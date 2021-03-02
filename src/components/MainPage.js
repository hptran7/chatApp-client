import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import RoomList from "./RoomList";

function MainPage() {
  return (
    <div>
      <h1>Mainpage</h1>
      <RoomList></RoomList>
    </div>
  );
}

const mapStatetoProps = () => {};

export default connect()(MainPage);
