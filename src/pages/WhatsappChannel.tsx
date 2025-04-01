import { Box, Button, FormControl, FormLabel, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WhatsappChannel = () => {
	const navigate = useNavigate();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Whatsapp</FormLabel>
					<label>Mensaje</label>
					<TextField id="outlined-basic" variant="outlined" placeholder='Escribe un mensaje' />
				</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button variant="contained" color="primary" onClick={() => navigate('/email-canal')}>Atrás</Button>
					<Button variant="contained" color="primary" onClick={() => navigate('/')}>Siguiente</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default WhatsappChannel; 