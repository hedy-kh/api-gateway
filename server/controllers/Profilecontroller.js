const User = require('../models/user.models');
const cloudinary = require('cloudinary').v2;
exports.updateProfile = async (req, res) => {
    const { firstName, lastName, age } = req.body;
    const { id } = req.params;
    try {
        if (firstName && firstName.length < 4) return res.status(400).json({ error: 'invalid firstname' });
        if (lastName && lastName.length < 4) return res.status(400).json({ error: 'invalid email' });
        if (age && (isNaN(age) || age < 13 || age > 100)) {
        return res.status(400).json({ error: 'Age must be between 13 and 100' });
        }
        const user = await User.findById(id);
        if (req.user.id !== id) return res.status(403).json({ error: 'unauthorized' });
        if (!user) return res.status(400).json({ error: 'no user found' });
        user.firstName = firstName;
        user.lastName = lastName;
        user.age = age;
        return res.status(200).json({ success: `you updated your profile ${user}` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.changePassword = async (req, res) => {
    const { password, ConfirmPassword } = req.body;
    const { id } = req.params;
    if (!id) return res.status(500).json({ error: 'server error' });
    try {
        if (password.length < 8 || ConfirmPassword.length < 8) return res.status(400).json({ error: 'password must be over 8 chars' });
        if (password !== ConfirmPassword) return res.status(400).json({ error: 'password do not match' });
        const user = await User.findById(id);
        if (req.user?.id !== id) return res.status(401).json({ error: 'unauthorized' });
        const isSame = await user.isValidPassword(password);
        if (isSame) return res.status(400).json({ error: 'new password cannot be the old password' });
        user.password = password;
        await user.save();
        return res.status(200).json({ success: 'password updated successfully' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.changePicture = async (req, res) => {
    const { profileImg } = req.body;
    const { id } = req.params;
    
    try {
        if (!profileImg) return res.status(400).json({ error: 'no image provided' });
        const existingUser = await User.findById(id);
        if (req.user.id !== id) return res.status(403).json({ error: 'unauthorized' });
        if (!existingUser) {
            return res.status(404).json({ error: 'user not found' });
        }
        if (existingUser.profileImg) {
            const urlParts = existingUser.profileImg.split('/');
            const publicIdWithExt = urlParts.slice(-2).join('/'); 
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
            
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.log('Failed to delete old image:', err);
            }
        }
        const result = await cloudinary.uploader.upload(profileImg, {
            folder: 'profile-images',
            width: 300,
            height: 300,
            crop: 'fill',
            quality: 'auto',
            format: 'jpg'
        });

        const user = await User.findByIdAndUpdate(
            id,
            { profileImg: result.secure_url },
            { new: true }
        );

        return res.status(200).json({ 
            message: 'success', 
            user: user, 
            image: result.secure_url 
        });

    } catch (error) {
        console.log(error); 
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.getProfile = async (req, res) => {
    try {
      const id = req.user.id;
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ error: 'no user found' });
      return res.status(200).json({ success: 'success', message: `user profile ${user}` });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'internal server error' });
  }  
};