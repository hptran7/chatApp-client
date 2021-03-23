import React from "react";
import Navbar from "./Navbar";

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
