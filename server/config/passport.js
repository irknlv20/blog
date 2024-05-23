const passport = require('passport');
const User = require('../auth/User');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20')
const GitHubStrategy = require('passport-github2')
//
//
passport.use(
    new LocalStrategy({ usernameField: "email" }, function (
        email,
        password,
        done
    ) {
        User.findOne({ email })
            .then((user) => {
                if (user != null) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (err) {
                            return done(err);
                        }
                        if (result) {
                            return done(null, user);
                        }
                    });
                }
            })
            .catch((e) => {
                return done(e);
            });
    })
);
passport.use(new GoogleStrategy({
        clientID: "932888049565-5e185ef1c3tv0hoacuan7ek8fhj9c8f6.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/api/auth/google",
        scope: ['openid', 'email', 'profile'],
    },
    async (accessToken, refreshToken, profile, cb)=> {
        const user = await User.findOne({
            googleId: profile.id
        });
        if(!user){
            const user = new User({
                googleId: profile.id,
                full_name: profile.displayName,
                image: `/images/avatar.png`,
                email: profile.emails[0].value,
                isBlocked: false,
                isAdmin: false,
            })
            await user.save();
            console.log(profile)
            return cb(null, user)
        } else{
            return cb(null, user)
        }
    }
));

passport.use(new GitHubStrategy({
        clientID: "14e31d12a3a583b0f398",
        clientSecret: "f24deb565deb80ce31aea9be2041c6f40cc71a58",
        callbackURL: "http://localhost:8000/api/auth/github/callback",
        scope: [ 'user:email' ]
    },
    async (accessToken, refreshToken, profile, cb)=> {
        const user = await User.findOne({
            githubId: profile.id
        });
        if(!user){
            const user = new User({
                githubId: profile.id,
                full_name: profile.displayName,
                image: `/images/avatar.png`,
                email: profile.emails[0].value,
                isBlocked: false,
                isAdmin: false,
            })
            await user.save();
            console.log(profile)
            return cb(null, user)
        } else{
            return cb(null, user)
        }
    }
));
passport.serializeUser(function(user, done) {
    done(null, user._id)
})
passport.deserializeUser(function(id, done) {
    User.findById(id).then((user, err) => {
        done(err, user);
    })
})