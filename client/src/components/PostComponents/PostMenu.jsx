import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegCopy, FaShare, FaVolumeMute } from "react-icons/fa";
import { MdBlock, MdOutlineReport } from "react-icons/md";
import { SlUserFollow } from "react-icons/sl";
import ShareToGroupModal from "./ShareToGroupModal";
import ReportPostModal from "./ReportPostModal";

const PostMenu = ({ post , userId, stopPropagation}) => {
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const toast = useToast();

  const copyToClipboard = async () => {
    try {
      const postLink = `/post/${post?.$id}/details`;
      await navigator.clipboard.writeText(postLink);
      toast({
        title: "Link copied!",
        description: "The Link has been copied to your clipboard.",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link to your clipboard.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          variant="ghost"
          size="sm"
          icon={<BsThreeDotsVertical className="text-primary text-base" />}
          onClick={stopPropagation}
        />
        <MenuList
          _dark={{ bg: "#2d2d2d", color: "#41cc69", fontWeight: "bold" }}
        >
          <MenuItem
            _dark={{ bg: "#2d2d2d", _hover: { bg: "#212121e6" } }}
            icon={<FaShare className="w-[20px] h-[20px] text-primary" />}
            onClick={(e) => {
              e.stopPropagation();
              setShareModalOpen(true);
            }}
            color="#41cc69"
            fontWeight="bold"
          >
            Share to Group
          </MenuItem>
          <MenuItem
            _dark={{ bg: "#2d2d2d", _hover: { bg: "#212121e6" } }}
            icon={<FaRegCopy className="w-[20px] h-[20px] text-primary" />}
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard();
            }}
            color="#41cc69"
            fontWeight="bold"
          >
            Copy Link
          </MenuItem>
          <MenuItem
            icon={
              <MdOutlineReport className="w-[20px] h-[20px] text-primary" />
            }
            onClick={(e) => {
              e.stopPropagation();
              setShowReportModal(true);
            }}
            color="#41cc69"
            fontWeight="bold"
          >
            Report Post
          </MenuItem>
          <MenuItem
            icon={<FaVolumeMute className="w-[20px] h-[20px] text-primary" />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            color="#41cc69"
            fontWeight="bold"
          >
            {`Mute ${post?.creator?.name} posts`}
          </MenuItem>
          <MenuItem
            icon={<SlUserFollow className="w-[20px] h-[20px] text-primary" />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            color="#41cc69"
            fontWeight="bold"
          >
            {`Follow ${post?.creator?.name}`}
          </MenuItem>
          <MenuItem
            icon={<MdBlock className="w-[20px] h-[20px] text-primary" />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            color="#41cc69"
            fontWeight="bold"
          >
            {`Block ${post?.creator?.name}`}
          </MenuItem>
        </MenuList>
      </Menu>

      {isShareModalOpen && (
        <ShareToGroupModal
          post={post}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      {showReportModal && (
        <ReportPostModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          postId={post?.$id}
          userId={userId}
        />
      )}
    </>
  );
};

export default PostMenu;
