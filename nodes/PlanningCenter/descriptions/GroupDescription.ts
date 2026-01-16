import type { INodeProperties } from 'n8n-workflow';

export const groupOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['group'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a group by ID',
				action: 'Get a group',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many groups',
				action: 'Get many groups',
			},
		],
		default: 'getMany',
	},
];

export const groupFields: INodeProperties[] = [
	// ----------------------------------
	//         group:get
	// ----------------------------------
	{
		displayName: 'Group',
		name: 'groupId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['get'],
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
		description: 'The group to retrieve',
	},

	// ----------------------------------
	//         group:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['group'],
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
				resource: ['group'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         group:filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Group Type ID',
				name: 'groupTypeId',
				type: 'string',
				default: '',
				description: 'Filter groups by group type ID',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter groups by name',
			},
			{
				displayName: 'Enrollment Open',
				name: 'enrollmentOpen',
				type: 'boolean',
				default: false,
				description: 'Whether to only show groups with open enrollment',
			},
			{
				displayName: 'Enrollment Strategy',
				name: 'enrollmentStrategy',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
						description: 'All enrollment strategies',
					},
					{
						name: 'Open Signup',
						value: 'open_signup',
						description: 'Groups with open signup',
					},
					{
						name: 'Request to Join',
						value: 'request_to_join',
						description: 'Groups requiring request to join',
					},
					{
						name: 'Closed',
						value: 'closed',
						description: 'Groups with closed enrollment',
					},
				],
				description: 'Filter by enrollment strategy',
			},
			{
				displayName: 'Archive Status',
				name: 'filter',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
						description: 'All groups',
					},
					{
						name: 'Archived',
						value: 'archived',
						description: 'Only archived groups',
					},
					{
						name: 'Not Archived',
						value: 'not_archived',
						description: 'Only active (non-archived) groups',
					},
				],
				description: 'Filter groups by archive status',
			},
		],
	},

	// ----------------------------------
	//         group:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['group'],
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
						name: 'Group Type',
						value: 'group_type',
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
