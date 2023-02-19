import { Avatar, Button, OutlinedInput, Box } from "@mui/material";
import { useRef, useState } from "react";
import { postTweet } from "./apiCalls";
import { useNavigate } from "react-router-dom";

export default function Add({ addTweet }) {
  const body = useRef();

  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const navigate = useNavigate();
  return(
    <Box>
    <form
      onSubmit={e => {
        e.preventDefault();
        (async () => {
          if(!body) return false;

          const tweet = await postTweet(body.current.value);

          if(!tweet) {
            setErr(true);
            setErrMsg("Something  went wrong. please try again");
            return false;
          }

          addTweet(tweet);
          navigate("/")
        })();
      }}>
        <Box sx={{display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Avatar />
          <Button type="submit" variant="contained">
            Tweet
          </Button>
        </Box>
        <OutlinedInput
          placeholder="What's on your mind"
          fullWidth
          sx={{ mb: 2}}
          inputRef={body}
          multiline
          rows={3}
        />

      </form>
      </Box>
  )
}