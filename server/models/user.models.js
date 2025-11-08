const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    firstName: { type: String, trim: true, required: true},
    lastName: { type: String, trim: true, required: true }, 
    age: { type: Number },
    profileImg:{type:String,trim:true},
    role: { type: String, enum: ['Admin', 'client', 'user'], default: 'user' },
    email: { type: String, unique: true,lowercase:true, trim: true, required: true },
    password: { type: String, minlength: 8, trim: true, required: true, select: false },
    otp: { type: String, trim: true, select: false,default:'null'}, 
    otpCreatedAt: { type: Date, select: false } ,
    isVerified: { type: Boolean, default: false, select: false },
    verifiedAt:{type:Date,select:false},
    refreshToken: {type: [String]},
    resendOtp: { type: String, trim: true, select: false },
    resetToken: { type: String, trim: true, minlength: 43, maxlength: 43, select: false },
    restTokenAt:{type:Date,select:false},
}, {
    timestamps: true 
});
userSchema.index({ email: 1 });
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) return next();    
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);   
        next();
    } catch (error) {
        next(error); 
    }
});
userSchema.methods.isValidPassword = async function (password) {
    try {
        const user = await this.constructor.findById(this._id).select('+password');
        return await bcrypt.compare(password, user.password);
    } catch (error) {
        console.log(error);
        throw new Error('Password comparison failed');
    }
};
const User = mongoose.model('User', userSchema);
module.exports = User;