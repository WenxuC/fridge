import React, { useContext } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import AuthContext from '../context/AuthContext';
import Item from './Item';
export default function Dashboard() {
	const { user, logoutUser } = useContext(AuthContext);

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
			<Grid item xs={12}>
				<Item />
			</Grid>
		</Grid>
	);
}
