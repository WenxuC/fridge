import React, { useContext, useState } from 'react';

import AuthContext from '../context/AuthContext';
import Header from './Header';
import Items from './Item';
import Recipe from './Recipe';
import History from './History';
import Search from './Search';

import PropTypes from 'prop-types';
import { Typography, Box, Tab, Tabs, Container, styled } from '@mui/material';
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

const AntTabs = styled(Tabs)({
	borderBottom: '1px solid #e8e8e8',
	'& .MuiTabs-indicator': {
		backgroundColor: '#1b5e20',
	},
});

const AntTab = styled(props => <Tab disableRipple {...props} />)(
	({ theme }) => ({
		minWidth: 0,
		[theme.breakpoints.up('sm')]: {
			minWidth: 0,
		},
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(1),
		color: 'rgba(0, 0, 0, 0.85)',
		'&:hover': {
			color: '#2e7d32',
			opacity: 1,
		},
	})
);

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [items, setItems] = useState([]);
	const [like, setLike] = useState(true);
	const [value, setValue] = useState(0);
	const [modal, setModal] = useState(false);

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
					<AntTabs value={value} onChange={handleChange} centered>
						<AntTab
							icon={<HistoryRoundedIcon />}
							label='History'
							{...allProps(0)}
						/>
						<AntTab
							icon={<Inventory2RoundedIcon />}
							label='Pantry'
							{...allProps(1)}
						/>
						\
						<AntTab
							icon={<SearchRoundedIcon />}
							label='Search'
							{...allProps(2)}
						/>
						<AntTab
							icon={<TravelExploreRoundedIcon />}
							label='Advanced Search'
							{...allProps(3)}
						/>
					</AntTabs>
				</Box>
				<TabPanel value={value} index={0}>
					<History like={like} setLike={setLike} />
				</TabPanel>
				<TabPanel value={value} index={1}>
					<Items setItems={setItems} items={items} />
				</TabPanel>

				<TabPanel value={value} index={2}>
					<Recipe setLike={setLike} setModal={setModal} modal={modal} />
				</TabPanel>
				<TabPanel value={value} index={3}>
					<Search setLike={setLike} setModal={setModal} modal={modal} />
				</TabPanel>
			</Box>
		</div>
	);
}
