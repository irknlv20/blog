const express = require('express');
const {editProfile, blockUser, unlockUser, deleteUser, deleteAccount} = require("./controller");
const {upload} = require("./multer");
const {isProfile, isAuth, isAdmin} = require("../auth/middlewares");
const router = express.Router();

router.post('/api/editprofile', isAuth ,upload.single("image"), editProfile);
router.post('/api/blockuser/:id', isAdmin, blockUser)
router.post('/api/unlockuser/:id', isAdmin, unlockUser)
router.delete('/api/deleteuser/:id', isAdmin, deleteUser)
router.delete('/api/deleteaccount/:id', isAuth, deleteAccount)

module.exports = router;