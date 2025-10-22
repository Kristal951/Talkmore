import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  RadioGroup,
  Radio,
  Stack,
  Textarea,
  useToast,
  Box,
} from "@chakra-ui/react";
import TextareaAutosize from "react-textarea-autosize";
import { ReportPost } from "../../lib/AppriteFunction";
// import { reportPost } from "../../lib/AppriteFunction"; // implement this

const ReportPostModal = ({ isOpen, onClose, postId, userId }) => {
  const toast = useToast();
  const [reason, setReason] = useState("Spam");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const ResetForm = () => {
    setReason("Spam");
    setComment("");
    setLoading(false);
  };

  const handleReport = async () => {
    setLoading(true);
    try {
      const result = await ReportPost(postId, userId, reason, comment);
      ResetForm();
      onClose();

      toast({
        title: "Report Submitted",
        description: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      if (result.status) onClose();
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="#41cc69" fontWeight="bold">
          Report Post
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <RadioGroup onChange={setReason} value={reason}>
            <Stack spacing={3}>
              <Radio value="Spam" colorScheme="green">
                Spam or misleading
              </Radio>
              <Radio value="Harassment" colorScheme="green">
                Harassment or bullying
              </Radio>
              <Radio value="Hate speech" colorScheme="green">
                Hate speech
              </Radio>
              <Radio value="Violence" colorScheme="green">
                Violence or dangerous content
              </Radio>
              <Radio value="Other" colorScheme="green">
                Other
              </Radio>
            </Stack>
          </RadioGroup>
          <Box
            as={TextareaAutosize}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add Comment..."
            mt={4}
            p={3}
            border="1px solid #41cc69"
            borderRadius="md"
            w="100%"
            color="#41cc69"
            _focus={{
              outline: "none",
              boxShadow: "none",
              borderColor: "#41cc69",
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleReport}
            isLoading={loading}
            ml={3}
          >
            Report
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportPostModal;
