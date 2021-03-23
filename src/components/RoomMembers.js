import axios from "axios";
import React, { useState, useEffect } from "react";
import server from "../utils/serverLink";
import { useHistory } from "react-router-dom";
import { Image } from "cloudinary-react";
import Options from "./Options";
import { useParams } from "react-router-dom";
import serverLink from "../utils/serverLink";
import { connect } from "react-redux";

function RoomMembers(props) {
  const roomName = useParams().roomName;
  const history = useHistory();
  const [chatMembers, setChatMembers] = useState([]);
  const [addUserName, setAddUserName] = useState("");
  const fetchAllRoomMember = async () => {
    await axios
      .get(`${serverLink}/chat-room/view-users/${props.roomID}`)
      .then((result) => {
        setChatMembers(result.data.members);
        props.OnLoadMember(result.data.members);
      });
  };

  useEffect(async () => {
    fetchAllRoomMember();
  }, [props.roomID]);

  const handleOnLeaveRoom = () => {
    history.push("/main");
    axios.post(`${server}/chat-room/leave-room/${props.roomID}`);
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
            roomId: props.roomID,
          })
          .then((result) => {
            if (result.data.addUser) {
              fetchAllRoomMember();
            } else {
              alert(result.data.message);
            }
          });
      }
      setAddUserName("");
    }
  };

  const member = chatMembers.map((member, index) => {
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
    <div className="ce-settings-container">
      <div className="ce-chat-settings-container">
        <div className="ce-chat-title-forn">
          <div className="ce-input ce-text-input room-title">{roomName}</div>
        </div>
      </div>
      <div className="members-list">
        <div className="ce-section-title-container ce-person-title-container">
          <div className="ce-section-title ce-person-title">Members</div>
          <div style={{ height: "12px" }}></div>
          {chatMembers ? <ul style={{ listStyle: "none" }}>{member}</ul> : null}

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
            <Options />
          </div>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    roomID: state.roomId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    OnLoadMember: (memberlist) =>
      dispatch({ type: "On_Load_Member", roomMembers: memberlist }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoomMembers);
