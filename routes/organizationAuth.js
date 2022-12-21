const express = require("express");
const organizationControllers = require("../controllers/organizationAuth");
const router = express.Router();

router.post("/register", organizationControllers.registerOrganization);

router.post("/login", organizationControllers.loginOrganization);

module.exports = router;
