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
	IDLE = 'idle',
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
	candidateStatus: CandidateStatus = CandidateStatus.IDLE;
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
		const checkedCandidates = this.candidates.filter((candidate) => candidate.checked)
		const isCustomTemplate = this.templateSelected.id === 3

		return checkedCandidates.flatMap((candidate) => 
			checkedChannels.flatMap((channel) => 
				this.templateSelected.templates
					.filter((template) => template.types.some((type) => type === channel.id))
					.map((template) => ({
						...template,
						template: this.replaceTemplateVariables(template.template, candidate, channel, isCustomTemplate)
					}))
			)
		)
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
}

export const candidateStore = proxy(new Candidate());