// Require the cloudinary library
import { v2 as cloudinary } from 'cloudinary'

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: 'domjbuuvt',
    api_key: '773156444981753',
    api_secret: process.env.API_CLOUDINARY_SECRET
});

// Log the configuration
// console.log(cloudinary.config());
export default cloudinary;