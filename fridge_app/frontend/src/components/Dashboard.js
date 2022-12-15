import React, { useContext, useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import List from '@mui/material/List';
import AuthContext from '../context/AuthContext';

export default function Dashboard() {
	const { user, logoutUser, authTokens } = useContext(AuthContext);
	const [items, setItems] = useState([]);

	useEffect(() => {
		getItems();
	}, []);

	const getItems = async () => {
		const response = await fetch('http://127.0.0.1:8000/items/getItems', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
		});

		const data = await response.json();

		if (response.status === 200) {
			setItems(data);
		} else if (response.statusText === 'Unauthorized') {
			logoutUser();
		}
	};
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
				{items.map(item => (
					<List key={item.id}>
						{item.name} - {item.quantity}
					</List>
				))}
			</Grid>
		</Grid>
	);
}
