import { Button } from "@mui/material";
import { useContext } from "react";
import { toggleFollow } from "./apiCalls";
import { AuthContext } from "./AuthProvider";

export default function FollowButton({ user }) {
  const { authUser, setAuthUser } = useContext(AuthContext);

  return authUser.following &&
    authUser.following.find((uid) => uid === user._id) ? (
    <Button
      onClick={() => {
        (async () => {
          let result = await toggleFollow(user._id);
          authUser.following = result.following;
          setAuthUser({ ...authUser });
        })();
      }}
      size="small"
      edge="end"
      variant="outlined"
      sx={{ borderRadius: 5 }}
    >
      Followed
    </Button>
  ) : (
    <Button
      onClick={() => {
        (async () => {
          let result = await toggleFollow(user._id);
          authUser.following = result.following;
          setAuthUser({ ...authUser });
        })();
      }}
      size="small"
      edge="end"
      variant="contained"
      sx={{ borderRadius: 5 }}
    >
      Follow
    </Button>
  );
}
