import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/socketProvider'
import ReactPlayer from 'react-player'
import peer from '../service/peer'


const Room = () => {
    const socket=useSocket();
    const [remoteSocketId,setRemoteSocketId]=useState(null);
    const [remoteEmail,setRemoteEmail]=useState()
    const [myStream,setMyStream]=useState(null);
    const [remoteStream,setRetmoteStream]=useState(null)



  const sendStream=useCallback(()=>{
    for(const track of myStream.getTracks()){
      peer.peer.addTrack(track,myStream)
     }
  },[myStream])

    const handleCallAccepted=useCallback(({from,ans})=>{
      peer.setLocalDescription(ans);
      console.log("call Accepted",from)  
      sendStream() 
        },[sendStream])

    const handleUserJoined=useCallback(({email,id})=>{
    console.log(`Email ${email} is joined the room`);
    setRemoteSocketId(id);
    setRemoteEmail(email)
    },[])

  const handleIncommingCall=useCallback(async({from,offer})=>{
    console.log("come to send CallAcepted response")
    const stream=await navigator.mediaDevices.getUserMedia({audio:true ,video:true});
    setMyStream(stream);
    console.log("your offer in incomming call",offer)
    console.log("who is calling you",from)
     const ans=await peer.getAnswer(offer)
     console.log("what ans you have make")
    socket.emit('call:accepted',{to:from,ans})
    setRemoteSocketId(from);

  },[])

  const handleNegoNeeded=useCallback(async()=>{
    const offer=await peer.getOffer();
     console.log("Neog:Starting with offer",offer)
     console.log("remnoteId",remoteSocketId)
    socket.emit("peer:nego:needed",{offer,to:remoteSocketId});
  },[remoteSocketId,socket]);

  const handleNegoNeedIncomming=useCallback(async({offer,from})=>{
    const ans=await peer.getAnswer(offer);
    console.log("accepting the offer In Incomming",offer,"GENERATEED ANSW",ans)
    socket.emit("peer:nego:done",{to:from,ans});
  },[socket]);
  

  useEffect(()=>{
  peer.peer.addEventListener("track",async(ev)=>{
    const remoteStream=ev.streams;
    console.log("Got the Streams",remoteStream);
    setRetmoteStream(remoteStream[0]);
  })
  },[])

  useEffect(()=>{
  peer.peer.addEventListener("negotiationneeded",handleNegoNeeded)
  return ()=>{
    peer.peer.removeEventListener("negotiationneeded",handleNegoNeeded)
  }
  },[handleNegoNeeded]);

const handleNegoNeedFinal=useCallback(async({ans})=>{
  await peer.setLocalDescription(ans);
},[])

 useEffect(()=>{
    socket.on("user:joined",handleUserJoined);
    socket.on("incoming:call",handleIncommingCall);
    socket.on("call:accepted",handleCallAccepted);
    socket.on("peer:nego:needed",handleNegoNeedIncomming)
    socket.on("peer:nego:final",handleNegoNeedFinal)
    return ()=>{
     socket.off("user:joined",handleUserJoined);   
     socket.off("incoming:call",handleIncommingCall);
     socket.off("call:accepted",handleCallAccepted);
     socket.off("peer:nego:needed",handleNegoNeedIncomming)
     socket.off("peer:nego:final",handleNegoNeedFinal)
    }
 },[socket,handleUserJoined,handleIncommingCall,handleCallAccepted,handleNegoNeedIncomming,handleNegoNeedFinal])


 const handleCallUser=useCallback(async()=>{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true ,video:true});
    const offer=await peer.getOffer();
    socket.emit("user:call",{to:remoteSocketId,offer})
    setMyStream(stream);
 })

  return (
    <>
     <div>Room page</div>
   <h1>{remoteSocketId?`You Are connected ${remoteEmail}`:"No one in rooom"}</h1>
   {
    remoteSocketId?<button onClick={handleCallUser}>Call</button>:null
   }
   {
    remoteSocketId?<button onClick={sendStream} >Send Stream</button>:null
   }

   {
    myStream&&<ReactPlayer style={{position:"absolute",bottom:0,right:0}} muted playing={true} url={myStream} height={"100px"} width={"100px"}></ReactPlayer>
   }
   {
    remoteStream&& <><h1>Remote Stream</h1><ReactPlayer muted playing={true} url={remoteStream} height={"80vh"} width={"90vw"}></ReactPlayer></> 
   }



    </>
   
  )
}

export default Room