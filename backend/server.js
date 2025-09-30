//Rendering Pages
//load express module
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


//put new express application in the app variable
const app = express();
const axios = require ('axios');
app.use(bodyParser.urlencoded({
    extended: true
  }));

  //set views property and the views engine
app.set("views", path.resolve(__dirname, "../frontend/views"));
app.set("view engine", "ejs");

const port = 8081;



// Axio basic auth request-https://masteringjs.io/tutorials/axios/basic_auth
// floor LOGIN PAGE
// USERNAME: cis 
// PASSWORD: 3368
app.post('/', function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    

    axios.get('http://127.0.0.1:5000/api/login',{
        auth: {
             username: username,
             password: password}})  

    .then((response)=>{
        let api_response = response.data;
    
        if (api_response == "Welcome to the Database"){
            
            axios.get('http://127.0.0.1:5000/api/floor')
            .then((response)=>{

            var floor_length = response.data.length;

                axios.get('http://127.0.0.1:5000/api/room')
                .then((response)=>{
                    var room_length = response.data.length;

            
                    res.render("pages/home",{
                        floor_length: floor_length.toString(),
                        room_length: room_length.toString(),
                        api_response: api_response
                    });
            
                });
            });
        }
           
        else{
            
            res.render("pages/login",{
                api_response: api_response
                
            });
        }
        
    });
});


app.get('/', (request, response)=>
    
    response.render('pages/login')
        
);  
    
    


app.get('/home', function(req, res){
    axios.get('http://127.0.0.1:5000/api/floor')
    .then((response)=>{
        var floor_length = response.data.length;

        axios.get('http://127.0.0.1:5000/api/room')
        .then((response)=>{
            var room_length = response.data.length;

            
            res.render("pages/home",{
                floor_length: floor_length.toString(),
                room_length: room_length.toString()
            });    
        });
    });
});  


//////////////////////////////////////////////////////////////////////////////
// FLOOR STUFF

app.get('/floor/get', function(req, res){
    axios.get('http://127.0.0.1:5000/api/floor')
    .then((response)=>{
        var floorData = response.data;
        res.render("pages/getfloor", {
        floor: floorData
    });  
    
    });
    });


// rendering floor PUT page
app.get('/floor/put',function (req, res){

    axios.get('http://127.0.0.1:5000/api/floor')
    .then((response)=>{
        var floorData = response.data;
        
        res.render("pages/putfloor", {
        available_floors: floorData
        
    });
    });
});

// floor PUT submit page
app.post('/floor/put',function(req,res){
    const level = req.body.selectedfloor;
    const name = {name: req.body.name};

    const name2 = req.body.name;
    axios.put(`http://127.0.0.1:5000/api/floor?level=${level}`, name)
    .then(function(response){
        
        var api_response = response.data;
        
        axios.get('http://127.0.0.1:5000/api/floor')
        .then((response)=>{
        var floorData = response.data;
    
        res.render("pages/putfloor",{
            api_response: api_response,
            available_floors: floorData,
            level: level,
            name: name2
        });

        });
        
    });

});


// rendering floor POST page
app.get('/floor/post', function(req, res){
    axios.get('http://127.0.0.1:5000/api/floor')
    .then((response)=>{
        var floors_posted = response.data;
        res.render("pages/postfloor", {
            floors_posted: floors_posted
        });  
    
    });
    });

// floor POST submit page
app.post("/floor/post", function(req,res){
    const postfloor = req.body;
    const level = req.body.level;
    const name = req.body.name;
    
    axios.post('http://127.0.0.1:5000/api/floor', postfloor)
    .then((response)=>{
        var api_response = response.data;
        
        axios.get('http://127.0.0.1:5000/api/floor')
        .then((response)=>{
            res.render("pages/postfloor", {
            api_response: api_response,
            floors_posted: response.data,
            level:level,
            name: name
            });
        });
        
    });
    
});


// rendering floor DELETE page
app.get('/floor/delete',function (req, res){

    axios.get('http://127.0.0.1:5000/api/floor')
    .then((response)=>{
        var available_floors = response.data;
        
        res.render("pages/deletefloor", {
        available_floors: available_floors
        
    });
    
    });
    
});

// floor DELETE submit page
app.post("/floor/delete", function(req,res){
    let level_id = req.body.selectedfloor;
    
    axios.delete(`http://127.0.0.1:5000/api/floor?level=${level_id}`)
    .then((response)=>{
        var api_response = response.data;


        axios.get('http://127.0.0.1:5000/api/floor')
        .then((response)=>{
            res.render("pages/deletefloor", {
            api_response:api_response,
            available_floors: response.data
        });
        });

    });
        
});


//////////////////////////////////////////////////////////////////////////////


// ROOM STUFF
app.get('/room/get', function(req, res){
    axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
    .then((response)=>{
        let roomData = response.data;
        res.render("pages/getroom", {
        room: roomData
    });  
    });
    });

// rendering room POST page
app.get('/room/post', function(req, res){
    axios.get('http://127.0.0.1:5000/api/floor')
    .then((response)=>{
        var available_floors = response.data;
        

        axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
        .then((response)=>{
            let available_rooms = response.data

            axios.get('http://127.0.0.1:5000/api/room/get_nonmaxed_room_number')
            .then((response)=>{
                var non_maxed_room_numbers = response.data;

                res.render("pages/postroom", {
                    available_floors: available_floors,
                    available_rooms: available_rooms,

                    non_maxed_room_numbers : non_maxed_room_numbers
                });
            });

        });  
    });
});


// room POST submit page
app.post('/room/post', function(req,res){
    
    var selected_floor = req.body.selectedfloor;
    selected_floor = selected_floor.split(' ');

    var floor = selected_floor[0];
    
    var room_level = selected_floor[1];

    var post_floor_body = {capacity: req.body.capacity, number: req.body.number};
    var capacity = req.body.capacity;
    var number = req.body.number

    axios.post(`http://127.0.0.1:5000/api/room?floor=${floor}`,post_floor_body)
    .then((response) =>{
        var api_response = response.data;
        
        axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
        .then((response)=>{
            let available_rooms = response.data;

            axios.get('http://127.0.0.1:5000/api/floor')
            .then((response)=>{
                var available_floors = response.data;

                axios.get('http://127.0.0.1:5000/api/room/get_nonmaxed_room_number')
                .then((response)=>{
                    var non_maxed_room_numbers = response.data;
                    res.render('pages/postroom',{
                        api_response: api_response,
                        
                        available_rooms: available_rooms,
                        available_floors: available_floors,
                        non_maxed_room_numbers: non_maxed_room_numbers,

                        capacity: capacity,
                        number:number,
                        room_level : room_level
        
                        });
                });
            
            });
        });
        
    });
});



// Rendering PUT room page
app.get('/room/put', function(req,res){
    axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
    .then((response)=>{
        var available_rooms = response.data;
        res.render('pages/putroom',{
            available_rooms: available_rooms
        });
    });
    
});

//room PUT submit page
app.post('/room/put', function (req,res){
    var room = req.body.selectedroom;
    var capacity = {capacity: Number(req.body.capacity)};

    axios.put(`http://127.0.0.1:5000/api/room?room=${room}`, capacity)
    .then((response)=>{
        let api_response = response.data;
        
        
        axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
        .then((response)=>{
            res.render('pages/putroom',{
            api_response: api_response,
            available_rooms: response.data,
            selected_room: room
            });
        });
        
    });
});

// render room delete page
app.get('/room/delete', function(req, res){
    axios.get('http://127.0.0.1:5000/api/room')
    .then((response)=>{
        available_rooms = response.data;
        
        axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
        .then((response)=>{
            res.render('pages/deleteroom', {
            available_rooms : available_rooms,
            available_rooms_with_floor : response.data
            });
        })
        
    });
});


//DELETE room submit page
app.post('/room/delete', function(req, res){
    
    let selectedroom = req.body.selectedroom.split(' ');
    
    let floor = selectedroom[0];
    let number = selectedroom[1];
    let id = selectedroom[2];
    
    axios.delete('http://127.0.0.1:5000/api/room',{
        headers: {
            floor: floor,
            number: number,
            id :id
        }
    })
    .then((response)=>{
        let api_response = response.data;

        axios.get('http://127.0.0.1:5000/api/room/available_rooms_with_floor_level')
        .then((response)=>{
            let available_rooms_with_floor = response.data;


            axios.get('http://127.0.0.1:5000/api/room')
            .then((response)=>{
                res.render('pages/deleteroom', {
                    api_response: api_response,
                    available_rooms_with_floor: available_rooms_with_floor,
                    available_rooms : response.data
                });
            });

        });
                
    });
    
});


//////////////////////////////////////////////////////////////////////////////
// RESIDENT STUFF

// Rendering RESIDENT page
app.get('/resident/get', function(req, res){
    axios.get('http://127.0.0.1:5000/api/resident/number')
    .then((response)=>{
        var residentData = response.data;
        res.render("pages/getresident", {
        resident: residentData
    });  
    });
    });

// rendering resident POST page
app.get('/resident/post', function(req, res){

    axios.get('http://127.0.0.1:5000/api/room')
    .then((response)=>{
        var rooms_available = response.data;
        axios.get('http://127.0.0.1:5000/api/resident/number')
        .then((response)=>{
            res.render("pages/postresident", {
            rooms_available: rooms_available,
            available_residents: response.data
        })
        
    });  
    });
    });

// POST resident submit page
app.post('/resident/post', function(req,res){
    var resident_info = req.body;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var age = req.body.age;
    
    axios.post('http://127.0.0.1:5000/api/resident', resident_info)
    .then((response)=>{
        var api_response = response.data;

        axios.get('http://127.0.0.1:5000/api/resident/number')
        .then((response)=>{
            var available_residents = response.data;
            axios.get('http://127.0.0.1:5000/api/room')
            .then((response)=>{
                res.render("pages/postresident", {
                    api_response: api_response,
                    available_residents: available_residents,
                    rooms_available: response.data,

                    firstname: firstname,
                    lastname: lastname,
                    age: age,
                    
                });
            });
            
        });

    });
    
});


//rendering PUT resident page
app.get('/resident/put', function(req,res){
   
    axios.get('http://127.0.0.1:5000/api/resident/number')
    .then((response)=>{
        var available_residents = response.data;


        axios.get('http://127.0.0.1:5000/api/room')
        .then((response)=>{
            res.render('pages/putresident', {
                available_rooms: response.data,
                available_residents: available_residents
            });
        });

    });

});
    

//PUT RESIDENT submit page
app.post('/resident/put', function(req,res){
    let res_info = req.body;
    
    let resident_id = req.body.id;
    let room_num = req.body.room; 

    axios.put('http://127.0.0.1:5000/api/resident', res_info)
    .then((response)=>{
        let api_response = response.data;
        
        axios.get('http://127.0.0.1:5000/api/resident/number')
        .then((response)=>{
            available_residents = response.data;
            
            axios.get('http://127.0.0.1:5000/api/room')
            .then((response)=>{
                res.render('pages/putresident', {
                    api_response : api_response,
                    available_residents :available_residents,
                    available_rooms : response.data,
                    resident_id : resident_id,
                    res_info : res_info,
                    room_num: room_num
                });

            });
                
        });
            
    });
});


//RENDER DELETE resident page

app.get('/resident/delete', function(req,res){

    axios.get('http://127.0.0.1:5000/api/resident/number')
    .then((response)=>{
        let available_residents = response.data;
        
        res.render('pages/deleteresident', {
            available_residents : available_residents
        });
    });
});



// DELETE RESIDENT
app.post('/resident/delete', function(req,res){
    
    selected_resident = req.body.selected_resident.split(' ');
    
    let resident_id = selected_resident[0];
    let firstname = selected_resident[1];
    let lastname = selected_resident[2];
    let age = selected_resident[3];
    let number = selected_resident[4];

    axios.delete('http://127.0.0.1:5000/api/resident',{
        headers: {
            id: resident_id,
            firstname: firstname,
            lastname: lastname,
            age: age,
            number : number
            
        }
    })
    .then((response)=>{
        let api_response = response.data;


        axios.get('http://127.0.0.1:5000/api/resident/number')
        .then((response)=>{
            var available_residents = response.data;
            res.render('pages/deleteresident', {
                api_response : api_response,
                available_residents : available_residents
            });
            
        });
            
    });
});


//start the experss application on port 8081 and print a server start message to console
app.listen(port, ()=> console.log(`Server is running at http://localhost:${port}`));