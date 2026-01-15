import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a scheduled (unsent) message',
				action: 'Delete a message',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a message by ID',
				action: 'Get a message',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many sent messages',
				action: 'Get many messages',
			},
			{
				name: 'Send',
				value: 'send',
				description: 'Send a message to lists or subscribers',
				action: 'Send a message',
			},
		],
		default: 'send',
	},
];

export const messageFields: INodeProperties[] = [
	// ----------------------------------
	//         message:send
	// ----------------------------------
	{
		displayName: 'Message Body',
		name: 'body',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		description: 'The message text to send (max 765 chars GSM-7 or 335 USC-2)',
	},
	{
		displayName: 'Send To',
		name: 'sendTo',
		type: 'options',
		required: true,
		options: [
			{
				name: 'Lists',
				value: 'lists',
				description: 'Send to one or more lists',
			},
			{
				name: 'Subscribers',
				value: 'subscribers',
				description: 'Send to specific subscribers',
			},
		],
		default: 'lists',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		description: 'Whether to send to lists or individual subscribers',
	},
	{
		displayName: 'List IDs',
		name: 'listIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				sendTo: ['lists'],
			},
		},
		description: 'Comma-separated list IDs to send to',
	},
	{
		displayName: 'Mobile Numbers',
		name: 'mobileNumbers',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
				sendTo: ['subscribers'],
			},
		},
		description: 'Comma-separated mobile numbers to send to',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
		options: [
			{
				displayName: 'Header',
				name: 'header',
				type: 'string',
				default: '',
				description: 'Message header (sender name, GSM-7 characters only)',
			},
			{
				displayName: 'Media URL',
				name: 'media_url',
				type: 'string',
				default: '',
				description: 'URL of image to include (MMS)',
			},
			{
				displayName: 'Schedule Time',
				name: 'scheduled_at',
				type: 'dateTime',
				default: '',
				description: 'Schedule message for future delivery (ISO 8601 format)',
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Internal note about this message',
			},
		],
	},

	// ----------------------------------
	//         message:get, delete
	// ----------------------------------
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['get', 'delete'],
			},
		},
		description: 'The ID of the message',
	},

	// ----------------------------------
	//         message:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['message'],
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
				resource: ['message'],
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
				resource: ['message'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'MMS', value: 'mms' },
					{ name: 'Email', value: 'email' },
				],
				default: '',
				description: 'Filter by message type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Sent', value: 'sent' },
					{ name: 'Scheduled', value: 'scheduled' },
					{ name: 'Sending', value: 'sending' },
				],
				default: '',
				description: 'Filter by message status',
			},
			{
				displayName: 'Created After',
				name: 'created_at_min',
				type: 'dateTime',
				default: '',
				description: 'Only return messages created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'created_at_max',
				type: 'dateTime',
				default: '',
				description: 'Only return messages created before this date',
			},
		],
	},
];
