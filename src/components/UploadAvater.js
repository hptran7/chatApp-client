import axios from "axios";
import React, { useState } from "react";
import serverLink from "../utils/serverLink";
import { useHistory } from "react-router-dom";

function UploadAvater() {
  const history = useHistory();
  const [fileInputState, setFileInputState] = useState(false);
  const [previewSource, setPreviewSource] = useState(false);
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e) => {
    e.preventDefault();
    if (!previewSource) return;
    uploadImage(previewSource);
  };

  const uploadImage = async (file) => {
    console.log(file);
    try {
      axios
        .post(`${serverLink}/user/upload-avatar`, {
          data: file,
        })
        .then((result) => {
          if (result.data.avatarUpdated) {
            history.go(0);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmitFile}>
        <input
          type="file"
          name="image"
          onChange={handleFileInputChange}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {previewSource && <img src={previewSource} style={{ height: "300px" }} />}
    </div>
  );
}

export default UploadAvater;
