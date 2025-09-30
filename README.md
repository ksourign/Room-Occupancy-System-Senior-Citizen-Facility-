## **Room Occupancy System**
Users can manage a MySQL database (tables: *floor*, *room*, *resident*) by performing CRUD operations (create, read, update, delete) through the user interface. Essentially, users can retrieve, update, insert, and delete records in the database.

## Architecture
<u>**Foundations**</u>  
- **Python** - used for writing REST APIs in Flask
- **Node.js** - runs JavaScript servers

<u>**Backend Servers**</u>  
- **Express** - web framework for Node.js
    - Listens to HTTP requests, handles routes and responses, and renders pages  
- **Flask** - web framework for Python to build a web application with REST APIs
    - Used for writing Python REST APIs to return JSON data and interact with MySQL database

<u>**HTTP Client**</u>  
- **Axios** - Used to send HTTP requests (users' GET, PUT, POST, DELETE data) from the frontend to API endpoints written to receive the responses<br>
---
## **Directions to Run** 
1. **Download MySQL Server and MySQL Workbench:**  
https://www.youtube.com/watch?v=u96rVINbAUI&t=62s  
(Video also shows how to create MySQL connection)  
**Note:** Remember *MySQL Root Password* to change credentials in **creds.py**
2. **Create your own MySQL connection**  
**Note:** Remember *Hostname* and *Username* to change credentials in **creds.py** if need be  
![alt text](image.png)
![alt text](image-2.png) 



3. **Create MySQL database name "sprint1" in MySQL connection**:
    - Open SQL script and select **sprint1sql.sql** file in backend folder
    ![alt text](image-4.png)
    - Run `create database sprint1;` by placing cursor at the end and clicking the lightning bolt with cursor at the top to execute SQL statement
    ![alt text](image-5.png)
  
4. **Open Terminal in backend folder and install the following:**  
    - **Install flask:** `pip install flask`  
    - **Install express:** `npm install express`  
    - **Install axios:** `npm install axios`  
    - **Install ejs:**`npm install ejs`  
    - **Install MySQL connector for Python:** `pip install mysql-connector-python`<br><br>
![alt text](image-3.png)  
<br><br>

5. **Run the system:**


<details><summary>Learning Outcomes</summary>  

- Developing a full-stack, web-based information system (frontend and backend)  
- Handling HTTP requests, responses, and page rendering with Express, Axios, and Flask
- Writing Application Programming Interfaces (APIs) to perform CRUD operations on MySQL database based on HTTP requests
</details>

