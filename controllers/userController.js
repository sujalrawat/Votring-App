import User from '../models/userSchema.js';
import { checkAdminRole } from './authController.js';
import Candidate from '../models/candidateSchema.js';

export async function getProfile(req, res) {
  try {
    const userData = req.user;

    const user = await User.findById(userData.id);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err.message,
    });
  }
}

export async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!(await user.comparePassword(currentPassword, user.password))) {
      return res.status(401).json({
        message: 'incorrect current password',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password updated',
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err.message,
    });
  }
}


