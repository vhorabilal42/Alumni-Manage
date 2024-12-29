const express = require('express');
const newsroutes = express();

const {newsImageupload} = require('../middleware/multer')
const {createNews, getAllNews, deleteNews, updateNews} = require('../controller/createNews')

// News API.
newsroutes.post('/', newsImageupload.single("newsimage"),createNews);

// To see All News.
newsroutes.get('/', getAllNews)

// Delete the News.
newsroutes.delete('/:id', deleteNews)

// Update News 
// newsroutes.patch('/:id', newsImageupload.single('newsimage'), updateNews)
newsroutes.patch('/:id', newsImageupload.single('newsimage'), updateNews)


module.exports = newsroutes
