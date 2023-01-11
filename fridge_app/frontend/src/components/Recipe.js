import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	Button,
	IconButton,
	CardHeader,
	Card,
	CardMedia,
	CardContent,
	Typography,
	CardActions,
	Collapse,
	Stack,
	Checkbox,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import CircularProgress from '@mui/material/CircularProgress';

const URL = config.url;

export default function Recipe({ setLike }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [expanded, setExpanded] = useState(-1);
	const [items, setItems] = useState([]);
	const [summary, setSummary] = useState([]);

	useEffect(() => {
		const getItems = async () => {
			const response = await fetch(`${URL}items/getItems`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
			});
			const data = await response.json();

			if (response.status === 200) {
				setItems(data);
			} else if (response.status === 400) {
				alert('Please add at least one item in your pantry.');
			}
		};
		getItems();
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

	const handleChange = async e => {
		const value = JSON.parse(e.target.value);
		setLike(value);
		if (e.target.checked) {
			await fetch(`${URL}api/saveRecipe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
				body: JSON.stringify({
					recipeID: value.id,
					title: value.title,
					source: value.source,
					summary: value.summary,
					image: value.image,
					favorite: true,
				}),
			});
		} else {
			await fetch(`${URL}api/deleteRecipe`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
				body: JSON.stringify({
					recipeID: value.id,
				}),
			});
		}
	};
	let stringtoHTML = function (str) {
		let dom = document.createElement('div');
		dom.innerHTML = str;

		return dom;
	};

	const handleHTML = e => {
		let data = [];
		let htmlBody = stringtoHTML(e);
		data.push(htmlBody);
		return data;
	};
	const handleExpandClick = i => {
		setExpanded(expanded === i ? -1 : i);
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
					<Grid container spacing={4}>
						{recipes.map((item, index) => (
							<Grid item key={index} xs={12} sm={5} md={3}>
								<Stack direction={'row'}>
									<Card
										sx={{
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
										}}
									>
										<CardHeader title={item.title} />
										<CardMedia
											component='img'
											height='194'
											image={item.image}
										/>
										<CardContent>
											<Typography variant='body2' color='text.secondary'>
												This impressive paella is a perfect party dish and a fun
												meal to cook together with your guests. Add 1 cup of
												frozen peas along with the mussels, if you like.
											</Typography>
										</CardContent>
										<CardActions disableSpacing>
											<Button
												href={item.source}
												target='_blank'
												endIcon={<InsertLinkRoundedIcon />}
											>
												Link
											</Button>
											<Checkbox
												defaultChecked={item.favorite}
												icon={<FavoriteBorder />}
												checkedIcon={<Favorite />}
												onChange={handleChange}
												value={JSON.stringify({
													id: item.recipeID,
													title: item.title,
													image: item.image,
													source: item.source,
													summary: item.summary,
												})}
											/>
											<IconButton
												onClick={() => handleExpandClick(index)}
												aria-expanded={expanded === index}
											>
												Recipe
												{expanded === index ? (
													<ExpandLessRoundedIcon />
												) : (
													<ExpandMoreRoundedIcon />
												)}
											</IconButton>
										</CardActions>
										<Collapse
											in={expanded === index}
											timeout='auto'
											unmountOnExit
											addEndListener={() => {
												setSummary(handleHTML(item.summary));
											}}
										>
											<CardContent>
												<div>{summary[0] ? summary[0].innerText : null}</div>
											</CardContent>
										</Collapse>
									</Card>
								</Stack>
							</Grid>
						))}
					</Grid>
				)}
			</Grid>
		</Grid>
	);
}
