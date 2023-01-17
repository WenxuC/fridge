import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// MUI
import {
	Typography,
	Grid,
	Button,
	Container,
	Box,
	styled,
} from '@mui/material';

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
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	zIndex: -2,
});

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
			<Root>
				<Container
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography
						align='center'
						variant='h3'
						sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
					>
						Welcome to Mise En Place
					</Typography>

					<Typography
						color='inherit'
						align='center'
						variant='h4'
						sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}
					>
						Mise En Place prepares recipes based on your pantry so you can focus
						on cooking!
					</Typography>

					<Background
						sx={{
							backgroundImage:
								'url(https://images.unsplash.com/photo-1567769541715-8c71fe49fd43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Zm9vZHx8fHx8fDE2NzM5MjQwMjU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080)',
							backgroundColor: t =>
								t.palette.mode === 'light'
									? t.palette.grey[50]
									: t.palette.grey[900],
							backgroundPosition: 'center',
						}}
					/>
				</Container>
			</Root>

			<Box component='section' sx={{ display: 'flex', overflow: 'hidden' }}>
				<Container sx={{ mt: 10, display: 'flex', position: 'relative' }}>
					<Grid container spacing={5}>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Typography variant='h5' align='center' sx={{ my: 5 }}>
									Ease of Use
								</Typography>
								<Typography variant='h6'>
									To get started, add ingredients from your pantry and we will
									generate recipes to maximize usage and reduce waste!
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Typography variant='h5' align='center' sx={{ my: 5 }}>
									Try New Things
								</Typography>
								<Typography variant='h6'>
									Try specific cuisines with our advanced search or if you want
									a surprise, use our quick search.
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Typography variant='h5' align='center' sx={{ my: 5 }}>
									Save Your Recipes
								</Typography>
								<Typography variant='h6'>
									You can save recipes you love and revisit them when you are
									ready to cook!
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
		</div>
	);
}
