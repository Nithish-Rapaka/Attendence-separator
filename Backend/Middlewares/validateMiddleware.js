const validateRegister = (req, res, next) => {
    const { name, id, password } = req.body;
    if (!name || !id || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 1) {
        return res.status(400).json({ message: 'Password must be at least 1 character or numbers' });
    }
    next();
};

const validateLogin=(req,res,next)=>{
    const { id, password } = req.body;
    if(!id || !password){
        return res.status(400).json({message:'ID and Password are required'});
    }
    next();
};
module.exports={
    validateRegister,
    validateLogin
};