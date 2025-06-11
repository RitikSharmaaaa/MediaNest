const cloudinary = require('cloudinary');
require('dotenv').config();

cloudinary.config({
    cloud_name:process.env.CLOUDNAME,
    api_key:process.env.APIKEY,
    api_secret:process.env.APISECRETKEY
})

module.exports = cloudinary;