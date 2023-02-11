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
	Link,
} from '@mui/material';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AuthContext from '../context/AuthContext';

export default function Header() {
	const { logoutUser } = useContext(AuthContext);

	const token = localStorage.getItem('authTokens');
	return (
		<div>
			<CssBaseline />
			<AppBar position='relative'>
				<Toolbar>
					<RestaurantMenuRoundedIcon sx={{ mr: 2 }} />
					<Typography variant='h6'>Mise En Place</Typography>
					<Container disableGutters={true} maxWidth={false}>
						<Stack direction='row' justifyContent='flex-end'>
							{token ? (
								<Button href='/dashboard' sx={{ mr: 1 }}>
									<Typography color='#fafafa'>Home</Typography>
								</Button>
							) : null}

							{/* <Button href='/about' sx={{ mr: 1 }}>
								<Typography color='#fafafa'>About</Typography>
							</Button> */}
							<Button href='/contact' sx={{ mr: 1 }}>
								<Typography color='#fafafa'>Contact Us</Typography>
							</Button>
							{token ? (
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
							) : (
								<Link href='/login' variant='body2'>
									<Button>
										<Typography color='#fafafa'>Login</Typography>
									</Button>
								</Link>
							)}
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
