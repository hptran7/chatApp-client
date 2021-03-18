import axios from "axios";
import React, { useState, useEffect } from "react";
import server from "../utils/serverLink";
import { NavLink } from "react-router-dom";
import { Icon, InlineIcon } from "@iconify/react";
import plusIcon from "@iconify/icons-akar-icons/plus";

function RoomList() {
  const [roomList, setRoomList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [newChatRoomName, setNewChatRoomName] = useState("");

  /*** function to handle on change in new chat text box ***/
  const handleOnNewChatChange = (e) => {
    setNewChatRoomName({
      [e.target.name]: e.target.value,
    });
  };

  /*** function to fetch all rooms that user is in  ***/
  const fetchAllroom = () => {
    axios.get(`${server}/user/display-chatRoom`).then((result) => {
      if (result.data.roomFetch) {
        setRoomList(result.data.roomList);
      } else {
        setErrorMessage("There is something wrong with the server connection");
      }
    });
  };

  /*** function to handle on create new room btn  ***/
  const handleOnCreateNewRoom = () => {
    axios
      .post(`${server}/chat-room/create-room`, newChatRoomName)
      .then((result) => {
        if (result.data.roomCreated) {
          fetchAllroom();
        }
      });
  };
  /** fetch all user's chat room when load **/
  useEffect(() => {
    fetchAllroom();
  }, []);

  let listOfRoom = roomList.map((chatRoom) => {
    const roomLink = `/chat/${chatRoom.roomName}/${chatRoom.roomId}`;
    return (
      <li key={chatRoom.roomId} className="ce-chat-card">
        <NavLink to={roomLink} className="chat-room-title">
          <p className="ce-chat-title-text">{chatRoom.roomName}</p>
        </NavLink>
      </li>
    );
  });

  return (
    <div className="room-list">
      <div className="ce-chat-list">
        <div className="ce-chats-container">
          <ul>{listOfRoom}</ul>
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
        </div>
      </div>
    </div>
  );
}

export default RoomList;
