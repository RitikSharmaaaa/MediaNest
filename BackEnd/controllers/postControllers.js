const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');
const Post = require('../models/post_model');
const User = require('../models/user_model');
const Comment = require('../models/comment');

module.exports.addPost = async (req, res) => {
    try {
        const author = req.id;
        const { caption } = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                message: "Image required",
                success: false
            });
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudnaryResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudnaryResponse.secure_url,
            author
        });

        const user = await User.findOne({ _id: author });

        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(200).json({
            message: "Image Uploaded sucessfully",
            post,
            success: true
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.userAllPost = async (req, res) => {
    try {
        const post = await Post.find({ author: req.id }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },   // fixed typo here
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            message: "All post are showed",
            post,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.allPost = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },  // fixed typo here
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });

        return res.status(200).json({
            message: "All post are showed",
            post,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.likePost = async (req, res) => {
    try {
        const likeKrneWala = req.id;
        const postId = req.params.id;

        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(500).json({
                message: "Post Not found",
                success: false
            });
        }

        const isLiked = post.likes.includes(likeKrneWala);
        if (isLiked) {
            await post.likes.pull(likeKrneWala);
            await post.save();
            return res.status(200).json({
                message: "Unliked",
                success: true,
                updatedLikes: post.likes
            });
        } else {
            await post.likes.push(likeKrneWala);
            await post.save();
            return res.status(200).json({
                message: "liked",
                success: true,
                updatedLikes: post.likes
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.addComment = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const { text } = req.body;

        if (!postId) {
            return res.status(500).json({
                message: "postid is invalid",
                success: false
            });
        }

        const post = await Post.findById({ _id: postId });

        if (!post) {
            return res.status(500).json({
                message: "post not found",
                success: false
            });
        }

        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });

        await post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: "Comment Added",
            comment,
            post,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.getAllComment = async (req, res) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return res.status(500).json({
                message: "Postid Not found",
                success: false
            });
        }

        const comment = await Comment.find({ post: postId }).sort({ createdAt: -1 })
            .populate({
                path: 'author',
                select: 'username profilePicture'   // fixed typo here (profilePricture → profilePicture)
            })
            .populate({
                path: 'post'
            });

        return res.status(200).json({
            message: "get all comment",
            comment,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID not provided",
                success: false
            });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }

        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "Unauthorized: You are not the author of this post",
                success: false
            });
        }

        // Delete post
        await Post.findByIdAndDelete(postId);

        // Remove post from user's posts array
        const user = await User.findById(userId);
        if (user) {
            user.posts.pull(postId);
            await user.save();
        }

        // Delete all comments for that post
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

module.exports.bookmark = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;

        if (!postId) {
            return res.status(500).json({
                message: "Post ID not provided",
                success: false
            });
        }

        const user = await User.findOne({ _id: userId });

        const isBookmarked = user.bookmarks.includes(postId);
        if (isBookmarked) {
            await user.bookmarks.pull(postId);
            await user.save();
            return res.status(200).json({
                message: "Unbookmarked",
                success: true
            });
        } else {
            await user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({
                message: "bookmarked",
                success: true
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
