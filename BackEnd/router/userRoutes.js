const express = require('express');
const { register,login, logout, getProfile, editProfile, getSuggestedUser, followUnfollow } = require('../controllers/userControllers');
const { isAuthencaicated } = require('../middleware/Auth');
const  upload  = require('../utils/multer');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthencaicated,getProfile);
router.route('/profile/edit').post(isAuthencaicated,upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthencaicated,getSuggestedUser);
router.route('/followorunfollow/:id').post(isAuthencaicated, followUnfollow);
// router.route('/login').post(login);

module.exports = router;