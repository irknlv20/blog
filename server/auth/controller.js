const User = require('./User');
const bcrypt = require('bcrypt');
const {cp} = require("fs");

const signUp = async(req, res) => {
    if(
        req.body.email.length <= 0 ||
        req.body.full_name <= 0 ||
        req.body.password.length <= 0 ||
        req.body.re_password.length <= 0
    ){
        res.redirect('/registration?error=1');
    }else if(req.body.password !== req.body.re_password){
        res.redirect('/registration?error?2');
    }
    const findUser = await User.findOne({email: req.body.email}).count()
    if(findUser){
        res.redirect('/registration/error=3');
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            new User({
                email: req.body.email,
                full_name: req.body.full_name,
                isAdmin: false,
                image: `/images/avatar.png`,
                password: hash,
                isBlocked: false,
            }).save();
            res.redirect('/login');
        });
    })
}

const signIn = async (req, res) => {
    res.redirect(`/myblogs/${req.user._id}`);
}

const signOut = (req, res) => {
    req.logout(function(err){
        if(err){
            console.log(err);
        }
    })
    res.redirect('/')
}

const getAllUsers = async(req,res) => {
    const data = await User.find();
    res.send({data})
}

module.exports = {signUp, signIn, signOut, getAllUsers};