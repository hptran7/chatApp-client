import React, { useEffect } from "react";
import Navbar from "./Navbar";

let socket;

function BaseLayout(props) {
  return (
    <>
      <header>
        <Navbar />
      </header>
      {props.children}
    </>
  );
}

export default BaseLayout;
