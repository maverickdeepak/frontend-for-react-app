import React, { useContext, useRef } from "react";
import StateContext from "../context/StateContext";
import DispatchContext from "../context/DispatchContext";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const Chat = () => {
  const socket = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  const closeChat = () => {
    appDispatch({
      type: "closeChat",
    });
  };

  useEffect(() => {
    if (appState.isChatOpen) {
      chatField.current.focus();
      appDispatch({
        type: "clearUnreadChatCount",
      });
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.current = io(
      process.env.BACKENDURL || "https://backend-for-react-app.onrender.com"
    );
    socket.current.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });
    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    chatLog.current.scrollTop = chatLog.current.scrollHeight;
    if (state.chatMessages.length && !appState.isChatOpen) {
      appDispatch({
        type: "inrementUnreadChatCount",
      });
    }
  }, [state.chatMessages]);

  function handleFieldChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // send messages to chat server
    socket.current.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: appState.user.token,
    });

    setState((draft) => {
      // add message to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });
      draft.fieldValue = "";
    });
  }

  return (
    <div
      id="chat-wrapper"
      className={`chat-wrapper ${
        appState.isChatOpen ? "chat-wrapper--is-visible" : ""
      } shadow border-top border-left border-right`}
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span className="chat-title-bar-close" onClick={closeChat}>
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={message.avatar} />
              </div>
            );
          }
          return (
            <div className="chat-other" key={index}>
              <Link to={`/profile/${message.username}`}>
                <img className="avatar-tiny" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}: </strong>
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        id="chatForm"
        className="chat-form border-top"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
          onChange={handleFieldChange}
          value={state.fieldValue}
        />
      </form>
    </div>
  );
};

export default Chat;
