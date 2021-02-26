import React, { useState } from "react";
import axios from "axios";
import server from "../utils/serverLink";
import { setAuthenticationHeader } from "../utils/authenticate";
import { connect } from "react-redux";

function Login(props) {
  const [user, setUser] = useState();
  const handleOnChange = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleOnLogin = async () => {
    axios.post(`${server}/user/login`, user).then(async (result) => {
      if (result.data.login) {
        const token = result.data.token;
        localStorage.setItem("jsonwebtoken", token);
        setAuthenticationHeader(token);
        props.onLogin(result.data.userName);
      }
    });
  };
  return (
    <>
      <input
        placeholder="username"
        name="userName"
        type="text"
        onChange={handleOnChange}
      ></input>
      <input
        placeholder="password"
        name="password"
        type="password"
        onChange={handleOnChange}
      ></input>
      <button onClick={handleOnLogin}>Login</button>
    </>
  );
}

const mapStatetoProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};
const dispatchStateToProps = (dispatch) => {
  return {
    onLogin: (userName) => dispatch({ type: "ON_AUTH", userName: userName }),
  };
};

export default connect(mapStatetoProps, dispatchStateToProps)(Login);
