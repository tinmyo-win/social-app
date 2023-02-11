import { Alert, Box, Button, OutlinedInput, Typography } from "@mui/material"
import React, {useRef, useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { register, updateUser } from "./apiCalls";
import { AuthContext } from "./AuthProvider";

export default function Edit() {

  const name = useRef();
  const profile = useRef();
  const password = useRef();

  const navigate = useNavigate();

  const { auth, authUser, setAuthUser } = useContext(AuthContext);

  const [ err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const  [ errMsg, setErrMsg ] = useState("");

  const updateHandler = async (e) => {
    e.preventDefault();

    const user = await updateUser(authUser._id, name.current.value, profile.current.value, password.current.value);

    if(user) {
      setAuthUser(user);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } else {
      setErr(true);
      setErrMsg(
        "Profile updated fail .please try again"
      )

      setTimeout(() => {
        setErr(false)
      }, 3000)
      
    }
  }

  return(
    <Box sx={{ my: 3, mx: {lg: 20, md: 5, sm: 5, xs: 3}}}>
      <Typography variant="h4" sx={{ my: 4}} > Edit Profile</Typography>

      {success && <Alert severity="success" sx={{ mb: 4 }} >Update user Success</Alert>}

      {err && <Alert severity="warning" sx={{ mb: 4}}>{errMsg}</Alert>}
      <form onSubmit={(e) => updateHandler(e)}>
        <OutlinedInput placeholder="profile" defaultValue={authUser.profile} fullWidth sx={{ mb:2}} inputRef={profile} />
        <OutlinedInput placeholder="name" fullWidth sx={{ mb:2}} defaultValue={authUser.name} inputRef={name} />
        <OutlinedInput type="password" placeholder="password remain blank if you do not wanna change" fullWidth sx={{ mb:2}} inputRef={password} />
        <Button variant="contained" type="submit">Edit</Button>
      </form>
    </Box>
  )
}