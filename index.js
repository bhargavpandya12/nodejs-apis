const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Where we will keep books
let books = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Mini Project APIs application!')
})

app.get('/login', (req, res) => {

    if (!req.query.emailId || !req.query.password) {
        const response = {
            "status": "failed",
            "message": "Email Id or Password is incorrect",
            "data": "Not enough input params!"
        };

        res.status(200).send(response);
    }
    else {

        const emailId = req.query.emailId;
        const password = req.query.password;

        const fs = require('fs');
        let rawdata = fs.readFileSync('./sample-data/users.json');
        let users = JSON.parse(rawdata);

        let userinfo = users.filter(x => 
            x.emailId.toLowerCase() === emailId.trim().toLowerCase() && 
            x.password.toLowerCase() === password.trim().toLowerCase()
        );

        if (userinfo.length > 0) {
            delete userinfo[0]["password"];
            const response = {
                "status": "success",
                "message": "User info fetched successfully",
                "data": userinfo[0]
            };

            res.status(200).send(response);
        }
        else {
            const response = {
                "status": "failed",
                "message": "Email Id or Password is incorrect",
                "data": ""
            };

            res.status(200).send(response);
        }
    }
});

app.post('/register', (req, res) => {
    
    if (!req.body.name || !req.body.emailId || !req.body.password || !req.body.dob || !req.body.contactNumber
        || !req.body.gender || !req.body.maritalStatus || !req.body.address || !req.body.skills) {

        const response = {
            "status": "failed",
            "message": "Not enough input params!",
            "data": "Not enough input params!"
        };

        res.status(200).send(response);
    }
    else {
        const name = req.body.name;
        const emailId = req.body.emailId;
        const password = req.body.password;
        const dob = req.body.dob;
        const contactNumber = req.body.contactNumber;
        const gender = req.body.gender;
        const maritalStatus = req.body.maritalStatus;
        const address = req.body.address;
        const skills = req.body.skills;

        const fs = require('fs');
        let rawdata = fs.readFileSync('./sample-data/users.json');
        let users = JSON.parse(rawdata);

        let userinfo = users.filter(x => x.emailId.toLowerCase() === emailId.trim().toLowerCase());

        if (userinfo.length > 0) {
            const response = {
                "status": "failed",
                "message": "User is already exists!",
                "data": ""
            };

            res.status(200).send(response);
        }
        else {
            const sortedArr = users.sort((a, b) => b.id > a.id ? 1:-1);
            const id = users.length == 0 ? 1 : (parseInt(sortedArr[0].id) + 1);
            users.push({
                "id": id,
                "name": name,
                "emailId": emailId,
                "dob": dob,
                "contactNumber": contactNumber,
                "gender": gender,
                "maritalStatus": maritalStatus,
                "address": address,
                "skills": skills,
                "password": password
            });

            const sortedUsersArr = users.sort((a, b) => a.id > b.id ? 1:-1);
            fs.writeFileSync('./sample-data/users.json', JSON.stringify(sortedUsersArr));

            const response = {
                "status": "success",
                "message": "User registered successfully",
                "data": {"id": id}
            };

            res.status(200).send(response);
        }
    }
});

app.get('/products', (req, res) => {
    const fs = require('fs');
    let rawdata = fs.readFileSync('./sample-data/products.json');
    let products = JSON.parse(rawdata);

    const data = {
        "status": "success",
        "message": "Products fetched successfully",
        "data": products
    };

    res.status(200).send(data);
});

app.listen(port, () => console.log(`Mini Project app listening on port ${port}!`));