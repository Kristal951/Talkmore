import React, { useCallback, useState, useRef, useContext } from 'react';
import { Button, Input, Textarea, useToast } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import UploadFile from '../assets/icons/file-upload.svg'; // Ensure this is an actual SVG file path.
import { createPost } from '../lib/AppriteFunction';
import { UserContext } from '../Contexts/UserContext';

const CreatePostForm = () => {
  const [postFile, setPostFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [fileType, setFileType] = useState(null); // To handle both image and video files
  const toast = useToast()
  const { userDetails } = useContext(UserContext);
  const userId = userDetails.id

  const resetForm = () => {
    setPostFile(null);
    setCaption('');
    setTags('');
    setLocation('');
    setImagePreview(null); // Reset the preview as well
  };

  const createNewPost = async(e)=>{
    e.preventDefault()
    try {
      if (!postFile) {
        throw new Error('No image or video selected');
      }

      const postData = {
        caption: caption, 
        tags: tags, 
        location: location,
        file: postFile,
        userId: userId
      };
  
      const newPost = await createPost(postData);
  
      console.log('Post created successfully:', newPost);
  
      resetForm();

      return  toast({
                title: 'Post Created',
                description: 'Your Post has been succesfully created',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
              });
  
    } catch (error) {
      console.error('Error creating post:', error);
      return  toast({
                title: 'Post Creation Failed',
                description: 'Something went wrong',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
              });
  }
}

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setPostFile(file);
      setFileType(file.type.split('/')[0]); // Get file type: image or video
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

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
          <Textarea placeholder='Caption' size="md" rows={3} value={caption} onChange={(e)=> setCaption(e.target.value)}/>

          <div {...getRootProps()} className='w-full h-[350px] flex flex-col items-center'>
            <input {...getInputProps()} />
            <div className='w-full h-full rounded-md flex items-center flex-col justify-center border-[1px]'>
              { !imagePreview && <p className='font-bold text-xl mb-4 p-4'>Post File</p>}

              <div className="w-full h-[80%] flex flex-col justify-center items-center rounded-lg mb-2">
                {imagePreview ? (
                  fileType === 'image' ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <video controls className="w-full h-full">
                      <source src={imagePreview} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )
                ) : (
                  <img src={UploadFile} alt="Upload" className='w-[100px] h-[100px]' />
                )}
                {!imagePreview && <p>Drag and drop an image or video, or click below to select one</p>}
              </div>

              <Button colorScheme='blue' width="50%" variant='solid'>
                Select from computer
              </Button>
            </div>
          </div>

          <div className="absolute bottom-2 gap-3 flex flex-col w-full h-max">
            <Input variant="filled" placeholder='Tags' value={tags} onChange={(e)=> setTags(e.target.value)}/>
            <Input variant="filled" placeholder='Location'value={location} onChange={(e)=> setLocation(e.target.value)} />
          </div>

          <div className="flex w-full h-max">
            <input type='submit'/>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
