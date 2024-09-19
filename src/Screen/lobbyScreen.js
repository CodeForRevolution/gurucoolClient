import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/socketProvider";
import { useNavigate } from "react-router-dom";
const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate=useNavigate();


  const JoinRoom = () => {
    socket.emit("room:join", { email, room });   
  };
const handleJoinRoom=useCallback((data)=>{
    const {email,room}=data;
    console.log("your Response of call join",email)
    navigate(`/room/${room}`)

},[navigate])
useEffect(()=>{
socket.on("room:join",handleJoinRoom)
return ()=>{
    socket.off("room:join",handleJoinRoom);
}
},[socket])

  return (
    <>
      <h2>Lobby Screen</h2>
      <input
        type="text"
        placeholder="Enter email"
        style={{ margin: "20px" }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="text "
        value={room}
        placeholder="Enter the Room"
        onChange={(e) => setRoom(e.target.value)}
      />
      <br />
      <button style={{ margin: "10px" }} onClick={(e) => JoinRoom()}>
        Joint The Room
      </button>
    </>
  );
};

export default LobbyScreen;
