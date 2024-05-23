const express = require('express');
const router = express.Router();
const Categories = require('../Categories/Categories');
const Blogs = require('../Blogs/Blogs');
const User = require('../auth/User')
const mongoose = require("mongoose");
const {isProfile} = require("../auth/middlewares");

router.get('/', async(req, res) => {
    const options = {};
    const category = await Categories.findOne({key: req.query.category});
    if(category){
        options.category = category._id;
        res.locals.category = req.query.category
    }
    let page = 0;
    const limit = 2;
    if(req.query.page && req.query.page > 0){
        page = req.query.page
    }
    if(req.query.search && req.query.search.length>0){
        options.$or = [
            {
                name: new RegExp(req.query.search, 'i')
            },
            {
                description: new RegExp(req.query.search, 'i')
            },
            {
                content: new RegExp(req.query.search, 'i')
            }
        ]
        res.locals.search = req.query.search
    }
    const allCategories = await Categories.find();
    const allBlogs = await Blogs.find(options)
        .limit(limit)
        .skip(page * limit)
        .populate("category")
        .populate("author");
    const BlogsCount = await Blogs.count(options)
    res.render('index', {categories: allCategories, blogs: allBlogs, user: req.user ? req.user : {}, pages: Math.ceil(BlogsCount/limit)});
})
router.get('/login', async(req, res) => {
    res.render('login', {user: req.user ? req.user : {}});
})
router.get('/registration', async(req, res) => {

    res.render('registration', {user: req.user ? req.user : {}});
})
router.get('/myblogs/:id', isProfile,async (req, res) => {
    const myBlogs = await Blogs.find({author: req.params.id}).populate("category").populate("author")
    const user = await User.findById(req.params.id);
    const allBlogs = await Blogs.find()
        .populate("category")
        .populate("author");
    const allUsers = await User.find()
    if(user.isAdmin){
        res.render('admin', {user: req.user ? req.user : {}, blogs: allBlogs, users: allUsers });
    } else {
        res.render('myblogs', {user, myBlogs});
    }
})
router.get('/mynotes/:id', async (req, res) => {
    const myBlogs = await Blogs.find({author: req.params.id}).populate("category").populate("author")
    const user = await User.findById(req.params.id)
        .populate("toNote")
        .populate({path: "toNote", populate: {path: "category"}})
        .populate({path: "toNote", populate: {path: "author"}});
    console.log(user)
    res.render('mynotes', {user, myBlogs});
})
router.get('/newblog', async(req, res) => {
    const allCategories = await Categories.find();
    res.render('newblog', {user: req.user ? req.user : {},categories: allCategories});
})
router.get('/editblog/:id', async(req, res) => {
    const thisBlog = await Blogs.findById(req.params.id)
        .populate("category")
        .populate("author")
        .populate("comments")
        .populate({path: "comments", populate: {path: "user"}})
    const allCategories = await Categories.find();
    res.render('editblog', {categories: allCategories,user: req.user ? req.user : {}, blog: thisBlog});
})
router.get('/editprofile/:id',isProfile, async(req, res) => {
    const user = await User.findById(req.params.id);
    res.render('editprofile', {user});
})
router.get('/blog/:id', async(req, res) => {
    const thisBlog = await Blogs.findById(req.params.id)
        .populate("category")
        .populate("author")
        .populate("views")
        .populate({path: "views", populate: {path: "userWatched"}})
        .populate("comments")
        .populate({path: "comments", populate: {path: "user"}})
    const allCategories = await Categories.find();
    function addView(){
        let isView = false;
        thisBlog.views.forEach(view=>{
            if(req.user && view.userWatched.id==req.user.id){
                isView = true;
            }
        })
        if (
            !isView && req.user && req.user.id != thisBlog.author.id
        ) {
            thisBlog.views.push(
                {
                    userWatched: req.user
                }
            )
            thisBlog.save()
            res.redirect(`/blog/${thisBlog._id}`)
        } else {
            return;
            res.redirect(`/blog/${thisBlog._id}?error=1`);
        }
    }
    res.render('blog', {categories: allCategories,user: req.user ? req.user : {}, blog: thisBlog, addView: addView()});
})
router.get('/profile/:id', async(req, res) => {
    const options = {};
    const category = await Categories.findOne({key: req.query.category});
    if(category){
        options.category = category._id;
        res.locals.category = req.query.category
    }
    let page = 0;
    const limit = 2;
    if(req.query.page && req.query.page > 0){
        page = req.query.page
    }
    if(req.query.search && req.query.search.length>0){
        options.$or = [
            {
                name: new RegExp(req.query.search, 'i')
            },
            {
                description: new RegExp(req.query.search, 'i')
            },
            {
                content: new RegExp(req.query.search, 'i')
            }
        ]
        res.locals.search = req.query.search
    }
    const user = await User.findById(req.params.id);
    const allCategories = await Categories.find();
    const allBlogs = await Blogs.find({author: user},options)
        .limit(limit)
        .skip(page * limit)
        .populate("category")
        .populate("author");
    const BlogsCount = await Blogs.count({author: user},options)
    res.render('profile', {user, categories: allCategories, blogs: allBlogs, pages: Math.ceil(BlogsCount/limit)});
})
module.exports = router;