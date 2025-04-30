import React, { useContext } from "react";
import {
  Tab,
  Tabs,
  TabList,
  TabIndicator,
  TabPanels,
  TabPanel,
  useToast,
} from "@chakra-ui/react";
import { UserContext } from "../../Contexts/UserContext";
import CreateFilePostForm from "./CreateFilePostForm";
import QuiilEditor from "../others/QuiilEditor";

const CreatePostForm = ({ getAllPosts }) => {
  const toast = useToast();
  const { userDetails } = useContext(UserContext);
  const userId = userDetails?.id;

  return (
    <Tabs variant="line" width="100%" isFitted colorScheme="green">
      <TabList>
        <Tab>Create Text Post</Tab> {/* Removed "act" typo */}
        <Tab>Create Media Post</Tab>
      </TabList>

      <TabIndicator
        mt="-1.5px"
        height="2px"
        bg="#41cc69"
        borderRadius="1px"
      />

      <TabPanels paddingTop="4">
        <TabPanel>
          <QuiilEditor userId={userId} getAllPosts={getAllPosts} />
        </TabPanel>
        <TabPanel>
          <CreateFilePostForm userId={userId} getAllPosts={getAllPosts} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default CreatePostForm;
