const mongoose = require("mongoose");
const userModel = require("./user");
mongoose.set("debug", true);
let uri = "mongodb+srv://test1:test1@cluster0.9is0r93.mongodb.net/?retryWrites=true&w=majority"

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .catch((error) => console.log(error));

async function getUsers(name, job) {
    let result;
    if (name === undefined && job === undefined) {
        result = await userModel.find();
    } else if (name && !job) {
        result = await findUserByName(name);
    } else if (job && !name) {
        result = await findUserByJob(job);
    }
    return result;
}

async function findUserById(id) {
    try {
        return await userModel.findById(id);
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

async function addUser(username,password) {
    try {
        const userToAdd = new userModel({
            name:username,
            password:password
        });
        const savedUser = await userToAdd.save();
        return savedUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function findUserByName(name) {
    return await userModel.find({ name: name });
}

async function findUserByJob(job) {
    return await userModel.find({ job: job });
}

async function findUser(username,password) {
    return await userModel.findOne({username,password});
}

exports.getUsers = getUsers;
exports.findUserById = findUserById;
exports.findUserByName = findUserByName;
exports.addUser = addUser;
exports.findUser = findUser;