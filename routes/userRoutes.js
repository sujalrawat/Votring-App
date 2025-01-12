import express from 'express';
import {login,signup,protect} from '../controllers/authController.js';
import {getProfile,changePassword} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/profile').get(protect,getProfile);

router.route('/profile/password').patch(protect,changePassword);

router.route('/vote/:id').get(protect)

export default router;
