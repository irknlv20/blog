const express = require('express');
const { upload } = require("./multer");
const router = express.Router();
const { isAuth, isAdmin } = require("../auth/middlewares");
const {getAllBlogs, createBlog, editBlog, createComment, deleteBlog, deleteComment, addToNotes, deleteFromNotes,
    deleteAuthorBlogs, editComment
} = require('./controller');


router.get('/api/blogs', getAllBlogs);
router.post('/api/newblog', isAuth, upload.single("image"), createBlog)
router.post('/api/editblog', isAuth, upload.single("image"), editBlog)
router.post('/api/newcomment', isAuth, createComment)
router.delete('/api/deleteblog/:id', isAuth, deleteBlog)
router.delete('/api/deletecomment/:id&:blog', isAuth, deleteComment)
router.post('/api/addtonotes/:blogId&:userId', isAuth, addToNotes)
router.delete('/api/deletefromnotes/:blogId&:userId', isAuth, deleteFromNotes)
router.delete('/api/deleteauthorblogs/:authorId', isAdmin, deleteAuthorBlogs)
router.delete('/api/deleteownblogs/:authorId', isAuth, deleteAuthorBlogs)
router.post('/api/editcomment', isAuth, editComment)

module.exports = router;