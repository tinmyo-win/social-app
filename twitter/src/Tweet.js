import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  ButtonGroup,
  IconButton,
  Button,
  FormControl,
  InputAdornment,
  Input,
} from "@mui/material";

import {
  ChatBubble as ChatBubbleIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as ChatBubbleOutlineIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import { green } from "@mui/material/colors";

import { useContext, useEffect, useMemo, useState, useRef } from "react";

import { blue, pink } from "@mui/material/colors";

import { getTweet } from "./apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export default function Tweet({ tweets }) {
  const { id } = useParams();

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();
  const [tweet, setTweet] = useState({});
  const [loading, setLoading] = useState(true);

  const input = useRef();

  useEffect(() => {
    (async () => {
      const result = await getTweet(id);
      setTweet(result);
      setLoading(false);
    })();
  }, [id]);

  // const tweet = useMemo(() => {
  //   const result = tweets.filter(t => t._id === id);
  //   return result[0]
  // }, [id]);

  return (
    !loading && (
      <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex" }}>
            <Avatar alt="Profile" sx={{ width: 64, height: 64 }} />
            <Box sx={{ ml: 2, mt: 1 }}>
              <Box sx={{ display: "flex" }}>
                <Typography>{tweet.owner_user[0].name}</Typography>
                <Typography
                  component="span"
                  sx={{
                    color: "grey",
                    mx: 1,
                  }}
                >
                  @{tweet.owner_user[0].handle}
                </Typography>

                <Typography component="span" sx={{ ml: 1, color: blue[500] }}>
                  <small>{tweet.created}</small>
                </Typography>
              </Box>
              <CardActionArea>{tweet.body}</CardActionArea>
            </Box>
          </CardContent>

          <Box
            // tweet"s actions
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <ButtonGroup>
              <IconButton>
                <FavoriteBorderIcon sx={{ color: pink[500] }} />
              </IconButton>
              <Button variant="clear">
                {(tweet.likes && tweet.likes.length) || 0}
              </Button>
            </ButtonGroup>

            <ButtonGroup variant="text">
              <IconButton size="small" disableRipple={true}>
                <ChatBubbleIcon color="success" />
              </IconButton>

              <Button
                sx={{
                  color: "grey",
                }}
              >
                {(tweet.comments && tweet.comments.length) || 0}
              </Button>
            </ButtonGroup>
          </Box>
        </Card>
        {tweet.comments.map((comment) => {
          return (
            <Card sx={{ mb: 2 }} key={comment._id}>
              <CardContent sx={{ display: "flex" }}>
                <Avatar
                  alt="Profile"
                  sx={{
                    width: 48,
                    height: 48,
                  }}
                />
                <Box sx={{ ml: 2, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        fontSize: "0.9em",
                      }}
                    >
                      {tweet.owner_user[0].name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        ml: 1,
                        color: "grey",
                      }}
                    >
                      @{tweet.owner_user[0].handle}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.8em",
                        ml: 1,
                        color: blue[500],
                      }}
                    >
                      {comment.created}
                    </Typography>
                  </Box>
                  <CardActionArea
                    onClick={() => {
                      navigate(`/tweets/${comment._id}`);
                    }}
                  >
                    {comment.body}
                  </CardActionArea>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      mt: 2,
                    }}
                  >
                    <ButtonGroup>
                      <IconButton>
                        <FavoriteBorderIcon
                          sx={{
                            color: pink[500],
                          }}
                        />
                      </IconButton>
                      <Button variant="clear">{comment.likes.length}</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                      <IconButton>
                        <ChatBubbleOutlineIcon
                          sx={{
                            color: green[500],
                          }}
                        />
                      </IconButton>
                      <Button variant="clear">{comment.comments.length}</Button>
                    </ButtonGroup>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}

        {auth && (
          <Box
            // Reply form
            sx={{
              p: 2,
              pb: 3,
              mt: 4,
              bottom: 0,
              position: "sticky",
              bgcolor: "banner.background",
            }}
          >
            <FormControl fullWidth>
              <Input
                inputRef={input}
                sx={{ fontSize: "16px", py: 2 }}
                placeholder="Your reply"
                multiline
                fullWidth
                variant="standard"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <SendIcon color="info" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
        )}
      </Box>
    )
  );
}
