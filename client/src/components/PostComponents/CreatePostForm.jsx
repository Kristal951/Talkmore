import React, {
  useState,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  Button,
  Input,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import ReactQuill from "react-quill";
import CustomToolbar from "../others/QuillCustomToolBar"; // Import your custom toolbar
import { createPost } from "../../lib/AppriteFunction";
import { UserContext } from "../../Contexts/UserContext";
import { useNavigate } from "react-router-dom";
import CreateFilePostForm from "./CreateFilePostForm";
import QuiilEditor from "../others/QuiilEditor";

const CreatePostForm = ({ getAllPosts }) => {
  const toast = useToast();
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;
  const navigate = useNavigate();
  // Reset form fields after post creation

  return (
    <Tabs variant="line" width="100%" isFitted colorScheme="green">
      <TabList>
        <Tab>Create Text Post</Tab>
        <Tab>Create Media Post</Tab>
      </TabList>

      <TabPanels paddingTop="4">
        <TabPanel>
          <QuiilEditor userId={userId} getAllPosts={getAllPosts} />
        </TabPanel>

        <TabPanel paddingTop="4">
          <CreateFilePostForm userId={userId} getAllPosts={getAllPosts} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default CreatePostForm;
