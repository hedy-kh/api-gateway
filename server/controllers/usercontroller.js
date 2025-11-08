const jwt = require('jsonwebtoken');
const User = require('../models/user.models.js');
const { generateOTP, sendOTPEmail, generateToken,forgetPassword,verificationSucess } = require('../utils/mail');
exports.createAccount = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;
        if (firstName.length < 4 || lastName.length < 4 || !email) return res.status(400).json({
            "sucess": "error",
            "message":"missing email or firstname and lastname must be more than 4 chars"
        });
        if (password.length < 8) {
            return res.status(400).json({ 'success': 'error', 'message': 'password must be more than 8 chars' });
        } else if (password !== confirmPassword) {
            return res.status(400).json({ 'success': 'error', 'message': 'password and confirm password are not matching' });
        }
        const exisitingUser = await User.findOne({ email });
        if (exisitingUser) return res.status(400).json({ 'sucess': 'user already exisit' ,'message':'this email already exisit'});
        const otp = generateOTP();
        const user = new User({
            email,
            firstName,
            lastName,
            password,
            otp,
            otpCreatedAt: new Date()
        });
        await user.save();
        await sendOTPEmail(email,otp);
        return res.status(200).json({
            'success': 'sucess',
            'message':'registration success please confirm via the code sent to your mail'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'error': 'internal server error' });
    }
};
exports.verifyAccount = async (req, res) => {
    try {
        const { otp, email } = req.body;
        if (!email) return res.status(500).json({ success: 'error', message: 'server error' });
        if (otp.toString().length < 4) return res.status(400).json({ error: "wrong otp" });
        const exisitingUser = await User.findOne({ email }).select('+otp +isVerified +otpCreatedAt +verifiedAt');
        if (!exisitingUser) return res.status(404).json({ error: 'error', message: 'no user found' });
        if (exisitingUser.otp === 'null') return res.status(400).json({ error: 'error', message: 'action not authroized' });
        if (exisitingUser.otp !== otp.toString()) return res.status(400).json({ error: 'wrong code' });
        const duration = Date.now() - exisitingUser.otpCreatedAt;
        if (duration >10*60*1000) return res.status(404).json({ error: 'error', message: 'token expired' });
        if (exisitingUser.isVerified) return res.status(400).json({ error:'error' ,message:'account already verified'});
        await User.updateOne({ email, }, {
            isVerified: true,
            otp: 'null',
            verifiedAt: Date.now()
        });
        await verificationSucess(email);
        return res.status(200).json({ 'sucess': 'your account is verified' });
    } catch (error) {
        console.log(error);
        return res.status.json({ 'error': 'internal server error' });
    }
};
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ "error": 'email or password missing' });
    const exisitingUser = await User.findOne({ email }).select('+password +isVerified');
    if (!exisitingUser) return res.status(400).json({ "error": "no user found " });
    
    const isMatched = await exisitingUser.isValidPassword(password);
    if (!isMatched) return res.status(403).json({ error: 'invalid password' });
    
    if (!exisitingUser.isVerified) return res.status(400).json({ error: "", "message": "you must verifiy your email first" });
    
    const payload = {
      id: exisitingUser._id,
      email: exisitingUser.email,
      role: exisitingUser.role,
      issuer: 'noapp',
    };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: '37d' });
    
    exisitingUser.refreshToken.push(refreshToken);
    await exisitingUser.save();
    res.cookie("Auth", refreshToken, {
      httpOnly: true,
      maxAge: 37 * 24 * 60 * 60 * 1000, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.cookie("hasSession", 'true', {
      httpOnly: false, 
      maxAge: 37 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    const userResponse = {
      id: exisitingUser._id,
      email: exisitingUser.email,
      role: exisitingUser.role,
      isVerified: exisitingUser.isVerified,
    };
    
    return res.status(200).json({
      'success': 'login success',
      accessToken,
      user: userResponse
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'internal server error' });
  }  
};
exports.tokenRefersh = async (req, res) => {
  try {
    const { Auth } = req.cookies;
    if (!Auth) return res.status(403).json({ error: 'unauthorized' });
    
    const decoded = jwt.verify(Auth, process.env.JWT_REFRESH);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.refreshToken.includes(Auth)) {
      return res.status(401).json({ error: 'user not found' });
    }
    
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      issuer: 'noapp',
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
    return res.status(201).json({
      success: 'token refreshed',
      accessToken,
      user: userResponse 
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'internal server error' });
  }
};
exports.resetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'missing email' });
    try {
        const exisitingUser = await User.findOne({ email }).select('+resetToken +restTokenAt +isVerified');
        if (!exisitingUser) return res.status(404).json({ error: 'no user found' });
        if (!exisitingUser.isVerified) {
            return res.status(401).json({ error: 'please verify your account first' });
        }
        const token = generateToken();
        exisitingUser.resetToken = token;
        exisitingUser.restTokenAt = Date.now();
        await forgetPassword(email, token);
        return res.status(200).json({ success: `rest instructions sent to ${email}` });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.setPassword = async (req, res) => {
    const { email, token } = req.query;
    const { password, confirmPassword } = req.body;
    if (!email || !token) return res.status(500).json({ error: 'internal server error' });
    if (token.length !== 43) return res.status(400).json({ error: 'invalid token' });
    try {
        const user = await User.findOne({ email }).select('+resetToken +restTokenAt +isVerified');
        if (!user) return res.status(404).json({ error: 'no user found' });
        if (user.resetToken !== token) return res.status(400).json({ error: 'invalid token' });
        const duration = Date.now() - user.restTokenAt;
        if (duration>14*60*1000) return res.status(400).json({ error: 'token expired' });
        if (password.length < 8 || confirmPassword.length < 8) return res.status(400).json({ error: 'password must be more than 8 chars' });
        if (password !== confirmPassword) return res.status(400).json({ error: 'password do not match' });
        const isSame = await user.isValidPassword(password);
        if (isSame) return res.status(400).json({ warning: 'new password cannot be the same the old password' });
        user.password = password;
        await user.save();
        return res.status(200).json({ success: 'your password is updated' });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
        
    }

};
exports.logout = async (req, res) => {
  try {
    const { Auth } = req.cookies;
    if (Auth) {
      const decoded = jwt.verify(Auth, process.env.JWT_REFRESH);
      const user = await User.findById(decoded.id);
      if (user) {
        user.refreshToken = user.refreshToken.filter(token => token !== Auth);
        await user.save();
      }
    }
    res.clearCookie("Auth");
    res.clearCookie  ("hasSession");
    return res.status(200).json({ success: 'logout success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'internal server error' });
  }
};