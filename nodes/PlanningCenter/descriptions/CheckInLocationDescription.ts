import type { INodeProperties } from 'n8n-workflow';

export const checkInLocationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checkInLocation'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a location by ID',
				action: 'Get a location',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many locations',
				action: 'Get many locations',
			},
		],
		default: 'getMany',
	},
];

export const checkInLocationFields: INodeProperties[] = [
	// ----------------------------------
	//         checkInLocation:get
	// ----------------------------------
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkInLocation'],
				operation: ['get'],
			},
		},
		description: 'The ID of the location to retrieve',
	},

	// ----------------------------------
	//         checkInLocation:getMany
	// ----------------------------------
	{
		displayName: 'Event',
		name: 'eventId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['checkInLocation'],
				operation: ['getMany'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchCheckInEvents',
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
		description: 'The event to get locations for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['checkInLocation'],
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
				resource: ['checkInLocation'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         checkInLocation:filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkInLocation'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Location Type',
				name: 'filter',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
						description: 'All locations',
					},
					{
						name: 'Locations Only',
						value: 'locations',
						description: 'Only regular locations',
					},
					{
						name: 'Root Locations',
						value: 'root',
						description: 'Only top-level locations',
					},
				],
				description: 'Filter locations by type',
			},
		],
	},

	// ----------------------------------
	//         checkInLocation:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkInLocation'],
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
						name: 'Check-Ins',
						value: 'check_ins',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Locations (Children)',
						value: 'locations',
					},
					{
						name: 'Options',
						value: 'options',
					},
					{
						name: 'Parent',
						value: 'parent',
					},
				],
				description: 'Related resources to include in the response',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: 'name',
				options: [
					{
						name: 'Name (A-Z)',
						value: 'name',
					},
					{
						name: 'Name (Z-A)',
						value: '-name',
					},
					{
						name: 'Position',
						value: 'position',
					},
				],
				description: 'How to order the results',
			},
		],
	},
];
