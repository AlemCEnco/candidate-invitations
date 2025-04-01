import { Box, FormControl, FormLabel, Paper, TextField, Typography, Button } from "@mui/material"
import { useSnapshot } from "valtio"
import { candidateStore } from "../stores/candidates"
import { useNavigate, useParams } from "react-router-dom"
import { useMemo } from "react"

const ChannelForm = () => {
	const { channels } = useSnapshot(candidateStore)
	const { id } = useParams()
	const navigate = useNavigate()

	const [currentChannel, isLastChannel] = useMemo(() => {
		const currentIndex = channels.findIndex(channel => channel.id === parseInt(id))
		const currentChannel = channels[currentIndex]
		const checkedChannels = channels.filter(channel => channel.checked)

		return [currentChannel, checkedChannels[checkedChannels.length - 1].id === currentChannel.id]
	}, [id, channels])

	const goToNextChannel = () => {
		const nextChannel = channels.find(channel => channel.id === currentChannel.id + 1 && channel.checked)
		navigate(`/seleccion-canales/${nextChannel.id}`)
	}

	const showMessage = () => {
		console.log(candidateStore.getMessageTemplates())
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<Typography variant="h4">{currentChannel.name}</Typography>

				<FormControl>
					{currentChannel.content.subject !== undefined ? (
						<>
							<FormLabel>Asunto</FormLabel>
							<TextField id="outlined-basic" variant="outlined" placeholder='Escribe un asunto' />
						</>
					) : null}
					<FormLabel>Mensaje</FormLabel>
					<TextField id="outlined-basic" variant="outlined" placeholder='Escribe un mensaje' />
					</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
					<Button variant="contained" color="primary" onClick={() => navigate(-1)}>Atrás</Button>
					{isLastChannel ? (
						<Button variant="contained" color="primary" onClick={showMessage}>Enviar</Button>
					) : (
						<Button variant="contained" color="primary" onClick={goToNextChannel}>Siguiente</Button>
					)}
				</Box>
			</Paper>
		</Box>
	)
}

export default ChannelForm