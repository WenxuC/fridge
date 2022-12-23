import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { Grid, Typography, List } from '@mui/material';

export default function History({ like }) {
	const { authTokens } = useContext(AuthContext);
	const [history, setHistory] = useState([]);

	useEffect(() => {
		const getHistory = async () => {
			const response = await fetch('http://127.0.0.1:8000/api/getHistory', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
			});

			const data = await response.json();

			if (response.status === 200) {
				setHistory(data);
			} else {
				setHistory([]);
			}
		};
		getHistory();
	}, [like]);

	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Typography variant='contained'>History</Typography>
			</Grid>
			<Grid item xs={12}>
				{history.map(history => (
					<List key={history.id}>{history.title}</List>
				))}
			</Grid>
		</Grid>
	);
}
