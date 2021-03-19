import axios from "axios";
import React, { useState } from "react";
import server from "../utils/serverLink";
import { useHistory } from "react-router-dom";
import { Image } from "cloudinary-react";

function RoomMembers(props) {
  const history = useHistory();
  const [addUserName, setAddUserName] = useState("");

  const handleOnLeaveRoom = () => {
    history.push("/main");
  };

  const handleOnLogOut = () => {
    localStorage.removeItem("jsonwebtoken");
    localStorage.removeItem("persist:root");
    history.push("/login");
  };

  const handleOnChange = (e) => {
    setAddUserName(e.target.value);
  };
  const handleOnKeyPress = (e) => {
    if (e.key == "Enter") {
      if (!addUserName == "") {
        axios
          .post(`${server}/chat-room/add-user`, {
            userName: addUserName,
            roomId: props.roomId,
          })
          .then((result) => {
            if (result.data.addUser) {
              console.log("good");
            } else {
              alert(result.data.message);
            }
          });
      }
      setAddUserName("");
    }
  };

  const member = props.chatRoomMembers.map((member, index) => {
    return (
      <li key={index} className="ce-person-container">
        <div className="ce-person-avatar">
          <div style={{ height: "48px", width: "48px" }}>
            <Image
              cloudName="dmv9eluxo"
              publicId={member.avatar}
              className="ce-avatar"
            ></Image>
          </div>
        </div>
        <div className="ce-person-text">{member.username}</div>
      </li>
    );
  });

  return (
    <div className="room-members-wrapper">
      <div className="room-members">
        <div className="ce-settings-container">
          <div className="ce-chat-settings-container">
            <div className="ce-chat-title-forn">
              <div className="ce-input ce-text-input room-title">
                {props.roomName}
              </div>
            </div>
          </div>
          <div className="members-list">
            <div className="ce-section-title-container ce-person-title-container">
              <div className="ce-section-title ce-person-title">Members</div>
              <div style={{ height: "12px" }}></div>
              <ul style={{ listStyle: "none" }}>{member}</ul>
              <div style={{ height: "12px" }}></div>
              <div>
                <input
                  className="ce-input ce-autocomplete-input"
                  placeholder="type a username to add"
                  onChange={handleOnChange}
                  onKeyPress={handleOnKeyPress}
                  value={addUserName}
                ></input>
              </div>
              <div style={{ height: "12px" }}></div>
              <div>
                <button
                  className="ce-input ce-autocomplete-input"
                  onClick={handleOnLeaveRoom}
                >
                  Leave Room
                </button>
              </div>
              <div style={{ height: "12px" }}></div>
              <div>
                <button
                  className="ce-input ce-autocomplete-input"
                  onClick={handleOnLogOut}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomMembers;
