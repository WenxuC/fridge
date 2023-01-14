import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	IconButton,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions,
	Collapse,
	Typography,
	Button,
	Stack,
	Chip,
	Divider,
	Paper,
} from '@mui/material';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

const URL = config.url;

export default function History({ like }) {
	const { authTokens } = useContext(AuthContext);
	const [history, setHistory] = useState([]);
	const [updateList, setUpdateList] = useState([false]);
	const [expanded, setExpanded] = useState(-1);
	useEffect(() => {
		const getHistory = async () => {
			const response = await fetch(`${URL}api/getHistory`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
			});

			const data = await response.json();

			if (response.status === 200) {
				setHistory(data);
			} else if (response.status === 404) {
				setHistory([]);
			}
		};
		getHistory();
		if (updateList) {
			setUpdateList(false);
		}
	}, [like, updateList]);

	const handleDelete = async e => {
		const value = JSON.parse(e.target.value);
		const response = await fetch(`${URL}api/deleteRecipe`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				recipeID: value.id,
			}),
		});

		const data = await response.json();

		if (response.status === 200) {
			setUpdateList(true);
		}
	};

	const handleExpandClick = i => {
		setExpanded(expanded === i ? -1 : i);
	};

	return (
		<Grid container spacing={2} justifyContent='center'>
			{history.map((history, index) => (
				<Grid item key={index} wrap='wrap-reverse'>
					<Stack direction={'row'}>
						<Paper elevation={2}>
							<Card
								sx={{
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
								style={{ backgroundColor: '#e0f7fa' }}
							>
								<CardHeader title={history.title} />
								<CardMedia component='img' height='194' image={history.image} />
								<CardContent>
									<Stack direction='row' spacing={1}>
										<Chip
											icon={<AccessTimeRoundedIcon />}
											label={history.time}
											color='primary'
										/>
										<Chip
											icon={<PersonRoundedIcon />}
											label={history.serving}
											color='primary'
										/>
									</Stack>
								</CardContent>
								<CardActions disableSpacing>
									<Button
										color='error'
										value={JSON.stringify({
											id: history.recipeID,
										})}
										onClick={handleDelete}
										endIcon={<CancelRoundedIcon />}
									>
										Delete
									</Button>
									<Button
										href={history.source}
										target='_blank'
										endIcon={<InsertLinkRoundedIcon />}
									>
										Link
									</Button>
									<IconButton
										onClick={() => handleExpandClick(index)}
										aria-expanded={expanded === index}
									>
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
											{history.missing_ingredient_list
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
					</Stack>
				</Grid>
			))}
		</Grid>
	);
}
