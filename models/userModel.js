/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `Please tell us your name`],
  },
  email: {
    type: String,
    required: [true, `Please provide your email`],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, `Please provide a password`],
    minlength: 8,
    maxlength: 64,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, `Please confirm your password`],
    validate: {
      //Only works on SAVE!!
      //Does not work on findByIdAndUpdate
      validator: function (el) {
        return el === this.password;
      },
      message: 'password are not same',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  passwordChangedAt: {
    type: Date,
    default: '2025-07-11',
  },
});

userSchema.pre('save', async function (next) {
  //Only run this function if password was actually isModified
  if (!this.isModified('password')) return next();

  //Hash the password with cost of 1
  this.password = await bcrypt.hash(this.password, 12);

  //Delete the passwordConfirm field
  this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(
      this.passwordChangedAt, JWTTimestamp
    );

    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // Return true if password was changed after JWT issued
    return changedTimestamp > JWTTimestamp;
  }

  // False means password NOT changed after token issued
  return false;
};

const User = mongoose.model(`User`, userSchema);
module.exports = User;
