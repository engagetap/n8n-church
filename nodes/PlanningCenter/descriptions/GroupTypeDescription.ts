import type { INodeProperties } from 'n8n-workflow';

export const groupTypeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['groupType'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a group type by ID',
				action: 'Get a group type',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many group types',
				action: 'Get many group types',
			},
		],
		default: 'getMany',
	},
];

export const groupTypeFields: INodeProperties[] = [
	// ----------------------------------
	//         groupType:get
	// ----------------------------------
	{
		displayName: 'Group Type',
		name: 'groupTypeId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['groupType'],
				operation: ['get'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'searchGroupTypes',
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
		description: 'The group type to retrieve',
	},

	// ----------------------------------
	//         groupType:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['groupType'],
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
				resource: ['groupType'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         groupType:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['groupType'],
				operation: ['get', 'getMany'],
			},
		},
		options: [
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				default: 'name',
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
