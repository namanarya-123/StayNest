// code ko batao ki clodinary ko kaise access kare

const cloudinary= require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

// config matlb jodna
// cloud ko backend ke sath jodna

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary : cloudinary,
    params: {
        // kahan pe file store karana hian
        folder: 'wanderlust_DEV',

        // kon kon se format ke data allowed honge usko likho
        allowerdFormats: ["png" , "jpg" , "jpeg"],
    },
});

module.exports = {
    cloudinary,
    storage
}