import { Icon, InlineIcon } from "@iconify/react";
import plusIcon from "@iconify/icons-akar-icons/plus";
import React, { useState, useEffect } from "react";
import server from "../utils/serverLink";
import axios from "axios";

export default function CreateRoomComp(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const [newChatRoomName, setNewChatRoomName] = useState("");

  /*** function to handle on change in new chat text box ***/
  const handleOnNewChatChange = (e) => {
    setNewChatRoomName({
      [e.target.name]: e.target.value,
    });
  };
  /*** function to handle on create new room btn  ***/
  const handleOnCreateNewRoom = () => {
    axios
      .post(`${server}/chat-room/create-room`, newChatRoomName)
      .then((result) => {
        if (result.data.roomCreated) {
          setTimeout(() => {
            props.fetchAllroom();
          }, 1000);
        }
      });
  };
  return (
    <div className="ce-chat-form-container">
      <div className="chat-box-wrapper">
        <div className="new-chat-box">
          <input
            className="ce-input ce-text-input"
            placeholder="New Chat"
            type="text"
            onChange={handleOnNewChatChange}
            name="roomName"
          ></input>
        </div>
        <div className="button-wrapper">
          <button
            className="ce-primary-button ce-create-room-btn"
            onClick={handleOnCreateNewRoom}
          >
            <Icon icon={plusIcon} width="1.3em" />
          </button>
        </div>
      </div>
    </div>
  );
}
