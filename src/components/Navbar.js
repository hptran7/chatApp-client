import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import { IconContext } from "react-icons";
import RoomListComponent from "./RoomListComponent";
import RoomMembers from "./RoomMembers";

function Navbar() {
  const [showRoomList, setShowRoomList] = useState(false);
  const [showRoomMembers, setShowRoomMembers] = useState(false);
  const [showSideBar, setShowsideBar] = useState(false);

  const handleOnShowSideBar = () => {
    setShowsideBar(!showSideBar);
  };
  const handleOnShowRoomList = () => {
    setShowRoomList(!showRoomList);
    setShowRoomMembers(false);
  };
  const handleOnShowMember = () => {
    setShowRoomMembers(!showRoomMembers);
    setShowRoomList(false);
  };
  return (
    <>
      <IconContext.Provider value={{ color: "#ffff" }}>
        <div className="navbar">
          <FaIcons.FaBars
            className="menui-icons"
            onClick={handleOnShowSideBar}
          />
        </div>
        {showSideBar ? (
          <div className="side-bar">
            <AiIcons.AiOutlineClose
              size={30}
              onClick={handleOnShowSideBar}
            ></AiIcons.AiOutlineClose>
            <div className="navbar-items" onClick={handleOnShowRoomList}>
              <IoIcons.IoIosOptions></IoIcons.IoIosOptions>
              <p>Rooms</p>
            </div>
            <div className="navbar-items" onClick={handleOnShowMember}>
              <IoIcons.IoIosOptions></IoIcons.IoIosOptions>
              <p>Members</p>
            </div>

            {showRoomList ? (
              <div>
                <RoomListComponent></RoomListComponent>
              </div>
            ) : null}
            {showRoomMembers ? <RoomMembers></RoomMembers> : null}
          </div>
        ) : null}
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
