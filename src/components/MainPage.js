import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import MainPageOptions from "./MainPageOptions";
import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";

function MainPage() {
  return (
    <div className="main-room">
      <RoomList></RoomList>
      <div className="chat-message-wrapper">
        <h1>Mainpage</h1>
      </div>
      <MainPageOptions />
    </div>
  );
}

export default connect()(MainPage);
