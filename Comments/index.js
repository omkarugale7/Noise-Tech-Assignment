const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect('mongodb+srv://omkar:omkar123@devops.bmxp2ar.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Comment = mongoose.model('Comment', {
  postId: String,
  id: String,
  content: String,
  status: String,
});

app.get('/posts/:id/comments', async (req, res) => {
  const comments = await Comment.find({ postId: req.params.id });
  res.send(comments);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { content } = req.body;
  const comment = new Comment({
    id: randomBytes(4).toString('hex'),
    content,
    postId: req.params.id,
    status: 'pending',
  });
  await comment.save();

  await axios.post('http://localhost:4003/events', {
    type: 'Created Comment',
    data: {
      id: comment.id,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  res.status(201).send(comment);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    await Comment.updateOne({ postId, id }, { status, content });

    await axios.post('http://localhost:4003/events', {
      type: 'CommentUpdated',
      data: { id, postId, status, content },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Comment server listening on port 4001!');
});
