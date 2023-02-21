import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import Cards from './Cards';
import Modals from './Modals';

import { Grid, Button, Stack } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const URL = config.url;

export default function Recipe({ setLike, setModal, modal }) {
	const { authTokens, user } = useContext(AuthContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);

	useEffect(() => {
		if (user.username == 'guest') {
			const storage = JSON.parse(localStorage.getItem('ingredients'));
			if (storage != null) {
				setItems(storage['name']);
			}
		} else {
			const getItems = async () => {
				const response = await fetch(`${URL}items/getItems`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + String(authTokens.access),
					},
				});

				const data = await response.json();
				setItems(data);
			};
			getItems();
		}
	}, []);

	const handleOnClick = async () => {
		setLoading(true);
		const response = await fetch(`${URL}api/getRecipe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				ingredients: items,
			}),
		});

		const data = await response.json();
		if (response.status === 201) {
			setRecipes(data);
			setLoading(false);
		} else {
			alert('No recipes found. Please try again.');
			setLoading(false);
		}
	};

	return (
		<Grid container spacing={4} align='center' justifyContent={'center'}>
			<Grid item xs={6}>
				<Button variant='contained' onClick={handleOnClick}>
					Search Recipes
				</Button>
			</Grid>
			<Grid item xs={12}>
				{loading ? (
					<CircularProgress />
				) : (
					<Grid container spacing={2} justifyContent='center' wrap='wrap'>
						{recipes.map((item, index) => (
							<Grid item key={index}>
								<Stack direction={'row'}>
									<Cards
										item={item}
										index={index}
										setLike={setLike}
										setModal={setModal}
									/>
								</Stack>
							</Grid>
						))}
					</Grid>
				)}
			</Grid>
			<Modals modal={modal} setModal={setModal} />
		</Grid>
	);
}
