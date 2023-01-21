import React, { useState, useContext, useEffect } from 'react';
import { config } from './Constants';
import AuthContext from '../context/AuthContext';
import Cards from './Cards';
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

export default function History({ like, setLike }) {
	const { authTokens } = useContext(AuthContext);
	const [history, setHistory] = useState([]);
	const [updateList, setUpdateList] = useState([false]);

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
	}, [updateList]);

	return (
		<Grid container spacing={2} justifyContent='center' wrap='wrap-reverse'>
			{history.map((history, index) => (
				<Grid item key={index}>
					<Stack direction={'row'}>
						<Cards item={history} index={index} setLike={setLike} />
					</Stack>
				</Grid>
			))}
		</Grid>
	);
}
