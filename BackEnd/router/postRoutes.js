const express = require('express');
const { isAuthenticated } = require('../middleware/Auth');
const upload = require('../utils/multer');
const { addPost, allPost, userAllPost, likePost, addComment, getAllComment, deletePost, bookmark } = require('../controllers/postControllers');
const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addPost);
router.route('/userallpost').post(isAuthenticated, userAllPost);
router.route('/allpost').post(isAuthenticated, allPost);
router.route('/likepost/:id').post(isAuthenticated, likePost);
router.route('/addcomment/:id').post(isAuthenticated, addComment);
router.route('/getallcomment/:id').get(isAuthenticated, getAllComment);
router.route('/deletepost/:id').delete(isAuthenticated, deletePost);
router.route('/bookmark/:id').post(isAuthenticated, bookmark);

module.exports = router;
