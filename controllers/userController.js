const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync( async (req,res)=>{
    const users = await User.find();
      res.status(200).json({
    status: 'success',
    data: {
    users: users
    },
  });
})
module.exports ={ getAllUsers}