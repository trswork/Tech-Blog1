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
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

      router.get('/login', (req, res) => {
        if (req.session.loggedIn) {
          res.redirect('/');
          return;
        }
      
        res.render('login');
      }); 

      router.get('/post/:id', (req, res) => {
        Post.findOne({
          where: {
            id: req.params.id
          },
          attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
          include: [
            {
              model: Comment,
              attributes: ['id', 'comment_text', 'user_id'],
              as: 'comments'
            },
            {
              model: User,
              as: 'user',
              attributes: ['username']
            }
          ]
        })
          .then(dbPostData => {
            if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
            }
      
            // serialize the data
            const post = dbPostData.get({ plain: true });
      
            // pass data to template
            res.render('single-post', { post });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });
module.exports = router;