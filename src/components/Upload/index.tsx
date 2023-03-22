import React, { useState, useEffect } from "react";
import style from "./index.module.scss";
import axios from "@/utils/axios";
import { onUpload as onUploadHandle } from "@/api/userInfo";
function UploadImage(props: any) {
  const { imgSrc, onUpload } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState<any>();
  useEffect(() => {
    imgSrc && setPreviewSource(imgSrc);
  }, []);
  useEffect(() => {
    handleSubmit()
  }, [selectedFile]);
  const handleFileInputChange = async (event: any) => {
    const file = event.target.files[0];
    previewFile(file);
    setSelectedFile(file);
    
  };

  const previewFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = () => {
    console.log("selectedFile=>", selectedFile);
    if (!selectedFile) return;
    uploadImage(selectedFile);
  };

  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await onUploadHandle(formData);

      onUpload(data.url);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.root}>
      <div className="upload-wrap">
        <div className="upload-plus"></div>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileInputChange}
        />

        {previewSource && <img src={previewSource} />}
      </div>
    </div>
  );
}

export default UploadImage;
