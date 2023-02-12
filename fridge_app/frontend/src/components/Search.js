import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import { cuisine_list, meal, diets, intolerances } from './dictionary/Filter';
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
	Autocomplete,
	TextField,
	Box,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const URL = config.url;

export default function Recipe({ setLike }) {
	const { authTokens } = useContext(AuthContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [items, setItems] = useState([]);
	const [cuisine, setCuisine] = useState('');
	const [intolerance, setIntolerance] = useState([]);
	const [type, setType] = useState('');
	const [diet, setDiet] = useState('');
	const [open, setOpen] = useState(false);
	const [alerts, setAlerts] = useState(false);

	const defaultPropsCuisine = {
		options: cuisine_list,
		getOptionLabel: option => option,
	};
	const defaultPropsMeal = {
		options: meal,
		getOptionLabel: option => option,
	};

	const defaultPropsDiet = {
		options: diets,
		getOptionLabel: option => option,
	};

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
						<Stack
							direction='column'
							alignItems='center'
							sx={{ minWidth: 360, maxWidth: 400 }}
						>
							<Autocomplete
								{...defaultPropsCuisine}
								clearOnEscape
								id='cuisine-list'
								value={cuisine}
								onChange={(event, newValue) => {
									setCuisine(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										label='Cuisine'
										sx={{ m: 1, width: '40ch' }}
									/>
								)}
							/>

							<Autocomplete
								{...defaultPropsMeal}
								clearOnEscape
								id='meal-list'
								value={type}
								onChange={(event, newValue) => {
									setType(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										label='Meal'
										sx={{ m: 1, width: '40ch' }}
									/>
								)}
							/>

							<Autocomplete
								{...defaultPropsDiet}
								clearOnEscape
								id='diet-list'
								value={diet}
								onChange={(event, newValue) => {
									setDiet(newValue);
								}}
								renderInput={params => (
									<TextField
										{...params}
										label='Diet'
										sx={{ m: 1, width: '40ch' }}
									/>
								)}
							/>
							<FormControl sx={{ m: 1, width: '40ch' }}>
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
						</Stack>
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
					<Grid container spacing={2} justifyContent='center' wrap='wrap'>
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
