import React, { useState, useEffect } from "react";

import RoomListComponent from "./RoomListComponent";

function RoomList() {
  return (
    <div className="room-list">
      <div className="ce-chat-list">
        <div className="ce-chats-container ce-settings-container">
          <div className="ce-chat-settings-container">
            <RoomListComponent></RoomListComponent>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomList;
