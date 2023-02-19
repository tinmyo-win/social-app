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
} from "@mui/material";

import {
  ChatBubble as ChatBubbleIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

import { blue, pink } from "@mui/material/colors";

import { getTweets } from "./apiCalls";
import { useNavigate } from "react-router-dom";

export default function Home({ tweets }) {
  // const [tweets, setTweets] = useState([]);

  // useEffect(() => {
  //   (async () => {
  //     const tweetsData = await getTweets();
  //     setTweets(tweetsData);
  //   })();
  // }, []);
  const navigate = useNavigate();

  return (
    <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
      {tweets.map((tweet, i) => {
        return (
          <Card key={i} sx={{ mb: 2 }}>
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
                <CardActionArea onClick={() => {
                  navigate(`/tweets/${tweet._id}`);
                }}>{tweet.body}</CardActionArea>
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
                <IconButton >
                  <FavoriteBorderIcon sx={{ color: pink[500]}}/>
                </IconButton>
                <Button
                  variant="clear"
                >
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
        );
      })}
    </Box>
  );
}
