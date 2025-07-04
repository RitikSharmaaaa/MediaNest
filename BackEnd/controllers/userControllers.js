const { trusted } = require('mongoose');
const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cloudinary = require('../utils/cloudinary');

const getDataUri = require('../utils/datauri');



module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            return res.status(401).json({
                message: "All field is required",
                success: false
            })
        }
        const existed = await User.findOne({ email });
        if (existed) {
            return res.status(401).json({
                message: "User Already exist",
                success: false
            })
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const userData = {
            username,
            email,
            password: hashpassword,

        }

        const user = await User.create(userData);

        return res.status(200).json({
            message: "Account Created Sucesssfully",
            success: true
        })


    } catch (err) {

        return res.status(500).json({

            message: err,
            success: false
        })
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).json({
                message: "All field required",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({
                message: "Email Or Password is Wrong",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({
                message: "Email Or Password is Wrong",
                success: false
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRETKEY, { expiresIn: '1d' });

        return res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                secure: false // Set to true in production (HTTPS)
            })
            .status(200)
            .json({
                message: "Welcome",
                success: true,
                user

            });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error,
            success: false,
            
        })
    }

}

module.exports.logout = (_, res) => {
    try {

        return res.cookie('token', '', { maxAge: 0 }).json({
            success: true,
            message: 'Logout Sucessfully'
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports.getProfile = async (req, res) => {

    try {
        const userId = req.params.id;
        const user = await User.findOne({ _id: userId }).select('-password');

        res.status(200).json({
            user,
            success: true
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports.editProfile = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudnaryResponse;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudnaryResponse = await cloudinary.uploader.upload(fileUri);
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudnaryResponse.secure_url;

        await user.save();
        return res.status(200).json({
            message: "Data Updated",
            success: true
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err,
            success: false
        })
    }
}

module.exports.getSuggestedUser = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
                success: false
            })
        };
        return res.status(400).json({
            success: true,
            user: suggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.followUnfollow = async (req, res) => {
    try {
        const followKarneWala = req.id;
        const jiskofollowkarnahaii = req.params.id;
        if (followKarneWala === jiskofollowkarnahaii) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false
            })
        }

        const user = await User.findOne({ _id: followKarneWala })
        const targetUser = await User.findOne({ _id: jiskofollowkarnahaii })

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User Not found",
                success: false
            })
        }

        const isFollowing = user.following.includes(jiskofollowkarnahaii)
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $pull: { following: jiskofollowkarnahaii } }),
                User.updateOne({ _id: jiskofollowkarnahaii }, { $pull: { followers: followKarneWala } }),
            ])
            await user.save();
            return res.stauts(200).json({
                message: "Unfollow Successfully",
                success: true,
            })
        }
        else {
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $push: { following: jiskofollowkarnahaii } }),
                User.updateOne({ _id: jiskofollowkarnahaii }, { $push: { followers: followKarneWala } }),
            ])
            await user.save();
            return res.status(200).json({
                message: "Follow Successfully",
                success: true,
            })
        }
    }
    catch (err) {
        console.log(err);
    }
}