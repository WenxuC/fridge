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
} from '@mui/material';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

const URL = config.url;

export default function History({ like }) {
	const { authTokens } = useContext(AuthContext);
	const [history, setHistory] = useState([]);
	const [updateList, setUpdateList] = useState([false]);
	const [expanded, setExpanded] = useState(-1);
	const [summary, setSummary] = useState([]);
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

	let stringtoHTML = function (str) {
		let dom = document.createElement('div');
		dom.innerHTML = str;

		return dom;
	};

	const handleHTML = e => {
		let data = [];
		let htmlBody = stringtoHTML(e);
		data.push(htmlBody);
		return data;
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
							<Collapse
								in={expanded === index}
								timeout='auto'
								unmountOnExit
								addEndListener={() => {
									setSummary(handleHTML(history.summary));
								}}
							>
								<CardContent>
									<div>{summary[0] ? summary[0].innerText : null}</div>
								</CardContent>
							</Collapse>
						</Card>
					</Stack>
				</Grid>
			))}
		</Grid>
	);
}
