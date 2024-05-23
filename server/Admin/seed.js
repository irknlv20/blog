const User = require("../auth/User");
const bcrypt = require('bcrypt');
async function createAdmin() {
    const findAdmin = await User.find({ isAdmin: true }).count();
    if (findAdmin == 0) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash('1', salt, function(err, hash) {
                new User({
                    email: 'master@master.com',
                    full_name: 'Master',
                    isAdmin: true,
                    image: '/images/avatar.png',
                    password: hash,
                }).save();
            });
        })
    }
}
module.exports = createAdmin;