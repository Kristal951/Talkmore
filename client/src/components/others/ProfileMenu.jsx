import {
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useContext } from "react";
import { FiCopy } from "react-icons/fi";
import { HiOutlineQrcode } from "react-icons/hi";
import { CiMenuKebab } from "react-icons/ci";
import { UserContext } from "../../Contexts/UserContext";
import ProfileQRCode from "../others/ProfileQRCode";
import { motion } from "framer-motion";
import { useColorModeValue } from "@chakra-ui/react";

const ProfileMenu = ({ userID, userName }) => {
  const toast = useToast();
  const { userDetails } = useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isClientUser = userDetails?.id === userID;
  const modalOverlayBg = useColorModeValue("rgba(0, 0, 0, 0.6)", "#2d2d2d");

  const MotionModalContent = motion(ModalContent);
  const MotionModalOverlay = motion(ModalOverlay);
  const MotionModalBody = motion(ModalBody);

  const copyToClipboard = async () => {
    try {
      const profileLink = `http://localhost:3000/profile/${userID}`; // Replace when deployed
      await navigator.clipboard.writeText(profileLink);
      toast({
        title: "Link copied!",
        description: `The link to ${
          isClientUser ? "your" : `${userName}'s`
        } profile has been copied to your clipboard.`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy the link to your clipboard.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Menu>
        <Tooltip label="Menu" placement="top" hasArrow bg="#41cc69">
          <MenuButton
            as={IconButton}
            aria-label="Profile Menu"
            icon={<CiMenuKebab className="text-primary text-2xl" />}
            variant="outline"
            colorScheme="teal"
            borderRadius="md"
            size="md"
            _hover={{ bg: "#bbf7d0" }}
            borderColor="#41cc69"
            _dark={{ backgroundColor: "#2d2d2d" }}
          />
        </Tooltip>

        <MenuList bg={modalOverlayBg}>
          <MenuItem
            icon={<FiCopy className="text-primary" />}
            onClick={copyToClipboard}
            _dark={{
              backgroundColor: "#2d2d2d",
              _hover: { backgroundColor: "#444" },
            }}
          >
            <Text fontSize="sm" color="#41cc69">
              Copy link to profile
            </Text>
          </MenuItem>
          <MenuItem
            icon={<HiOutlineQrcode className="text-primary" />}
            onClick={onOpen}
            _dark={{
              backgroundColor: "#2d2d2d",
              _hover: { backgroundColor: "#444" },
            }}
          >
            <Text fontSize="sm" color="#41cc69">
              View QR code
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <MotionModalOverlay
          initial={{ opacity: 0 }}
          display="hidden"
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
        <MotionModalContent
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.5 }}
          _dark={{ backgroundColor: "#2d2d2d" }}
        >
          <ModalHeader className="text-primary text-center">
            Profile QR Code
          </ModalHeader>
          <ModalCloseButton />
          <MotionModalBody
            display="flex"
            justifyContent="center"
            alignItems="center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProfileQRCode userName={userName} userID={userID} />
          </MotionModalBody>
          <ModalFooter
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <p className="text-primary text-center text-base font-bold">{`Scan the QR code to view ${
              isClientUser ? "your" : `${userName}'s`
            } Profile`}</p>
            <p className="text-primary text-center text-base font-bold">Hover over the QR code to download</p>
          </ModalFooter>
        </MotionModalContent>
      </Modal>
    </>
  );
};

export default ProfileMenu;
