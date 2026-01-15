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
				name: 'Add Subscriber',
				value: 'addSubscriber',
				description: 'Add a subscriber to a list',
				action: 'Add subscriber to list',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new list',
				action: 'Create a list',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a list',
				action: 'Delete a list',
			},
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
				name: 'Get Subscribers',
				value: 'getSubscribers',
				description: 'Get subscribers in a list',
				action: 'Get subscribers in list',
			},
			{
				name: 'Remove Subscriber',
				value: 'removeSubscriber',
				description: 'Remove a subscriber from a list',
				action: 'Remove subscriber from list',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a list name',
				action: 'Update a list',
			},
		],
		default: 'getMany',
	},
];

export const listFields: INodeProperties[] = [
	// ----------------------------------
	//         list:create
	// ----------------------------------
	{
		displayName: 'List Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['create'],
			},
		},
		description: 'Name of the new list',
	},

	// ----------------------------------
	//         list:get, update, delete, getSubscribers
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
				operation: ['get', 'update', 'delete', 'getSubscribers', 'addSubscriber', 'removeSubscriber'],
			},
		},
		description: 'The ID of the list',
	},

	// ----------------------------------
	//         list:update
	// ----------------------------------
	{
		displayName: 'New Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['update'],
			},
		},
		description: 'New name for the list',
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
		default: 50,
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         list:getSubscribers
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['getSubscribers'],
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
				operation: ['getSubscribers'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
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
				operation: ['getSubscribers'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by name or mobile number',
			},
		],
	},

	// ----------------------------------
	//         list:addSubscriber, removeSubscriber
	// ----------------------------------
	{
		displayName: 'Mobile Number',
		name: 'mobileNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['list'],
				operation: ['addSubscriber', 'removeSubscriber'],
			},
		},
		description: 'The mobile phone number of the subscriber',
	},
];
