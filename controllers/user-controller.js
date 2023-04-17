const {User, Thought} = require("../models")
const userController = {
    getUsers(req, res) {
        User.find()
        .select("-__v")
        .then((allUsers)=> {
            res.json(allUsers)
        })
        .catch((err)=> {
            res.status(500).json(err)
        })
    } 
}
module.exports = userController