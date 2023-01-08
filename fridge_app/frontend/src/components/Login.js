import React, { useState, useContext } from 'react';
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
import AuthContext from '../context/AuthContext';

const theme = createTheme();

export default function Login() {
	const { loginUser } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

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
								<Grid item xs>
									<Link href='#' variant='body2'>
										Forgot password?
									</Link>
								</Grid>
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
{
	/* <Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Typography variant='h4' component='h4'>
					Login
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					label='Username'
					placeholder='User Name'
					value={username}
					onChange={e => setUsername(e.target.value)}
					autoFocus
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					label='Password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					type='password'
					placeholder='Password'
				/>
			</Grid>
			<Grid item xs={12}>
				<Button
					type='submit'
					value={JSON.stringify({ username, password })}
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					onClick={loginUser}
				>
					Sign In
				</Button>
			</Grid>
		</Grid> */
}
