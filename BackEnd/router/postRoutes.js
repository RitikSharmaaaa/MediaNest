const express = require('express');
const { isAuthencaicated } = require('../middleware/Auth');
const  upload  = require('../utils/multer');
const { addPost, allPost, userAllPost, likePost, addComment, getAllComment, deletePost, bookmark } = require('../controllers/postControllers');
const router = express.Router();

router.route('/addpost').post(isAuthencaicated,upload.single('image'),addPost);
router.route('/userallpost').post(isAuthencaicated, userAllPost);
router.route('/allpost').post(isAuthencaicated,allPost);
router.route('/likepost/:id').post(isAuthencaicated,likePost);
router.route('/addcomment/:id').post(isAuthencaicated,addComment);
router.route('/getallcomment/:id').get(isAuthencaicated,getAllComment);
router.route('/deletepost/:id').post(isAuthencaicated,deletePost);
router.route('/bookmark/:id').post(isAuthencaicated,bookmark);
module.exports = router;