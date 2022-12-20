import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	Button,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	ListSubheader,
	IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
export default function Recipe({ items }) {
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
