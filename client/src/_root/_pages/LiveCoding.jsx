import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const LiveCoding = () => {
  const user = useSelector((state) => state.user.user);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState(user.displayName);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId == "") toast.error("Room Id is required");
    if (username == "") toast.error("Username is required");
    roomId !== "" &&
      username !== "" &&
      navigate(`/live-coding/${roomId}`, {
        state: { username },
      });
  };
  const generateNewRoomID = () => {
    setRoomId(uuidv4());
    toast.success("Room Id generated");
  };

  const navigate = useNavigate();

  return (
    <div className="h-full w-full flexC">
      <div className="w-[50%] h-[50%] border-2 border-white flexC flex-col gap-3">
        <form
          onSubmit={handleSubmit}
          className="flexC gap-3 flex-col w-[70%] text-lg "
        >
          <input
            type="text"
            className="w-full outline-none border-none bg-white px-2 py-1 text-black"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
          <input
            type="text"
            className="w-full outline-none border-none bg-white px-2 py-1  text-black"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button className="w-full bg-emerald-400 py-2 rounded-md hover:bg-emerald-500 active:bg-emerald-500 duration-200">
            Join
          </button>
        </form>

        <p className="text-white">
          Don't have a room Id? create a{" "}
          <span
            className="text-emerald-400 cursor-pointer"
            onClick={generateNewRoomID}
          >
            New Room
          </span>
        </p>
      </div>
    </div>
  );
};

export default LiveCoding;
