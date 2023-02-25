import React from 'react';

import { Stack, Snackbar, Alert } from '@mui/material';

function Alerts({ setOpen, open, alert }) {
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<Stack direction='row' justifyContent={'center'}>
			{console.log(alert, open)}
			{open !== '' ? (
				<Snackbar
					open={open}
					autoHideDuration={5000}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					onClose={handleClose}
				>
					<Alert
						sx={{ minWidth: 370, maxWidth: 360 }}
						severity='error'
						onClose={handleClose}
					>
						{alert}
					</Alert>
				</Snackbar>
			) : null}
		</Stack>
	);
}

export default Alerts;
