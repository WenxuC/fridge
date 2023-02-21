import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { config } from './Constants';
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
	Chip,
	Divider,
	Paper,
} from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

const URL = config.url;

export default function Cards({ item, index, setLike, setModal }) {
	const { authTokens, user } = useContext(AuthContext);
	const [expanded, setExpanded] = useState(-1);

	const handleChange = async e => {
		const value = JSON.parse(e.target.value);
		if (user.username == 'guest') {
			setModal(true);
		} else {
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
						image: value.image,
						missing_ingredient_list: value.missing_ingredient_list,
						time: value.time,
						serving: value.serving,
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
		}
	};

	const handleExpandClick = i => {
		setExpanded(expanded === i ? -1 : i);
	};
	return (
		<Paper elevation={12}>
			<Card
				sx={{
					maxWidth: 300,

					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
				// style={{ backgroundColor: '#c8e6c9' }}
			>
				<CardHeader
					title={<Typography variant='subtitle2'>{item.title}</Typography>}
				/>
				<CardMedia component='img' height='194' image={item.image} />
				<CardContent>
					<Stack direction='row' spacing={1}>
						<Chip
							icon={<AccessTimeRoundedIcon />}
							label={`Cook Time: ${item.time}`}
							color='primary'
						/>
						<Chip
							icon={<PersonRoundedIcon />}
							label={`Servings: ${item.serving}`}
							color='primary'
						/>
					</Stack>
				</CardContent>
				<CardActions disableSpacing>
					<Checkbox
						defaultChecked={item.favorite}
						icon={<FavoriteBorder />}
						checkedIcon={
							user.username == 'guest' ? (
								<Favorite style={{ color: 'grey' }} />
							) : (
								<Favorite style={{ color: 'red' }} />
							)
						}
						onChange={handleChange}
						value={JSON.stringify({
							id: item.recipeID,
							title: item.title,
							image: item.image,
							source: item.source,
							missing_ingredient_list: item.missing_ingredient_list,
							time: item.time,
							serving: item.serving,
						})}
					/>
					<Button
						href={item.source}
						target='_blank'
						endIcon={<InsertLinkRoundedIcon />}
					>
						Link
					</Button>
					<IconButton
						onClick={() => handleExpandClick(index)}
						aria-expanded={expanded === index}
						size='small'
						color='primary'
					>
						Ingredients
						{expanded === index ? (
							<ExpandLessRoundedIcon />
						) : (
							<ExpandMoreRoundedIcon />
						)}
					</IconButton>
				</CardActions>
				<Collapse in={expanded === index} timeout='auto' unmountOnExit>
					<CardContent>
						<div>
							<Typography align='left' variant='h6'>
								Missing ingredients
							</Typography>
							<Divider />
							{item.missing_ingredient_list
								.split(',')
								.map((ingredients, index) => (
									<Grid container spacing={4} align='left' key={index}>
										<Grid item xs={12} key={index}>
											<Typography>{ingredients}</Typography>
										</Grid>
									</Grid>
								))}
						</div>
					</CardContent>
				</Collapse>
			</Card>
		</Paper>
	);
}
