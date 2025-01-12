import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export async function signup(req, res, next) {
  try {
    const admin = await User.findOne({role:'admin'});
    
    if(req.body.role==='admin' && admin){
      return res.status(400).json({
        status:'fail',
        message:"There can only be one admin"
      })
    }
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function login(req, res, next) {
  try {
    const { aadharCardNumber, password } = req.body;

    if (!aadharCardNumber || !password) {
      return res.status(401).json({
        message: 'please provide aadhar card and password',
      });
    }

    const user = await User.findOne({ aadharCardNumber })

    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({
        message: 'incorrect aadhar card number or password',
      });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token
    });
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
}

export async function protect(req,res,next){
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return res.status(401).json({
            status:'logged out',
            message:"You are not logged in"
        })
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        
        req.user = decoded
        next();
    }catch(err){
        res.status(401).json({
            status:'fail',
            message:err.message
        })
    }


}

export async function checkAdminRole(userId){
  try{
    const user = await User.findById(userId) 
    return user.role === 'admin'
  }catch(err){
    return false;
  }
}