import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import bxsRightArrow from "@iconify/icons-bx/bxs-right-arrow";
import bxsDownArrow from "@iconify/icons-bx/bxs-down-arrow";
import UploadAvater from "./UploadAvater";

function Options() {
  const history = useHistory();
  const [showUploadOption, setShowUploadOption] = useState(false);
  const handleOnLogOut = () => {
    localStorage.removeItem("jsonwebtoken");
    localStorage.removeItem("persist:root");
    history.push("/");
  };

  const handleOnShowUploadAvatar = () => {
    setShowUploadOption(!showUploadOption);
  };

  const handleOnOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="members-list">
      <div className="ce-section-title-container ce-person-title-container">
        <div
          className="ce-input ce-autocomplete-input options"
          onClick={handleOnOptionsClick}
        >
          <div>Options</div>

          {!showOptions ? (
            <Icon icon={bxsRightArrow} />
          ) : (
            <Icon icon={bxsDownArrow} />
          )}
        </div>
        <div style={{ height: "12px" }}></div>
        {showOptions ? (
          <div>
            <div className="option" onClick={handleOnShowUploadAvatar}>
              Upload avatar
            </div>
            {showUploadOption ? <UploadAvater /> : null}

            <div className="option" onClick={handleOnLogOut}>
              Log out
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Options;
