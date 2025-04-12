import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for React Quill
import EmojiPicker from "@emoji-mart/react"; // Corrected import for emoji-mart
import CustomToolbar from "./QuillCustomToolBar";
import './index.scss'

const MyEditor = ({ handleEditorChange, newPostContent }) => {
    const [editorChange, setEditorChange] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Create a ref to hold the ReactQuill instance
  const quillRef = useRef(null);

  // Handle emoji selection and insertion into the editor
  const handleEmojiSelect = (emoji) => {
    const quill = quillRef.current.getEditor(); // Use ref to get the editor instance
    const cursorPosition = quill.getSelection().index;
    quill.insertText(cursorPosition, emoji.native);
    setShowEmojiPicker(false);
  };

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Configure the toolbar for React Quill
  const modules = {
    toolbar: {
      container: "#custom-toolbar",
      handlers: {
        "custom-emoji": handleEmojiButtonClick, 
      },
    },
  };
 
  return (
    <div className="w-full h-full flex flex-col">
      <CustomToolbar />
      <ReactQuill
        value={newPostContent}
        onChange={handleEditorChange}
        modules={modules}
        ref={quillRef} 
      />
      
      {showEmojiPicker && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
    </div>
  );
};

export default MyEditor;
