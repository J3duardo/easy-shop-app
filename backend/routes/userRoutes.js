const express = require("express");
const jwt = require("jsonwebtoken");
const {check, validationResult} = require("express-validator");
const User = require("../models/userModel");

const router = express.Router();

// Registro de usuarios
router.post("/signup", [
  check("name", "Your name is required").not().isEmpty(),
  check("name", "Name must be at least 4 characters and maximum 15 characters").isLength({min: 4, max: 15}),
  check("email", "Email is required").not().isEmpty(),
  check("email", "Invalid email").isEmail(),
  check("password", "Password is required").not().isEmpty(),
  check("password", "Password must be at least 6 characters and maximum 50 characters").isLength({min: 6, max: 50}),
  check("passwordConfirm", "You must confirm your password").not().isEmpty(),
  check("phone", "You must provide your phone").not().isEmpty(),
  check("zip", "Zip code is required").not().isEmpty(),
  check("city", "Your city is required").not().isEmpty(),
  check("country", "Your country is required").not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const message = errors.array({onlyFirstError: true})
    return res.status(400).json({
      status: "failed",
      msg: message[0].msg
    })
  }

  if(req.body.password !== req.body.passwordConfirm) {
    return res.status(400).json({
      status: "failed",
      msg: "Passwords don't match"
    })
  }

  
  try {
    const {name, email, password, passwordConfirm, phone, zip, city, country} = req.body;

    // Chequear si existe un usuario para el email ingresado
    const checkUser = await User.findOne({email});
    if(checkUser) {
      return res.status(400).json({
        status: "failed",
        msg: "User already exists. Try another email address."
      })
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      passwordConfirm,
      phone,
      zip,
      city,
      country
    });

    await user.save();
    user.password = undefined;

    const token = jwt.sign(
      {userId: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET,
      {expiresIn: "7 days"}
    );

    res.json({
      status: "success",
      data: {token, user}
    });
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
});

// Login de usuarios
router.post("/login", [
  check("email", "Email is required").not().isEmpty(),
  check("email", "Invalid email").isEmail(),
  check("password", "Password is required").not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    const message = errors.array({onlyFirstError: true})
    return res.status(400).json({
      status: "failed",
      msg: message[0].msg
    })
  }

  try {
    const email = req.body.email && req.body.email.toLowerCase();
    const user = await User.findOne({email});

    if(!user) {
      return res.status(404).json({
        status: "failed",
        msg: "User not found or deleted"
      })
    }

    const checkPassword = await user.checkPassword(req.body.password);
    if(!checkPassword) {
      return res.status(401).json({
        status: "failed",
        msg: "Wrong password"
      })
    }

    const token = jwt.sign(
      {userId: user._id, isAdmin: user.isAdmin},
      process.env.JWT_SECRET,
      {expiresIn: "7 days"}
    );

    user.password = undefined;

    res.json({
      status: "success",
      data: {token, user}
    });
    
  } catch (error) {
    res.status(500).json({
      status: "failed",
      msg: `Error: ${error.message}`
    })
  }
})

module.exports = router;