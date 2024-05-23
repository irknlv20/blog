const express = require('express');
const passport = require('passport');   
const router = express.Router();
const {signUp, signIn, signOut} = require('./controller');
const {getAllUsers} = require('./controller');
const createAdmin = require('../Admin/seed')
const {isNotBlocked} = require('./middlewares')

router.post('/api/signup', signUp);
router.post('/api/signin', isNotBlocked, passport.authenticate('local', {failureRedirect: '/login?error=1'}), signIn);
router.get('/api/signOut', signOut);
router.get('/api/users', getAllUsers)
router.get('/api/auth/google', passport.authenticate('google'), (req, res) => {
    res.redirect('/myblogs/' + req.user._id)
})
router.get('/api/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
createAdmin();

module.exports = router;