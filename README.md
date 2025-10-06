## **Room Occupancy System**
Users can manage a MySQL database (tables: *floor*, *room*, *resident*) by performing CRUD operations (create, read, update, delete) through the user interface. Essentially, users can insert, retrieve, update, and delete records in the database.
<details><summary>Learning Outcomes</summary>  

- Developing a full-stack, web-based information system (frontend and backend)  
- Handling HTTP requests, responses, and page rendering with Express, Axios, and Flask
- Writing Application Programming Interfaces (APIs) to perform CRUD operations on MySQL database based on HTTP requests
</details>

## Architecture
<u>**Foundations**</u>  
- **Python** - used for writing REST APIs in Flask
- **Node.js** - runs JavaScript servers

<u>**Backend Servers**</u>  
- **Express** - web framework for Node.js
    - Listens to HTTP requests, handles routes and responses, and renders pages using EJS templates
- **Flask** - web framework for Python to build a web application with REST APIs
    - Used for writing Python REST APIs to return JSON data and interact with MySQL database

<u>**View / Template Engine**</u> 
- **EJS (Embedded JavaScript)** - renders dynamic HTML pages with data responses from Flask API routes  

<u>**HTTP Client**</u>  
- **Axios** - Used to send HTTP requests (users' GET, PUT, POST, DELETE data) from the frontend to API endpoints written to receive the responses<br>
---
## **Directions to Run** 
### <u>Database Setup</u>
1. **Download MySQL Server and MySQL Workbench:**  
https://www.youtube.com/watch?v=u96rVINbAUI&t=62s  
**Note:** Remember your *MySQL Root Password* to change credentials in **creds.py** later. But if you want to avoid changing later, input 'admin123!' as the password


2. **Create your own MySQL connection** **(4:36 in video)**  
**Note:** Remember *Hostname* and *Username* to change credentials in **creds.py** later if need be  
![alt text](/README_images/mysql_connection_setup.png)


3. **Create MySQL database named "sprint1" in MySQL connection**:
    - **Open SQL script and select *sprint1sql.sql* file in *backend* folder**
    ![alt text](/README_images/open_sql_script.png)
    - **Execute SQL statements to create 'sprint1' database and use the database (place mouse cursor at the end of each statement and click the icon with a lightning bolt and a cursor at the top)** 
    ![alt text](/README_images/execute_SQL_query.png)
        ```sql
        create database sprint1; -- Execute to create "sprint1" database

        use sprint1; -- Execute to use "sprint1" database

    - **Execute SQL statements to create and populate tables *floor*, *room*, and *resident* (execute in order):**  

        ```sql 
        --Floor table example:

        --Execute to create floor table
        create table floor (
        id int  primary key auto_increment,
        level int,
        name varchar(255));

        --Execute insertion query to populate floor table
        insert into floor values 
        (-1, -1, 'basement'), 
        (null, 1, '1st'), 
        (null, 2, '2nd'), 
        (null, 3, '3rd');

        --repeat for room and resident SQL statements
  
### <u>Environment Setup</u>
1. **Download and install Node.js on computer:** https://www.youtube.com/watch?v=7pbQ4ZKPBiU  

2. **Download zip file from GitHub, extract folder, and open folder in VS Code**  
![alt text](/README_images/download_github_zip.png)<br><br>
![alt text](/README_images/opening_folder_vscode.png)

3. **Open Terminal in *backend* folder (right click *backend* folder) and install the following:**  
![alt text](/README_images/open_terminal_vscode.png)
![alt text](/README_images/running_terminal.png)
    - **Install flask:** `pip install flask`  
    - **Install express:** `npm install express`  
    - **Install axios:** `npm install axios`  
    - **Install ejs:**`npm install ejs`  
    - **Install MySQL connector for Python:** `pip install mysql-connector-python`<br>
  

4. **Change credentials in creds.py if need be**  
![alt text](/README_images/creds.py.png) 

5. **Test MySQL database connection by running `python restapi.py` in the Terminal of *backend* folder** (you should see "Connection to MySQL DB successful")
![alt text](/README_images/successful_MySQL%20DB%20connection.png)

6. **Open another Terminal in the ***backend*** folder and run `node server.js` to run the room occupancy system**
    - **Ctrl + click the localhost link to launch the system:**
![alt text](/README_images/launching_localhost.png)
    - **You should see the login page once launched:**
![alt text](/README_images/login_page.png)

7. **Login credentials to enter welcome page and access the room occupancy system:**  
user = cis  
password = 3368
![alt text](/README_images/welcome_page.png)