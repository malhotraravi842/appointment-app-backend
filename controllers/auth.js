require("dotenv").config();
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { throwErr } = require("../util/error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwErr("Validation Failed", 422, errors);
  }

  const email = req.body.email;

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        throwErr("Email address exists already.", 422);
      }

      return bcrypt.hash(req.body.password, 12);
    })
    .then((hashedPass) => {
      const user = new User({
        email: req.body.email,
        password: hashedPass,
        fullName: req.body.fullName,
      });

      return user.save();
    })
    .then((user) => {
      res.status(201).json({ message: "Registration is successfull." });
    })
    .catch((err) => next(err));
};
exports.loginUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwErr("Validation Failed", 422, errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  let foundUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        throwErr("User not found", 404);
      }

      foundUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        throwErr("Please enter a valid email or password", 401);
      }

      const token = jwt.sign(
        { userId: foundUser._id.toString(), email: foundUser.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      res
        .status(200)
        .json({ message: "Login is successfull.", data: { token: token } });
    })
    .catch((err) => next(err));
};
