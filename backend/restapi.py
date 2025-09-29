# Developing APIs
import flask
from flask import jsonify
from flask import request, make_response

import creds
from sql import create_connection
from sql import execute_read_query
from sql import execute_query

import hashlib

app = flask.Flask (__name__)
app.config["DEBUG"] = True


myCreds = creds.Creds() 
conn = create_connection (myCreds.hostname, myCreds.userName, myCreds.password, myCreds.dbName)

masterUsername = 'cis' 
masterPassword = "25f9525ece71bbb5beb98beb01b793a8e900a1cc4fc5891b1948746272da9792" #3368


#LOGIN API floor table
@app.route('/api/login', methods=['GET'])
def auth_example():
    if request.authorization:
        encoded = request.authorization.password.encode() #unicode encoding
        hashedResult = hashlib.sha256(encoded) #hashing
        if request.authorization.username == masterUsername and hashedResult.hexdigest() == masterPassword:
            return "Welcome to the Database"
            
    return 'COULD NOT VERIFY!'
# ------------------------------------------------------------------------------------------------------------------------------



#RESTAPI for FLOOR TABLE
#GET floor
@app.route('/api/floor', methods=['GET']) #http://127.0.0.1:5000/api/floor
def get_all_floors():
    select_all_floors_query = 'SELECT * FROM floor ORDER BY level ASC'
    run_select_all_floors = execute_read_query(conn,select_all_floors_query)
    
    return jsonify(run_select_all_floors)


# #POST floor
@app.route('/api/floor', methods=['POST'])
def add_floor():
    
    new_info = request.get_json() #getting the json post request
    new_level = new_info ['level']
    
    if("-" in new_level):
        new_level = new_level.strip("-")
        if(new_level.isnumeric()):
            new_level = "-" + new_level
    else:
        if(new_info['level'].isnumeric()):
            new_level = new_info ['level']
        else:
            return "Invalid Level"


    new_name = new_info ['name']
    
    check_floor_query = "SELECT * FROM floor WHERE level = (%s)" % (new_level)

    check_floor = execute_read_query (conn, check_floor_query)
    
    
    if len(check_floor) == 0:
    
        insert_floor_query = "INSERT INTO floor (level, name) VALUES (%s, '%s')" % (new_level, new_name)
        execute_query (conn, insert_floor_query)

        return f'Successfully Posted [Floor: {new_level}, Name: "{new_name}"]'
    else:
        return f'[Floor: {new_level}] Already Available'
    

# #PUT floor 
@app.route('/api/floor', methods=['PUT'])
def update_floor_name():   

    if 'level' in request.args:
        request_level = int(request.args['level'])

        #STORING levels in floor
        available_levels = []
        select_floor_data = "SELECT * FROM floor"
        floor_data = execute_read_query (conn, select_floor_data)
        for i in floor_data:
            available_levels.append (i.get('level'))
        
        if request_level in available_levels:
            new_info = request.get_json()
            new_name = new_info ['name']

            update_floor_name_query = "UPDATE floor SET name = ('%s') where level = (%s)" % (new_name, request_level)
            execute_query(conn,update_floor_name_query)

            return f'Successfully Updated [Floor: {request_level}, Name: "{new_name}"]'
        
    

# #DELETE floor 
@app.route('/api/floor', methods=['DELETE'])
def delete_floor():
    if 'level' in request.args:
        request_level = int(request.args['level'])
        floor_level_according_to_id = execute_read_query(conn,"select level from floor where id = (%s)" %(request_level))
        level = [floor_level_according_to_id[0].get('level')]

        execute_query(conn, "DELETE FROM resident WHERE room in (SELECT id from room WHERE floor = (%s))" % (request_level))
        execute_query (conn, "DELETE FROM room where floor = (%s)" % (request_level))
        execute_query (conn, "DELETE FROM floor where id = (%s)" % (request_level))
        
        
        return f'Successfully Deleted [Floor: {level[0]}]'
                       

# # ------------------------------------------------------------------------------------------------------------------------------------

# #RESTAPI for ROOM TABLE
# #GET room 
@app.route('/api/room', methods = ['GET']) #http://127.0.0.1:5000/api/room
def get_all_rooms():
    select_all_room_query = "SELECT * FROM room ORDER BY number ASC"
    run_select_all_room_query = execute_read_query (conn, select_all_room_query)

    return jsonify(run_select_all_room_query)

# # set intersect -  https://www.programiz.com/python-programming/methods/set/symmetric_difference



# #Prevent user from selecting the room # that already have up to 10 rooms
@app.route('/api/room/get_nonmaxed_room_number', methods = ['GET'])
def get_nonmaxed_room_number():
    select_nonmaxed_rooms = """select floor.level from room, floor
                                where room.floor = floor.id
                                group by room.floor
                                having count(room.floor) = 10"""
                                    
    run_select_nonmaxed_rooms = execute_read_query(conn, select_nonmaxed_rooms)

    run_select_all_floor_levels = execute_read_query(conn, "select floor.level from floor")

    all_floor_levels = [x.get('level') for x in run_select_all_floor_levels]
    all_floor_levels.sort()

    if (len(run_select_all_floor_levels )>0 and len(run_select_nonmaxed_rooms)>0):
        non_maxed_rooms = {x.get('level') for x in run_select_nonmaxed_rooms}
        all_floor_levels = {x.get('level') for x in run_select_all_floor_levels}

        non_maxed_room_numbers = non_maxed_rooms.symmetric_difference(all_floor_levels)
        non_maxed_room_numbers = list(non_maxed_room_numbers)
        non_maxed_room_numbers.sort()

        return non_maxed_room_numbers
    else:
        return all_floor_levels






# #POST room 
@app.route('/api/room',methods = ['POST'])
def add_room():
    if 'floor' in request.args:
        request_floor = int(request.args['floor'])

        new_info = request.get_json()
        new_capacity = new_info['capacity']
        new_number = new_info ['number']

        

        request_room = "SELECT * FROM room where number = (%s) and floor = (%s)" % (new_number, request_floor)
        read_request_room = execute_read_query (conn, request_room)
    
        check_level_from_floor_id = "select level from floor where id = (%s)" % (request_floor)
        read_level_from_floor_id = execute_read_query(conn, check_level_from_floor_id)



        a = []
        for x in read_level_from_floor_id:
            a.append(x.get('level'))



        if len(a) >0:
            level = str(a[0])

        find_room_level = execute_read_query(conn,"select floor.level from floor where floor.id = (%s)" % (request_floor))

        if len(find_room_level)>0:
            room_level = find_room_level[0].get('level')



        if (int(new_number) >= (int(level)*100 + 1)) and (int(new_number)<=(int(level)*100 + 10)):

            if len(read_request_room) == 0:
                execute_query(conn, "INSERT INTO room (capacity, number, floor) VALUES (%s, %s, %s)" % (new_capacity, new_number, request_floor))
                return (f'Posted Room: [Floor {room_level} - Room #{new_number} - Capacity: {new_capacity}]')
            else:
                return f'Room #{new_number} Already Exists'
        

        elif(int(new_number) <= (int(level)*100-1) and (int(new_number) >=( int(level)*100-10))):
            if len(read_request_room) == 0:
                execute_query(conn, "INSERT INTO room (capacity, number, floor) VALUES (%s, %s, %s)" % (new_capacity, new_number, request_floor))
                return (f'Posted Room: [Floor {room_level} - Room #{new_number} - Capacity: {new_capacity}]')
        
            else:
                return f'Room #{new_number} Already Exists'
        else:
            return "Invalid Room Number"





# # Show users room number, room capacity with "floor" from floor.level db by using room.floor that reference floor.id db

@app.route('/api/room/available_rooms_with_floor_level',methods = ['GET'])
def show_available_rooms_for_post():
    return (execute_read_query(conn,"select floor.level, room.number, room.id, room.capacity FROM floor, room WHERE room.floor = floor.id ORDER BY room.number"))

    


# #PUT room
@app.route('/api/room', methods = ['PUT']) #http://127.0.0.1:5000/api/room?room=203
def update_room():
    if 'room' in request.args:
        request_room = int(request.args['room'])
        new_info = request.get_json()

        new_capacity = new_info ['capacity']

        if type(new_capacity) != int:
            return "Invalid Capacity"

        update_room_query = "UPDATE room SET capacity = (%s) WHERE number = (%s)" % (new_capacity, request_room) 

        execute_query(conn, update_room_query)

        return f'Updated [Room #{request_room}] Capacity to [{new_capacity}]'
    else:
        return "Request Unprovided"
    
        


# #DELETE room
@app.route('/api/room', methods = ['DELETE'])
def delete_room():
    request_floor = request.headers['floor']
    request_number = request.headers['number']
    request_id = request.headers['id']
    
    
    
    
    execute_query(conn,"DELETE FROM resident WHERE room IN (SELECT id FROM room WHERE id = (%s))" % (request_id))
    execute_query(conn, "DELETE FROM room WHERE id = (%s);" % (request_id))

    return "[Floor %s], [Room %s] Deleted" % (request_floor, request_number)
    
        
    
    
# # -----------------------------------------------------------------------------------------------------------------------------------------
# #restAPI for RESIDENT TABLE
# #GET resident table 
@app.route('/api/resident', methods=['GET']) #http://127.0.0.1:5000/api/resident
def get_all_residents():
    select_all_residents_query = "SELECT * FROM resident"
    run_select_all_residents_query = execute_read_query (conn,select_all_residents_query)

    return jsonify(run_select_all_residents_query)



# #POST resident
@app.route('/api/resident', methods=['POST'])
def add_resident():

    new_info = request.get_json()
    
    new_firstname = new_info ['firstname']
    new_lastname = new_info ['lastname']
    new_age = new_info ['age']
    new_room = new_info ['room']
      
    insert_resident_query = "INSERT INTO resident (firstname, lastname, age, room) VALUES ('%s', '%s', %s, %s)" % (new_firstname, new_lastname, new_age, new_room)
    execute_query (conn, insert_resident_query)
    
    room_number = "select number from room where id = (%s)" % (new_room)

    run_room_number = execute_read_query(conn, room_number)

    room_num = list(x.get('number') for x in run_room_number)

    return f'Successfully Posted Resident [{new_firstname} {new_lastname}, Age: {new_age}, Room: {room_num[0]}]'
    



# #PUT resident table
@app.route('/api/resident', methods=['PUT'])
def update_resident():
    new_info = request.get_json()
    
    request_firstname = new_info ['firstname']
    request_lastname = new_info ['lastname']
    request_room = new_info ['room']
    request_age = new_info['age']
    request_id = new_info ['id']
    if(len(request_id)>0):
        if(len(request_firstname)>0 or len(request_lastname)>0 or len(request_room)>0 or len(request_age)>0):

            if(request_firstname != ""):
                
                execute_query (conn, "UPDATE resident SET firstname = ('%s') WHERE id = (%s)" % (request_firstname, request_id))
                
            if(request_lastname != ""):    
                
                execute_query (conn, "UPDATE resident SET lastname = ('%s') WHERE id = (%s)" % (request_lastname, request_id))

            if(request_room != ""):    
                select_room_id = "select id from room where number = (%s)"%(request_room)
                run_select_room_id = execute_read_query(conn, select_room_id)
                room_id = list(x.get('id') for x in run_select_room_id)
                room_id = room_id [0]
                execute_query (conn, "UPDATE resident SET room  = (%s) WHERE id = (%s)" % (room_id, request_id))
                
            
                
            if (request_age != ""):
                
                execute_query (conn, "UPDATE resident SET age = (%s) WHERE id = (%s)" % (request_age, request_id))

            

            return "Successfully Updated"
        return "No Update Provided"
    else:
        return "No Resident Provided"





# #DELETE resident 
@app.route('/api/resident', methods=['DELETE'])
def delete_resident():

    request_resident_id = int(request.headers['id'])
    request_resident_firstname = request.headers['firstname']
    request_resident_lastname = request.headers['lastname']
    request_resident_age = int(request.headers['age'])
    request_resident_number = int(request.headers['number'])
    
   
    delete_resident_query = "DELETE FROM resident WHERE id = (%s)" % (request_resident_id)
    execute_query(conn, delete_resident_query)


    

    return f"Successfully Deleted Resident [{request_resident_firstname} {request_resident_lastname}, Age: {request_resident_age}, Room: #{request_resident_number}]"
    



# #GET room number given resident's "room"
@app.route('/api/resident/number', methods = ['GET'])
def get_resident_room_number():
    resident_room_number_query = "SELECT number, age, room, resident.id, firstname, lastname FROM room, resident WHERE resident.room = room.id ORDER BY  room.number ASC"
    return execute_read_query (conn, resident_room_number_query)
    


#all code supported by Professor Otto


if __name__ == "__main__":
    app.run()
