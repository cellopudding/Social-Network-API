const {User, Thought} = require("../models")
 const mongoose = require('mongoose');
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
    },
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
          .select('-__v')
          .populate('friends')
          .populate('thoughts')
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: 'No user with this id!' });
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      // create a new user
      createUser(req, res) {
        User.create(req.body)
          .then((dbUserData) => {
            res.json(dbUserData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },

      //update a user 
      updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User found with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },

      //delete user 
      deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
          .then((user) => {
            if (!user) {
              return res.status(404).json({ message: "No user with this id!" });
            }
            return Thought.deleteMany({ _id: { $in: user.thoughts } });
          })
          .then(() => {
            res.json({ message: "User and associated thoughts deleted!" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      },
      

      //add a friend
    
      

addFriend({ params }, res) {
  const userId = mongoose.Types.ObjectId(params.userId);
  User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { friends: params.friendId } },
    { new: true, runValidators: true }
  )
  .then((dbUserData) => {
    if (!dbUserData) {
      res.status(404).json({ message: "No user with this id" });
      return;
    }
    res.json(dbUserData);
  })
  .catch((err) => res.json(err));
},
      //delete a friend
      removeFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              return res.status(404).json({ message: "No user with this id!" });
            }
            res.json(dbUserData);
          })
          .catch((err) => res.json(err));
      },

    

    
}
module.exports = userController