const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const maxAge = 365 * 24 * 60 * 60 * 1000;

const createToken = (id) =>{
    return jwt.sign({id}, process.env.TOKEN_SECRET,{
        expiresIn: maxAge
    })
};

module.exports.registerUser = async (req, res) =>{
    const { name, username, password, picture} = req.body;
    if(!name || !username || !password){
        res.status(400);
        throw new Error(" Please Enter all the Fields")
    }
    
    const userExists = await User.findOne({username});

    if(userExists){
        res.status(400);
        throw new Error("User already exits");
    }
    try{

        const user = await User.create({name, username, password, picture});
        res.status(201).json({
            _id: user._id, 
            name: user.name, 
            username: user.username,
            picture: user.picture,
        });
    }catch(err){
        res.status(400).json(err)
    }
};

module.exports.signIn = async (req, res) =>{ 
    const { username, password} = req.body;

    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge});
        res.status(200).json({user});
    }
    catch(err){
        return res.status(401).json({message:"paire nom d'utiliasateur/mot de passe incorrecte"});
    }
};


