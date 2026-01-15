import type { INodeProperties } from 'n8n-workflow';

export const personOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['person'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new person',
				action: 'Create a person',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a person',
				action: 'Delete a person',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a person by ID',
				action: 'Get a person',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many people',
				action: 'Get many people',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a person',
				action: 'Update a person',
			},
		],
		default: 'get',
	},
];

export const personFields: INodeProperties[] = [
	// ----------------------------------
	//         person:create
	// ----------------------------------
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		description: "The person's first name",
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		description: "The person's last name",
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Anniversary',
				name: 'anniversary',
				type: 'dateTime',
				default: '',
				description: "The person's anniversary date",
			},
			{
				displayName: 'Birthdate',
				name: 'birthdate',
				type: 'dateTime',
				default: '',
				description: "The person's birthdate",
			},
			{
				displayName: 'Child',
				name: 'child',
				type: 'boolean',
				default: false,
				description: 'Whether the person is a child',
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [
					{ name: 'Male', value: 'M' },
					{ name: 'Female', value: 'F' },
				],
				default: '',
				description: "The person's gender",
			},
			{
				displayName: 'Grade',
				name: 'grade',
				type: 'number',
				typeOptions: {
					minValue: -1,
					maxValue: 12,
				},
				default: 0,
				description: 'The person\'s grade level (-1 = Pre-K, 0 = Kindergarten, 1-12 = Grade)',
			},
			{
				displayName: 'Medical Notes',
				name: 'medical_notes',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Medical information for this person',
			},
			{
				displayName: 'Middle Name',
				name: 'middle_name',
				type: 'string',
				default: '',
				description: "The person's middle name",
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: "The person's nickname or \"goes by\" name",
			},
			{
				displayName: 'Site ID',
				name: 'site_id',
				type: 'string',
				default: '',
				description: 'The ID of the site to assign this person to',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: "The person's membership status",
			},
		],
	},

	// ----------------------------------
	//         person:delete
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the person to delete',
	},

	// ----------------------------------
	//         person:get
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['get'],
			},
		},
		description: 'The ID of the person to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['get'],
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
				default: [],
				description: 'Related resources to include in the response',
			},
		],
	},

	// ----------------------------------
	//         person:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['person'],
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
				resource: ['person'],
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
				resource: ['person'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Created Since',
				name: 'created_at',
				type: 'dateTime',
				default: '',
				description: 'Return people created after this date',
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
			{
				displayName: 'Search Name or Email',
				name: 'search_name_or_email',
				type: 'string',
				default: '',
				description: 'Search by name or email address',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: '',
				description: 'Filter by membership status',
			},
			{
				displayName: 'Updated Since',
				name: 'updated_at',
				type: 'dateTime',
				default: '',
				description: 'Return people updated after this date',
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
				resource: ['person'],
				operation: ['getMany'],
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
				default: [],
				description: 'Related resources to include in the response',
			},
			{
				displayName: 'Order By',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Created At', value: 'created_at' },
					{ name: 'First Name', value: 'first_name' },
					{ name: 'Last Name', value: 'last_name' },
					{ name: 'Updated At', value: 'updated_at' },
				],
				default: 'last_name',
				description: 'Field to sort results by',
			},
		],
	},

	// ----------------------------------
	//         person:update
	// ----------------------------------
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['update'],
			},
		},
		description: 'The ID of the person to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['person'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Anniversary',
				name: 'anniversary',
				type: 'dateTime',
				default: '',
				description: "The person's anniversary date",
			},
			{
				displayName: 'Birthdate',
				name: 'birthdate',
				type: 'dateTime',
				default: '',
				description: "The person's birthdate",
			},
			{
				displayName: 'Child',
				name: 'child',
				type: 'boolean',
				default: false,
				description: 'Whether the person is a child',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: "The person's first name",
			},
			{
				displayName: 'Gender',
				name: 'gender',
				type: 'options',
				options: [
					{ name: 'Male', value: 'M' },
					{ name: 'Female', value: 'F' },
				],
				default: '',
				description: "The person's gender",
			},
			{
				displayName: 'Grade',
				name: 'grade',
				type: 'number',
				typeOptions: {
					minValue: -1,
					maxValue: 12,
				},
				default: 0,
				description: 'The person\'s grade level (-1 = Pre-K, 0 = Kindergarten, 1-12 = Grade)',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: "The person's last name",
			},
			{
				displayName: 'Medical Notes',
				name: 'medical_notes',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Medical information for this person',
			},
			{
				displayName: 'Middle Name',
				name: 'middle_name',
				type: 'string',
				default: '',
				description: "The person's middle name",
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: "The person's nickname or \"goes by\" name",
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: "The person's membership status",
			},
		],
	},
];
