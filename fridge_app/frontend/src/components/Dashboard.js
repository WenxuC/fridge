import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

import {
	Button,
	Typography,
	AppBar,
	Toolbar,
	Stack,
	Box,
	Tab,
	Tabs,
	Container,
	Grid,
	CssBaseline,
} from '@mui/material';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import AuthContext from '../context/AuthContext';
import Items from './Item';
import Recipe from './Recipe';
import History from './History';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Box>{children}</Box>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function allProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}
export default function Dashboard() {
	const { user, logoutUser } = useContext(AuthContext);
	const [items, setItems] = useState([]);
	const [like, setLike] = useState(true);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div className='App'>
			<CssBaseline />
			<AppBar position='relative'>
				<Toolbar>
					<RestaurantMenuRoundedIcon sx={{ mr: 2 }} />
					<Typography variant='h6'>THE FRIDGE</Typography>
					<Container disableGutters={true} maxWidth='xl'>
						<Stack direction='row' justifyContent='flex-end'>
							<Button
								type='submit'
								color='error'
								value='Logout'
								size='small'
								variant='contained'
								onClick={logoutUser}
							>
								<LogoutRoundedIcon />
							</Button>
						</Stack>
						<Grid container spacing={2}>
							<Grid item xs={12}></Grid>
						</Grid>
					</Container>
				</Toolbar>
			</AppBar>
			<Box></Box>
			<Container maxWidth='sm'>
				<Typography
					variant='h4'
					align='center'
					sx={{
						p: 2,
					}}
				>
					{user.username.toUpperCase()}'s Fridge
				</Typography>
			</Container>
			<Box sx={{ width: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label='basic tabs example'
						centered
					>
						<Tab label='History' {...allProps(0)} />
						<Tab label='Pantry' {...allProps(1)} />
						<Tab label='Search' {...allProps(2)} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<History like={like} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Items setItems={setItems} items={items} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<Recipe setLike={setLike} />
				</TabPanel>
			</Box>
		</div>
	);
}
