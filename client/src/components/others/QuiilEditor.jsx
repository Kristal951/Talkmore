import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles for React Quill
import EmojiPicker from "@emoji-mart/react"; // Corrected import for emoji-mart
import CustomToolbar from "./QuillCustomToolBar";
import "./index.scss";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { createPost } from "../../lib/AppriteFunction";

const QuiilEditor = ({ getAllPosts, userId }) => {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [creatingTextPost, setCreatingTextPost] = useState(false);
  const quillRef = useRef(null); // React Quill Ref
  const toast = useToast();

  const createTextPost = async (e) => {
    e.preventDefault();
    if (!value) {
      return toast({
        title: "Empty Post",
        description: "Please write something before posting.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    }
    try {
      setCreatingTextPost(true);
      const payload = {
        creator: userId,
        TextContent: value,
        mimeType: "text/plain",
      };
      await createPost(payload);
      return toast({
        title: "Post created",
        description: "Text Post Created.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
      setCreatingTextPost(false);
      return toast({
        title: "Post Creation Failed",
        description: "Text Post Creation Failed.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setCreatingTextPost(false);
      setValue("");
      setShowEmojiPicker(false);
      getAllPosts();
    }
  };

  // Emoji picker button click handler
  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Handle emoji selection and insert into the editor
  const handleEmojiSelect = (emoji) => {
    const quill = quillRef.current.getEditor();
    const cursorPosition = quill.getSelection().index;
    quill.insertText(cursorPosition, emoji.native);
    setShowEmojiPicker(false);
  };

  const modules = {
    toolbar: {
      container: "#custom-toolbar",
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "code-block",
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <CustomToolbar
        quillRef={quillRef}
        onEmojiClick={handleEmojiButtonClick}
      />
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={setValue}
        placeholder="Write your post..."
        modules={modules}
        theme=""
        formats={formats}
      />
      <div className="flex flex-col w-full items-end justify-end mt-2">
        <Button
          onClick={createTextPost}
          isDisabled={creatingTextPost}
          colorScheme="green"
        >
          {creatingTextPost ? <Spinner size="sm" /> : "Create Post"}
        </Button>
      </div>

      {showEmojiPicker && (
        <div className="mt-2">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default QuiilEditor;
