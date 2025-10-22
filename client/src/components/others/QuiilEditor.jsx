import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill styles
import EmojiPicker from "@emoji-mart/react"; // Emoji picker
import CustomToolbar from "./QuillCustomToolBar";
import "./index.scss";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { createPost, queryUsersTag } from "../../lib/AppriteFunction";

// Quill and module imports
import Quill from "quill";
import {Mention} from "quill-mention";
import "quill-mention/dist/quill.mention.css";

// Register the mention module
Quill.register("modules/mention", Mention);

const QuiilEditor = ({ getAllPosts, userId }) => {
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [creatingTextPost, setCreatingTextPost] = useState(false);
  const quillRef = useRef(null);
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

      toast({
        title: "Post Created",
        description: "Text post successfully created.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setValue("");
      setShowEmojiPicker(false);
      getAllPosts();
    } catch (error) {
      console.error(error);
      toast({
        title: "Post Creation Failed",
        description: "Something went wrong while creating the post.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setCreatingTextPost(false);
    }
  };

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji) => {
    const quill = quillRef.current.getEditor();
    const cursorPosition = quill.getSelection()?.index || 0;
    quill.insertText(cursorPosition, emoji.native);
    setShowEmojiPicker(false);
  };

  const modules = {
    toolbar: {
      container: "#custom-toolbar",
    },
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["@"],
      source: async function (searchTerm, renderList) {
        try {
          if (!searchTerm) {
            return renderList([], searchTerm); // Ensure renderList is always called
          }
    
          const res = await queryUsersTag(searchTerm);
          const users = res.data?.users?.documents || [];
    
          const suggestions = users.map((user) => ({
            id: user.$id,
            value: user.tag,
          }));
    
          renderList(suggestions, searchTerm);
        } catch (err) {
          console.error("Mention fetch error", err);
          renderList([], searchTerm); // Fallback on error
        }
      }, 
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
    "mention",
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
        formats={formats}
        theme="snow"
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
