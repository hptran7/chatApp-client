import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import RoomList from "./RoomList";
import RoomMembers from "./RoomMembers";

function MainPage() {
  return (
    <div>
      <RoomList></RoomList>
      <h1>Mainpage</h1>
      <RoomMembers></RoomMembers>
    </div>
  );
}

export default connect()(MainPage);
