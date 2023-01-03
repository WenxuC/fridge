import React, { useState, useContext, useEffect } from 'react';
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
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Alert,
	AlertTitle,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import CircularProgress from '@mui/material/CircularProgress';
import { maxWidth } from '@mui/system';

export default function Recipe({ setLike }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [expanded, setExpanded] = useState(-1);
	const [items, setItems] = useState([]);
	const [summary, setSummary] = useState([]);
	const [cuisine, setCuisine] = useState('');
	const [intolerance, setIntolerance] = useState([]);
	const [type, setType] = useState('');
	const [diet, setDiet] = useState('');
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState(false);

	useEffect(() => {
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
		getItems();
	}, [alert]);

	const intolerances = [
		'Dairy',
		'Egg',
		'Gluten',
		'Grain',
		'Peanut',
		'Seafood',
		'Sesame',
		'Shellfish',
		'Soy',
		'Sulfite',
		'Tree Nut',
		'Wheat',
	];
	const handleSearch = async () => {
		setLoading(true);
		const response = await fetch('http://127.0.0.1:8000/api/advancedRecipe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				ingredients: items,
				intolerance: intolerance,
				type: type,
				cuisine: cuisine,
				diet: diet,
			}),
		});
		const data = await response.json();
		if (response.status === 200) {
			setOpen(false);
			setAlert(false);
			setRecipes(data);
			setLoading(false);
		} else if (response.status === 400) {
			setAlert(true);
			setLoading(false);
			setRecipes([]);
		}
	};
	const handleSelect = event => {
		const {
			target: { value },
		} = event;
		setIntolerance(typeof value === 'string' ? value.split(',') : value);
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
					favorite: true,
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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	return (
		<Grid container spacing={4} align='center'>
			<Grid item xs={12}>
				<Button variant='contained' onClick={handleClickOpen}>
					Advanced Search
				</Button>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Advanced Search</DialogTitle>
					{alert ? (
						<Alert severity='error'>
							<AlertTitle>Error</AlertTitle>
							No recipes found, Try again with other options.
						</Alert>
					) : null}

					<DialogContent>
						<Grid container align='center'>
							<Stack
								direction='row'
								justifyContent='center'
								alignItems='stretch'
							>
								<Grid item xs={5}>
									<FormControl sx={{ m: 1, minWidth: 200 }}>
										<InputLabel>Cuisine</InputLabel>
										<Select
											value={cuisine}
											label='Cuisine'
											onChange={e => setCuisine(e.target.value)}
										>
											<MenuItem value=''>
												<em>None</em>
											</MenuItem>
											<MenuItem value={'African'}>African</MenuItem>
											<MenuItem value={'American'}>American</MenuItem>
											<MenuItem value={'British'}>British</MenuItem>
											<MenuItem value={'Cajun'}>Cajun</MenuItem>
											<MenuItem value={'Caribbean'}>Caribbean</MenuItem>
											<MenuItem value={'Chinese'}>Chinese</MenuItem>
										</Select>
									</FormControl>
									<FormControl sx={{ m: 1, minWidth: 200 }}>
										<InputLabel>Type</InputLabel>
										<Select
											value={type}
											label='Type'
											onChange={e => setType(e.target.value)}
										>
											<MenuItem value=''>
												<em>None</em>
											</MenuItem>
											<MenuItem value={'Breakfast'}>Breakfast</MenuItem>
											<MenuItem value={'Lunch'}>Lunch</MenuItem>
											<MenuItem value={'Dinner'}>Dinner</MenuItem>
										</Select>
									</FormControl>
									<FormControl sx={{ m: 1, minWidth: 200 }}>
										<InputLabel>Diet</InputLabel>
										<Select
											value={diet}
											label='Diet'
											onChange={e => setDiet(e.target.value)}
										>
											<MenuItem value=''>
												<em>None</em>
											</MenuItem>
											<MenuItem value={'Vegetarian'}>Vegetarian</MenuItem>
											<MenuItem value={'Vegan'}>Vegan</MenuItem>
											<MenuItem value={'Ketogenic'}>Ketogenic</MenuItem>
											<MenuItem value={'Gluten Free'}>Gluten Free</MenuItem>
											<MenuItem value={'Pescetarian'}>Pescetarian</MenuItem>
										</Select>
									</FormControl>
									<FormControl sx={{ m: 1, minWidth: 200, maxWidth: 200 }}>
										<InputLabel>Intolerance</InputLabel>
										<Select
											value={intolerance}
											label='Intolerance'
											onChange={handleSelect}
											multiple
										>
											{intolerances.map(name => (
												<MenuItem
													key={name}
													value={name}
													// style={getStyles(name, personName, theme)}
												>
													{name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</Grid>
							</Stack>
						</Grid>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={handleSearch}>Search</Button>
					</DialogActions>
				</Dialog>
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
													id: item.id,
													title: item.title,
													image: item.image,
													source: item.source,
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
