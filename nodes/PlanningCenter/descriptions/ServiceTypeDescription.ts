import type { INodeProperties } from 'n8n-workflow';

export const serviceTypeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['serviceType'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a service type by ID',
				action: 'Get a service type',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many service types',
				action: 'Get many service types',
			},
		],
		default: 'getMany',
	},
];

export const serviceTypeFields: INodeProperties[] = [
	// ----------------------------------
	//         serviceType:get
	// ----------------------------------
	{
		displayName: 'Service Type ID',
		name: 'serviceTypeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['serviceType'],
				operation: ['get'],
			},
		},
		description: 'The ID of the service type to retrieve. Find this in the URL when viewing the service type in Planning Center Services.',
	},

	// ----------------------------------
	//         serviceType:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['serviceType'],
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
				resource: ['serviceType'],
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
				resource: ['serviceType'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter service types by name',
			},
		],
	},
];
