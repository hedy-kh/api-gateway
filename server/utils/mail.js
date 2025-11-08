const nodemailer = require('nodemailer');
const crypto = require('crypto');
const generateOTP = () => {
    let digits = '';
    for (let i = 0; i < 4; i++) {
        digits += Math.floor(Math.random() * 10);
    }
    return digits.toString();
};
const generateToken = () => {
    return crypto.randomBytes(32).toString('base64url');
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
            html: `<b>Your OTP code is: ${otp}</b>`
        });
        console.log('OTP email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send OTP email');
    }
};
const verificationSucess = async (email) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'verification sucess',
            text:'your account is successfully verified',
        });
    } catch (error) {
        console.log(error);
        throw new Error('failed to send verification success mail');
    }
};
const forgetPassword = async (email, token) => {
    try {
        await transporter.sendMail({
            to: email,
            subject: 'PasswordRest',
            html: `
            <p>
            rest your password
            <a href="${process.env.FRONT_URL}/resetpassword?email=${email}&token=${token}">Rest password</a>
            ${token}
            <p>`
        });
    } catch (error) {
        console.log(error);
        throw new Error('failed to send rest password mail');
    }
};

module.exports = { generateOTP, sendOTPEmail,forgetPassword,verificationSucess,generateToken};