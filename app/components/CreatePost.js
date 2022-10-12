import React, { useContext, useState } from "react";
import Page from "./Page";
import toast from "react-hot-toast";

import StateContext from "../context/StateContext";

import { useNavigate } from "react-router-dom";

import Axios from "axios";

const CreatePost = () => {
  const appState = useContext(StateContext);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post("/create-post", {
        title: title,
        body: body,
        token: appState.user.token,
      });
      const postId = response.data;
      toast.success("New Post Created Successfully");
      setTitle("");
      setBody("");

      // REDIRECT TO NEW POST URL
      navigate(`/post/${postId}`);
    } catch (error) {
      console.log("Something went wrong");
    }
  };

  return (
    <Page title="Create Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder="Post Title"
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            placeholder="Post Content"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default CreatePost;
