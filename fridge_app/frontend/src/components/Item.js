import React, { useState, useContext, useEffect, Fragment } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import {
	Grid,
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
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CircularProgress from '@mui/material/CircularProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

const URL = config.url;

export default function Items() {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [name, setName] = useState('');
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

		if (updateList) {
			setUpdateList(false);
		}
	}, [updateList]);

	const handleClose = () => {
		setOpen(false);
		setName('');
		setAlert('');
	};

	function handleDeleteItem(ingredient) {
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

	const handleAddItem = async () => {
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
			setAlert('Item already exists');
		} else if (response.status === 405) {
			setAlert('Please enter an item');
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
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Stack direction='row' justifyContent='center'>
					<Grid item xs={3} md={3} lg={3}>
						{alert !== '' ? (
							<Alert sx={{ m: 2 }} severity='error'>
								{alert}
							</Alert>
						) : null}

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
							sx={{ m: 2 }}
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

						<Stack direction='row' justifyContent='flex-start'>
							<Button
								variant='contained'
								onClick={handleAddItem}
								sx={{ ml: 2 }}
							>
								Add Item
							</Button>
						</Stack>
					</Grid>
					{items.length > 0 ? (
						<Box sx={{ minWidth: 300, mt: 2 }}>
							<Paper elevation={12}>
								<List
									sx={{
										width: '100%',
										maxWidth: 360,
										bgcolor: 'background.paper',
										position: 'relative',
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
						<Typography variant='h6'>Your Pantry Is Empty</Typography>
					)}
				</Stack>
			</Grid>
		</Grid>
	);
}
