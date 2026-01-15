import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClearstreamApi implements ICredentialType {
	name = 'clearstreamApi';

	displayName = 'Clearstream API';

	documentationUrl = 'https://api-docs.clearstream.io/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Clearstream API key from account settings',
			hint: 'Find this in your Clearstream account under Settings > API',
		},
		{
			displayName: 'Webhook Key',
			name: 'webhookKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: false,
			description: 'Your Clearstream webhook authentication key (for webhook triggers)',
			hint: 'Find this in your Clearstream account under Settings > Webhooks',
		},
		{
			displayName: 'Account ID (Optional)',
			name: 'accountId',
			type: 'string',
			default: '',
			required: false,
			description: 'Optional subaccount ID if you need to access a specific subaccount',
		},
		{
			displayName: 'Default Send From Number',
			name: 'defaultNumber',
			type: 'string',
			default: '',
			required: false,
			description: 'Default phone number to send messages from (longcode or shortcode)',
			placeholder: '+15551234567',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.getclearstream.com/v1',
			url: '/account',
		},
	};
}
