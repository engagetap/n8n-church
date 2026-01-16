import type { INodeProperties } from 'n8n-workflow';

export const groupMembershipOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['groupMembership'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many memberships for a group',
				action: 'Get many memberships',
			},
		],
		default: 'getMany',
	},
];

export const groupMembershipFields: INodeProperties[] = [
	// ----------------------------------
	//         groupMembership:getMany
	// ----------------------------------
	{
		displayName: 'Group',
		name: 'groupId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['groupMembership'],
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
		description: 'The group to get memberships for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['groupMembership'],
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
				resource: ['groupMembership'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         groupMembership:filters
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['groupMembership'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
						description: 'All roles',
					},
					{
						name: 'Leader',
						value: 'leader',
						description: 'Only leaders',
					},
					{
						name: 'Member',
						value: 'member',
						description: 'Only members',
					},
				],
				description: 'Filter memberships by role',
			},
		],
	},

	// ----------------------------------
	//         groupMembership:options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['groupMembership'],
				operation: ['getMany'],
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
				default: 'first_name',
				options: [
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
						name: 'Joined At (Newest First)',
						value: '-joined_at',
					},
					{
						name: 'Joined At (Oldest First)',
						value: 'joined_at',
					},
				],
				description: 'How to order the results',
			},
		],
	},
];
