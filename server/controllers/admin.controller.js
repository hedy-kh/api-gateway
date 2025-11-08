const User = require('../models/user.models');
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) return res.status(400).json({ error: 'invalid request' });
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ error: 'user not found' });
        return res.status(200).json({ success: `user ${user} deleted successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.setClient = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(500).json({ error: 'server error' });
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'no user found' });
        if (user.role !== 'user') return res.status(401).json({
            success: 'false',
            message:'user either admin or already client'
        });
        user.role = 'client';
        await user.save();
        return res.status(200).json({ success: 'success',message:'user role updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.setUser = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ error: 'no user found' });
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'invalid user' });
        if (user.role !== 'client') return res.status(401).json({
            success: 'false',
           message:'user is admin or already with user role' 
        });
        user.role = 'user',
        await user.save();
        return res.status(200).json({ success: 'true', message: 'user role updated' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.setAdmin = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(404).json({ error: 'invalid id' });
    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: 'no user found' });
        if (user.role === 'Admin') return res.status(403).json({ error: 'user already admin' });
        user.role = 'Admin';
        await user.save();
        return res.status(200).json({ success: 'true', message: 'user role set to admin' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.getAllAdmins = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const admins = await User.find({
            role: 'Admin'
        }).skip((page - 1) * limit).limit(limit);
        const count = User.countDocuments({ role: 'Admin' });
    return res.status(200).json({
      message: count.length === 1 
        ? 'You are the only admin' 
        : 'Admins found',
      admins,
        total: count,
        currentPage: page,
            totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const user = await User.find({
            role:
                'user'
        }).skip((page - 1) * limit).limit(limit);
        const count = await User.countDocuments({ role: 'user' });
      return res.status(200).json({
          sucess: 'ok',
          message: count.length === 0 ? 'No User roles yet' : 'users found',
          user,
          total: count,
          currentPage: page,
          totalPages: Math.ceil(count / limit)
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'internal server error' });
  }  
};
exports.getAllClients = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const clients = await User.find({ role: 'client' })
            .skip((page - 1) * limit)
            .limit(limit);
        const count = await User.countDocuments({ role: 'client' });
        return res.status(200).json({
            success: 'ok',
            message: count.length === 0 ? 'no clients yet' : 'client found',
            clients,
            total: count,
            currentPage: page,
            totalPages:Math.ceil(count/limit)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
exports.getTotal = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const users = await User.find().skip((page - 1) * limit).limit(limit);
        const count = await User.countDocuments();
        return res.status(200).json({
            sucess: 'ok',
            message: count === 1 ? 'you are the only user' : 'users fetched',
            users,
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error' });
    }
};
