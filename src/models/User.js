// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: {type: Boolean, required : true},
  email: {type: String, required: true},
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
