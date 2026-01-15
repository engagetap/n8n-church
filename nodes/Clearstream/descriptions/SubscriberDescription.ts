import type { INodeProperties } from 'n8n-workflow';

export const subscriberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['subscriber'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new subscriber',
				action: 'Create a subscriber',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Opt-out a subscriber',
				action: 'Delete a subscriber',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a subscriber by phone number',
				action: 'Get a subscriber',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many subscribers',
				action: 'Get many subscribers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a subscriber',
				action: 'Update a subscriber',
			},
		],
		default: 'getMany',
	},
];

export const subscriberFields: INodeProperties[] = [
	// ----------------------------------
	//         subscriber:create
	// ----------------------------------
	{
		displayName: 'Mobile Number',
		name: 'mobileNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscriber'],
				operation: ['create'],
			},
		},
		description: 'The mobile phone number (E.164 format preferred, e.g., +15551234567)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscriber'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'first',
				type: 'string',
				default: '',
				description: 'Subscriber first name',
			},
			{
				displayName: 'Last Name',
				name: 'last',
				type: 'string',
				default: '',
				description: 'Subscriber last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Subscriber email address',
			},
			{
				displayName: 'List IDs',
				name: 'lists',
				type: 'string',
				default: '',
				description: 'Comma-separated list IDs to add subscriber to',
			},
			{
				displayName: 'Tag IDs',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs to add to subscriber',
			},
			{
				displayName: 'Double Opt-In',
				name: 'double_optin',
				type: 'boolean',
				default: false,
				description: 'Whether to require double opt-in confirmation',
			},
			{
				displayName: 'Send Autoresponse',
				name: 'autoresponse',
				type: 'boolean',
				default: false,
				description: 'Whether to send opt-in autoresponse text',
			},
			{
				displayName: 'Integration ID',
				name: 'integration_id',
				type: 'string',
				default: '',
				description: 'External ID for integration purposes',
			},
		],
	},

	// ----------------------------------
	//         subscriber:get
	// ----------------------------------
	{
		displayName: 'Mobile Number',
		name: 'mobileNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['subscriber'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The mobile phone number of the subscriber',
	},

	// ----------------------------------
	//         subscriber:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['subscriber'],
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
				resource: ['subscriber'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscriber'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Filter by subscriber status',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Search by name',
			},
			{
				displayName: 'Mobile Number',
				name: 'mobile',
				type: 'string',
				default: '',
				description: 'Search by mobile number',
			},
			{
				displayName: 'Created After',
				name: 'created_at_min',
				type: 'dateTime',
				default: '',
				description: 'Only return subscribers created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'created_at_max',
				type: 'dateTime',
				default: '',
				description: 'Only return subscribers created before this date',
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
				resource: ['subscriber'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Sort By',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'Full Name (A-Z)', value: 'full_name' },
					{ name: 'Full Name (Z-A)', value: '-full_name' },
					{ name: 'Created (Oldest)', value: 'created_at' },
					{ name: 'Created (Newest)', value: '-created_at' },
					{ name: 'Updated (Oldest)', value: 'updated_at' },
					{ name: 'Updated (Newest)', value: '-updated_at' },
				],
				default: '-created_at',
				description: 'How to sort the results',
			},
		],
	},

	// ----------------------------------
	//         subscriber:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscriber'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'first',
				type: 'string',
				default: '',
				description: 'Subscriber first name',
			},
			{
				displayName: 'Last Name',
				name: 'last',
				type: 'string',
				default: '',
				description: 'Subscriber last name',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Subscriber email address',
			},
			{
				displayName: 'Add to List IDs',
				name: 'add_lists',
				type: 'string',
				default: '',
				description: 'Comma-separated list IDs to add subscriber to',
			},
			{
				displayName: 'Remove from List IDs',
				name: 'remove_lists',
				type: 'string',
				default: '',
				description: 'Comma-separated list IDs to remove subscriber from',
			},
			{
				displayName: 'Add Tag IDs',
				name: 'add_tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs to add to subscriber',
			},
			{
				displayName: 'Remove Tag IDs',
				name: 'remove_tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tag IDs to remove from subscriber',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active (Opt In)', value: 'active' },
					{ name: 'Inactive (Opt Out)', value: 'inactive' },
				],
				default: 'active',
				description: 'Change subscriber opt-in status',
			},
			{
				displayName: 'Integration ID',
				name: 'integration_id',
				type: 'string',
				default: '',
				description: 'External ID for integration purposes',
			},
		],
	},

	// ----------------------------------
	//         subscriber:delete
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'deleteOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['subscriber'],
				operation: ['delete'],
			},
		},
		options: [
			{
				displayName: 'Include Subaccounts',
				name: 'include_subaccounts',
				type: 'boolean',
				default: false,
				description: 'Whether to opt-out from all subaccounts as well',
			},
		],
	},
];
