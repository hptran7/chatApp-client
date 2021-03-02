import axios from "axios";
import React, { useState, useEffect } from "react";
import serverLink from "../utils/serverLink";
import { useParams } from "react-router-dom";

function ChatRoom() {
  const roomId = parseInt(useParams().roomId);
  const [typingMessage, setTypingMessage] = useState({});
  const handleOnChange = (e) => {
    e.preventDefault();
    setTypingMessage({
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClick = () => {
    axios.post(
      `${serverLink}/chat-room/send-messages/${roomId}`,
      typingMessage
    );
    setTypingMessage({});
  };

  const handleOnEnter = (e) => {
    if (e.key == "Enter") {
      handleOnClick();
    }
  };
  return (
    <>
      <form>
        <input
          type="text"
          name="message"
          onChange={handleOnChange}
          onKeyPress={handleOnEnter}
        ></input>
        <input type="reset" onClick={handleOnClick} value="send"></input>
      </form>
    </>
  );
}

export default ChatRoom;
