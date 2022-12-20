import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	TextField,
	Button,
	MenuItem,
	Stack,
	Typography,
	List,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
export default function Item({ setItems, items }) {
	const { authTokens, logoutUser } = useContext(AuthContext);
	const [name, setName] = useState('');
	const [updateList, setUpdateList] = useState(false);
	const [edit, setEdit] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		getItems();
		if (updateList) {
			setUpdateList(false);
		}
	}, [updateList, edit, open]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setName('');
	};

	const handleDelete = async e => {
		const id = e.target.value;
		const response = await fetch('http://127.0.0.1:8000/items/deleteItem', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				id: id,
			}),
		});

		if (response.status === 200) {
			setUpdateList(true);
		} else if (response.statusText === 'Unauthorized') {
			logoutUser();
		}
	};
	// const handleEdit = async e => {
	// 	const id = e.target.value;
	// 	const response = await fetch('http://127.0.0.1:8000/items/updateItem', {
	// 		method: 'PUT',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			Authorization: 'Bearer ' + String(authTokens.access),
	// 		},
	// 		body: JSON.stringify({
	// 			id: id,
	// 		}),
	// 	});

	// 	if (response.status === 200) {
	// 		setUpdateList(true);
	// 	} else if (response.statusText === 'Unauthorized') {
	// 		logoutUser();
	// 	}
	// };
	const updateEdit = () => {
		if (edit) {
			setEdit(false);
		} else {
			setEdit(true);
		}
	};
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

	const handleSubmit = async () => {
		const response = await fetch('http://127.0.0.1:8000/items/createItem', {
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
		} else {
			console.log('Bad Request');
		}
	};
	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<Typography>---Ingredients---</Typography>
				<Typography>
					{edit ? (
						<Button type='submit' onClick={updateEdit}>
							Done
						</Button>
					) : (
						<Button type='submit' onClick={updateEdit}>
							Edit
						</Button>
					)}
				</Typography>
				{edit
					? items.map(item => (
							<List key={item.id}>
								{item.name}
								<Button value={item.id} onClick={handleDelete}>
									X
								</Button>
							</List>
					  ))
					: items.map(item => <List key={item.id}>{item.name}</List>)}
			</Grid>

			<Grid item xs={12}>
				<Button variant='contained' onClick={handleClickOpen}>
					Add Item
				</Button>
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Add Item</DialogTitle>
					<DialogContent>
						<Grid container spacing={1} align='center'>
							<Stack
								direction='row'
								justifyContent='center'
								alignItems='stretch'
							>
								<Grid item xs={5}>
									<TextField
										margin='normal'
										required
										label='Item'
										placeholder='Item name'
										value={name}
										onChange={e => setName(e.target.value)}
									/>
								</Grid>
							</Stack>
						</Grid>
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
