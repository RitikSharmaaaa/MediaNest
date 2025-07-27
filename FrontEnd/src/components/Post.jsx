import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@radix-ui/react-avatar';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Send,
  Bookmark,

} from 'lucide-react';
import { Button } from './ui/button';
import React, { useState } from 'react';
import CommentDiloag from './CommentDiloag';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from "../components/ui/badge"
import axios from 'axios';
import { toast } from 'sonner';
import { setPostUser, setSelectedPost } from '@/redux/postSlice';

const Post = (props) => {
  const { user } = useSelector((store) => store.auth);
  const posts = useSelector((store) => store.post);

  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [postLike, setPostLike] = useState(props.post.likes.length);
  const [liked, setLiked] = useState(props.post.likes.includes(user?._id) || false);
  const [comment, setComment] = useState(props.post.comments);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  const likedHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9000/post/likepost/${props.post._id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedPost = posts.post.map((p) => {
          if (p._id === props.post._id) {
            return { ...p, likes: response.data.updatedLikes };
          }
          return p;
        });
        dispatch(setPostUser(updatedPost));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to like or dislike');
    }
  };

  const deleteHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:9000/post/deletepost/${props.post._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedPost = posts.post.filter(
          (postItem) => postItem?._id !== props.post?._id
        );
        dispatch(setPostUser(updatedPost));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const commentHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9000/post/addcomment/${props.post._id}`,
        { text },
        {

          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {

        const updatedComment = [...comment, response.data.comment];
        setComment(updatedComment);
        const updatedPostData = posts.post.map((p) =>
          p._id === props.post._id ? { ...p, comments: updatedComment } : p
        );
        console.log(updatedPostData)
        dispatch(setPostUser(updatedPostData));

        toast.success(response.data.message);
        setText(''); // clear input
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };



  return (
    <div className="max-w-md mx-auto bg-white border rounded-md shadow-sm my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage
              src={props.post.author.profilePicture}
              alt="user"
              className="object-cover w-full h-full"
            />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">
            {props.post.author.username}
          </span>
          {user._id === props.post.author._id && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
              Author
            </Badge>
          )}

        </div>

        {/* Options Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogOverlay className="bg-black/40 backdrop-blur-sm fixed inset-0 z-40" />
          <DialogContent className="z-50 rounded-xl p-0 max-w-sm w-full fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl">
            <div className="flex flex-col divide-y">
              <Button variant="ghost" className="text-red-500 font-semibold py-4 text-base hover:bg-gray-50 rounded-t-xl">
                Report
              </Button>
              <Button variant="ghost" className="text-red-500 font-semibold py-4 text-base hover:bg-gray-100">
                Unfollow
              </Button>
              <Button variant="ghost" className="py-4 text-base hover:bg-gray-100">
                Go to post
              </Button>
              <Button variant="ghost" className="py-4 text-base hover:bg-gray-100">
                Share
              </Button>
              <Button variant="ghost" className="py-4 text-base hover:bg-gray-100">
                Copy Link
              </Button>
              {user._id === props.post.author?._id && (
                <Button
                  variant="ghost"
                  className="py-4 text-base hover:bg-gray-100 rounded-b-xl"
                  onClick={deleteHandler}
                >
                  Delete
                </Button>
              )}
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  className="py-4 text-base hover:bg-gray-100 rounded-b-xl"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="w-full bg-black flex items-center justify-center">
        <img
          src={props.post.image||null}
          alt="Post"
          className="w-full object-contain max-h-[500px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex gap-4">
          <Heart
            onClick={() => {
              setLiked(!liked);
              setPostLike(liked ? postLike - 1 : postLike + 1);
              likedHandler();
            }}
            className={`cursor-pointer hover:scale-110 transition-all duration-200 ${liked ? 'text-red-500 fill-red-500' : ''
              }`}
          />
          <MessageCircle
            onClick={() => {
              setOpen(true),
                dispatch(setSelectedPost(props.post));
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer" />
        </div>
        <Bookmark className="cursor-pointer" />
      </div>

      {/* Likes + Caption */}
      <div className="px-4 pb-2">
        <p className="text-sm font-semibold">{postLike} likes</p>
        <p className="text-sm">
          <span className="font-semibold">{props.post.author.username}</span>{' '}
          {props.post.caption}
        </p>
        {
          comment.length > 0 && <p
            className="text-xs text-gray-500 mt-1 cursor-pointer"
            onClick={() => {
              setOpen(true),
                dispatch(setSelectedPost(props.post));
            }}
          >
            View all {comment.length} comments
          </p>
        }
        {open && <CommentDiloag open={open} setOpen={setOpen} />}
      </div>

      {/* Add a comment */}
      <div className="flex border-t px-4 py-3">
        <input
          type="text"
          placeholder="Add a comment..."
          className="w-full text-sm focus:outline-none"
          value={text}
          onChange={changeEventHandler}

        />
        {text && <span onClick={commentHandler} className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
