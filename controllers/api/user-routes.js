const router = require('express').Router();
const { User, Post, Comment } = require("../../models");

router.get("/", (req, res) => {
    User.findAll({
      attributes: ["id", "username", "email", "password"], //TODO remove password in the futrue
      include: [
        {
          model: Post,
          as: "posts",
          attributes: ["id", "title", "body"],
        },
        {
          model: Comment,
          as: "comments",
          attributes: ["id", "comment_text", "post_id"],
        },
      ],
    }) //include the posts and comments of this user
      .then((dbUserData) => {
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
      }
  
      const validPassword = dbUserData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
  
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });
  });

  module.exports = router;