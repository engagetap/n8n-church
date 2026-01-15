import type { INodeProperties } from 'n8n-workflow';

export const formOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['form'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a form by ID',
				action: 'Get a form',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many forms',
				action: 'Get many forms',
			},
			{
				name: 'Get Submissions',
				value: 'getSubmissions',
				description: 'Get submissions for a form',
				action: 'Get form submissions',
			},
		],
		default: 'getSubmissions',
	},
];

export const formFields: INodeProperties[] = [
	// ----------------------------------
	//         form:get
	// ----------------------------------
	{
		displayName: 'Form ID',
		name: 'formId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['form'],
				operation: ['get'],
			},
		},
		description: 'The ID of the form to retrieve. Find this in the URL when viewing the form in Planning Center.',
	},

	// ----------------------------------
	//         form:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['form'],
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
				resource: ['form'],
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
				resource: ['form'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Active Only',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether to only return active forms',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter forms by name',
			},
		],
	},

	// ----------------------------------
	//         form:getSubmissions
	// ----------------------------------
	{
		displayName: 'Form ID',
		name: 'formId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['form'],
				operation: ['getSubmissions'],
			},
		},
		description: 'The ID of the form to get submissions from. Find this in the URL when viewing the form in Planning Center (e.g., https://people.planningcenteronline.com/forms/123456).',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['form'],
				operation: ['getSubmissions'],
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
				resource: ['form'],
				operation: ['getSubmissions'],
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
				resource: ['form'],
				operation: ['getSubmissions'],
			},
		},
		options: [
			{
				displayName: 'Submitted After',
				name: 'created_at_gte',
				type: 'dateTime',
				default: '',
				description: 'Only return submissions created after this date/time. Essential for finding recent form submissions.',
			},
			{
				displayName: 'Submitted Before',
				name: 'created_at_lte',
				type: 'dateTime',
				default: '',
				description: 'Only return submissions created before this date/time',
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
				resource: ['form'],
				operation: ['getSubmissions'],
			},
		},
		options: [
			{
				displayName: 'Include Person Details',
				name: 'includePerson',
				type: 'boolean',
				default: true,
				description: 'Whether to include the full person record for each submission. Required to get phone numbers.',
			},
			{
				displayName: 'Include Form Fields',
				name: 'includeFormFields',
				type: 'boolean',
				default: false,
				description: 'Whether to include the form field definitions',
			},
		],
	},
];
