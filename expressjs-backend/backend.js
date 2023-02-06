const express = require('express');
const app = express();
const port = 5001;
const cors = require("cors");

//table to store users
const users = [
    {username: "admin", password: "password"}
];

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.post("/account/login", (req, res) => {
   const {username,password} = req.body;

   const valid = users.find(u => u.username == username && u.password == password);

   if(valid) {
       const token = `${username}`;
       return res.json({token});
   } else {
       return res.status(401).json({error: "Invalid login"});
   }

});

app.post("/account/register", (req,res) => {
    const {username,password} = req.body;

    //console.log(username)

    //check if username is taken
    const taken = users.find(u => u.username == username);
    if(taken) {
        return res.status(400).json({error: "Username taken"});
    }

    //check if password secure
    const passCheck = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
    if(!passCheck.test(password)) {
        return res.status(400).json({error: "Password must contain at least 1 capital letter, 1 digit, and 1 symbol"});
    }

    //add new user
    const newUser = {username,password};
    users.push(newUser);
    res.json({message: "New User Registered"})
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/users', (req, res) => {
    res.json(users)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});