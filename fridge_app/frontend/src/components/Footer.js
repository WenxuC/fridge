import React from 'react';

import { Typography, Box, Link } from '@mui/material';

function Copyright() {
	return (
		<Typography variant='body2' color='#fafafa' align='center'>
			{'Copyright © '}
			<Link color='inherit'>Mise En Place</Link> {new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

function Footer() {
	return (
		<Box sx={{ bgcolor: 'primary.dark', p: 6 }} component='footer'>
			<Typography variant='h6' align='center' gutterBottom color='#fafafa'>
				Thank You!
			</Typography>
			<Copyright />
		</Box>
	);
}

export default Footer;
