import type { INodeProperties } from 'n8n-workflow';

export const threadOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['thread'],
			},
		},
		options: [
			{
				name: 'Archive',
				value: 'archive',
				description: 'Archive a thread',
				action: 'Archive a thread',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a thread and send initial message',
				action: 'Create a thread',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a thread by ID',
				action: 'Get a thread',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many threads from inbox',
				action: 'Get many threads',
			},
			{
				name: 'Get Replies',
				value: 'getReplies',
				description: 'Get replies in a thread',
				action: 'Get thread replies',
			},
			{
				name: 'Send Reply',
				value: 'sendReply',
				description: 'Send a reply in a thread',
				action: 'Send reply to thread',
			},
			{
				name: 'Store Thread Data',
				value: 'storeThreadData',
				description: 'Prepare thread data for Data Table storage (Clearstream + Planning Center)',
				action: 'Store thread data',
			},
		],
		default: 'getMany',
	},
];

export const threadFields: INodeProperties[] = [
	// ----------------------------------
	//         thread:get, getReplies, sendReply, archive
	// ----------------------------------
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['get', 'getReplies', 'sendReply', 'archive'],
			},
		},
		description: 'The ID of the thread',
	},

	// ----------------------------------
	//         thread:create
	// ----------------------------------
	{
		displayName: 'Mobile Number',
		name: 'mobileNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['create'],
			},
		},
		description: 'The mobile number to start a thread with (E.164 format preferred)',
	},
	{
		displayName: 'Header',
		name: 'header',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['create'],
			},
		},
		description: 'Message header/sender name (GSM 7-bit characters only)',
	},
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
				resource: ['thread'],
				operation: ['create'],
			},
		},
		description: 'The initial message to send',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Send From Number',
				name: 'number',
				type: 'string',
				default: '',
				description: 'Specific longcode/shortcode to send from',
			},
			{
				displayName: 'Media URL',
				name: 'media_url',
				type: 'string',
				default: '',
				description: 'URL of image to include (MMS)',
			},
		],
	},

	// ----------------------------------
	//         thread:sendReply
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
				resource: ['thread'],
				operation: ['sendReply'],
			},
		},
		description: 'The reply message to send',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['sendReply'],
			},
		},
		options: [
			{
				displayName: 'Header',
				name: 'header',
				type: 'string',
				default: '',
				description: 'Message header (sender name)',
			},
			{
				displayName: 'Media URL',
				name: 'media_url',
				type: 'string',
				default: '',
				description: 'URL of image to include (MMS)',
			},
		],
	},

	// ----------------------------------
	//         thread:getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['thread'],
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
				resource: ['thread'],
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
				resource: ['thread'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Search Text',
				name: 'text',
				type: 'string',
				default: '',
				description: 'Search by message content',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Search by subscriber name',
			},
			{
				displayName: 'Mobile Number',
				name: 'mobile',
				type: 'string',
				default: '',
				description: 'Search by mobile number',
			},
			{
				displayName: 'Archived',
				name: 'archived',
				type: 'boolean',
				default: false,
				description: 'Whether to include archived threads',
			},
		],
	},

	// ----------------------------------
	//         thread:getReplies
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['getReplies'],
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
				resource: ['thread'],
				operation: ['getReplies'],
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

	// ----------------------------------
	//         thread:storeThreadData
	// ----------------------------------
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['storeThreadData'],
			},
		},
		description: 'The Clearstream thread ID',
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['storeThreadData'],
			},
		},
		description: 'The Planning Center person ID',
	},
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['storeThreadData'],
			},
		},
		description: 'The Planning Center workflow card ID',
	},
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['storeThreadData'],
			},
		},
		description: 'The Planning Center workflow ID',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['thread'],
				operation: ['storeThreadData'],
			},
		},
		options: [
			{
				displayName: 'Question Type',
				name: 'questionType',
				type: 'string',
				default: '',
				description: 'Label for the type of question asked (e.g., "volunteer", "membership")',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				default: '',
				description: 'The subscriber phone number',
			},
		],
	},
];
