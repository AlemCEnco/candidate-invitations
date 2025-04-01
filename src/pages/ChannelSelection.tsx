import { Box, Button, FormControlLabel, FormControl, FormLabel, Paper, FormGroup, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { candidateStore } from '../stores/candidates';

const ChannelSelection = () => {
	const { channels } = useSnapshot(candidateStore);
	const navigate = useNavigate();

	const goToChannelForm = () => {
		const firstSelected = channels.find(channel => channel.checked)
		navigate(`/seleccion-canales/${firstSelected?.id}`)
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Selección de Plantilla</FormLabel>
					<FormGroup>
						{channels.map(channel => (
								<FormControlLabel key={channel.id} control={<Checkbox checked={channel.checked} onChange={() => candidateStore.toggleChannels(channel.id)}  />} label={channel.name} />
							))}
					</FormGroup>
				</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button variant="contained" color="primary" onClick={() => navigate('/seleccion-plantilla')}>Atrás</Button>
					<Button variant="contained" color="primary" onClick={goToChannelForm}>Siguiente</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default ChannelSelection; 