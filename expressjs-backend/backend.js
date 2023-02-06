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

   if(valid){
       const token = `${username}`;
       return res.json({token});
   } else {
       return res.status(401).json({error: "Invalid login"});
   }

});

//app.post("/account/register")

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});