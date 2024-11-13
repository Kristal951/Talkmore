import React, { useCallback, useState, useRef, useContext, useEffect } from 'react';
import { Button, Input, Textarea, useToast, Spinner } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import UploadFile from '../../assets/icons/file-upload.svg'; 
import { createPost } from '../../lib/AppriteFunction';
import { UserContext } from '../../Contexts/UserContext';

const CreatePostForm = () => {
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(null); 
  const toast = useToast();
  const { userDetails } = useContext(UserContext);
  const userId = userDetails.id;

  const resetForm = () => {
    setPostFile(null);
    setCaption('');
    setTags('');
    setLocation('');
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
        throw new Error('No image or video selected');
      }

      const postData = {
        caption, 
        tags, 
        location,
        file: postFile,
        userId,
      };

      const newPost = await createPost(postData);

      resetForm();
      toast({
        title: 'Post Created',
        description: 'Your post has been successfully created',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Post Creation Failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      const type = file.type.split('/')[0];
      if (!['image', 'video'].includes(type)) {
        toast({
          title: 'Unsupported file type',
          description: 'Only image and video files are supported',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }
      setPostFile(file);
      setFileType(type); 
      setImagePreview(URL.createObjectURL(file));
    }
  }, [toast]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.svg', '.jpeg', '.jpg'],
      'video/*': ['.mp4', '.mpeg', '.mkv'],
    },
  });

  return (
    <div className='w-full h-full bg-black bg-opacity-40 flex items-center justify-center'>
      <div className="bg-white w-[50%] h-[98%] rounded-md shadow-lg p-4">
        <form onSubmit={createNewPost} className='w-full h-full flex flex-col gap-6 relative'>
          <Textarea placeholder='Caption' size="md" rows={3} value={caption} onChange={(e) => setCaption(e.target.value)} />

          <div {...getRootProps()} className='w-full h-[350px] flex flex-col items-center'>
            <input {...getInputProps()} aria-label="Upload File" />
            <div className='w-full h-full rounded-md flex items-center flex-col justify-start border-[1px]'>
              {imagePreview ? (
                fileType === 'image' ? (
                  <div className="w-full h-[85%] flex flex-col justify-center items-center rounded-lg">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <video controls className="w-full h-[85%]">
                    <source src={imagePreview} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              ) : (
                <div className="flex flex-col w-full justify-center gap-6 items-center h-[80%]">
                  <p className='font-bold text-xl p-2'>Post File</p>
                  <img src={UploadFile} alt="Upload" className='w-[100px] h-[100px]' />
                  <p>Drag and drop an image or video, or click below to select one</p>
                </div>
              )}
              <div className="flex w-full h-max justify-center items-center p-2">
                <Button colorScheme='blue' width="50%" variant='solid'>
                  Select from computer
                </Button>
              </div>
            </div>
          </div>

          <div className="gap-3 flex flex-col w-full h-max">
            <Input variant="filled" placeholder='Tags' value={tags} onChange={(e) => setTags(e.target.value)} />
            <Input variant="filled" placeholder='Location' value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="w-full flex items-center justify-center h-max">
            <Button
              colorScheme='blue'
              width="50%"
              variant='solid'
              type="submit"
              disabled={loading}
              aria-label="Create Post"
            >
              {loading ? <Spinner /> : 'Create Post'}
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
