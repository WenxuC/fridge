import React, { useState } from 'react';
import {
	Avatar,
	Button,
	CssBaseline,
	Link,
	Grid,
	Box,
	TextField,
	Typography,
	Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Login() {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = () => {
		const body = {
			user_name: username,
			password: password,
		};
		axios.post('http://localhost:8000/account/login', body).then(response => {
			if (response.statusText) {
				navigate('/dashboard');
			} else {
				console.log(response.statusText);
			}
		});
	};

	return (
		<Grid container spacing={2} align='center'>
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
