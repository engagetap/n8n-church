import type { INodeProperties } from 'n8n-workflow';

export const checkInEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checkInEvent'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get an event by ID',
				action: 'Get an event',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many events',
				action: 'Get many events',
			},
		],
		default: 'getMany',
	},
];

export const checkInEventFields: INodeProperties[] = [
	// ----------------------------------
	//         checkInEvent:get
	// ----------------------------------
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkInEvent'],
				operation: ['get'],
			},
		},
		description: 'The ID of the event to retrieve',
	},

	// ----------------------------------
	//         checkInEvent:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['checkInEvent'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 25,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['checkInEvent'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         checkInEvent:filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkInEvent'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter events by name',
			},
			{
				displayName: 'Filter Type',
				name: 'filter',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
						description: 'All events',
					},
					{
						name: 'Archived',
						value: 'archived',
						description: 'Only archived events',
					},
					{
						name: 'Not Archived',
						value: 'not_archived',
						description: 'Only active (non-archived) events',
					},
				],
				description: 'Filter events by archive status',
			},
		],
	},

	// ----------------------------------
	//         checkInEvent:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkInEvent'],
				operation: ['get', 'getMany'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				default: [],
				options: [
					{
						name: 'Attendance Types',
						value: 'attendance_types',
					},
					{
						name: 'Event Periods',
						value: 'event_periods',
					},
					{
						name: 'Event Times',
						value: 'event_times',
					},
					{
						name: 'Locations',
						value: 'locations',
					},
				],
				description: 'Related resources to include in the response',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: '-created_at',
				options: [
					{
						name: 'Created At (Newest First)',
						value: '-created_at',
					},
					{
						name: 'Created At (Oldest First)',
						value: 'created_at',
					},
					{
						name: 'Name (A-Z)',
						value: 'name',
					},
					{
						name: 'Name (Z-A)',
						value: '-name',
					},
				],
				description: 'How to order the results',
			},
		],
	},
];
