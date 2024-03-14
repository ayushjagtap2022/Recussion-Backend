const { response } = require('express');
const Blogs = require('../models/blogSchema');
const userScehma = require('../models/userScehma');
const blogDetails = async (req, res) => {
  try {
    //  let userId = req.userData.payload.user._id;
    let findDetails = await Blogs.find({})
    if (!findDetails) {
      res.send(400).send({ Error: "Result not found" })
    } else {
      res.send(findDetails)
    }
  } catch (err) {
    res.status(500).send({ Error: err + "lol" });
  }
}
const save_Blog = async (req, res) => {
  try {
    let userId = req.userData.payload.user._id;
    const requiredFields = ['title', 'description'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).send({ Error: `Missing required field: ${field}` });
      }
    } if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const createBlog = new Blogs({
      user: userId,
      title: req.body.title,
      description: req.body.description,
      thumbnail: req.file.filename
    });
    await createBlog.save().then((result) => {
      req.blogId = result._id
      res.status(201).send(result);
    });
  } catch (error) {
    res.status(500).send({ Error: error.message });
  }
}
const delete_Blogs = async (req, res) => {
  try {
    let deletedetail_query = await Blogs.findByIdAndDelete(req.params._id.trim())
    if (!deletedetail_query) {
      console.log(deletedetail_query)
      res.status(400).send({ Error: "Blog not found" });
    } else {
      res.status(200).send(deletedetail_query)
    }
  } catch (error) {
    res.status(500).send({ Error: "Internal Server Error" + error })
  }
}
const like = async (req, res) => {
  try {
    let success = false
    const blogId = req.params._id.trim();
    const userId = req.userData.payload.user._id;
    let blogfind_query = await Blogs.findById(blogId);
    if (!blogfind_query) {
      return res.status(400).send({ Error: "Blog not found" });
    }
    const userIndex = blogfind_query.like.indexOf(userId);
    if (userIndex !== -1) {
      blogfind_query.like.splice(userIndex, 1);
      success = false
    } else {
      blogfind_query.like.push(userId);
      success = true
    }
    await blogfind_query.save();
    res.status(200).send({ Message: "Toggle like successful", success: success });
  } catch (error) {
    res.status(500).send({ Error: "Internal Server Error" + error });
  }
};
const wishlistBlog = async (req, res) => {
  try {
    let success = false
    const blogId = req.params._id.trim();
    const userId = req.userData.payload.user._id;
    let blogfind_query = await Blogs.findById(blogId);
    if (!blogfind_query) {
      return res.status(400).send({ Error: "Blog not found" });
    }
    const userIndex = blogfind_query.wishlist.indexOf(userId);
    if (userIndex !== -1) {
      blogfind_query.wishlist.splice(userIndex, 1);
      success = false
    } else {
      blogfind_query.wishlist.push(userId);
      success = true
    }
    await blogfind_query.save();
    res.status(200).send({ Message: "Toggle wishlist successful", success: success });
  } catch (error) {
    res.status(500).send({ Error: "Internal Server Error" + error });
  }
};
const findWishlistedBlog = async (req, res) => {
  try {
    const userId = req.userData.payload.user._id;
    const wishlistedBlogs = await Blogs.find({ wishlist: userId });
    if (wishlistedBlogs.length === 0) {
      return res.status(400).send({ Error: "No wishlisted blogs found for the user" });
    }
    res.status(200).send(wishlistedBlogs);
  } catch (error) {
    res.status(500).send({ Error: "Internal Server Error" + error });
  }
}

const findLikeLength = async (req, res) => {
  try {
    const blogId = req.params._id.trim();
    let blogfind_query = await Blogs.findById(blogId);
    if (!blogfind_query) {
      return res.status(400).send({ Error: "Blog not found" });
    }
    res.status(200).send({ likeLength: blogfind_query.like.length })
  } catch (error) {
    res.status(500).send({ Error: "Internal Server Error" + error });
  }
}
const searchBlogs = async (req, res) => {
  try {
    const blogs = req.params._blogs;
    if (!blogs) {
      return res.status(400).send({ Error: "parameter 'blogs' is missing" });
    }

    let blogfind_query = await Blogs.find({ title: { $regex: blogs } });
    if (!blogfind_query || blogfind_query.length === 0) {
      return res.status(404).send({ Error: "Blog not found" });
    }
    res.status(201).send(blogfind_query)
  } catch (error) {
    console.error(error);
    res.status(500).send({ Error: "Internal Server Error" + error });
  }
}
const findBlog = async (req, res) => {
  try {
    const blogs = req.params._blog;

    let blogfind_query = await Blogs.findById(blogs);
    if (!blogfind_query) {
      return res.status(400).send({ Error: "Blog not Found" });
    }
    else {
      const user_FindQuery = await userScehma.findById(blogfind_query.user);
      if (!user_FindQuery) {
        return res.status(400).send({ Error: "User not Found" });
      }
      res.status(201).send({ name: user_FindQuery.name });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ Error: "Internal Server Error" + error });
  }
}

module.exports = searchBlogs;

module.exports = { save_Blog, blogDetails, delete_Blogs, like, findLikeLength, wishlistBlog, findWishlistedBlog, searchBlogs, findBlog }