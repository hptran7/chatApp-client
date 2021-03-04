import axios from "axios";
import React, { useState, useEffect } from "react";
import serverLink from "../utils/serverLink";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { connect } from "react-redux";
import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";

let socket;

function ChatRoom(props) {
  const roomId = parseInt(useParams().roomId);
  const [typingMessage, setTypingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [oldMessage, setOldMessage] = useState([]);
  const [chatRoomMembers, setChatRoomMembers] = useState([]);
  const handleOnChange = (e) => {
    e.preventDefault();
    setTypingMessage({
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClick = () => {
    if (typingMessage) {
      axios.post(
        `${serverLink}/chat-room/send-messages/${roomId}`,
        typingMessage
      );
      socket.emit(
        "sendMessage",
        {
          userName: props.userName,
          roomId: roomId,
          message: typingMessage.message,
        },
        () => setTypingMessage(false)
      );
    }
  };

  const handleOnEnter = (e) => {
    if (e.key == "Enter") {
      handleOnClick();
    }
  };

  /* establish socket connection when user enters room */
  useEffect(() => {
    socket = io(`${serverLink}`);
    socket.emit("joinRoom", roomId);

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  /*** display old messages and all member in chatRoom from database when loaded ***/

  useEffect(() => {
    axios
      .get(`${serverLink}/chat-room/view-messages/${roomId}`)
      .then((result) => {
        setOldMessage(result.data.message);
      });
    axios.get(`${serverLink}/chat-room/view-users/${roomId}`).then((result) => {
      setChatRoomMembers(result.data.members);
    });
  }, []);

  /* useEffect for receiving new messages */
  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  return (
    <div className="main-room">
      <RoomList />
      <form>
        <input
          type="text"
          name="message"
          onChange={handleOnChange}
          onKeyPress={handleOnEnter}
        ></input>
        <input type="reset" onClick={handleOnClick} value="send"></input>
      </form>
      <RoomMembers chatRoomMembers={chatRoomMembers} roomId={roomId} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userName: state.userName,
  };
};

export default connect(mapStateToProps)(ChatRoom);
