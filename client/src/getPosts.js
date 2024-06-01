import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Comments from './Comments';
import CommentsList from './GetComment';

const GetPosts = () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    try {
      const result = await axios.get('http://localhost:4002/posts');
      setPosts(result.data);
    } catch (error) {
      console.log('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  });

  const handleDeletePost = async (postId) => {
    try {
      console.log(postId)
      await axios.post(http://localhost:4000/delete/posts/${postId});
      fetchPosts();
    } catch (error) {
      console.log('Error deleting post:', error);
    }
  };

  const renderPosts = Object.values(posts).map((post) => (
    <div className="card" style={{ width: '30%', marginBottom: '20px', minHeight:'350px', position:'relative' }} key={post.id}>
      <div className="card-body">
        <h3>{post.title}</h3>
        <p>{post.id}</p>
        <CommentsList comments={post.comments} />
        <Comments postId={post.id} />
        <button style={{position:'absolute', bottom:'20px', marginLeft:'30%'}} onClick={() => handleDeletePost(post.id)} className="btn btn-primary">Delete</button>
      </div>
    </div>
  ));

  return <div className="d-flex flex-row flex-wrap justify-content-between">{renderPosts}</div>;
};

export default GetPosts;