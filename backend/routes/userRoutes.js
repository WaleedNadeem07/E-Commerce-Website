const express = require('express');
const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key'; 
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");


const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// creating user
router.post('/', async(req, res)=> {
  try {
    const {name, email, password, picture} = req.body;
    console.log(req.body);
    const user = await User.create({name, email, password, picture});
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if(e.code == 11000){
      msg = "User already exists"
    } else {
      msg = e.message;
    }
    console.log(e);
    res.status(400).json(msg)
  }
})

router.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ name: username });
    console.log("HERE");
    if (existingUser) {
      // Username already exists, return an error response
      return res.status(400).json({ message: 'Username already exists.' });
    }
    console.log("HERE2");

    // Username doesn't exist, proceed with creating the new user
    const newUser = await User.create({ name: username, email, password });

    // Generate a JWT token with user's email as payload
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// login user
router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with user's email as payload
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    // Include the username in the response JSON object
    console.log(user.name);
    res.status(200).json({ user: { name: user.name, email: user.email }, token });
  } catch (error) {
    console.log("failed login req");
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/api/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email is "admin14@gmail.com"
    if (email !== 'admin14@gmail.com') {
      return res.status(403).json({ error: 'Not authorized. Admins only.' });
    }

    const user = await User.findByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with user's email as payload
    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    res.status(200).json({ user: { name: user.name, email: user.email }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:8000/v1/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "waleednadeem07@gmail.com",
        pass: "asmtsgpgxsmnfcoe",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "waleednadeem07@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
    
  } catch (error) { console.log("Error", error); }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    //res.send("Verified");
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }

});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

module.exports = router;
