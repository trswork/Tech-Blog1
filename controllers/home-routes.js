const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
      attributes: [
        'id',
        'title',
        'body',
        'user_id'
      ],
      include: [
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'comment_text', 'user_id']
          },
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        console.log(dbPostData[0]);
        res.render('homepage', dbPostData[0].get({ plain: true }));
      })
      const posts = dbPostData.map((post) => post.get({ plain: true })); // serialize all the posts
      console.log(posts);
      res.render("home", { posts, loggedIn: req.session.loggedIn });
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });

      router.get('/login', (req, res) => {
        if (req.session.loggedIn) {
          res.redirect('/');
          return;
        }
      
        res.render('login');
      }); 

router.get('/', (req, res) => {
    console.log(req.session);
      
        // other logic...
      });
module.exports = router;