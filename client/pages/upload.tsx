import React from "react";
import Navbar from "../components/Navbar";
import Uploader from "../components/Uploader";

const UploadPage = () => {
  const handleUpload = () => {
    console.log("uploading");
  };

  return (
    <div>
      <Navbar />
      <Uploader />
    </div>
  );
};

export default UploadPage;
