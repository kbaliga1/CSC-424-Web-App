const express = require('express');
const app = express();
const port = 5001;
const cors = require("cors");
const {addUser, findUser} = require("./user-services");
const {findUserByName} = require("./user-services");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//table to store users
// const users = [
//     {username: "admin", password: "password"}
// ];

function generateAccessToken(username) {
    const data = {username: username}
    const options = {   expiresIn: '1h' };
    return jwt.sign(data, process.env.TOKEN_SECRET);
}

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

function authenticateToken(req,res,next)  {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

app.get('/username',authenticateToken,(req,res) => {
    console.log(req.user.username)
    const username = `${req.user.username}`;
    res.json({username});
})

app.post("/account/login", async (req, res) => {
   const {username,password} = req.body;

   // const valid = users.find(u => u.username == username && u.password == password);
   const valid = await findUser(username,password);

   if(valid) {
       const token = generateAccessToken(username);
       // const token = `${username}`;
       return res.json({token});
   } else {
       return res.status(401).json({error: "Invalid login"});
   }

});

app.post("/account/register", async (req,res) => {
    const {username,password} = req.body;

    //check if username is taken
    // const taken = users.find(u => u.username == username);
    const taken = findUserByName(username)
    if(taken) {
        return res.status(400).json({error: "Username taken"});
    }

    //check if password secure
    const passCheck = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;
    if(!passCheck.test(password)) {
        return res.status(400).json({error: "Password must contain at least 1 capital letter, 1 digit, and 1 symbol"});
    }

    //add new user
    // const newUser = {username,password};
    // users.push(newUser);

    try{
        await addUser(username,password);
    } catch (err) {
        console.log(err)
    }

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