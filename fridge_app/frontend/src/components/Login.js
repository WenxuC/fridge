import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, getError] = useState('');
	useEffect(() => {
		setTimeout(() => {
			getError('');
		}, 5000);
	}, []);

	const handleSubmit = () => {
		const body = {
			user_name: username,
			password: password,
		};
		axios
			.post('http://localhost:8000/account/login', body)
			.catch(function (error) {
				if (error.response.status == 400) {
					return getError('Wrong password or user');
					// Show the error on the frontend
				}
			})
			.then(response => {
				if (response.statusText) {
					navigate('/dashboard');
				} else {
					console.log(response.statusText);
				}
			});
	};

	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Typography variant='h4' component='h4'>
					Login
				</Typography>
			</Grid>
			<Grid item xs={3}>
				{error != '' ? (
					<Alert severity='error' align='center'>
						{error}
					</Alert>
				) : null}
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
					value='Login'
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					onClick={handleSubmit}
				>
					Sign In
				</Button>
			</Grid>
		</Grid>
	);
}
