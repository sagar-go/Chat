const User = require("../models/userModel");
const generateToken = require("../utils/util");
const jwt = require("jsonwebtoken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
   return res.status(200).send('User already Exists');
    // throw new Error("User already exists");
  }


  const user = await User.create({
    name,
    email,
    password,
    pic,
  })
  
  if (user) {
    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET
    );
  

  return  res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: token,
    });
  } else {
  return  res.status(400).send('Some Error');
    throw new Error("User not found");
  }
};

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if(!user){
    return res.status(200).send({success:false,message:"Invalid Email or Password"});
  }else{

    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET
    );
  

    return res.send({
      success:true,
      data:{
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: token,
      }
   
    });

  }




    
  
};

module.exports = { allUsers, registerUser, authUser };