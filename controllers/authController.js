const User = require('../models/userModel');

const signup = async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: `sucess`,
    data: {
      user: newUser,
    },
  });
};
module.exports= signup
