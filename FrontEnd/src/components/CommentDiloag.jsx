import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { MessageCircle, X, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'

const comments = [
  { id: 2, user: 'jane', text: '🔥🔥🔥', avatar: '' },
  { id: 3, user: 'john', text: 'Awesome picture!', avatar: '' },
]

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('')

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    if(inputText.trim()){
      setText(inputText)
    }
    else{
      setText('');
    }

  }

  const sendMessageHandler = () => {
    alert(text)
    setText('')
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
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-2xl h-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl flex flex-col">

          {/* Header */}
          <div className="p-4 border-b font-semibold flex justify-between items-center">
            Comments
            <Dialog.Close asChild>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Post Image or Placeholder */}
          <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
            Post Image Here
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex justify-between items-start">
                <div className="flex gap-3 items-start">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-semibold">{comment.user}</span>{' '}
                    <span>{comment.text}</span>
                  </div>
                </div>

                {/* Dropdown Menu for actions */}
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
                        onClick={() => handleFollow(comment.user)}
                      >
                        Follow {comment.user}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => handleFavorite(comment.user)}
                      >
                        Add to Favorites
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            ))}
          </div>

          {/* Add Comment Box */}
          <div className="p-4 border-t flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/me.png" />
              <AvatarFallback>R</AvatarFallback>
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
