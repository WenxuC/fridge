import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
// MUI
import {
	Typography,
	Grid,
	Button,
	Container,
	Box,
	styled,
	Stack,
} from '@mui/material';

import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
const item = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	px: 5,
};

const Root = styled('section')(({ theme }) => ({
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	[theme.breakpoints.up('sm')]: {
		height: '80vh',
		minHeight: 500,
		maxHeight: 1300,
	},
}));

const Background = styled(Box)({
	position: 'absolute',
	display: 'flex',
	left: -10,
	right: 0,
	top: -10,
	bottom: 0,
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	zIndex: -1,
});

const Title = styled(Typography)(({ theme }) => ({
	fontSize: '64px',
	color: '#fafafa',
	fontWeight: 'bold',
	margin: theme.spacing(4, 0, 4, 0),
	[theme.breakpoints.down('sm')]: {
		fontSize: '40px',
	},
}));
export default function Home() {
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('authTokens');

		if (token) {
			navigate('/dashboard');
		}
	});

	return (
		<div>
			<Header />
			<Root>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Title
						align='center'
						variant='h3'
						sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
					>
						Welcome to Mise En Place
					</Title>

					<Typography
						color='#fafafa'
						align='center'
						variant='h5'
						sx={{ mb: 4 }}
					>
						Mise En Place prepares recipes based on your pantry so you can focus
						on cooking!
					</Typography>

					<Background
						sx={{
							backgroundImage:
								'url(https://images.unsplash.com/photo-1627488193141-953623010488?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80)',
							backgroundColor: t =>
								t.palette.mode === 'light'
									? t.palette.grey[50]
									: t.palette.grey[900],
							backgroundPosition: 'center',
						}}
					/>
				</Container>
			</Root>

			<Box
				component='section'
				sx={{ display: 'flex', overflow: 'hidden', mb: '100px' }}
			>
				<Container sx={{ mt: 10, display: 'flex', position: 'relative' }}>
					<Grid container spacing={5}>
						<Grid item xs={12} md={12}>
							<Stack
								display='flex'
								justifyContent='center'
								alignItems='center'
								minHeight='20vh'
							>
								<Typography variant='h4' textAlign={'center'}>
									Explore different recipes from around the world
								</Typography>
								<Typography variant='subtitle1'>
									Over 5,000+ recipes and 2,600+ ingredients
								</Typography>
							</Stack>
						</Grid>
						<Grid item xs={12} md={12}>
							<Stack display='flex' justifyContent='center' alignItems='center'>
								<Typography variant='h5'>How Mise En Place Works</Typography>
							</Stack>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={{ mb: '10px' }}>
									<TouchAppOutlinedIcon fontSize='large' />
								</Box>
								<Typography variant='h6'>
									Add ingredients from your pantry and we will generate recipes
									to maximize usage and reduce waste!
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={{ mb: '10px' }}>
									<TipsAndUpdatesOutlinedIcon fontSize='large' />
								</Box>
								<Typography variant='h6'>
									Try specific cuisines with our advanced search or if you want
									a surprise, use our quick search.
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={{ mb: '10px' }}>
									<FavoriteBorderOutlinedIcon fontSize='large' />
								</Box>
								<Typography variant='h6'>
									Save recipes you love and revisit them when you are ready to
									cook!
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>
			<Grid container spacing={2} justifyContent='center'>
				<Grid item xs={12} align='center' sx={{ mt: 15, mb: 20 }}>
					<Button
						color='primary'
						variant='contained'
						size='large'
						href='/register'
						sx={{ minWidth: 200 }}
					>
						Try It Out
					</Button>
				</Grid>
			</Grid>
			<Footer />
		</div>
	);
}
