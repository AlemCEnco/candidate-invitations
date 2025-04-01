import { Box, Button, FormControl, FormLabel, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const EmailChannel = () => {
	const navigate = useNavigate();

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Correo electrónico</FormLabel>
					<label>Asunto</label>
					<TextField id="outlined-basic" variant="outlined" placeholder='Escribe un asunto' />
					<label>Mensaje</label>
					<TextField id="outlined-basic" variant="outlined" placeholder='Escribe un mensaje' />
				</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button variant="contained" color="primary" onClick={() => navigate('/sms-canal')}>Atrás</Button>
					<Button variant="contained" color="primary" onClick={() => navigate('/whatsapp-canal')}>Siguiente</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default EmailChannel; 