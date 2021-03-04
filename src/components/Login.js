import React, { useState } from "react";
import axios from "axios";
import server from "../utils/serverLink";
import { setAuthenticationHeader } from "../utils/authenticate";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

function Login(props) {
  const history = useHistory();
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
        history.push("/main");
      }
    });
  };

  return (
    <div className="wrapper">
      <div className="form">
        <h1 className="title">Chat Application</h1>
        <input
          placeholder="username"
          name="userName"
          type="text"
          onChange={handleOnChange}
          required
          className="input"
        />
        <input
          type="password"
          onChange={handleOnChange}
          className="input"
          placeholder="Password"
          name="password"
          required
        />
        <div align="center">
          <button type="submit" className="button" onClick={handleOnLogin}>
            <span>Start chatting</span>
          </button>
        </div>
      </div>
    </div>
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
