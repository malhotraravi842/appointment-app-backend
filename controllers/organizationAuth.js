const Organization = require("../models/organization");
const { validationResult } = require("express-validator");
const { throwErr } = require("../util/error");

exports.registerOrganization = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwErr("Validation Failed", 422, errors);
  }

  const email = req.body.email;

  Organization.findOne({ email: email })
    .then((org) => {
      if (org) {
        throwErr("Email address exists already.", 422);
      }

      return bcrypt.hash(req.body.password, 12);
    })
    .then((hashedPass) => {
      const org = new Organization({
        email: email,
        password: hashedPass,
        orgName: req.body.orgName,
        addressLine1: req.body.addressLine1,
        addressLine2: req.body.addressLin2,
        city: req.body.city,
        pincode: req.body.pincode,
        phoneNumber: req.body.phoneNumber,
      });

      return org.save();
    })
    .then((org) => {
      res.status(201).json({ message: "Registration is successfull." });
    })
    .catch((err) => next(err));
};

exports.loginOrganization = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwErr("Validation Failed", 422, errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  let foundOrg;

  Organization.findOne({ email: email })
    .then((org) => {
      if (!org) {
        throwErr("User not found", 404);
      }

      foundOrg = org;

      return bcrypt.compare(password, org.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        throwErr("Please enter a valid email or password", 401);
      }

      const token = jwt.sign(
        { userId: foundOrg._id.toString(), email: foundOrg.email },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );

      res
        .status(200)
        .json({ message: "Login is successfull.", accessToken: token });
    })
    .catch((err) => next(err));
};
