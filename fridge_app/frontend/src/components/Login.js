import React, { useState, useContext } from 'react';

import AuthContext from '../context/AuthContext';
import Alerts from './Alerts';

import {
	Button,
	Grid,
	TextField,
	Typography,
	Avatar,
	CssBaseline,
	Link,
	Paper,
	Box,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function Login() {
	const { loginUser, open, setOpen, alert } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	return (
		<ThemeProvider theme={theme}>
			<Alerts setOpen={setOpen} open={open} alert={alert} />
			<Grid container component='main' sx={{ height: '100vh' }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: 'url(https://source.unsplash.com/random/?food)',
						backgroundRepeat: 'no-repeat',
						backgroundColor: t =>
							t.palette.mode === 'light'
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Sign In
						</Typography>

						<Box>
							<TextField
								margin='normal'
								required
								fullWidth
								label='Username'
								placeholder='User Name'
								value={username}
								onChange={e => setUsername(e.target.value)}
								autoFocus
							/>

							<TextField
								margin='normal'
								required
								fullWidth
								label='Password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								type='password'
								placeholder='Password'
							/>
							<Button
								type='submit'
								fullWidth
								value={JSON.stringify({ username, password })}
								variant='contained'
								sx={{ mt: 3, mb: 2 }}
								onClick={loginUser}
							>
								Sign In
							</Button>
							<Grid container>
								{/* <Grid item xs>
									<Link href='#' variant='body2'>
										Forgot password?
									</Link>
								</Grid> */}
								<Grid item>
									<Link href='/register' variant='body2'>
										{"Don't have an account?"}
									</Link>
								</Grid>
							</Grid>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
}
