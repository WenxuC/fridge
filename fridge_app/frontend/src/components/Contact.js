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
					elevation={24}
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Typography component='h1' variant='h4' align='center' sx={{ mb: 2 }}>
						Contact Form
					</Typography>
					<Grid container spacing={3} justifyContent='center'>
						<Grid item xs={12} sm={8}>
							<TextField
								variant='outlined'
								required
								id='name'
								label='Name'
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								variant='outlined'
								required
								id='email'
								name='email'
								label='Email'
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								variant='outlined'
								required
								id='subject'
								name='subject'
								label='Subject'
								fullWidth
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<TextField
								id='outlined-multiline-static'
								label='Description'
								required
								multiline
								fullWidth
								rows={6}
							/>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
								<Button variant='contained'>Send</Button>
							</Box>
						</Grid>
					</Grid>
				</Paper>
			</Container>
		</div>
	);
}

export default Contact;
