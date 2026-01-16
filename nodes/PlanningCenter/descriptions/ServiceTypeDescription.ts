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
		displayName: 'Service Type',
		name: 'serviceTypeId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['serviceType'],
				operation: ['get'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchServiceTypes',
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
		description: 'The service type to retrieve',
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
