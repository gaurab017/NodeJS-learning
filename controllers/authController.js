/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

//JWT sign function
const signToken = (id) => jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //Signup controller
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
// Hide password in response
  newUser.password = undefined;
  
  const token = signToken(newUser._id);
  res.status(201).json({
    status: `sucess`,
    token,
    data: {
      user: newUser,
    },
  });
});

//login controller
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1) Check if email exist and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exist && password is correct
  const user = await User.findOne({ email: email }).select('+password');
  const checkPass = await user.correctPassword(password, user.password);

  if (!user || !checkPass) {
    return next(new AppError('Incorrect email or password'), 401);
  }
  //3) If everything is ok send token the client
  const token = signToken(user._id);
  res.status(201).json({
    status: `sucess`,
    token,
  });
});
module.exports = { signup, login };
