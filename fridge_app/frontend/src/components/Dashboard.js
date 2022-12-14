import React, { useContext } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
	const navigate = useNavigate();
	let { user, logoutUser } = useContext(AuthContext);
	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Typography>Dashboard: {user.username}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button
					type='submit'
					value='Logout'
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					onClick={logoutUser}
				>
					Logout
				</Button>
			</Grid>
		</Grid>
	);
}
