const Blogs = require('./Blogs');
const User = require('../auth/User')
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const getAllBlogs = async(req, res) => {
    const data = await Blogs.find();
    res.status(200).send({data});
}

const createBlog = async (req, res) => {
    if (
        req.file &&
        req.body.name.length > 2 &&
        req.body.description.length > 10 &&
        req.body.content.length > 10
    ) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        await new Blogs({
            name: req.body.name,
            description: req.body.description,
            content: req.body.content,
            date: today,
            image: `/images/blogs/${req.file.filename}`,
            author: req.user._id,
            category: req.body.category
        }).save();
        res.redirect(`/myblogs/${req.user._id}`);
    } else {
        res.redirect("/newblog?error=1");
    }
};

const editBlog = async (req, res) => {
    const blog = await Blogs.findById(req.body.id);
    if (
        req.user.id==blog.author._id &&
        req.file &&
        req.body.name.length > 2 &&
        req.body.description.length > 10 &&
        req.body.content.length > 10
    ) {
        fs.unlinkSync(path.join(__dirname + "../../../public" + blog.image));
        await Blogs.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            description: req.body.description,
            content: req.body.content,
            image: `/images/blogs/${req.file.filename}`,
            category: req.body.category
        });
        res.redirect(`/myblogs/${req.user.id}`);
    } else {
        res.redirect(`/editblog/${req.body.id}?error=2`);
    }
};
const createComment = async (req, res) => {
    if (
        req.body.content.length > 0
    ) {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        let hour = today.getHours();
        let min = today.getMinutes();
        today = hour + ':' + min + ', ' + dd + '/' + mm + '/' + yyyy;
        const blog = await Blogs.findById(req.body.blogId)
        blog.comments.push(
            {
                content: req.body.content,
                date: today,
                user: req.user,
            }
        )
        blog.save()
        res.redirect(`/blog/${req.body.blogId}`)
    } else {
        res.redirect(`/blog/?error=1`);
    }
};

const deleteBlog = async (req, res) => {
    const blog = await Blogs.findById(req.params.id);
    if (blog) {
        fs.unlinkSync(path.join(__dirname + "../../../public" + blog.image));
        await Blogs.deleteOne({ _id: req.params.id });
        res.status(200).send("ok");
    } else {
        res.status(404).send("not found");
    }
};
const deleteAuthorBlogs = async(req, res) => {
    const user = await User.findById(req.params.authorId)
    await Blogs.deleteMany({ author: user })
    console.log(await Blogs.find())
    if(req.params.authorId){
        res.status(200).send("ok");
    } else {
        res.status(404).send("not found");
    }
}

const editComment = async (req, res) => {
    const thisBlog = await Blogs.findOne({_id: req.body.blogId}).populate("comments");
    let thisComm = {}
    thisBlog.comments.forEach(el => {
        if(el.id == req.body.commId){
            thisComm = el;
        }
    })
    thisComm.content = req.body.content
    thisBlog.save()
    res.redirect(`/blog/${req.body.blogId}`)
};
const deleteComment = async (req, res) => {
    const thisBlog = await Blogs.findOne({_id: req.params.blog}).populate("comments");
    const commentIndex = thisBlog.comments.findIndex(comment => comment._id == req.params.id);
    if (commentIndex !== -1) {
    thisBlog.comments.splice(commentIndex, 1);
    await thisBlog.save();
    res.status(200).send('Комментарий удален');
    } else {
        res.status(404).send('Комментарий не найден');
    }
};

const addToNotes = async (req, res) => {
    const user = await User.findById(req.params.userId)
    user.toNote.push(req.params.blogId)
    user.save()
    res.send("Блог успешно добавлен в заметки!");
}
const deleteFromNotes = async (req, res) => {
    const user = await User.findById(req.params.userId)
    const blog = await Blogs.findById(req.params.blogId)
    for (let i = 0; i < user.toNote.length; i++) {
        if (user.toNote[i] == req.params.blogId) {
            user.toNote.splice(i, 1);
            user.save();
            res.send("Успешно удалено");
        }
    }
}
module.exports = {  getAllBlogs,
                    createBlog,
                    editBlog,
                    createComment,
                    deleteBlog,
                    deleteComment,
                    addToNotes,
                    deleteFromNotes,
                    deleteAuthorBlogs,
                    editComment
};