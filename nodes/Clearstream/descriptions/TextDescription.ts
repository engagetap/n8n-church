import type { INodeProperties } from 'n8n-workflow';

export const textOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['text'],
			},
		},
		options: [
			{
				name: 'Send',
				value: 'send',
				description: 'Send a one-off text to one or more numbers',
				action: 'Send a text',
			},
		],
		default: 'send',
	},
];

export const textFields: INodeProperties[] = [
	// ----------------------------------
	//         text:send
	// ----------------------------------
	{
		displayName: 'Mobile Numbers',
		name: 'mobileNumbers',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['send'],
			},
		},
		description: 'Comma-separated mobile numbers to send to (creates inactive subscribers if needed)',
	},
	{
		displayName: 'Message Body',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['send'],
			},
		},
		description: 'The message text to send',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['text'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Header',
				name: 'header',
				type: 'string',
				default: '',
				description: 'Message header (sender name)',
			},
			{
				displayName: 'Media URL',
				name: 'media_url',
				type: 'string',
				default: '',
				description: 'URL of image to include (MMS)',
			},
		],
	},
];
