import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { IoMdDownload } from "react-icons/io";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";

const ProfileQRCode = ({ userName, userID }) => {
  const profileUrl = `http://localhost:3000/profile/${userID}`;

  const handleDownload = () => {
    const svg = document.getElementById("animated-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${userName}'s_QR.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = url;
  };

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
      className="relative group w-max h-max"
    >
      <QRCodeSVG
        id="animated-qr"
        value={profileUrl}
        size={150}
        bgColor="#ffffff"
        fgColor="#000000"
        style={{ borderRadius: "8px" }}
        marginSize="2"
      />
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 rounded-lg">
        <Tooltip label="Download QR" placement="top" hasArrow bg="#41cc69">
          <IconButton
            icon={<IoMdDownload size={20} />}
            aria-label="Download QR"
            size="sm"
            onClick={handleDownload}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300"
            variant="solid"
            colorScheme="green"
          />
        </Tooltip>
      </div>
    </MotionDiv>
  );
};

export default ProfileQRCode;
