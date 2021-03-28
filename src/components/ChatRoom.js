import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import serverLink from "../utils/serverLink";
import { useParams, useHistory } from "react-router-dom";
import io from "socket.io-client";
import { connect } from "react-redux";
import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";
import { Icon } from "@iconify/react";
import sendOutlined from "@iconify/icons-ant-design/send-outlined";
import { Image } from "cloudinary-react";
import * as AiIcons from "react-icons/ai";
import * as FiIcons from "react-icons/fi";

let socket;

function ChatRoom(props) {
  const roomId = parseInt(useParams().roomId);
  const roomName = useParams().roomName;
  const [typingMessage, setTypingMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [oldMessage, setOldMessage] = useState([]);
  const [showTypingMessage, setShowTypingMEssage] = useState("");
  const [showVideoAlert, setShowVideoAlert] = useState(false);
  const [videoCallRoomId, setVideoCallRoomId] = useState("");
  const history = useHistory();
  const myRef = useRef(null);
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

  /** AutoScroll Function **/
  const executeScroll = () => {
    myRef.current.scrollIntoView();
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

  useEffect(async () => {
    await axios
      .get(`${serverLink}/chat-room/view-messages/${roomId}`)
      .then((result) => {
        setOldMessage(result.data.message);
      });

    props.OnLoadRoom(roomId);
    setMessages([]);
    setTimeout(executeScroll, 500);
  }, [roomId]);

  const oldMessagesLi = oldMessage.map((message, index) => {
    const sender = props.roomMembers.filter((member) => {
      return member.username == message.userName;
    });
    return (
      <li key={index} className="message-block">
        {message.userName == props.userName ? (
          <div>
            <Image
              className="message-avatar my-message-avatar"
              cloudName="dmv9eluxo"
              publicId={sender[0] ? sender[0].avatar : null}
            ></Image>
            <div className="message-wrapper my-message ">
              <div className="sender">
                <p className="sender-name">{message.userName}</p>
              </div>
              <div className="message">{message.message}</div>
            </div>
          </div>
        ) : (
          <div>
            <Image
              className="message-avatar users-message-avatar"
              cloudName="dmv9eluxo"
              publicId={sender[0] ? sender[0].avatar : null}
            ></Image>
            <div className="message-wrapper users-message ">
              <div className="sender">
                <p className="sender-name">{message.userName}</p>
              </div>
              <div className="message">{message.message}</div>
            </div>
          </div>
        )}
      </li>
    );
  });

  /** display new messages from socket.io **/

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
      executeScroll();
    });
  }, []);
  /** handle On new Member Log In **/
  useEffect(() => {
    socket.on("announce", (message) => {});
  }, []);

  /** handle On video call incoming **/
  useEffect(() => {
    socket.on("video invite", (roomId) => {
      console.log(roomId);
      setShowVideoAlert(true);
      setVideoCallRoomId(roomId.roomId);
    });
  }, []);

  /***  Functions Handle Call Options***/
  const hanndleDeclineCall = () => {
    setShowVideoAlert(false);
  };

  const handleOnAcceptCall = () => {
    // history.push(`/video/#${videoCallRoomId}`);
    const win = window.open(`#/video/${videoCallRoomId}`, "_blank");
    win.focus();
    setShowVideoAlert(false);
  };

  const handleOnVideoCall = () => {
    socket.emit("call video", { roomId: roomId, userName: props.userName });
  };

  const newMessagesLi = messages.map((message, index) => {
    const sender = props.roomMembers.filter((member) => {
      return member.username == message.user;
    });
    return (
      <li key={index} className="message-block">
        {message.user == props.userName ? (
          <div className="">
            <Image
              className="message-avatar my-message-avatar"
              cloudName="dmv9eluxo"
              publicId={sender[0].avatar}
            ></Image>
            <div className="message-wrapper my-message ">
              <div className="sender">
                <p className="sender-name">{message.user}</p>
              </div>
              <div className="message">{message.text}</div>
            </div>
          </div>
        ) : (
          <div>
            <Image
              className="message-avatar users-message-avatar"
              cloudName="dmv9eluxo"
              publicId={sender[0].avatar}
            ></Image>
            <div className="message-wrapper users-message ">
              <div className="sender">
                <p className="sender-name">{message.user}</p>
              </div>
              <div className="message">{message.text}</div>
            </div>
          </div>
        )}
      </li>
    );
  });

  return (
    <div className="main-room">
      {showVideoAlert ? (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Incoming Call</h2>
            </div>
            <div className="modal-body">
              <div className="calling-icon">
                <FiIcons.FiPhoneCall size={30} />
                <div className="calling-dots"></div>
                <div className="calling-dots"></div>
                <div className="calling-dots"></div>
              </div>

              <div>
                <button
                  className="call-btn"
                  style={{ background: "green" }}
                  onClick={handleOnAcceptCall}
                >
                  Answer
                </button>
                <button
                  className="call-btn"
                  style={{ background: "red" }}
                  onClick={hanndleDeclineCall}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <RoomList />
      <div className="chat-message-wrapper">
        <div className="chat-feed">
          <div className="chat-title-container">
            <div className="chat-title">{roomName}</div>
            {oldMessage ? <ul>{oldMessagesLi}</ul> : null}

            <ul>{newMessagesLi}</ul>

            <div ref={myRef} style={{ height: "75px" }}></div>
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
                <button
                  type="submit"
                  onClick={handleOnVideoCall}
                  className="send-button"
                >
                  <AiIcons.AiFillPhone size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="room-members-wrapper">
        <div className="room-members">
          <RoomMembers />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userName: state.userName,
    userAvatar: state.userAvatar,
    roomMembers: state.roomMembers,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLoadMembers: (memberList) =>
      dispatch({ type: "LOAD_MEMBERS", memberList: memberList }),
    OnLoadRoom: (roomId) => dispatch({ type: "ON_LOAD_ROOM", roomId: roomId }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoom);
