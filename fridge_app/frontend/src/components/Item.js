import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	TextField,
	Button,
	Stack,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	ListItemText,
	Alert,
} from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
const URL = config.url;

export default function Items({ setItems, items }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [name, setName] = useState('');
	const [updateList, setUpdateList] = useState(false);
	const [edit, setEdit] = useState(false);
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState(false);
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
	}, [updateList, edit, open, alert]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setName('');
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

	const updateEdit = () => {
		if (edit) {
			setEdit(false);
		} else {
			setEdit(true);
		}
	};

	const handleSubmit = async () => {
		const response = await fetch(`${URL}items/createItem`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				name: name,
			}),
		});
		if (response.status === 201) {
			setUpdateList(true);
			setOpen(false);
			setName('');
			setAlert(false);
		} else if (response.status === 400) {
			setAlert(true);
		}
	};
	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				{items.length > 0 ? (
					<List
						sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
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
									>
										Trash
									</Button>
								}
							>
								{' '}
								<ListItemText primary={item.name} />
							</ListItem>
						))}
					</List>
				) : (
					<Typography variant='h6'>Your Pantry Is Empty</Typography>
				)}
			</Grid>

			<Grid item xs={12}>
				<Button variant='contained' onClick={handleClickOpen}>
					Add Item
				</Button>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Add Item</DialogTitle>
					{alert ? <Alert severity='error'>Item already exists.</Alert> : null}
					<DialogContent
						sx={{
							width: 400,
							height: 100,
						}}
					>
						<Stack direction='row' justifyContent='center'>
							<TextField
								margin='normal'
								required
								label='Item'
								placeholder='Item name'
								value={name}
								sx={{ minWidth: 350 }}
								onChange={e => setName(e.target.value)}
							/>
						</Stack>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={handleSubmit}>Add Item</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		</Grid>
	);
}
