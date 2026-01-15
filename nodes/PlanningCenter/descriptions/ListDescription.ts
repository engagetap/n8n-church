import type { INodeProperties } from 'n8n-workflow';

export const listOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['list'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a list by ID',
				action: 'Get a list',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many lists',
				action: 'Get many lists',
			},
			{
				name: 'Get People',
				value: 'getPeople',
				description: 'Get people from a list',
				action: 'Get people from a list',
			},
			{
				name: 'Refresh',
				value: 'refresh',
				description: 'Refresh/rerun a list to update its members (for Rules-based lists)',
				action: 'Refresh a list',
			},
		],
		default: 'getPeople',
	},
];

export const listFields: INodeProperties[] = [
	// ----------------------------------
	//         list:get
	// ----------------------------------
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['get'],
			},
		},
		description: 'The ID of the list to retrieve. Find this in the URL when viewing the list in Planning Center.',
	},

	// ----------------------------------
	//         list:refresh
	// ----------------------------------
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['refresh'],
			},
		},
		description: 'The ID of the list to refresh. This will recalculate the list members based on its rules. Only works for Rules-based lists.',
	},

	// ----------------------------------
	//         list:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['list'],
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
				resource: ['list'],
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
				resource: ['list'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter lists by name (partial match supported with %)',
			},
		],
	},

	// ----------------------------------
	//         list:getPeople
	// ----------------------------------
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getPeople'],
			},
		},
		description: 'The ID of the list to get people from. Find this in the URL when viewing the list in Planning Center (e.g., https://people.planningcenteronline.com/lists/123456).',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getPeople'],
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
				resource: ['list'],
				operation: ['getPeople'],
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
				resource: ['list'],
				operation: ['getPeople'],
			},
		},
		options: [
			{
				displayName: 'Added to List After',
				name: 'created_at_gte',
				type: 'dateTime',
				default: '',
				description: 'Only return people added to this list after this date/time. Useful for finding recent additions.',
			},
			{
				displayName: 'Added to List Before',
				name: 'created_at_lte',
				type: 'dateTime',
				default: '',
				description: 'Only return people added to this list before this date/time',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'Filter by first name',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Filter by last name',
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
				resource: ['list'],
				operation: ['getPeople'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Addresses', value: 'addresses' },
					{ name: 'Emails', value: 'emails' },
					{ name: 'Field Data', value: 'field_data' },
					{ name: 'Households', value: 'households' },
					{ name: 'Phone Numbers', value: 'phone_numbers' },
					{ name: 'Primary Campus', value: 'primary_campus' },
				],
				default: ['phone_numbers', 'emails'],
				description: 'Related resources to include in the response. Phone Numbers is essential for texting workflows.',
			},
		],
	},
];
