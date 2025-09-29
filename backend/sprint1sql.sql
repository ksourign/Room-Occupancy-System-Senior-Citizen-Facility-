create database sprint1;
use sprint1;

-- FLOOR TABLE
create table floor (
	id int  primary key auto_increment,
    level int,
    name varchar(255));


insert into floor values (-1, -1, 'basement'),
 (null, 1, '1st'),
 (null, 2, '2nd'),
 (null, 3, '3rd');
 

-- ROOM TABLE

create table room(
id int primary key auto_increment ,
capacity int,
number int,
floor int, FOREIGN KEY (floor) REFERENCES floor(id));

insert into room (id,capacity, number, floor)
values (null,5,-100,-1),(null,10,101,1), 
(null,10,102,1), (null,10,103,1), (null,20,201,2), 
(null,20,202,2), (null,20,203,2), (null,30,301,3), 
(null,30,302,3) , (null,30,303,3);



-- RESIDENT TABLE
create table resident (
id int primary key auto_increment,
firstname varchar (255),
lastname varchar (255),
age int, 
room int, FOREIGN KEY (room) REFERENCES room(id));

insert into resident values 
(null, "Kaitlyn", "Sou", 22, 4), (null, "Jonathan", "Sou",21,4), (null, "Virasack", "Sou",50,4),
(null, "Jane", "Doe", 30, 5), (null, "John", "Doe",32,4),
(null, "Lara", "Croft", 20, 6), (null, "Lily", "Croft",18,6),
(null,"Jin", "Sakai", 28, 6);


	
select * from floor;
select * from room;
select* from resident;


truncate resident;
drop table resident;
drop table room;
drop table floor;