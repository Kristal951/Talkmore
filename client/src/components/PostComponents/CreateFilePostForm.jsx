import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPost } from "../../lib/AppriteFunction";
import { Button, Input, Spinner, useToast } from "@chakra-ui/react";
import UploadFile from "../../assets/icons/file-upload.svg";

const CreateFilePostForm = ({ userId, getAllPosts }) => {
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const toast = useToast();

  const resetForm = () => {
    setPostFile(null);
    setCaption("");
    setTags("");
    setLocation("");
    setFileType(null);
    setImagePreview(null);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const createNewPost = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (!postFile) {
        throw new Error("No image or video selected");
      }

      const postData = {
        caption,
        tags,
        location,
        file: postFile,
        userId,
      };

      await createPost(postData);

      resetForm();
      toast({
        title: "Post Created",
        description: "Your post has been successfully created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Post Creation Failed",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
      getAllPosts();
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const type = file.type.split("/")[0];
        if (!["image", "video"].includes(type)) {
          toast({
            title: "Unsupported file type",
            description: "Only image and video files are supported",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }
        if (file.size > 50 * 1024 * 1024) {
          toast({
            title: "File Too Large",
            description: "Please upload a file smaller than 50MB",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          return;
        }
        setPostFile(file);
        setFileType(type);
        setImagePreview(URL.createObjectURL(file));
      }
    },
    [toast]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".mkv"],
    },
  });

  return (
    <form onSubmit={createNewPost} className="flex w-full flex-col gap-6">
      {/* File Upload */}
      <div
        {...getRootProps()}
        className={`w-full h-[350px] p-2 flex flex-col items-center ${
          isDragActive ? "border-primary bg-blue-100" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} aria-label="Upload File" />
        <div className="w-full border-primary h-full rounded-md flex items-center flex-col justify-start border-[1px]">
          {imagePreview ? (
            fileType === "image" ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-[85%] object-cover rounded-lg"
              />
            ) : (
              <video controls className="w-full h-[85%] rounded-lg">
                <source src={imagePreview} type="video/mp4" />
              </video>
            )
          ) : (
            <div className="flex flex-col w-full justify-center gap-6 p-2 items-center h-[80%]">
              <p className="font-bold text-xl text-primary p-2">Post File</p>
              <img
                src={UploadFile}
                alt="Upload"
                className="w-[100px] h-[100px]"
              />
              <p className="text-primary text-base text-center">
                Drag and drop an image or video, or click below to select one
              </p>
            </div>
          )}

          <div className="flex w-full justify-center p-2">
            <Button
              colorScheme="blue"
              width="50%"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              Select from computer
            </Button>
          </div>
        </div>
      </div>

      {/* Caption, Tags, Location */}
      <Input
        placeholder="Caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <Input
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <Input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <div className="w-full flex items-center justify-between">
        <Button
          onClick={() => {
            resetForm();
          }}
          colorScheme="gray"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isDisabled={loading || !postFile}
          colorScheme="green"
        >
          {loading ? <Spinner size="sm" /> : "Create Post"}
        </Button>
      </div>
    </form>
  );
};

export default CreateFilePostForm;
