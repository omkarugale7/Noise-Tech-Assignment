const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://omkar:omkar123@devops.bmxp2ar.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Post = mongoose.model('Post', {
  id: String,
  title: String,
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.post('/posts', async (req, res) => {
  const { title } = req.body;
  const post = new Post({ id: randomBytes(4).toString('hex'), title });
  await post.save();

  res.status(201).send(post);
});


app.post('/delete/posts/:id', async (req, res) => {
    const postId = req.params.id;
    try {
      const deletedPost = await Post.findOneAndDelete({ id: postId });
      if (!deletedPost) {
        return res.status(404).send({ error: 'Post not found' });
      }
      res.send(deletedPost);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  });
  

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log('Post service listening on port 4000!');
});
