import React, { useState, useContext } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';

export default function Login() {
	const { loginUser } = useContext(AuthContext);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	return (
		<Grid container spacing={1} align='center'>
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
		</Grid>
	);
}
