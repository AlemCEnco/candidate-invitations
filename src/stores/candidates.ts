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
		name: 'Sms',
		checked: false,
		content: {
			message: ''
		}
	},
	{
		id: 2,
		name: 'Correo electrónico',
		checked: false,
		content: {
			subject: '',
			message: ''
		}
	},
	{
		id: 3,
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
				types: [1, 2],
				template: 'Hola, te invitamos a nuestro evento'
			}, 
			{
				types: [3],
				template: 'Hola, {{name}} te invitamos a nuestro evento'
			}
		]
	},
	{
		id: 2,
		name: 'Recordatorio',
		templates: [
			{
				types: [1, 2],
				template: 'Hola, recuerda nuestro evento'
			},
			{
				types: [3],
				template: 'Hola, {{name}} recuerda nuestro evento'
			}
		]
	},
	{
		id: 3,
		name: 'Personalizado',
		templates: [
			{
				types: [1, 2],
				template: 'Hola, {{name}} te invitamos a nuestro evento'
			},
			{
				types: [3],
				template: 'Hola, {{name}} te invitamos a nuestro evento'
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
	smsTemplate: ITemplate
	emailTemplate: ITemplate
	whatsappTemplate: ITemplate

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

}

export const candidateStore = proxy(new Candidate());