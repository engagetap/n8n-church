import type { INodeProperties } from 'n8n-workflow';

export const workflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflow'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a workflow by ID',
				action: 'Get a workflow',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many workflows',
				action: 'Get many workflows',
			},
			{
				name: 'Get People',
				value: 'getPeople',
				description: 'Get all people in a workflow with their phone numbers',
				action: 'Get people in workflow',
			},
		],
		default: 'getMany',
	},
];

export const workflowFields: INodeProperties[] = [
	// ----------------------------------
	//         workflow:get
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['get'],
			},
		},
		description: 'The ID of the workflow to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Category', value: 'category' },
					{ name: 'Shared People', value: 'shared_people' },
					{ name: 'Shares', value: 'shares' },
					{ name: 'Steps', value: 'steps' },
				],
				default: [],
				description: 'Related resources to include in the response',
			},
		],
	},

	// ----------------------------------
	//         workflow:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['workflow'],
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
				resource: ['workflow'],
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
				resource: ['workflow'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter workflows by name',
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
				resource: ['workflow'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Category', value: 'category' },
					{ name: 'Shared People', value: 'shared_people' },
					{ name: 'Shares', value: 'shares' },
					{ name: 'Steps', value: 'steps' },
				],
				default: [],
				description: 'Related resources to include in the response',
			},
		],
	},

	// ----------------------------------
	//         workflow:getPeople
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getPeople'],
			},
		},
		description: 'The ID of the workflow to get people from',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getPeople'],
			},
		},
		options: [
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Ready', value: 'ready' },
					{ name: 'Snoozed', value: 'snoozed' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Removed', value: 'removed' },
				],
				default: 'ready',
				description: 'Filter by card stage',
			},
		],
	},
];
