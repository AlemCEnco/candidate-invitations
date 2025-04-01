import { Box, Button, FormControlLabel, FormControl, FormLabel, Paper, RadioGroup, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { candidateStore } from '../stores/candidates';
import { useSnapshot } from 'valtio';
import { ChangeEvent } from 'react';

const TemplateSelection = () => {
	const {templates, templateSelected} = useSnapshot(candidateStore)

  const navigate = useNavigate();

	const _handleSelectTemplate = (e: ChangeEvent<HTMLInputElement>) => {
		const id = e.target.value
		candidateStore.selectTemplate(parseInt(id))
	}

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Selección de Plantilla</FormLabel>
					<RadioGroup
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="invitation"
						name="radio-buttons-group"
					>
						{templates.map((template) => (
							<FormControlLabel key={template.id} value={template.id} control={<Radio checked={template.id === templateSelected?.id} onChange={_handleSelectTemplate} />} label={template.name} />
						))}
					</RadioGroup>
				</FormControl>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>Cancelar</Button>
					<Button variant="contained" color="primary" onClick={() => navigate('/selection-canales')}>Siguiente</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TemplateSelection; 