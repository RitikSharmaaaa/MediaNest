import React, { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MessageCircle, X, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPostUser } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('')
  const [comment, setComment] = useState([])
  const { selectedPost } = useSelector(store => store.post)
  const { user } = useSelector(store => store.auth)
  const posts = useSelector(store => store.post)
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedPost?.comments) {
      setComment(selectedPost.comments)
    }
  }, [selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    setText(inputText.trim() ? inputText : '')
  }

  const sendMessageHandler = async () => {
    try {
      const response = await axios.post(
        `http://localhost:9000/post/addcomment/${selectedPost._id}`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      )

      if (response.data.success) {
        const newComment = {
          ...response.data.comment,
          author: {
            username: user.username,
            profilePicture: user.profilePicture,
          },
        };

        const updatedComment = [...comment, newComment];
        setComment(updatedComment);

        const updatedPostData = posts.post.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedComment } : p
        );

        dispatch(setPostUser(updatedPostData));
        toast.success(response.data.message);
        setText('');
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment")
    }
  }

  const handleFollow = (username) => {
    alert(`You followed ${username}`)
  }

  const handleFavorite = (username) => {
    alert(`Added ${username}'s comment to favorites`)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-2xl h-[85vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl flex flex-col">

          {/* Header */}
          <div className="p-4 border-b font-semibold flex justify-between items-center">
            Comments
            <Dialog.Close asChild>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Post Image */}
          <div className="w-full h-64 bg-black flex items-center justify-center overflow-hidden">
            <img
              src={selectedPost?.image}
              alt="post"
              className="object-contain max-h-full max-w-full"
            />
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comment.map((comment) => (
              <div key={comment._id} className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author?.profilePicture} />
                    <AvatarFallback>
                      {comment.author?.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-semibold">{comment.author?.username}</span>{' '}
                    <span>{comment.text}</span>
                  </div>
                </div>

                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button>
                      <MoreHorizontal className="w-4 h-4 text-gray-500 hover:text-black" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      sideOffset={5}
                      className="bg-white border rounded-md shadow-md w-40 text-sm p-1 z-50"
                    >
                      <DropdownMenu.Item
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleFollow(comment.author?.username)}
                      >
                        Follow {comment.author?.username}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleFavorite(comment.author?.username)}
                      >
                        Add to Favorites
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <div className="p-4 border-t flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
              value={text}
              onChange={changeEventHandler}
            />
            <Button disabled={!text.trim()} onClick={sendMessageHandler} size="sm">
              Post
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default CommentDialog
