const User = require('../auth/User')
const Blogs = require("../Blogs/Blogs");
const fs = require("fs");
const path = require("path");

const editProfile = async (req, res) => {
    const user = await User.findById(req.body.id)
    if (
        req.file &&
        req.body.full_name.length > 2 &&
        req.body.hobby.length > 2
    ) {
        await User.findByIdAndUpdate(req.body.id, {
            full_name: req.body.full_name,
            hobby: req.body.hobby,
            image: `/images/users/${req.file.filename}`
        });
        res.redirect(`/myblogs/${req.body.id}`);
    } else {
        res.redirect(`/editprofile/${req.body.id}?error=2`);
    }
};
const blockUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    user.isBlocked = true;
    user.save()
    res.send("")
}
const unlockUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    user.isBlocked = false;
    user.save()
    res.send("")
}
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if(user.image != "/images/avatar.png"){
            fs.unlinkSync(path.join(__dirname + "../../../public" + user.image));
        }
        await User.deleteOne({ _id: req.params.id });
        res.status(200).send("ok");
    } else {
        res.status(404).send("not found");
    }
};
const deleteAccount = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if(user.image != "/images/avatar.png"){
            fs.unlinkSync(path.join(__dirname + "../../../public" + user.image));
        }
        await User.deleteOne({ _id: req.params.id });
        res.status(200).send("ok");
    } else {
        res.status(404).send("not found");
    }
};
module.exports = {editProfile, blockUser, unlockUser, deleteUser, deleteAccount}