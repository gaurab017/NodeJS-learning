/* eslint-disable import/no-extraneous-dependencies */
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//JWT sign function
const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
//Signup controller
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role : req.body.role
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
const protect = async (req, res, next) => {
  console.log('Protect middleware triggered');
  //1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get acess', 401)
    );
  }
  //2) Verification tokken
  const verifyAsync = promisify(jwt.verify);
  const decodedResult = await verifyAsync(token, process.env.JWT_SECRET);
  console.log(decodedResult);
  //3) Check if user still exist
  const verifiedUser = await User.findById(decodedResult.id);
  if (!verifiedUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }
  //4) Check if userchanged password after the JWT was issues
  const passwordChanged = await verifiedUser.changedPasswordAfter(
    decodedResult.iat
  );
  if (passwordChanged) {
    return next(
      new AppError('Password was Changed recently. Please Login Again', 401)
    );
  }
  //Grant Acess to protected route
  req.user = verifiedUser;
  next();
};

const restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next(); // Call next only if allowed
  };


module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  
};
