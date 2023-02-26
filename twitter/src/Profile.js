import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  ButtonGroup,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubble as ChatBubbleIcon,
} from "@mui/icons-material";
import { pink, blue } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "./AuthProvider";
import { getUser, getUserTweets } from "./apiCalls";

import FollowButton from "./FollowButton";

export default function Profile() {
  const navigate = useNavigate();

  const { handle } = useParams();

  const { authUser } = useContext(AuthContext);

  const [user, setUser] = useState(authUser);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    (async () => {
      const update = await getUser(handle ?? authUser.handle); //need to refactor right logic
      if (update) setUser(update);

      const list = await getUserTweets(update._id);

      setTweets(list);
    })();
  });

  const toggleLike = () => {};

  return (
    <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
      <Box sx={{ height: 150, background: "grey", mb: 2 }}></Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography>
            {user.name}
            <Typography
              component="span"
              sx={{ color: "grey", fontSize: "0.8em", ml: 1 }}
            >
              @{user.handle}
            </Typography>
          </Typography>
          <Typography sx={{ mt: 1, fontSize: "0.9em" }}>
            {user.profile}
          </Typography>
        </Box>
        <Box>
          {user._id === authUser._id ? (
            <Button
              variant="contained"
              onClick={() => {
                navigate("/edit");
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <FollowButton user={user} />
          )}
        </Box>
      </Box>

      <Box>
        <Button
          onClick={() => {
            navigate("/followers", {
              state: {
                users: user.followers_users,
              },
            });
          }}
          sx={{ mr: 4, color: blue[500] }}
        >
          {user.followers_users && user.followers_users.length} Followers
        </Button>
        <Button
          onClick={() => {
            navigate("/following", {
              state: {
                users: user.following_users,
              },
            });
          }}
          sx={{ mr: 4, color: pink[500] }}
        >
          {user.following_users && user.following_users.length} Following
        </Button>
      </Box>

      <Box sx={{ my: 3, mx: { lg: 20, md: 5, sm: 5, xs: 3 } }}>
        {tweets.map((tweet, i) => {
          return (
            <Card key={i} sx={{ mb: 2 }}>
              <CardContent sx={{ display: "flex" }}>
                <Avatar alt="Profile" sx={{ width: 64, height: 64 }} />
                <Box sx={{ ml: 2, mt: 1 }}>
                  <Box sx={{ display: "flex" }}>
                    <CardActionArea
                      onClick={() => {
                        navigate(`/@/${tweet.owner_user[0].handle}`);
                      }}
                    >
                      <Typography component="span">
                        {tweet.owner_user[0].name}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{
                          color: "grey",
                          mx: 1,
                        }}
                      >
                        @{tweet.owner_user[0].handle}
                      </Typography>
                      <Typography
                        component="span"
                        sx={{ ml: 1, color: blue[500] }}
                      >
                        <small>{tweet.created}</small>
                      </Typography>
                    </CardActionArea>
                  </Box>
                  <CardActionArea
                    onClick={() => {
                      navigate(`/tweets/${tweet._id}`);
                    }}
                  >
                    {tweet.body}
                  </CardActionArea>
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
                  <IconButton onClick={() => toggleLike(tweet._id)}>
                    {tweet.likes.find((n) => n === authUser._id) ? (
                      <FavoriteIcon sx={{ color: pink[500] }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: pink[500] }} />
                    )}
                  </IconButton>
                  <Button
                    variant="clear"
                    onClick={() => {
                      navigate("/likes", {
                        state: {
                          users: tweet.likes_users,
                        },
                      });
                    }}
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
    </Box>
  );
}
