import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material"
import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
export default function Register() {

  const name = useRef();
  const handle = useRef();
  const profile = useRef();
  const password = useRef();

  const navigate = useNavigate();

  const [ err, setErr] = useState(false);
  const  [ errMsg, setErrMsg ] = useState("");

  const registerHandler = (e) => {
    e.preventDefault();

    fetch("http://localhost:8484/users/register", {
      method: "POST",
      headers: {"Content-Type" : "application/json" },
      body: JSON.stringify({
        name: name.current.value,
        handle: handle.current.value,
        profile: profile.current.value,
        password: password.current.value,
      })
    })
    .then(res => {
      if(!res.ok) return res.json();
      else navigate("/login", {state: "Resgister Successful"});
    })
    .then(json => {
      setErr(true);
      setErrMsg(json.msg)
    })
  }

  return(
    <Box sx={{ my: 3, mx: {lg: 20, md: 5, sm: 5, xs: 3}}}>
      <Typography variant="h4" sx={{ my: 4}} > Register</Typography>

      {err && <Alert severity="warning" sx={{ mb: 4}}>{errMsg}</Alert>}
      <form onSubmit={(e) => registerHandler(e)}>
        <OutlinedInput placeholder="profile" fullWidth sx={{ mb:2}} inputRef={profile} />
        <OutlinedInput placeholder="name" fullWidth sx={{ mb:2}} inputRef={name} />
        <OutlinedInput placeholder="handle" fullWidth sx={{ mb:2}} inputRef={handle} />
        <OutlinedInput type="password" placeholder="password" fullWidth sx={{ mb:2}} inputRef={password} />
        <Button variant="contained" type="submit">Register</Button>
      </form>
    </Box>
  )
}