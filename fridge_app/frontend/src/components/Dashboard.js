import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// import '../App.css';
import Header from './Header';
import { Typography, Box, Tab, Tabs, Container } from '@mui/material';
import AuthContext from '../context/AuthContext';
import Items from './Item';
import Recipe from './Recipe';
import History from './History';
import Search from './Search';

import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
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
	const { user } = useContext(AuthContext);
	const [items, setItems] = useState([]);
	const [like, setLike] = useState(true);
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<div>
			<Header />
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
						<Tab
							icon={<HistoryRoundedIcon />}
							label='History'
							{...allProps(0)}
						/>
						<Tab
							icon={<Inventory2RoundedIcon />}
							label='Pantry'
							{...allProps(1)}
						/>
						\
						<Tab icon={<SearchRoundedIcon />} label='Search' {...allProps(2)} />
						<Tab
							icon={<TravelExploreRoundedIcon />}
							label='Advanced Search'
							{...allProps(3)}
						/>
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<History like={like} setLike={setLike} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Items setItems={setItems} items={items} />
				</TabPanel>

				<TabPanel value={value} index={2}>
					<Recipe setLike={setLike} />
				</TabPanel>
				<TabPanel value={value} index={3}>
					<Search setLike={setLike} />
				</TabPanel>
			</Box>
		</div>
	);
}
