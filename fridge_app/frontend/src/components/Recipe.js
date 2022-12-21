import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	Button,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	ListSubheader,
	IconButton,
	Checkbox,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
export default function Recipe({ items, setLike }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [recipes, setRecipes] = useState([]);

	const handleOnClick = async () => {
		const response = await fetch('http://127.0.0.1:8000/api/getRecipe', {
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
		} else if (response.statusText === 'Unauthorized') {
			logoutUser();
		}
	};

	const handleChange = async e => {
		const value = JSON.parse(e.target.value);
		setLike(value);
		if (e.target.checked) {
			await fetch('http://127.0.0.1:8000/api/saveRecipe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
				body: JSON.stringify({
					id: value.id,
					title: value.title,
					source: value.source,
					image: value.image,
				}),
			});
		} else {
			await fetch('http://127.0.0.1:8000/api/deleteRecipe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
				body: JSON.stringify({
					id: value.id,
				}),
			});
		}
	};

	return (
		<Grid container space={5} align='center'>
			<Grid item xs={12}>
				<Button variant='contained' onClick={handleOnClick}>
					Search Recipe
				</Button>
			</Grid>
			<Grid item xs={12}>
				<ImageList sx={{ width: 500, height: 450 }}>
					<ImageListItem key='Subheader' cols={2}>
						<ListSubheader component='div'>Recipes</ListSubheader>
					</ImageListItem>
					{recipes.map(item => (
						<ImageListItem key={item.id}>
							<img src={item.image} alt={item.title} loading='lazy' />
							<ImageListItemBar
								title={item.title}
								actionIcon={
									<IconButton
										sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
										aria-label={`info about ${item.title}`}
										href={item.source}
										target='_blank'
									>
										<InfoIcon />
										<Checkbox
											icon={<FavoriteBorder />}
											checkedIcon={<Favorite />}
											onChange={handleChange}
											value={JSON.stringify({
												id: item.id,
												title: item.title,
												image: item.image,
												source: item.source,
											})}
										/>
									</IconButton>
								}
							/>
						</ImageListItem>
					))}
				</ImageList>
			</Grid>
		</Grid>
	);
}
