import React from "react";

function BaseLayout(props) {
  return (
    <>
      <header>header</header>
      {props.children}
      <footer>chatApp</footer>
    </>
  );
}

export default BaseLayout;
