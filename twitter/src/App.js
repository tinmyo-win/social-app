import { useContext, useEffect, useState } from "react";
import MainDrawer from "./MainDrawer";
import Header from "./Header";

import { Button, Fab, Snackbar } from "@mui/material";
import { Add as AddIcon, Feedback } from "@mui/icons-material";
import Register from "./Register";
import Login from "./Login";
import Edit from "./Edit";
import Profile from "./Profile";
import Home from "./Home";
import Tweet from "./Tweet";
import Add from "./Add";

import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { verify, getTweets } from "./apiCalls";
import Likes from "./Likes";

export default function App() {
  const [drawerState, setDrawerState] = useState(false);
  const { setAuth, setAuthUser, authUser } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [feddback, setFeedBack] = useState();

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

  const addTweet = (tweet) => {
    setFeedBack(true);
    setTweets([tweet, ...tweets]);
  };

  const updateTweets = (update) => {
    setTweets(
      tweets.map((tweet) => {
        if (tweet._id === update._id) return update;
        else return tweet;
      })
    );
  };

  const toggleLike = (id) => {
    setTweets(
      tweets.map((tweet) => {
        if (tweet._id === id) {
          if (tweet.likes.find((n) => n === authUser._id)) {
            tweet.likes = tweet.likes.filter((n) => n !== authUser._id);
          } else {
            tweet.likes = [authUser._id, ...tweet.likes];
          }
        }
        return tweet;
      })
    );
  };

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <MainDrawer drawerState={drawerState} toggleDrawer={toggleDrawer} />
      <Routes>
        <Route
          path="/"
          element={<Home tweets={tweets} toggleLike={toggleLike} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/tweets/:id"
          element={<Tweet tweets={tweets} updateTweets={updateTweets} />}
        />
        <Route path="/add" element={<Add addTweet={addTweet} />} />
        <Route path="/likes" element={<Likes />} />
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
          onClick={() => {
            navigate("/add");
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </div>
  );
}
