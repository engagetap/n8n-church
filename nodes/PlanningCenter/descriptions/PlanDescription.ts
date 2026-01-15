import type { INodeProperties } from 'n8n-workflow';

export const planOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['plan'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a plan by ID',
				action: 'Get a plan',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many plans for a service type',
				action: 'Get many plans',
			},
		],
		default: 'getMany',
	},
];

export const planFields: INodeProperties[] = [
	// ----------------------------------
	//         plan:get
	// ----------------------------------
	{
		displayName: 'Service Type ID',
		name: 'serviceTypeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['get'],
			},
		},
		description: 'The ID of the service type this plan belongs to',
	},
	{
		displayName: 'Plan ID',
		name: 'planId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['get'],
			},
		},
		description: 'The ID of the plan to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Contributors', value: 'contributors' },
					{ name: 'My Schedules', value: 'my_schedules' },
					{ name: 'Plan Times', value: 'plan_times' },
					{ name: 'Series', value: 'series' },
				],
				default: [],
				description: 'Related resources to include in the response',
			},
		],
	},

	// ----------------------------------
	//         plan:getMany
	// ----------------------------------
	{
		displayName: 'Service Type ID',
		name: 'serviceTypeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['plan'],
				operation: ['getMany'],
			},
		},
		description: 'The ID of the service type to get plans for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['plan'],
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
				resource: ['plan'],
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
				resource: ['plan'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'After Date',
				name: 'after',
				type: 'dateTime',
				default: '',
				description: 'Only return plans scheduled after this date',
			},
			{
				displayName: 'Before Date',
				name: 'before',
				type: 'dateTime',
				default: '',
				description: 'Only return plans scheduled before this date',
			},
			{
				displayName: 'Future Plans Only',
				name: 'future',
				type: 'boolean',
				default: false,
				description: 'Whether to only return future plans',
			},
			{
				displayName: 'Next X Days',
				name: 'nextDays',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 7,
				description: 'Only return plans within the next X days from today. Overrides After/Before date filters.',
			},
			{
				displayName: 'Past Plans Only',
				name: 'past',
				type: 'boolean',
				default: false,
				description: 'Whether to only return past plans',
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
				resource: ['plan'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Contributors', value: 'contributors' },
					{ name: 'My Schedules', value: 'my_schedules' },
					{ name: 'Plan Times', value: 'plan_times' },
					{ name: 'Series', value: 'series' },
				],
				default: [],
				description: 'Related resources to include in the response',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Sort Date (Ascending)', value: 'sort_date' },
					{ name: 'Sort Date (Descending)', value: '-sort_date' },
					{ name: 'Title (Ascending)', value: 'title' },
					{ name: 'Title (Descending)', value: '-title' },
					{ name: 'Created At (Ascending)', value: 'created_at' },
					{ name: 'Created At (Descending)', value: '-created_at' },
					{ name: 'Updated At (Ascending)', value: 'updated_at' },
					{ name: 'Updated At (Descending)', value: '-updated_at' },
				],
				default: 'sort_date',
				description: 'How to order the returned plans',
			},
		],
	},
];
