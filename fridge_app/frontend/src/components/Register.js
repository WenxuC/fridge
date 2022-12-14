import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
	const navigate = useNavigate();
	const [username, getUserName] = useState('');
	const [password, getPassword] = useState('');
	const [email, getEmail] = useState('');
	const [error, getError] = useState('');

	useEffect(() => {
		setTimeout(() => {
			getError('');
		}, 5000);
	}, []);

	const handleSubmit = () => {
		const body = {
			username: username,
			password: password,
			email: email,
		};
		axios
			.post('http://127.0.0.1:8000/account/register', body)
			.catch(function (error) {
				console.log('error', error.response);
				if (error.response.status === 400) {
					return getError(error.response.status);
				}
			})
			.then(response => {
				if (response.status === 201) {
					navigate('/login');
				}
			});
	};

	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Typography variant='h4' component='h4'>
					Register
				</Typography>
			</Grid>
			<Grid item xs={12}>
				{error !== '' ? <Alert severity='error'>{error}</Alert> : null}
			</Grid>

			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					label='User Name'
					placeholder='User Name'
					value={username}
					onChange={e => getUserName(e.target.value)}
					autoFocus
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					label='Email'
					placeholder='Email'
					value={email}
					onChange={e => getEmail(e.target.value)}
					autoFocus
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					label='Password'
					value={password}
					onChange={e => getPassword(e.target.value)}
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
