import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

const Posts = () => {
  const post = useSelector((store) => store.post?.post || []);

  return (
    <div>
      {post.map((posts) => (
        <Post key={posts._id} post={posts} />
      ))}
    </div>
  );
};

export default Posts;
