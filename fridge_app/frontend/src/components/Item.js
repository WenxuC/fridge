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
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CircularProgress from '@mui/material/CircularProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
const URL = config.url;

export default function Items({ setItems, items }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [name, setName] = useState('');
	const [updateList, setUpdateList] = useState(false);
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState('');
	const [results, setResults] = useState([]);
	const [openSearch, setOpenSearch] = useState(false);
	const [inputValue, setInputValue] = useState('');
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
	}, [updateList, open, alert, results]);

	const handleClose = () => {
		setOpen(false);
		setName('');
		setAlert('');
	};

	const handleDelete = async e => {
		const name = e.target.value;
		const response = await fetch(`${URL}items/deleteItem`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				name: name,
			}),
		});

		if (response.status === 200) {
			setUpdateList(true);
		} else if (response.statusText === 'Unauthorized') {
			logoutUser();
		}
	};

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
	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Stack direction='row' justifyContent='center'>
					<Grid item xs={3} md={3} lg={3}>
						{alert !== '' ? <Alert severity='error'>{alert}</Alert> : null}
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
							<Button onClick={handleClose} color='error'>
								Clear
							</Button>
							<Button onClick={handleAddItem}>Add Item</Button>
						</Stack>
					</Grid>

					{items.length > 0 ? (
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
							{items.map(item => (
								<ListItem
									key={item.name}
									secondaryAction={
										<Button
											value={item.name}
											color='error'
											onClick={handleDelete}
											endIcon={<DeleteRoundedIcon />}
										></Button>
									}
								>
									<ListItemText primary={item.name} />
								</ListItem>
							))}
						</List>
					) : (
						<Typography variant='h6'>Your Pantry Is Empty</Typography>
					)}
				</Stack>
			</Grid>
		</Grid>
	);
}
