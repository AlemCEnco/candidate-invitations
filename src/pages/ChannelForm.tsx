import { Box, FormControl, FormLabel, Paper, TextField, Typography, Button } from "@mui/material"
import { useSnapshot } from "valtio"
import { candidateStore } from "../stores/candidates"
import { useNavigate, useParams } from "react-router-dom"
import { useMemo, useState } from "react"

const ChannelForm = () => {
	const { channels } = useSnapshot(candidateStore)
	const { id } = useParams()
	const navigate = useNavigate()

	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');

	const [currentChannel, isLastChannel] = useMemo(() => {
		const currentIndex = channels.findIndex(channel => channel.id === parseInt(id))
		const currentChannel = channels[currentIndex]
		const checkedChannels = channels.filter(channel => channel.checked)

		return [currentChannel, checkedChannels[checkedChannels.length - 1].id === currentChannel.id]
	}, [id, channels])

	const isDisabled = currentChannel.content.subject !== undefined ? !subject.trim() || !message.trim() : !message.trim();

	const goToNextChannel = () => {
		const nextChannel = channels.find(channel => channel.id === currentChannel.id + 1 && channel.checked)
		navigate(`/selection-canales/${nextChannel.id}`)
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
							<TextField id="outlined-basic" value={subject} variant="outlined" onChange={(e) => setSubject(e.target.value)} placeholder='Escribe un asunto' sx={{ width: "600px" }} />
						</>
					) : null}
					<FormLabel>Mensaje</FormLabel>
					<TextField id="outlined-basic" value={message} variant="outlined" onChange={(e) => setMessage(e.target.value)} placeholder='Escribe un mensaje' sx={{ width: "600px" }} multiline={currentChannel.content.subject !== undefined}
						rows={currentChannel.content.subject !== undefined ? 6 : 1} />
				</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
					<Button variant="contained" color="primary" onClick={() => navigate(-1)}>Atrás</Button>
					{isLastChannel ? (
						<Button variant="contained" color="primary" onClick={showMessage} disabled={isDisabled}>Enviar</Button>
					) : (
						<Button variant="contained" color="primary" onClick={goToNextChannel} disabled={isDisabled}>Siguiente</Button>
					)}
				</Box>
			</Paper>
		</Box>
	)
}

export default ChannelForm