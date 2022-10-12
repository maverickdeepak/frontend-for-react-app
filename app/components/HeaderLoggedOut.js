import React, { useState, useContext } from "react";
import Axios from "axios";
import toast from "react-hot-toast";

import DispatchContext from "../context/DispatchContext";

const HeaderLoggedOut = () => {
  const appDispatch = useContext(DispatchContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Axios.post("/login", {
        username: username,
        password: password,
      });

      if (res.data) {
        appDispatch({
          type: "login",
          data: res.data,
        });
        toast.success("User logged-in successfully");
      } else {
        toast.error("Incorrect Username/Password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form className="mb-0 pt-2 pt-md-0" onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
