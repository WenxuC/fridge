import React, { useState } from 'react';
import { config } from './Constants';
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
	Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const URL = config.url;
const theme = createTheme();

export default function Register() {
	const navigate = useNavigate();
	const [username, getUserName] = useState('');
	const [password, getPassword] = useState('');
	const [email, getEmail] = useState('');
	const [error, getError] = useState('');

	const handleSubmit = () => {
		const body = {
			username: username,
			password: password,
			email: email,
		};
		axios
			.post(`${URL}account/register`, body)
			.catch(function (error) {
				if (error.response.status === 400) {
					return getError('User or email already exists. Please try again.');
				}
			})
			.then(response => {
				if (response.status === 201) {
					navigate('/login');
				} else {
				}
			});
	};

	return (
		<ThemeProvider theme={theme}>
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
							Sign Up
						</Typography>

						{error !== '' ? (
							<Alert fullWidth severity='error'>
								{error}
							</Alert>
						) : null}

						<Box>
							<TextField
								margin='normal'
								required
								fullWidth
								label='User Name'
								placeholder='User Name'
								value={username}
								onChange={e => getUserName(e.target.value)}
								autoFocus
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								label='Email'
								placeholder='Email'
								value={email}
								onChange={e => getEmail(e.target.value)}
								autoFocus
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								label='Password'
								value={password}
								onChange={e => getPassword(e.target.value)}
								type='password'
								placeholder='Password'
							/>
							<Button
								type='submit'
								fullWidth
								value='sign up'
								variant='contained'
								sx={{ mt: 3, mb: 2 }}
								onClick={handleSubmit}
							>
								Sign Up
							</Button>
							<Grid container>
								<Grid item xs>
									<Link href='#' variant='body2'>
										Forgot password?
									</Link>
								</Grid>
								<Grid item>
									<Link href='/login' variant='body2'>
										{'Already have an account?'}
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
