import React, { useContext } from 'react';
import {
	AppBar,
	Toolbar,
	CssBaseline,
	Typography,
	Stack,
	Button,
	Container,
	Grid,
} from '@mui/material';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AuthContext from '../context/AuthContext';

export default function Header() {
	const { logoutUser } = useContext(AuthContext);

	return (
		<div>
			<CssBaseline />
			<AppBar position='relative'>
				<Toolbar>
					<RestaurantMenuRoundedIcon sx={{ mr: 2 }} />
					<Typography variant='h6'>Mise En Place</Typography>
					<Container disableGutters={true} maxWidth={false}>
						<Stack direction='row' justifyContent='flex-end'>
							<Button
								type='submit'
								color='error'
								value='Logout'
								size='small'
								variant='contained'
								onClick={logoutUser}
							>
								<LogoutRoundedIcon />
							</Button>
						</Stack>
						<Grid container spacing={2}>
							<Grid item xs={12}></Grid>
						</Grid>
					</Container>
				</Toolbar>
			</AppBar>
		</div>
	);
}
