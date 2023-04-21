const {User, Thought} = require("../models")


const thoughtController = {
    // getThoughts,
    // getSingleThought,
    // createThought,
    // updateThought,
    // deleteThought,
    // addReaction,
    // removeReaction,

    //get all thoughts 
    getThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    
    // getThoughts(req, res) {
    //     Thought.find({})
    //       .populate({
    //         path: "reactions",
    //         select: "-__v",
    //       })
    //       .select("-__v")
    //       .sort({ _id: -1 })
    //       .then((dbThoughtData) => res.json(dbThoughtData))
    //       .catch((err) => {
    //         console.log(err);
    //         res.sendStatus(400);
    //       });
    //   },
    
    
    //get a single thought
    getSingleThought({ params }, res) {
        Thought.findOne({ _id: params.id })
          .populate({
            path: "reactions",
            select: "-__v",
          })
          .select("-__v")
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              return res.status(404).json({ message: "No thought with this id!" });
            }
            res.json(dbThoughtData);
          })
          .catch((err) => {
            console.log(err);
            res.sendStatus(400);
          });
      },

      //create thought
      createThought({ body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No users found with this ID' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.json(err));
    },

    //update thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thoughts found with that ID' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      },
    

    //delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No thoughts found with that ID' });
              return;
            }
            return User.findOneAndUpdate(
              { _id: parmas.userId },
              { $pull: { thoughts: params.Id } },
              { new: true }
            )
          })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No Users found with that ID' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.json(err));
      },

      //add reaction
      addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
          {_id: params.thoughtId}, 
          {$push: {reactions: body}}, 
          {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thoughts with that ID.'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err))
    },
    
    //remove reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
        )
          .then(dbThoughtData => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'Cant execute'});
              return;
            }
           res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
      }
    
};

module.exports = thoughtController 