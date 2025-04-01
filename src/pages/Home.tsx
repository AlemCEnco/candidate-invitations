import { ListItemText, Checkbox, List, ListItem, ListItemButton, ListItemAvatar, Avatar, Box, Typography, Button } from '@mui/material';
import { useEffect } from 'react';
import { candidateStore, CandidateStatus } from '../stores/candidates';
import { useSnapshot } from 'valtio';
import { useNavigate } from 'react-router-dom';



const Home = () => {
	const { candidates } = useSnapshot(candidateStore);
	const navigate = useNavigate();
	const isDisabled = !candidates.some(candidate => candidate.checked);

	useEffect(() => {
		candidateStore.fetchCandidates()
	}, []);


	if (candidateStore.candidateStatus === CandidateStatus.LOADING) {
		return <Box>
			<Typography variant="h4">Cargando...</Typography>
		</Box>
	}

	return (
		<Box>
			<Typography variant="h4">Candidatos</Typography>
			<List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
				{candidates.map((candidate) => {
					const labelId = `checkbox-list-secondary-label-${candidate.id}`;
					return (
						<ListItem
							key={candidate.id}
							secondaryAction={
								<Checkbox
									edge="end"
									onChange={() => candidateStore.toggleCandidate(candidate.id)}
									checked={candidate.checked}
									slotProps={{ input: { 'aria-labelledby': labelId } }}
								/>
							}
							disablePadding
						>
							<ListItemButton>
								<ListItemAvatar>
									<Avatar
										alt={`Avatar n°${candidate.id + 1}`}
										src={`https://i.pravatar.cc/300?img=${candidate.id}`}
									/>
								</ListItemAvatar>
								<ListItemText id={labelId} primary={candidate.name} secondary={candidate.email} />
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>
			<Button variant="contained" color="primary" onClick={() => navigate('/selection-plantilla')} disabled={isDisabled}>Seleccionar plantilla</Button>
		</Box>
	);
};

export default Home; 