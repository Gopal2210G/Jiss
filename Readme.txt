<h3> This is a CRUD app built using Express js, Mongodb and HTML,CSS and Javascript.</h3>
<br>
<h3>We aim to design a Judiciary Information System (JIS) that:</h3>
<br>
a. implements a user-friendly system for case registration, creation and modification.<br>
b. The information entered by the registrar is properly stored and then displayed for private access to only registered users.<br>
c. To create a database to store, manage and backup case records.<br>
d. To search for a specific case record by entering known data.<br>



#### To Run the Web Application
- Run
```
npm install
start all dependencies: 
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.9",
    "express": "^4.18.3",
    "mongoose": "^8.2.2",
    "nodemailer": "^6.9.13",
    "nodemon": "^3.1.0"
```

- Create .env file in the root directory and specify the following:
```
PORT=3000
MONGO_URI=
(Add your own cluster connection)
```
- Go to terminal and Run:
```
cd server (If directry is Jiss)
nodemon index.js

```
<br>
<br>
