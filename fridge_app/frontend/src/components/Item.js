import React, { useState, useContext, useEffect, Fragment } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import Alerts from './Alerts';

import {
	TextField,
	Button,
	Stack,
	Typography,
	List,
	ListItem,
	ListItemText,
	Alert,
	Autocomplete,
	InputAdornment,
	Box,
	Paper,
	Snackbar,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CircularProgress from '@mui/material/CircularProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const URL = config.url;

export default function Items() {
	const { authTokens, logoutUser, user } = useContext(AuthContext);
	const [name, setName] = useState('');
	const [open, setOpen] = useState(false);
	const [updateList, setUpdateList] = useState(false);
	const [alert, setAlert] = useState('');
	const [results, setResults] = useState([]);
	const [items, setItems] = useState([]);
	const [openSearch, setOpenSearch] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [edit, setEdit] = useState(false);
	const loading = openSearch && results.length === 0;

	useEffect(() => {
		if (!openSearch) {
			setResults([]);
		}
	}, [openSearch]);

	useEffect(() => {
		let active = true;

		if (active) {
			setResults([...results]);
		}
		if (!loading) {
			return undefined;
		}
		return () => {
			active = false;
		};
	}, [loading]);

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

		if (updateList) {
			setUpdateList(false);
		}
	}, [updateList]);

	function handleDeleteItem(ingredient) {
		if (user.username == 'guest') {
			const index = items.findIndex(item => item.name == ingredient);
			items.splice(index, 1);
			localStorage.setItem('ingredients', JSON.stringify({ name: items }));
			if (items.length == 0) {
				setEdit(false);
			}
			setUpdateList(true);
		} else {
			const handleDelete = async () => {
				const response = await fetch(`${URL}items/deleteItem`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + String(authTokens.access),
					},
					body: JSON.stringify({
						name: ingredient,
					}),
				});

				if (response.status === 200) {
					setUpdateList(true);
				} else if (response.status == 401) {
					logoutUser();
				}
			};
			handleDelete();
		}
	}

	const handleAddItem = async () => {
		if (user.username == 'guest') {
			if (localStorage.getItem('ingredients') == undefined) {
				const dict = { name: [] };
				localStorage.setItem('ingredients', JSON.stringify(dict));
			}
			if (name.name != undefined) {
				const storage = JSON.parse(localStorage.getItem('ingredients'));
				const result = storage['name'].find(item => item.name == name.name);
				if (result != null) {
					setOpen(true);
					setAlert('Item already exists');
				} else {
					storage['name'].push({
						id: storage['name'].length,
						name: name.name,
						user: 'guest',
					});
					localStorage.setItem('ingredients', JSON.stringify(storage));
					setItems(storage['name']);
					setUpdateList(true);
					setOpen(false);
					setName('');
					setAlert('');
				}
			} else if (name.name == undefined) {
				setOpen(true);
				setAlert('Please enter an item');
			}
		} else {
			const response = await fetch(`${URL}items/createItem`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
				body: JSON.stringify({
					name: name.name,
				}),
			});

			if (response.status === 201) {
				setUpdateList(true);
				setOpen(false);
				setName('');
				setAlert('');
			} else if (response.status === 400) {
				setOpen(true);
				setAlert('Item already exists');
			} else if (response.status === 405) {
				setOpen(true);
				setAlert('Please enter an item');
			}
		}
	};

	const handleSearch = async e => {
		if (e.key === 'Enter') {
			const response = await fetch(`${URL}items/autocompleteItem`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
				body: JSON.stringify({
					name: inputValue,
				}),
			});
			const data = await response.json();
			if (response.status === 200) {
				setResults(data);
			} else if (response.status === 400) {
				setOpen(true);
				setAlert('No search results');
			}
		}
	};

	const handleEdit = () => {
		if (edit) {
			setEdit(false);
		} else {
			setEdit(true);
		}
	};
	return (
		<div>
			<Alerts setOpen={setOpen} open={open} alert={alert} />
			<Stack direction='row' justifyContent={'center'}>
				<Autocomplete
					onChange={(event, newValue) => {
						setName(newValue);
					}}
					value={name}
					onInputChange={(e, newInputValue) => {
						setInputValue(newInputValue);
					}}
					inputValue={inputValue}
					open={openSearch}
					isOptionEqualToValue={(option, value) => {
						option.name === value.name;
					}}
					onOpen={() => {
						setOpenSearch(true);
					}}
					onClose={() => {
						setOpenSearch(false);
					}}
					getOptionLabel={results => (results.name ? results.name : '')}
					options={results}
					loading={loading}
					disableClearable
					forcePopupIcon={false}
					sx={{ mr: 2, mt: 5, minWidth: 250, maxWidth: 360 }}
					renderInput={params => (
						<TextField
							{...params}
							InputProps={{
								...params.InputProps,
								startAdornment: (
									<InputAdornment position='start'>
										<SearchRoundedIcon />
									</InputAdornment>
								),
								endAdornment: (
									<Fragment>
										{loading ? (
											<CircularProgress color='inherit' size={20} />
										) : null}
										{params.InputProps.endAdornment}
									</Fragment>
								),
							}}
							label='Press enter to search'
							onKeyDown={handleSearch}
						/>
					)}
				/>

				<Button
					variant='contained'
					onClick={handleAddItem}
					sx={{ mt: 5, maxHeight: 55 }}
				>
					Add Item
				</Button>
			</Stack>
			<Stack direction='row' justifyContent={'center'}>
				{items.length > 0 ? (
					<Box sx={{ minWidth: 360, mt: 2, maxWidth: 450 }}>
						<Paper elevation={12}>
							<List
								sx={{
									width: '100%',
									minWidth: 360,
									bgcolor: 'background.paper',
									position: 'flex',
									overflow: 'auto',
									maxHeight: 400,
									'& ul': { padding: 0 },
								}}
							>
								{items.map(items =>
									edit ? (
										<ListItem
											key={items.name}
											secondaryAction={
												<Button
													value={items.name}
													color='error'
													onClick={() => handleDeleteItem(items.name)}
													endIcon={<DeleteRoundedIcon />}
												></Button>
											}
										>
											<ListItemText primary={items.name} />
										</ListItem>
									) : (
										<ListItem key={items.name}>
											<ListItemText primary={items.name} />
										</ListItem>
									)
								)}
							</List>
							<Box display='flex' justifyContent='center'>
								{edit ? (
									<Button
										variant='contained'
										color='secondary'
										onClick={handleEdit}
										fullWidth
									>
										Done
									</Button>
								) : (
									<Button variant='contained' onClick={handleEdit} fullWidth>
										Edit
									</Button>
								)}
							</Box>
						</Paper>
					</Box>
				) : (
					<Typography variant='h6' sx={{ mt: 2 }}>
						Your Pantry Is Empty
					</Typography>
				)}
			</Stack>
		</div>
	);
}
