const express = require('express');
const { register, login, logout, getProfile, editProfile, getSuggestedUser, followUnfollow } = require('../controllers/userControllers');
const { isAuthenticated } = require('../middleware/Auth'); // Make sure this matches exactly
const upload = require('../utils/multer');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthenticated, followUnfollow);

module.exports = router;
