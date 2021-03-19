import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import bxsRightArrow from "@iconify/icons-bx/bxs-right-arrow";
import bxsDownArrow from "@iconify/icons-bx/bxs-down-arrow";
import UploadAvater from "./UploadAvater";

function MainPageOptions() {
  const history = useHistory();
  const handleOnLogOut = () => {
    localStorage.removeItem("jsonwebtoken");
    localStorage.removeItem("persist:root");
    history.push("/login");
  };

  const handleOnOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const [showOptions, setShowOptions] = useState(false);
  return (
    <div className="room-members-wrapper">
      <div className="room-members">
        <div className="ce-settings-container">
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
                  <div className="option" onClick={handleOnLogOut}>
                    Upload avatar
                  </div>
                  <div className="option" onClick={handleOnLogOut}>
                    Log out
                  </div>
                </div>
              ) : null}
              <UploadAvater />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPageOptions;
