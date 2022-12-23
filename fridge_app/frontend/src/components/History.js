import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import {
	Grid,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	ListSubheader,
	IconButton,
	Checkbox,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
export default function History({ like }) {
	const { authTokens } = useContext(AuthContext);
	const [history, setHistory] = useState([]);
	const [updateList, setUpdateList] = useState([false]);

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
	return (
		<Grid container spacing={1} align='center'>
			<Grid item xs={12}>
				<ImageList sx={{ width: 500, height: 450 }}>
					<ImageListItem key='Subheader' cols={2}>
						<ListSubheader component='div'>History</ListSubheader>
					</ImageListItem>
					{history.map(history => (
						<ImageListItem key={history.id}>
							<img src={history.image} alt={history.title} loading='lazy' />
							<ImageListItemBar
								title={history.title}
								actionIcon={
									<IconButton
										sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
										aria-label={`info about ${history.title}`}
										href={history.source}
										target='_blank'
									>
										<InfoIcon />
										<Checkbox
											icon={<CancelRoundedIcon />}
											onChange={handleDelete}
											value={JSON.stringify({
												id: history.id,
											})}
										/>
									</IconButton>
								}
							/>
						</ImageListItem>
					))}
				</ImageList>
			</Grid>
		</Grid>
	);
}
