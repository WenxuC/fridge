import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import Cards from './Cards';
import { Grid, Stack } from '@mui/material';

const URL = config.url;

export default function History({ like, setLike }) {
	const { authTokens, logoutUser, user } = useContext(AuthContext);
	const [history, setHistory] = useState([]);
	const [updateList, setUpdateList] = useState([false]);

	useEffect(() => {
		const getHistory = async () => {
			const response = await fetch(`${URL}api/getHistory`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
			});

			const data = await response.json();

			if (response.status === 200) {
				setHistory(data);
			} else if (response.status === 404) {
				setHistory([]);
			} else if (response.status == 401) {
				logoutUser();
			}
		};

		if (
			localStorage.getItem('ingredients') != undefined &&
			user.username != 'guest'
		) {
			const storage = JSON.parse(localStorage.getItem('ingredients'));
			storage['name'].map(async item => {
				const response = await fetch(`${URL}items/createItem`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + String(authTokens.access),
					},
					body: JSON.stringify({
						name: item.name,
					}),
				});
			});
			localStorage.removeItem('ingredients');
		}
		getHistory();
		if (updateList) {
			setUpdateList(false);
		}
	}, [updateList]);

	return (
		<Grid container spacing={2} justifyContent='center' wrap='wrap'>
			{history.map((history, index) => (
				<Grid item key={index}>
					<Stack direction={'row'}>
						<Cards item={history} index={index} setLike={setLike} />
					</Stack>
				</Grid>
			))}
		</Grid>
	);
}
