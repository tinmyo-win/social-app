import { useContext, useEffect, useState } from "react";
import MainDrawer from "./MainDrawer";
import Header from "./Header";

import { Button } from "@mui/material";
import Register from "./Register";
import Login from "./Login";

import { Link, Route, Routes } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { verify } from "./apiCalls";

const Home = () => {
  const { auth, authUser } = useContext(AuthContext);
  return (
    <div>
      {auth ? (
        <div>
          <div>{authUser.name}</div>
          <div>{authUser.profile}</div>
          <div>{authUser.handle}</div>
          <Link to={'/update'}>
            <Button variant="contained">Update</Button>
          </Link>
        </div>
      ) : (
        "Guest User"
      )}
    </div>
  );
};

const Update = () => {
  return(
    <div>
      Update
    </div>
  )
}

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

  return (
    <div>
      <Header toggleDrawer={toggleDrawer} />
      <MainDrawer drawerState={drawerState} toggleDrawer={toggleDrawer} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </div>
  );
}
