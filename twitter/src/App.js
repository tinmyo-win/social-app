import { useContext, useEffect, useState } from "react";
import MainDrawer from "./MainDrawer";
import Header from "./Header";

import { Button, Fab, Snackbar } from "@mui/material";
import { Add as AddIcon, Feedback } from "@mui/icons-material";
import Register from "./Register";
import Login from "./Login";
import Edit from './Edit';
import Profile from './Profile';
import Home from './Home';
import Tweet from './Tweet';
import Add from './Add';

import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { verify, getTweets } from "./apiCalls";

export default function App() {
  const [drawerState, setDrawerState] = useState(false);
  const { setAuth, setAuthUser } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [feddback, setFeedBack] = useState()

  useEffect(() => {
    (async () => {
      const user = await verify();
      if (user) {
        setAuth(true);
        setAuthUser(user);
      }
    })();
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerState(open);
  };

  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    (async () => {
      const tweetsData = await getTweets();
      setTweets(tweetsData);
    })();
  }, []);

  const addTweet = tweet => {
    setFeedBack(true);
    setTweets([tweet, ...tweets]);
  }

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <MainDrawer drawerState={drawerState} toggleDrawer={toggleDrawer} />
      <Routes>

        <Route path="/" element={<Home tweets={tweets} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tweets/:id" element={<Tweet tweets={tweets} />} />
        <Route path="/add" element={<Add addTweet={addTweet} />} />
      </Routes>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={feddback}
        autoHideDuration={5000}
        onClose={() => {
          setFeedBack(false);
        }}
        message="Your tweet posted"
      />

      {location.pathname !== "/add" && (
        <Fab
          color="success"
          sx={{ position: "fixed", right: 40, bottom: 40 }}
          onClick={
            () => {
              navigate("/add")
            }
          }>
            <AddIcon />
          </Fab>
      )}
    </div>
  );
}
