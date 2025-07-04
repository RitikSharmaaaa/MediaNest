import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@radix-ui/react-avatar';
import {
  Dialog,
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

const Post = (props) => {
 console.log(props.post.author)
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
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
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">
            {props.post.author.username}
          </span>
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
              <Button variant="ghost" className="py-4 text-base hover:bg-gray-100 rounded-b-xl">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className="w-full bg-black flex items-center justify-center">
        <img
          src={props.post.image}
          alt="Post"
          className="w-full object-contain max-h-[500px]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex gap-4">
          <Heart className="cursor-pointer" />
          <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer" />
        </div>
        <Bookmark className="cursor-pointer" />
      </div>

      {/* Likes + Caption */}
      <div className="px-4 pb-2">
        <p className="text-sm font-semibold">
          {props.post.likes.length} likes
        </p>
        <p className="text-sm">
          <span className="font-semibold">{props.post.author.username}</span> {props.post.caption}
        </p>
        <p
          className="text-xs text-gray-500 mt-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          View all 10 comments
        </p>
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
        {text && <span className="text-[#3BADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
};

export default Post;
