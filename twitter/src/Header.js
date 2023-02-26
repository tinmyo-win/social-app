import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ArrowBack as ArrowBackIcon, PersonSearch as PersonSearchIcon, Notifications as NotificationsIcon } from "@mui/icons-material";

import Search from "./Search";

import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function Header({toggleDrawer}) {
	const location = useLocation();
	const navigate = useNavigate();

	const [searchOpen, setSearchOpen] = useState(false);
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					{location.pathname === "/" ? (
						<IconButton
						size="large"
						edge="start"
						color="inherit"
						sx={{ mr: 2 }}
						onClick={toggleDrawer(true)}>
						<MenuIcon />
					</IconButton>
					):
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						sx={{ mr: 2 }}
						onClick={() => {
							navigate(-1);
						}}>
						<ArrowBackIcon />
					</IconButton>
					}
					
					<Typography
						variant="h6"
						component="div"
						sx={{ flexGrow: 1 }}>
						Twitter
					</Typography>

					<IconButton
						color="inherit"
						onClick={() => {
							setSearchOpen(true);
						}}>
							<PersonSearchIcon />
					</IconButton>
					<IconButton
						color="inherit"
						onClick={() => {

						}}>
							<NotificationsIcon />
					</IconButton>

					<Search open={searchOpen} setOpen={setSearchOpen} />
				</Toolbar>
			</AppBar>
		</Box>
	);
}
