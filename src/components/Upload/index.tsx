import React, { useState, useEffect } from "react";
import style from "./index.module.scss";
import axios from "@/utils/axios";
import { onUpload as onUploadHandle } from "@/api/userInfo";
import { useTranslation } from "react-i18next";

function UploadImage(props: any) {
  const { imgSrc, onUpload } = props;
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    imgSrc && previewFile(imgSrc);
  }, []);
  useEffect(() => {
    handleSubmit();
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
    setLoading(true);
    uploadImage(selectedFile);
  };

  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await onUploadHandle(formData);

      onUpload(data.url);
      setLoading(false);
      console.log(data);
    } catch (error) {
      setLoading(false);

      console.error(error);
    }
  };

  return (
    <div className={style.root}>
      <div className="upload-wrap">
        {!previewSource && <div className="upload-plus"></div>}
        {loading && (
          <div className="upload-loading">{t("common.uploading")}</div>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileInputChange}
        />

        {(imgSrc || previewSource) && <img src={imgSrc || previewSource} />}
      </div>
    </div>
  );
}

export default UploadImage;
