import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PlanningCenterApi implements ICredentialType {
	name = 'planningCenterApi';

	displayName = 'Planning Center API';

	documentationUrl = 'https://developer.planning.center/docs/#/overview/authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'Application ID',
			name: 'applicationId',
			type: 'string',
			default: '',
			required: true,
			description: 'The Application ID from your Planning Center Personal Access Token',
			hint: 'Find this at https://api.planningcenteronline.com/oauth/applications',
		},
		{
			displayName: 'Secret',
			name: 'secret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Secret from your Planning Center Personal Access Token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.applicationId}}',
				password: '={{$credentials.secret}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.planningcenteronline.com',
			url: '/people/v2/me',
		},
	};
}
