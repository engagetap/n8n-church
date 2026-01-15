import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get account details',
				action: 'Get account details',
			},
			{
				name: 'Get Headers',
				value: 'getHeaders',
				description: 'Get recently used message headers',
				action: 'Get message headers',
			},
			{
				name: 'Get Stats',
				value: 'getStats',
				description: 'Get account statistics',
				action: 'Get account stats',
			},
		],
		default: 'get',
	},
];

export const accountFields: INodeProperties[] = [
	// No additional fields needed for account operations
];
