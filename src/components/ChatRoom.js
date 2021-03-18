import axios from "axios";
import React, { useState, useEffect } from "react";
import serverLink from "../utils/serverLink";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { connect } from "react-redux";
import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";
import { Icon } from "@iconify/react";
import sendOutlined from "@iconify/icons-ant-design/send-outlined";

let socket;

function ChatRoom(props) {
  const roomId = parseInt(useParams().roomId);
  const roomName = useParams().roomName;
  const [typingMessage, setTypingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [oldMessage, setOldMessage] = useState([]);
  const [showTypingMessage, setShowTypingMEssage] = useState("");
  const [chatRoomMembers, setChatRoomMembers] = useState([]);
  const handleOnChange = (e) => {
    e.preventDefault();
    setTypingMessage({
      [e.target.name]: e.target.value,
    });
    setShowTypingMEssage(e.target.value);
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
      setShowTypingMEssage("");
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
      socket.emit("leaveRoom", roomId);
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
    setMessages([]);
  }, [roomId]);

  const oldMessagesLi = oldMessage.map((message, index) => {
    return (
      <li key={index} className="message-block">
        {message.userName == props.userName ? (
          <div className="message-wrapper my-message ">
            <div className="sender">
              <p className="sender-name">{message.userName}</p>
            </div>
            <div className="message">{message.message}</div>
          </div>
        ) : (
          <div className="message-wrapper users-message ">
            <div className="sender">
              <p className="sender-name">{message.userName}</p>
            </div>
            <div className="message">{message.message}</div>
          </div>
        )}
      </li>
    );
  });

  /** display new messages from socket.io **/

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const newMessagesLi = messages.map((message, index) => {
    return (
      <li key={index} className="message-block">
        {message.user == props.userName ? (
          <div className="message-wrapper my-message ">
            <div className="sender">
              <p className="sender-name">{message.user}</p>
            </div>
            <div className="message">{message.text}</div>
          </div>
        ) : (
          <div className="message-wrapper users-message ">
            <div className="sender">
              <p className="sender-name">{message.user}</p>
            </div>
            <div className="message">{message.text}</div>
          </div>
        )}
      </li>
    );
  });

  return (
    <div className="main-room">
      <RoomList />
      <div className="chat-message-wrapper">
        <div className="chat-feed">
          <div className="chat-title-container">
            <div className="chat-title">{roomName}</div>
            <ul>{oldMessagesLi}</ul>
            <ul>{newMessagesLi}</ul>
            <div className="message-form-container">
              <div className="message-form">
                <input
                  className="message-input"
                  type="text"
                  name="message"
                  onChange={handleOnChange}
                  onKeyPress={handleOnEnter}
                  placeholder="send a message..."
                  value={showTypingMessage}
                ></input>
                <button
                  type="submit"
                  onClick={handleOnClick}
                  className="send-button"
                >
                  <Icon icon={sendOutlined} width="1.3em" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoomMembers
        chatRoomMembers={chatRoomMembers}
        roomId={roomId}
        roomName={roomName}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userName: state.userName,
  };
};

export default connect(mapStateToProps)(ChatRoom);
