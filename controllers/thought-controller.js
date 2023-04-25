const {User, Thought} = require("../models")


const thoughtController = {
    
    //get all thoughts 
    getThoughts(req, res) {
        Thought.find({})
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    
    
    //get a single thought
    getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((thoughtData) => {
        if (!thoughtData) {
          return res.status(404).json({ message: "No thought with this id!" });
        }
        res.json(thoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
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
    removeReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      )
        .then((thoughtData) => {
          if (!thoughtData) {
            return res.status(404).json({ message: "No thought with this id!" });
          }
          res.json(thoughtData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
    
    
};

module.exports = thoughtController 