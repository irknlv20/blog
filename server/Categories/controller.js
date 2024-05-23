const Categories = require('./Categories');

const getAllCategories = async(req, res) => {
    const data = await Categories.find();
    res.status(200).send({data});
}

module.exports = {getAllCategories};