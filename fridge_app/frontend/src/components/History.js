import React, { useState, useContext, useEffect } from 'react';
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
} from '@mui/material';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

export default function History({ like }) {
	const { authTokens } = useContext(AuthContext);
	const [history, setHistory] = useState([]);
	const [updateList, setUpdateList] = useState([false]);
	const [expanded, setExpanded] = useState(-1);

	useEffect(() => {
		const getHistory = async () => {
			const response = await fetch('http://127.0.0.1:8000/api/getHistory', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + String(authTokens.access),
				},
			});

			const data = await response.json();

			if (response.status === 200) {
				setHistory(data);
			} else {
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

		const response = await fetch('http://127.0.0.1:8000/api/deleteRecipe', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + String(authTokens.access),
			},
			body: JSON.stringify({
				id: value.id,
			}),
		});
		const data = await response.json();

		if (response.status === 200) {
			setUpdateList(true);
		} else {
			console.log(response.statusText);
		}
	};

	const handleExpandClick = i => {
		setExpanded(expanded === i ? -1 : i);
	};
	return (
		<Grid container spacing={4}>
			{history.map((history, index) => (
				<Grid item key={index} xs={12} sm={5} md={3}>
					<Stack direction={'row'}>
						<Card
							sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
						>
							<CardHeader title={history.title} />
							<CardMedia component='img' height='194' image={history.image} />
							<CardContent>
								<Typography variant='body2' color='text.secondary'>
									This impressive paella is a perfect party dish and a fun meal
									to cook together with your guests. Add 1 cup of frozen peas
									along with the mussels, if you like.
								</Typography>
							</CardContent>
							<CardActions disableSpacing>
								<Button
									color='error'
									value={JSON.stringify({
										id: history.id,
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
									<Typography paragraph>Method:</Typography>
									<Typography paragraph>
										Heat 1/2 cup of the broth in a pot until simmering, add
										saffron and set aside for 10 minutes.
									</Typography>
									<Typography paragraph>
										Heat oil in a (14- to 16-inch) paella pan or a large, deep
										skillet over medium-high heat. Add chicken, shrimp and
										chorizo, and cook, stirring occasionally until lightly
										browned, 6 to 8 minutes. Transfer shrimp to a large plate
										and set aside, leaving chicken and chorizo in the pan. Add
										pimentón, bay leaves, garlic, tomatoes, onion, salt and
										pepper, and cook, stirring often until thickened and
										fragrant, about 10 minutes. Add saffron broth and remaining
										4 1/2 cups chicken broth; bring to a boil.
									</Typography>
									<Typography paragraph>
										Add rice and stir very gently to distribute. Top with
										artichokes and peppers, and cook without stirring, until
										most of the liquid is absorbed, 15 to 18 minutes. Reduce
										heat to medium-low, add reserved shrimp and mussels, tucking
										them down into the rice, and cook again without stirring,
										until mussels have opened and rice is just tender, 5 to 7
										minutes more.
									</Typography>
									<Typography>
										Set aside off of the heat to let rest for 10 minutes, and
										then serve.
									</Typography>
								</CardContent>
							</Collapse>
						</Card>
					</Stack>
				</Grid>
			))}
		</Grid>
	);
}
