import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Grid, TextField, Button, MenuItem, Stack } from '@mui/material';
export default function Item() {
	const [quantity, setQuantity] = useState('');
	const [name, setName] = useState('');
	const [expiration, setExpiration] = useState('');
	const { authTokens } = useContext(AuthContext);
	const [weight, setWeight] = useState('lb');
	const weights = [
		{
			value: 'lbs',
			label: 'lbs',
		},
		{
			value: 'oz',
			label: 'oz',
		},
		{
			value: 'fl. oz',
			label: 'fl. oz',
		},
		{
			value: 'c',
			label: 'c',
		},
		{
			value: 'tbsp',
			label: 'tbsp',
		},
		{
			value: 'tsp',
			label: 'tsp',
		},
		{
			value: 'qt',
			label: 'qt',
		},
	];

	const handleSubmit = async () => {
		const response = await fetch('http://127.0.0.1:8000/items/createItem', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				quantity: quantity + weight,
				name: name,
				expiration: expiration,
			}),
		});

		const data = await response.json();

		if (response.status === 201) {
			console.log('Added');
		} else {
			console.log('Bad Request');
		}
	};

	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					label='Item'
					placeholder='Enter Item'
					value={name}
					onChange={e => setName(e.target.value)}
				/>
			</Grid>
			<Grid item xs={12}>
				<Stack direction='row' justifyContent='center' alignItems='stretch'>
					<Grid item xs={2}>
						<TextField
							required
							margin='normal'
							label='Quantity'
							value={quantity}
							onChange={e => setQuantity(e.target.value)}
						></TextField>
					</Grid>
					<Grid item xs={1}>
						<TextField
							select
							required
							margin='normal'
							helperText='Weight'
							value={weight}
							onChange={e => setWeight(e.target.value)}
						>
							{weights.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
				</Stack>
			</Grid>
			<Grid item xs={12}>
				<TextField
					margin='normal'
					required
					placeholder='Date'
					value={expiration}
					type='date'
					onChange={e => setExpiration(e.target.value)}
				/>
			</Grid>
			<Grid item xs={12}>
				<Button
					type='submit'
					value='Create'
					variant='contained'
					sx={{ mt: 3, mb: 2 }}
					onClick={handleSubmit}
				>
					Add Item
				</Button>
			</Grid>
		</Grid>
	);
}
