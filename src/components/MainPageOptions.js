import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import bxsRightArrow from "@iconify/icons-bx/bxs-right-arrow";
import bxsDownArrow from "@iconify/icons-bx/bxs-down-arrow";
import UploadAvater from "./UploadAvater";
import Options from "./Options";

function MainPageOptions() {
  const history = useHistory();
  const [showUploadOption, setShowUploadOption] = useState(false);
  const handleOnLogOut = () => {
    localStorage.removeItem("jsonwebtoken");
    localStorage.removeItem("persist:root");
    history.push("/login");
  };

  const handleOnShowUploadAvatar = () => {
    setShowUploadOption(!showUploadOption);
  };

  const handleOnOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="room-members-wrapper">
      <div className="room-members">
        <div className="ce-settings-container">
          <Options />
        </div>
      </div>
    </div>
  );
}

export default MainPageOptions;
