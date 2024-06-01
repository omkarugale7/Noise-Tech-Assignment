const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://omkar:omkar123@devops.bmxp2ar.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Post = mongoose.model('Post', {
  id: String,
  title: String,
  comments: [{ id: String, content: String, status: String }],
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'Created Posts') {
    const { id, title } = data;
    const post = new Post({ id, title, comments: [] });
    await post.save();
  }

  if (type === 'Created Comment') {
    const { id, content, postId, status } = data;
    await Post.updateOne({ id: postId }, { $push: { comments: { id, content, status } } });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    await Post.updateOne(
      { id: postId, 'comments.id': id },
      { $set: { 'comments.$.content': content, 'comments.$.status': status } }
    );
  }

  res.send({});
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

app.listen(4002, () => {
  console.log('Query service listening on port 4002');
});
