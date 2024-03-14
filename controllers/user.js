const userSchema = require('../models/userScehma')
const sendMail = require('../services/mail')
const genHash = require('../services/generateHash')
const tokenGen = require('../services/token')
const { compare } = require('bcryptjs')
const Create_User = async (req, res) => {
      try {
            let result = await userSchema.findOne({ email: req.body.email })
            if (!result || (req.body.email != result.email)) {
                  sendMail(req.body.email);
                  let passwordHash = genHash(req.body.password)
                  let userDetails = new userSchema({
                        name: req.body.name,
                        email: req.body.email,
                        password: passwordHash,
                        roles: "NORMAL",
                  });
                  userDetails.save().then((user) => {
                        let generatedToken = tokenGen(res, user._id, user.roles, user.name)
                        generatedToken.then((token) => {
                              res.status(201).send({ token, name: user.name, roles: user.roles, send: req.body.email });
                        })
                              .catch((error) => {
                                    res.status(500).send(error);
                              });
                  }).catch((err) => {
                        res.send({ Error: err })
                  });
            }
            else {
                  res.status(400).send({ Error: "Email already exist" })
            }
      } catch (error) {
            res.status(500).send({ Error: `Internal server Error ${error}` });
      }
}
const getall_Users = async (req, res) => {
      let userData = await userSchema.find();
      res.status(200).send(userData)
}
const login_User = async (req, res) => {
      try {
            let loginquery = await userSchema.findOne({ email: req.body.email })
            if (loginquery) {
                  compare(req.body.password, loginquery.password, (err, result) => {
                        if (result) {
                              let generatedToken = tokenGen(res, loginquery._id, loginquery.roles, loginquery.name)
                              generatedToken.then((token) => {
                                    res.send({ Message: "Successfully Login", roles: loginquery.roles, token, name: loginquery.name, userid: loginquery._id })
                              })
                        } else {
                              res.status(400).json({ message: 'Invalid credentials' });
                        }
                  });
            } else {
                  res.status(400).send({ Error: "Wrong Credentials" })
            }
      } catch (error) {
            res.status(500).send({ Error: `Internal server Error ${error}` })
      }
}
const delete_User = async (req, res) => {
      try {
            let deleteuser_query = await userSchema.findByIdAndDelete(req.params._id.trim())
            if (!deleteuser_query) {
                  res.status(400).send({ Error: "User not found" });
            } else {
                  res.status(200).send(deleteuser_query)
            }
      } catch (error) {
            res.status(500).send({ Error: "Internal Server Error" })
      }
}
const updateBy_Admin = async (req, res) => {
      try {
            let compareHash = genHash(req.body.password)
            const update = { email: req.body.email, password: compareHash };
            let updatedUser = await userSchema.findByIdAndUpdate(
                  req.params._id.trim(),
                  update,
                  { new: true }
            );
            if (updatedUser) {
                  res.status(200).send(updatedUser);
            } else {
                  res.status(400).send({ error: 'User not found' });
            }
      } catch (err) {
            res.status(500).send(err);
      }
}
module.exports = { Create_User, getall_Users, login_User, delete_User, updateBy_Admin }