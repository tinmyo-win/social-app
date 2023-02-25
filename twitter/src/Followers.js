import { Box } from "@mui/system"
import { useLocation } from "react-router-dom";

export default function Followers() {
  const location = useLocation()
  const { users } = location.state;
  return(
    <Box sx={{ my: 3, mx: {lg: 20, md: 5, sm: 5, xs: 3}}}>
      {users.map(user => {
        return <div key={user._id}>{user.name}</div>
      })}
    </Box>
  )
}