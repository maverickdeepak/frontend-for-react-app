import React, { useContext, useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import StateContext from "../context/StateContext";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

import NotFound from "./NotFound";

const ViewSinglePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const appState = useContext(StateContext);

  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    async function fethcPost() {
      try {
        const response = await Axios.get(`/post/${id}`);
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("There was a problem");
      }
    }
    fethcPost();
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingIcon />
      </Page>
    );

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  function isPostOwner() {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });
        if (response.data == "Success") {
          toast.success("Post deleted successfully");
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log("There was an error");
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isPostOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${post._id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a
              className="delete-post-button text-danger"
              data-tip="Delete"
              data-for="delete"
              onClick={deleteHandler}
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={post.body}
          allowedElements={[
            "p",
            "br",
            "strong",
            "em",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "ul",
            "li",
            "ol",
          ]}
        />
      </div>
    </Page>
  );
};

export default ViewSinglePost;
