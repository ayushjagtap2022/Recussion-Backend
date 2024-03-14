const mongoose = require('mongoose');
const comment = require('../models/commentSchema');
const addComment = async (req, res) => {
  try {
    let userIds = req.userData.payload.user._id;
    let userName = req.userData.payload.user.name;

    const comments = new comment({ userId: userIds, userName: userName, comment: req.body.comment, blogId: req.params._id.trim() });
    const find_query = await comment.findOne({ blogId: req.params._id.trim(), userId: userIds })
    if (find_query) {
      return res.status(401).send({ error: "Comment already existed" }); // Return here
    }

    if (!comments) {
      return res.status(401).send({ Error: "Invalid Credentials" }); // Return here
    }

    comments.save()
      .then(userComment => res.status(201).send(userComment))
      .catch(err => res.status(422).send({ Error: err }));
  } catch (err) {
    res.status(500).send({ Error: "Internal Server Error" + err });
  }
};

const displayComments = async (req, res) => {
  try {
    const displayQuery = await comment.find({ blogId: req.params._id.trim() });

    if (!displayQuery) {
      res.status(422).send({ Error: "Error while displaying comments" });
    } else {
      res.status(200).send(displayQuery);
    }
  } catch (err) {
    res.status(500).send({ Error: "Internal Server Error" + err });
  };
}

const deleteComments = async (req, res) => {
  try {
    const commentId = req.params._id;
    const userid = req.body.userId;

    const deleteQuery = await comment.findOneAndDelete({
      _id: commentId,
      userId: userid,
    });

    if (!deleteQuery) {
      res.status(422).send({ Error: "Comment not found" });
    } else {
      console.log(deleteQuery)
      res.status(200).send(deleteQuery);
    }
  } catch (err) {
    res.status(500).send({ Error: "Internal Server Error" });
  }
};

module.exports = { addComment, displayComments, deleteComments };
