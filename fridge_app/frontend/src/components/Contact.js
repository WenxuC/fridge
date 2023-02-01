import React from 'react';
import Header from './Header';
import { Grid, Typography, TextField, Paper, Button, Box } from '@mui/material';
import { Container } from '@mui/system';
function Contact() {
	return (
		<div>
			<Header />
			<Container component='main' maxWidth='md' sx={{ mb: 4 }}>
				<Paper
					variant='outlined'
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Typography component='h1' variant='h4' align='center'>
						Contact Form
					</Typography>
					<Grid container spacing={3} justifyContent='center'>
						<Grid item xs={12} sm={8}>
							<TextField
								required
								id='firstName'
								name='firstName'
								label='First name'
								fullWidth
								autoComplete='given-name'
								variant='standard'
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								required
								id='lastName'
								name='lastName'
								label='Last name'
								fullWidth
								autoComplete='family-name'
								variant='standard'
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								required
								id='email'
								name='email'
								label='Email'
								fullWidth
								variant='standard'
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								id='outlined-multiline-static'
								label='Description'
								multiline
								fullWidth
								rows={5}
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
								<Button>Submit</Button>
							</Box>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		</div>
	);
}

export default Contact;
