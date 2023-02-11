import { useContext, useEffect, useState } from "react";
import MainDrawer from "./MainDrawer";
import Header from "./Header";

import { Button } from "@mui/material";
import Register from "./Register";
import Login from "./Login";
import Edit from './Edit';
import Profile from './Profile';
import Home from './Home';

import { Link, Route, Routes } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { verify } from "./apiCalls";

export default function App() {
  const [drawerState, setDrawerState] = useState(false);
  const { setAuth, setAuthUser } = useContext(AuthContext);

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

  const tweets = [
		{ user: "Alice", body: "Some tweet body conent" },
		{ user: "Bob", body: "Some other tweet post body" },
		{ user: "Tom", body: "More tweet body content"},
	];

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
      </Routes>
    </div>
  );
}
