import { Box, FormControl, FormLabel, Paper, TextField, Typography, Button } from "@mui/material"
import { useSnapshot } from "valtio"
import { candidateStore, TypeChannel } from "../stores/candidates"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"

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

	const toggleContentTemplate = (template: { subject?: string, message?: string }, type: TypeChannel) => {
		const channelMap = {
			[TypeChannel.sms]: 1,
			[TypeChannel.email]: 2,
			[TypeChannel.whatsapp]: 3
		};

		const channelId = channelMap[type];
		if (!channelId) return;

		candidateStore.channels = candidateStore.channels.map(channel =>
			channel.id === channelId ? { ...channel, content: { ...channel.content, ...template } } : channel
		);
	};

	const goToNextChannel = () => {
		const nextChannel = channels.find(channel => channel.id === currentChannel.id + 1 && channel.checked)
		navigate(`/selection-canales/${nextChannel.id}`)
	}

	const goBack = () => {
		const previousChannel = channels.find(channel => channel.id === currentChannel.id - 1 && channel.checked)
		if (previousChannel) {
			const prevContent = previousChannel.content;
			setSubject(prevContent.subject || '');
			setMessage(prevContent.message || '');
		}
		navigate(-1);
	}

	const showMessage = () => {
		console.log(candidateStore.prepareDataForBackend())
	}

	useEffect(() => {
		const currentChannelContent = currentChannel.content;
		setSubject(currentChannelContent.subject || '');
		setMessage(currentChannelContent.message || '');
	}, [currentChannel]);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
			<Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<Typography variant="h4">{currentChannel.name}</Typography>

				<FormControl>
					{currentChannel.content.subject !== undefined ? (
						<>
							<FormLabel>Asunto</FormLabel>
							<TextField id="outlined-basic" value={subject} variant="outlined" onChange={(e) => {
								setSubject(e.target.value);
								toggleContentTemplate({ subject: e.target.value }, currentChannel.type);
							}} placeholder='Escribe un asunto' sx={{ width: "600px" }} />
						</>
					) : null}
					<FormLabel>Mensaje</FormLabel>
					<TextField id="outlined-basic" value={message} variant="outlined" onChange={(e) => {
						setMessage(e.target.value);
						toggleContentTemplate({ message: e.target.value }, currentChannel.type);
					}} placeholder='Escribe un mensaje' sx={{ width: "600px" }} multiline={currentChannel.content.subject !== undefined}
						rows={currentChannel.content.subject !== undefined ? 6 : 1} />
				</FormControl>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2 }}>
					<Button variant="contained" color="primary" onClick={goBack}>Atrás</Button>
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