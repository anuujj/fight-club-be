const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require('nodemailer');
const { generateVerificationToken } = require("../utils");

const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com',
      pass: 'password',
    },
  });

  const verificationLink = `http://localhost:5173/verify/${token}`;

  const mailOptions = {
    from: 'videshsen729@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: ${verificationLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const verificationToken = generateVerificationToken();
    // Create a new user
    const newUser = new User({ username, password, isVerified: false, verificationToken, email });
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    sendVerificationEmail(email, verificationToken);

    res.status(201).json({ userId: newUser._id, token });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user in the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Username is not valid", errorCode: 401 });
    }
    if(!user.isVerified){
      return res.status(403).json({error: "Email is not verified", errorCode: 403});
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password", errorCode: 401 });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    console.error("Error logging in user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if the username already exists
    if(username.length < 3){
      return res.status(400).json({ error: "Username must be at least 3 characters" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: `${username} is taken` });
    }

    // If the username does not exist, it is unique
    res.status(200).json({ message: "Username is unique" });
  } catch (error) {
    console.error("Error checking username:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyEmail = async(req,res)=>{
  const token = req.params.token;
  const user = await User.findOne({verificationToken: token});

  if (user) {
    // Mark user as verified in the database
    console.log('user found', user);
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verification successful' });
  } else {
    res.status(404).send('Invalid verification token.');
  }
}
module.exports = { register, login, checkUsername, verifyEmail};
