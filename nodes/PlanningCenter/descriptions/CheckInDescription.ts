import type { INodeProperties } from 'n8n-workflow';

export const checkInOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['checkIn'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a check-in by ID',
				action: 'Get a check-in',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many check-ins',
				action: 'Get many check-ins',
			},
		],
		default: 'getMany',
	},
];

export const checkInFields: INodeProperties[] = [
	// ----------------------------------
	//         checkIn:get
	// ----------------------------------
	{
		displayName: 'Check-In ID',
		name: 'checkInId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['checkIn'],
				operation: ['get'],
			},
		},
		description: 'The ID of the check-in to retrieve',
	},

	// ----------------------------------
	//         checkIn:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['checkIn'],
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
				resource: ['checkIn'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         checkIn:filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkIn'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Event ID',
				name: 'eventId',
				type: 'string',
				default: '',
				description: 'Filter check-ins by event ID',
			},
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				default: '',
				description: 'Filter check-ins by location ID',
			},
			{
				displayName: 'Person ID',
				name: 'personId',
				type: 'string',
				default: '',
				description: 'Filter check-ins by person ID (from People product)',
			},
			{
				displayName: 'Status',
				name: 'filter',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
						description: 'All check-ins',
					},
					{
						name: 'Checked Out',
						value: 'checked_out',
						description: 'Only checked-out attendees',
					},
					{
						name: 'First Time',
						value: 'first_time',
						description: 'Only first-time attendees',
					},
					{
						name: 'Guest',
						value: 'guest',
						description: 'Only guests',
					},
					{
						name: 'Not Checked Out',
						value: 'not_checked_out',
						description: 'Only currently checked-in (not yet checked out)',
					},
					{
						name: 'Regular',
						value: 'regular',
						description: 'Only regular attendees',
					},
					{
						name: 'Volunteer',
						value: 'volunteer',
						description: 'Only volunteers',
					},
				],
				description: 'Filter check-ins by status',
			},
			{
				displayName: 'Security Code',
				name: 'securityCode',
				type: 'string',
				default: '',
				description: 'Filter by security code',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter check-ins created after this date/time',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter check-ins created before this date/time',
			},
			{
				displayName: 'Checked Out After',
				name: 'checkedOutAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter check-ins checked out after this date/time',
			},
		],
	},

	// ----------------------------------
	//         checkIn:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['checkIn'],
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
						name: 'Checked In At (Station)',
						value: 'checked_in_at',
					},
					{
						name: 'Checked In By',
						value: 'checked_in_by',
					},
					{
						name: 'Checked Out By',
						value: 'checked_out_by',
					},
					{
						name: 'Event',
						value: 'event',
					},
					{
						name: 'Event Period',
						value: 'event_period',
					},
					{
						name: 'Event Times',
						value: 'event_times',
					},
					{
						name: 'Locations',
						value: 'locations',
					},
					{
						name: 'Options',
						value: 'options',
					},
					{
						name: 'Person',
						value: 'person',
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
						name: 'Checked Out At (Most Recent First)',
						value: '-checked_out_at',
					},
					{
						name: 'Checked Out At (Oldest First)',
						value: 'checked_out_at',
					},
					{
						name: 'Created At (Newest First)',
						value: '-created_at',
					},
					{
						name: 'Created At (Oldest First)',
						value: 'created_at',
					},
					{
						name: 'First Name (A-Z)',
						value: 'first_name',
					},
					{
						name: 'First Name (Z-A)',
						value: '-first_name',
					},
					{
						name: 'Last Name (A-Z)',
						value: 'last_name',
					},
					{
						name: 'Last Name (Z-A)',
						value: '-last_name',
					},
					{
						name: 'Number',
						value: 'number',
					},
				],
				description: 'How to order the results',
			},
		],
	},
];
