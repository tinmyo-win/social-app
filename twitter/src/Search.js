import { PersonSearch as PersonSearchIcon } from "@mui/icons-material";
import { Avatar, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Modal, OutlinedInput } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FollowButton from "./FollowButton";

const style = {
  position: "absolute",
  top: "10%",
  left: "20%",
  bgcolor: "#222",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  width: "60%",
}

export default function Search({ open, setOpen }) {
  const input = useRef();
  const navigate = useNavigate();
  const [ users, setUsers ] = useState([]);

  const handleClose = () => setOpen(false);

  return(
    <Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <OutlinedInput
            fullWidth={true}
            inputRef={input}
            variant="outlined"
            placeholder="Search user"
            startAdornment={
              <InputAdornment position="start">
                <PersonSearchIcon />
              </InputAdornment>
            }
          />
        </Box>
      </Modal>

      <List>
      {users.map((user) => {
        return (
          <ListItem
            key={user._id}
            secondaryAction={<FollowButton user={user} />}
          >
            <ListItemAvatar>
              <Link to={`/@${user.handle}`}>
                <Avatar alt="Profile"></Avatar>
              </Link>
            </ListItemAvatar>
            <ListItemText
              primary={user.name + " @" + user.handle}
              secondary={user.profile}
            />
          </ListItem>
        );
      })}
      </List>
    </Box>
  )
}