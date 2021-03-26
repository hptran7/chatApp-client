import React, { useState, useEffect } from "react";
import server from "../utils/serverLink";
import { NavLink, useHistory } from "react-router-dom";

import axios from "axios";
import CreateRoomComp from "./CreateRoomComp";

function RoomListComponent() {
  const [roomList, setRoomList] = useState([]);
  const history = useHistory();

  const handleOnChangeRoom = () => {
    setTimeout(() => {
      history.go(0);
    }, 300);
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

  /** fetch all user's chat room when load **/
  useEffect(() => {
    fetchAllroom();
  }, []);

  let listOfRoom = roomList.map((chatRoom, index) => {
    const roomLink = `/chat/${chatRoom.roomName}/${chatRoom.roomId}`;
    return (
      <div key={index}>
        <li key={chatRoom.roomId} className="ce-chat-card">
          <NavLink
            to={roomLink}
            className="chat-room-title"
            onClick={handleOnChangeRoom}
          >
            <p className="ce-chat-title-text">{chatRoom.roomName}</p>
          </NavLink>
        </li>
        {/* <CreateRoomComp fetchAllroom={fetchAllroom}></CreateRoomComp> */}
      </div>
    );
  });
  return (
    <>
      <div className="ce-input ce-text-input room-title">Room</div>
      <div className="ce-section-title ce-person-title nav-item-title">
        Rooms
      </div>
      <ul>{listOfRoom}</ul>
      <CreateRoomComp fetchAllroom={fetchAllroom}></CreateRoomComp>
    </>
  );
}

export default RoomListComponent;
