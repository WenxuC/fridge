import React from 'react';
import { Button, Typography, Modal, Box, DialogActions } from '@mui/material';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

function Modals({ modal, setModal }) {
	const handleClose = () => {
		setModal(false);
	};

	return (
		<Modal open={modal} onClose={handleClose}>
			<Box sx={style}>
				<Typography variant='h6' component='h2'>
					You're not registered
				</Typography>
				<Typography sx={{ mt: 2 }}>
					You need an account to save recipes. Would you like to sign up now?
				</Typography>
				<DialogActions>
					<Button onClick={handleClose}>No</Button>
					<Button href='/register'>Yes</Button>
				</DialogActions>
			</Box>
		</Modal>
	);
}

export default Modals;
