import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import Cards from './Cards';
import {
	Grid,
	Button,
	Stack,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Alert,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const URL = config.url;

export default function Recipe({ setLike }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [cuisine, setCuisine] = useState('');
	const [intolerance, setIntolerance] = useState([]);
	const [type, setType] = useState('');
	const [diet, setDiet] = useState('');
	const [open, setOpen] = useState(false);
	const [alerts, setAlerts] = useState(false);

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
	}, [alerts]);

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
		const response = await fetch(`${URL}api/advancedRecipe`, {
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
			setAlerts(false);
			setRecipes(data);
			setLoading(false);
		} else {
			console.log(response.status);
			setAlerts(true);
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

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setAlerts(false);
	};
	return (
		<Grid container spacing={4} align='center' justifyContent={'center'}>
			<Grid item xs={6}>
				<Button variant='contained' onClick={handleClickOpen}>
					Advanced Search
				</Button>

				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Advanced Search</DialogTitle>
					{alerts ? (
						<Alert severity='error'>
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
												<MenuItem key={name} value={name}>
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
					<Grid
						container
						spacing={2}
						justifyContent='center'
						wrap='wrap-reverse'
					>
						{recipes.map((item, index) => (
							<Grid item key={index}>
								<Stack direction={'row'}></Stack>
								<Cards item={item} index={index} setLike={setLike} />
							</Grid>
						))}
					</Grid>
				)}
			</Grid>
		</Grid>
	);
}
