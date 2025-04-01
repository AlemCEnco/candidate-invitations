import { proxy } from 'valtio';

const candidateEndpoint = 'https://jsonplaceholder.typicode.com/users'

export interface ICandidates {
	id: number;
	name: string;
	username: string;
	email: string;
	phone: string;
	website: string;
	checked: boolean;
}

export enum TypeTemplate {
	invitation = 'invitation',
	reminder = 'reminder',
	custom = 'custom',
}

export enum TypeChannel {
	sms = 'sms',
	email = 'email',
	whatsapp = 'whatsapp',
}

export enum CandidateStatus {
	LOADING = 'loading',
	LOADED = 'loaded',
	ERROR = 'error',
}

export interface ITemplate {
	subject?: string;
	message: string;
}

export interface IChannel {
	id: number;
	type: TypeChannel;
	name: string;
	checked: boolean;
	content: ITemplate;
}

export interface IMessage {
	id: number;
	name: string;
	templates: {
		types: number[];
		template: string;
	}[];
}

const initialChannels: IChannel[] = [
	{
		id: 1,
		type: TypeChannel.sms,
		name: 'Sms',
		checked: false,
		content: {
			message: ''
		}
	},
	{
		id: 2,
		type: TypeChannel.email,
		name: 'Correo electrónico',
		checked: false,
		content: {
			subject: '',
			message: ''
		}
	},
	{
		id: 3,
		type: TypeChannel.whatsapp,
		name: 'Whatsapp',
		checked: false,
		content: {
			message: ''
		}
	}
]

const initialTemplates: IMessage[] = [
	{
		id: 1,
		name: 'Invitación',
		templates: [
			{
				types: [1, 3],
				template: 'Mensaje: Hola [Nombre], te invitamos a participar en el proceso de [nombre del proceso/actividad] que se llevará a cabo el [fecha] a las [hora]. Por favor, confirma tu asistencia respondiendo a este mensaje. ¡Te esperamos!'
			}, 
			{
				types: [2],
				template: `Asunto: Invitación al proceso de [nombre del proceso]
							Mensaje:  
							Estimado/a [Nombre],  
							Esperamos que te encuentres bien.  
							A través de este medio, queremos invitarte a participar en el proceso de [nombre del proceso],  
							que se llevará a cabo el [fecha] a las [hora].  
							El lugar del encuentro será [dirección/sala virtual].  
							Tu participación es muy importante para nosotros. Agradeceríamos que confirmes tu asistencia respondiendo a este correo.  
							Quedamos atentos a cualquier consulta que puedas tener.  
							Cordialmente,  
							[Nombre del remitente]  
							[Puesto]  
							[Empresa/Organización]`
			}
		]
	},
	{
		id: 2,
		name: 'Recordatorio',
		templates: [
			{
				types: [1, 3],
				template: 'Mensaje: Hola [Nombre], te recordamos que el proceso de [nombre del proceso/actividad] al que confirmaste tu asistencia se realizará el [fecha] a las [hora]. ¡Te esperamos puntual!'
			},
			{
				types: [2],
				template: `Asunto: Recordatorio del proceso de [nombre del proceso] 
							Mensaje: 
							Estimado/a [Nombre], 
							Queremos recordarte que el proceso de [nombre del proceso], al que amablemente confirmaste tu asistencia, 
							se realizará el [fecha] a las [hora]. El evento tendrá lugar en [dirección/sala virtual]. 
							Si tienes alguna duda o necesitas asistencia previa, no dudes en contactarnos. 
							Te esperamos puntual. 
							Saludos cordiales,  
							[Nombre del remitente]  
							[Puesto]  
							[Empresa/Organización]`
			}
		]
	},
	{
		id: 3,
		name: 'Personalizado',
		templates: [
			{
				types: [1, 3],
				template: 'Mensaje: [nombre del proceso]'
			},
			{
				types: [2],
				template: `Asunto: [subject del proceso]
							Mensaje: [nombre del proceso]`
			}
		]
	}
]


class Candidate {
	candidates: ICandidates[] = [];
	candidateStatus: CandidateStatus = CandidateStatus.LOADING;
	channels: IChannel[] = initialChannels;
	templates: IMessage[] = initialTemplates;
	templateSelected: IMessage = initialTemplates[0];

	typeTemplate: TypeTemplate = TypeTemplate.invitation;

	async fetchCandidates() {
		this.candidateStatus = CandidateStatus.LOADING;
		const response = await fetch(candidateEndpoint);
		const data = await response.json();
		this.candidates = data.map((candidate: ICandidates) => ({
			...candidate,
			checked: false,
		}));
		this.candidateStatus = CandidateStatus.LOADED;
	}

	selectTemplate(id: number) {
		const templateIndex = this.templates.findIndex((template) => template.id === id)
		this.templateSelected = this.templates[templateIndex]
	}

	toggleCandidate(id: number) {
		const candidateIndex = this.candidates.findIndex((candidate) => candidate.id === id);
		this.candidates[candidateIndex].checked = !this.candidates[candidateIndex].checked
	}

	toggleTypeTemplate(template: TypeTemplate) {
		this.typeTemplate = template
	}

	toggleChannels(id: number) {
		const channelIndex = this.channels.findIndex((channel) => channel.id === id)
		this.channels[channelIndex].checked = !this.channels[channelIndex].checked
	}

	toggleTemplate(id: number) {
		const channelIndex = this.channels.findIndex((channel) => channel.id === id)
		this.channels[channelIndex].checked = !this.channels[channelIndex].checked
	}

	getMessageTemplates()	{
		const checkedChannels = this.channels.filter((channel) => channel.checked)
		const checkedTemplates = this.templateSelected.templates.filter((template) => template.types.some((type) => checkedChannels.some((channel) => channel.id === type)))
		return checkedTemplates
	}

	toggleContentTemplate(template: ITemplate, type: TypeChannel) {
		const channelMap = {
			[TypeChannel.sms]: 1,
			[TypeChannel.email]: 2,
			[TypeChannel.whatsapp]: 3
		};
	
		const channelId = channelMap[type];
		if (!channelId) return;
	
		this.channels = this.channels.map(channel =>
			channel.id === channelId ? { ...channel, content: template } : channel
		);
	}


 	replaceTemplateVariables = (template: string, candidate: ICandidates, channel: IChannel, isCustomTemplate: boolean): string => {
		let result = template;
		result = result.replace('[Nombre]', candidate.name);
	
		// Si es una plantilla personalizada (id === 3)
		if (isCustomTemplate) {
		result = result.replace('[subject del proceso]', channel.content.subject); // Reemplaza nombre del proceso
		result = result.replace('[nombre del proceso]', channel.content.message); // Reemplaza nombre del proceso
		result = result.replace('[fecha]', '2025-04-01'); // Ejemplo de fecha
		result = result.replace('[hora]', '10:00 AM'); // Ejemplo de hora
		result = result.replace('[dirección/sala virtual]', 'Sala Virtual 1'); // Ejemplo de lugar
		result = result.replace('[Nombre del remitente]', 'John Doe'); // Ejemplo de remitente
		result = result.replace('[Puesto]', 'Coordinador'); // Ejemplo de puesto
		result = result.replace('[Empresa/Organización]', 'Mi Empresa'); // Ejemplo de empresa
		}
		
		console.log('result',result)
		return result;
	};
  
  // Estructura para enviar al backend
//    prepareDataForBackend = (candidates: ICandidates[], templates: IMessage[], channels: IChannel[], templateSelectedId: number) => {
	prepareDataForBackend = () => {
		// Filtrar los candidatos seleccionados
		const data = this.candidates.filter(candidate => candidate.checked);
	  
		// Generar el array para enviar al backend
		const dataToSend = data.map((candidate) => {
		  const selectedChannels = this.channels.filter(channel => channel.checked);  // Filtrar los canales seleccionados
	  
		  const messages = selectedChannels.flatMap((channel) => {
			const customTemplate = this.templates.find(template => template.id === candidateStore.templateSelected.id);
	  
			// Verificar si se está utilizando una plantilla personalizada (id === 3)
			const isCustomTemplate = candidateStore.templateSelected.id === 3;
	  
			return customTemplate ? customTemplate.templates.map((template) => {
			  // Reemplazar las variables en el template según el canal y el candidato
			  const message = this.replaceTemplateVariables(template.template, candidate, channel, isCustomTemplate);
	  
			  // Si es un canal de email, agregar el subject
			//   const subject = channel.type === TypeChannel.email && isCustomTemplate
			// 	? this.replaceTemplateVariables(customTemplate.templates[1].template, candidate, channel, isCustomTemplate)
			// 	: '';
	  
			  // Retornar los mensajes con la estructura adecuada
			//   return {
			// 	channel: channel.name,
			// 	message,
			// 	subject
			//   };
			}) : [];
		  });
	  
		  return {
			candidateId: candidate.id,
			candidateName: candidate.name,
			messages
		  };
		});
	  
		return dataToSend;
	  };
	  

   showMessage = () => {
	// Obtenemos el template seleccionado y los canales seleccionados
	const selectedTemplate = candidateStore.templateSelected;
	const selectedChannels = this.channels.filter(channel => channel.checked); // Canales seleccionados
	
	const candidateData = candidateStore.candidates; // Los datos de los candidatos
	
	// Generar el mensaje con los datos reemplazados
	const generatedMessages = candidateData.map(candidate => {
	  const messages = selectedChannels.flatMap(channel => {
		const customTemplate = initialTemplates.find(template => template.id === selectedTemplate.id);
		
		const isCustomTemplate = selectedTemplate.id === 3;
		return customTemplate ? customTemplate.templates.map(template => {
		  // Reemplazamos las variables en la plantilla
		  const message = this.replaceTemplateVariables(template.template, candidate, channel, isCustomTemplate);
  
		  // Si es un canal de email, también agregar el subject
		  const subject = channel.type === TypeChannel.email && isCustomTemplate
			? this.replaceTemplateVariables(customTemplate.templates[1].template, candidate, channel, isCustomTemplate)
			: '';
  
		  return {
			channel: channel.name,
			message,
			subject
		  };
		}) : [];
	  });
  
	  return {
		candidateId: candidate.id,
		candidateName: candidate.name,
		messages
	  };
	});
  
	// Mostrar los mensajes generados
	console.log(generatedMessages);
  };
}

export const candidateStore = proxy(new Candidate());