import type { INodeProperties } from 'n8n-workflow';

export const groupEventOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['groupEvent'],
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
				description: 'Get many events for a group',
				action: 'Get many events',
			},
		],
		default: 'getMany',
	},
];

export const groupEventFields: INodeProperties[] = [
	// ----------------------------------
	//         groupEvent:get
	// ----------------------------------
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['groupEvent'],
				operation: ['get'],
			},
		},
		description: 'The ID of the event to retrieve',
	},

	// ----------------------------------
	//         groupEvent:getMany
	// ----------------------------------
	{
		displayName: 'Group',
		name: 'groupId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['groupEvent'],
				operation: ['getMany'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchGroups',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: '12345678',
			},
		],
		description: 'The group to get events for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['groupEvent'],
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
				resource: ['groupEvent'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         groupEvent:filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['groupEvent'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Starts After',
				name: 'startsAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter events starting after this date/time',
			},
			{
				displayName: 'Starts Before',
				name: 'startsBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter events starting before this date/time',
			},
			{
				displayName: 'Upcoming Only',
				name: 'upcoming',
				type: 'boolean',
				default: false,
				description: 'Whether to only show upcoming events',
			},
		],
	},

	// ----------------------------------
	//         groupEvent:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['groupEvent'],
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
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Location',
						value: 'location',
					},
				],
				description: 'Related resources to include in the response',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: 'starts_at',
				options: [
					{
						name: 'Starts At (Newest First)',
						value: '-starts_at',
					},
					{
						name: 'Starts At (Oldest First)',
						value: 'starts_at',
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
