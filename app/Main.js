import React, { useEffect, useReducer, useState, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { LoaderIcon, toast, Toaster } from "react-hot-toast";
import { useImmerReducer } from "use-immer";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";

Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://backend-for-react-app.onrender.com";

// CONTEXT
import StateContext from "./context/StateContext";
import DispatchContext from "./context/DispatchContext";

// COMPONENTS
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";
import Home from "./components/Home";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));

// PAGES
import About from "./components/About";
import Term from "./components/Term";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import LoadingIcon from "./components/LoadingIcon";

function ourReducer(draft, action) {
  switch (action.type) {
    case "login":
      draft.loggedIn = true;
      draft.user = action.data;
      return;
    case "logout":
      draft.loggedIn = false;
      return;
    case "openSearch":
      draft.isSearchOpen = true;
      return;
    case "closeSearch":
      draft.isSearchOpen = false;
      return;
    case "toggleChat":
      draft.isChatOpen = !draft.isChatOpen;
      return;
    case "closeChat":
      draft.isChatOpen = false;
      return;
    case "inrementUnreadChatCount":
      draft.unreadChatCount++;
      return;
    case "clearUnreadChatCount":
      draft.unreadChatCount = 0;
      return;
  }
}

function AppComponent() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexAppToken")),
    user: {
      token: localStorage.getItem("complexAppToken"),
      username: localStorage.getItem("complexAppUsername"),
      avatar: localStorage.getItem("complexAppAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexAppToken", state.user.token);
      localStorage.setItem("complexAppUsername", state.user.username);
      localStorage.setItem("complexAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexAppToken");
      localStorage.removeItem("complexAppUsername");
      localStorage.removeItem("complexAppAvatar");
    }
  }, [state.loggedIn]);

  // check if token is expired or not
  useEffect(() => {
    if (state.loggedIn) {
      // send axios request
      const ourRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: ourRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            toast.error("Session expired. Please login again", {
              duration: 3000,
            });
          }
        } catch (error) {
          console.log("SEARCH-ERROR", error);
        }
      }

      fetchResults();

      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              // Define default options
              className: "",
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },

              // Default options for specific types
              success: {
                duration: 3000,
                theme: {
                  primary: "green",
                  secondary: "black",
                },
              },
              error: {
                duration: 3000,
                theme: {
                  primary: "red",
                  secondary: "white",
                },
              },
            }}
          />
          <Header />
          <Suspense fallback={<LoadingIcon />}>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route
                path="/"
                element={state.loggedIn ? <Home /> : <HomeGuest />}
              />
              <Route path="/about-us" element={<About />} />
              <Route path="/terms" element={<Term />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<ViewSinglePost />} />
              <Route path="/profile/:username/*" element={<Profile />} />
              <Route path="/post/:id/edit" element={<EditPost />} />
            </Routes>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback="">
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#app"));

root.render(<AppComponent />);

if (module.hot) {
  module.hot.accept();
}
