import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Contexts/UserContext';
import { Avatar, Button, Input, VStack, HStack, Box, Heading, useToast, Textarea, Spinner } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { updateProfile } from '../../lib/AppriteFunction';
import { useNavigate } from 'react-router-dom';

const EditProfileForm = () => {
    const { userDetails, setUserDetails } = useContext(UserContext);

    useEffect(() => {
        console.log("User details updated:", userDetails);
      }, [userDetails]);
    
  const [name, setName] = useState(userDetails.name);
  const [email, setEmail] = useState(userDetails.email || '');
  const [tag, setTag] = useState(userDetails.tag || '');
  const [bio, setBio] = useState(userDetails.Bio || '');
  const [imgUrl, setImgUrl] = useState(userDetails.imgUrl);
  const [file, setFile] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false)
  const toast = useToast();
  const navigate = useNavigate()

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImgUrl(URL.createObjectURL(file)); // Preview the image
      setFile(file)
    }
  };
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  const handleGoBack=()=>{
    setIsEditing(false)
    navigate(-1)
  }

  const userId = userDetails.id

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = {
        name,
        email,
        tag,
        bio,
        file,
        userId
      };

      const res = await updateProfile(updatedUser);
      console.log(res);
  
      setUserDetails({
        name: res.name,
        tag: res.tag,
        email: res.email,
        phoneNumber: res.phoneNumber,
        imgUrl: res.imgURL,
        Bio: res.Bio,
      });
  
      toast({
        title: 'Profile Updated',
        description: 'Your profile details have been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position:'top-right'
      });
  
      setIsEditing(false);
      handleGoBack();
  
    } catch (error) {
      console.error('Failed to save profile:', error);
      setLoading(false);
      setIsEditing(false);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:'top-right'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(userDetails.name);
    setEmail(userDetails.email || '');
    setTag(userDetails.tag || '');
    setBio(userDetails.Bio || '');
    setImgUrl(userDetails.imgUrl);
    setIsEditing(false);
  };

  return (
    <Box w="full" h="100vh" p={6} bg="gray.50" display="flex" overflowY="scroll" alignItems="center" justifyContent="center">
      <VStack
        bg="white"
        p={8}
        spacing={6}
        borderRadius="md"
        boxShadow="md"
        w={["100%", "80%", "50%", "40%"]}
      >
        <Heading size="lg" mb={4}>Edit Profile</Heading>
        
        <Avatar size="2xl" src={imgUrl} name={name} />

        {isEditing && (
          <Box {...getRootProps()} className="w-full h-40 border-dashed border-2 rounded-md flex items-center justify-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag & drop a new profile picture or click to select</p>
          </Box>
        )}

        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isReadOnly={!isEditing}
          variant={isEditing ? 'outline' : 'filled'}
        />

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isReadOnly={!isEditing}
          variant={isEditing ? 'outline' : 'filled'}
        />
        
        <Input
          placeholder="Tag"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          isReadOnly={!isEditing}
          variant={isEditing ? 'outline' : 'filled'}
        />
        
        <Textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          isReadOnly={!isEditing}
          variant={isEditing ? 'outline' : 'filled'}
        />

        <HStack spacing={4} mt={4}>
          {isEditing ? (
            <>
              <Button colorScheme="blue" onClick={handleSave}>
                {
                    loading ? <Spinner/> : 'Save'
                }
              </Button>
              <Button colorScheme="gray" onClick={handleCancel}>Cancel</Button>
            </>
          ) : (
            <div className='w-full gap-14 flex'>
                <Button colorScheme="blue" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button colorScheme="blue" onClick={handleGoBack}>Go Back</Button>
            </div>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default EditProfileForm;
