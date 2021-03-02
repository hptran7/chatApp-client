import axios from "axios";
import React, { useState, useEffect } from "react";
import server from "../utils/serverLink";
import { NavLink } from "react-router-dom";

function RoomList() {
  const [roomList, setRoomList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    axios.get(`${server}/user/display-chatRoom`).then((result) => {
      if (result.data.roomFetch) {
        setRoomList(result.data.roomList);
      } else {
        setErrorMessage("There is something wrong with the server connection");
      }
    });
  }, []);

  let listOfRoom = roomList.map((chatRoom) => {
    const roomLink = `/chat/${chatRoom.roomId}`;
    return (
      <li key={chatRoom.roomId}>
        <NavLink to={roomLink}>
          <p>{chatRoom.roomName}</p>
        </NavLink>
      </li>
    );
  });

  return (
    <div>
      <h4>Room List</h4>
      <ul>{listOfRoom}</ul>
    </div>
  );
}

export default RoomList;
