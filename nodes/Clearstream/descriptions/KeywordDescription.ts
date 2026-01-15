import type { INodeProperties } from 'n8n-workflow';

export const keywordOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['keyword'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new keyword',
				action: 'Create a keyword',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a keyword',
				action: 'Delete a keyword',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a keyword by ID',
				action: 'Get a keyword',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all keywords',
				action: 'Get many keywords',
			},
		],
		default: 'getMany',
	},
];

export const keywordFields: INodeProperties[] = [
	// ----------------------------------
	//         keyword:create
	// ----------------------------------
	{
		displayName: 'Keyword Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['keyword'],
				operation: ['create'],
			},
		},
		description: 'The keyword text (what people will text)',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['keyword'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Opt-In List IDs',
				name: 'optin_lists',
				type: 'string',
				default: '',
				description: 'Comma-separated list IDs to add subscribers to when they text this keyword',
			},
			{
				displayName: 'Autoresponse',
				name: 'autoresponse',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Automatic reply message when someone texts this keyword',
			},
			{
				displayName: 'Autoresponse Header',
				name: 'autoresponse_header',
				type: 'string',
				default: '',
				description: 'Header for the autoresponse message',
			},
		],
	},

	// ----------------------------------
	//         keyword:get, delete
	// ----------------------------------
	{
		displayName: 'Keyword ID',
		name: 'keywordId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['keyword'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The ID of the keyword',
	},

	// ----------------------------------
	//         keyword:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['keyword'],
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
				resource: ['keyword'],
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
];
