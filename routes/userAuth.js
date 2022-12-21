require("dotenv").config();
const express = require("express");
const { body } = require("express-validator");
const authControllers = require("../controllers/userAuth");

const router = express.Router();

router.post(
  "/login",
  [
    body("email", "Please enter a valid email address.")
      .isEmail()
      .normalizeEmail(),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters"
    )
      .trim()
      .isLength({ min: 5 }),
  ],
  authControllers.loginUser
);

router.post(
  "/register",
  [
    body("fullName").not().isEmpty(),

    body("email", "Please enter a valid email address.")
      .isEmail()
      .normalizeEmail(),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters"
    )
      .trim()
      .isLength({ min: 5 }),
  ],
  authControllers.registerUser
);

module.exports = router;
