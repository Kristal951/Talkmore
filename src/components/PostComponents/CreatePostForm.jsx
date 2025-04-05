import React, { useCallback, useState, useContext, useEffect } from "react";
import { Button, Input, Textarea, useToast, Spinner } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import UploadFile from "../../assets/icons/file-upload.svg";
import { createPost } from "../../lib/AppriteFunction";
import { UserContext } from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";

const CreatePostForm = () => {
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(null);
  const toast = useToast();
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;
  const navigate = useNavigate()

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
    setLoading(true);
    try {
      if (!postFile) {
        throw new Error("No image or video selected");
      }
      if (!caption.trim()) {
        throw new Error("Caption is required");
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
            description: "Please upload a file smaller than 10MB",
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".svg", ".jpeg", ".jpg"],
      "video/*": [".mp4", ".mpeg", ".mkv"],
    },
  });

  return (
    <div className="w-full h-full dark:bg-darkBackground2 ">
      <div className="bg-white w-full h-screen p-2 dark:bg-darkBackground">
        <form
          onSubmit={createNewPost}
          className="w-[60%] h-full flex flex-col gap-6 relative overflow-y-scroll"
        >
          <Textarea
            placeholder="Caption"
            size="lg"
            rows={6}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div
            {...getRootProps()}
            className={`w-full h-[350px] flex flex-col items-center ${
              isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} aria-label="Upload File" />
            <div className="w-[50%] h-full rounded-md flex items-center flex-col justify-start border-[1px]">
              {imagePreview ? (
                fileType === "image" ? (
                  <div className="w-full h-[85%] flex flex-col justify-center items-center rounded-lg">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <video controls className="w-full h-[85%]">
                    <source src={imagePreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="flex flex-col w-full justify-center gap-6 items-center h-[80%]">
                  <p className="font-bold text-xl p-2">Post File</p>
                  <img
                    src={UploadFile}
                    alt="Upload"
                    className="w-[100px] h-[100px]"
                  />
                  <p>
                    Drag and drop an image or video, or click below to select
                    one
                  </p>
                </div>
              )}
              <div className="flex w-full h-max justify-center items-center p-2">
                <Button colorScheme="blue" width="50%" variant="solid">
                  Select from computer
                </Button>
              </div>
            </div>
          </div>

          <div className="gap-3 flex flex-col w-[80%] h-max">
            <Input
              variant="filled"
              placeholder="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Input
              variant="filled"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="w-full flex items-center justify-between h-max">
          <Button
              colorScheme="blue"
              width="40%"
              variant="solid"
              onClick={()=>{
                resetForm()
                navigate(-1)
              }}
              aria-label="Cancel"
            >
              Cancel
            </Button>
            
            <Button
              colorScheme="blue"
              width="40%"
              variant="solid"
              type="submit"
              disabled={loading || !postFile}
              aria-label="Create Post"
            >
              {loading ? <Spinner /> : "Create Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
