const express = require('express');
const router = express.Router();
const Article = require('../models/ArticlesModel');
const { adminProtected } = require('../middleware/adminProtected');

router.get('/x', async (req, res) => {
  let query = Article.find().sort({ createdAt: -1 });
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'));
  }

  try {
    const articles = await query.exec();
    res.status(200).json(articles);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.get('/', async (req, res) => {
  let query = Article.find().sort({ createdAt: -1 });
  if (req.query.search != null && req.query.search != '') {
    query = query.regex('tags', new RegExp(req.query.search, 'i'));
  }
  try {
    const articles = await query.exec();
    res.status(200).json(articles);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.get('/language', async (req, res) => {
  let query = Article.find().sort({ createdAt: -1 });
  if (req.query.search != null && req.query.search != '') {
    query = query.regex('language', new RegExp(req.query.search, 'i'));
  }
  try {
    const articles = await query.exec();
    res.status(200).json(articles);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  const articleId = req.params.id;
  try {
    const article = Article.findById(articleId);
    if (article) {
      res.status(200).json(article);
    } else {
      res.status(400).json({
        message: 'Article not found',
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.post('/new', adminProtected, async (req, res) => {
  const { title, markdown, tags, description, language } = req.body;

  if (!title || !markdown || !tags || !description) {
    res.status(400).json({
      message: 'Please fill all the fields',
    });
  }

  try {
    const article = new Article({
      title: title,
      markdown: markdown,
      tags: tags,
      description: description,
      language: language,
    });
    await article.save();
    res.status(200).json(article);
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.delete('/delete/:id', adminProtected, async (req, res) => {
  const articleId = req.params.id;

  if (!articleId) {
    res.status(400).json({
      message: 'No Id was handled',
    });
  }

  const article = await Article.findById(articleId);
  try {
    if (article) {
      await article.remove();
      res.status(200).json({
        article,
        message: `Succesfully deleted article ${articleId}`,
      });
    } else {
      res.status(400).json({
        message: `Article ${articleId} was not found`,
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.put('/edit/:id', adminProtected, async (req, res) => {
  const { title, markdown, tags, description, language } = req.body;
  const articleId = req.params.id;

  if (!title || !markdown || !tags || !articleId || !description) {
    res.status(400).json({
      message: 'Please fill all the fields',
    });
  }

  try {
    const article = await Article.findById(articleId);
    if (article) {
      article.title = title;
      article.markdown = markdown;
      article.tags = tags;
      article.description = description;
      article.language = language;
      await article.save();
      res.status(200).json(article);
    } else {
      res.status(400).json({
        message: `Article ${articleId} was not found`,
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

router.post('/passcheck', (req, res) => {
  const password = req.body.password;
  if (password === process.env.ADMIN_KEY) {
    res.json({
      canAccess: true,
      adminPass: process.env.ADMIN_KEY,
    });
  } else {
    res.json({
      canAccess: false,
    });
  }
});

module.exports = router;
