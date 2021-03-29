import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import serverLink from "../utils/serverLink";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import server from "../utils/serverLink";

const StyledVideo = styled.video`
  /* height: 600px;
  width: 300px;
  margin: 32px; */
  height: 40%;
  width: 50%;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      if (stream.active) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

function VideoRoom() {
  const roomID = parseInt(useParams().roomId);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = io.connect(`${server}`);
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("joinVideoRoom", roomID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peerID: userID,
              peer,
            });
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          const peerObj = {
            peer,
            peerID: payload.callerID,
          };

          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("user left", (payload) => {
          if (payload.roomID === roomID) {
            const peerObj = peersRef.current.find(
              (p) => p.peerID === payload.socketId
            );
            if (peerObj) {
              peerObj.peer.destroy();
            }
            const peers = peersRef.current.filter(
              (p) => p.peerID !== payload.socketId
            );
            peersRef.current.peers;
            setPeers(peers);
          }
        });
      });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div className="video-wrapper">
      <div className="webcam-section">
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
        {peers.map((peer) => {
          return <Video key={peer.peerID} peer={peer.peer} />;
        })}
      </div>
    </div>
  );
}

export default VideoRoom;
