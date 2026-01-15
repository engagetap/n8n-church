import type { INodeProperties } from 'n8n-workflow';

export const teamMemberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['teamMember'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get team members scheduled for a plan',
				action: 'Get team members for a plan',
			},
		],
		default: 'getMany',
	},
];

export const teamMemberFields: INodeProperties[] = [
	// ----------------------------------
	//         teamMember:getMany
	// ----------------------------------
	{
		displayName: 'Service Type ID',
		name: 'serviceTypeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['teamMember'],
				operation: ['getMany'],
			},
		},
		description: 'The ID of the service type',
	},
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['teamMember'],
				operation: ['getMany'],
			},
		},
		description: 'The ID of the plan to get team members for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['teamMember'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['teamMember'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 25,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['teamMember'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Confirmed', value: 'confirmed' },
					{ name: 'Unconfirmed', value: 'unconfirmed' },
					{ name: 'Declined', value: 'declined' },
				],
				default: '',
				description: 'Filter by confirmation status',
			},
		],
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['teamMember'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Person', value: 'person' },
					{ name: 'Team', value: 'team' },
					{ name: 'Responds To', value: 'responds_to' },
					{ name: 'Times', value: 'times' },
					{ name: 'Decline Reason', value: 'decline_reason' },
				],
				default: ['person'],
				description: 'Related resources to include. Person is essential for getting contact information.',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Name (Ascending)', value: 'name' },
					{ name: 'Name (Descending)', value: '-name' },
					{ name: 'Status (Ascending)', value: 'status' },
					{ name: 'Status (Descending)', value: '-status' },
					{ name: 'Created At (Ascending)', value: 'created_at' },
					{ name: 'Created At (Descending)', value: '-created_at' },
				],
				default: 'name',
				description: 'How to order the returned team members',
			},
		],
	},
];
