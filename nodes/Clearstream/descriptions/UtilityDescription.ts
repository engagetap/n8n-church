import type { INodeProperties } from 'n8n-workflow';

export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Verify Response',
				value: 'verifyResponse',
				description: 'Check if a value matches any of the expected responses',
				action: 'Verify response',
			},
		],
		default: 'verifyResponse',
	},
];

export const utilityFields: INodeProperties[] = [
	// ----------------------------------
	//         utility:verifyResponse
	// ----------------------------------
	{
		displayName: 'Input Value',
		name: 'inputValue',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['verifyResponse'],
			},
		},
		description: 'The value to check (e.g., the response text from a message)',
	},
	{
		displayName: 'True Values',
		name: 'trueValues',
		type: 'string',
		required: true,
		default: 'yes, 1, y, true',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['verifyResponse'],
			},
		},
		description: 'Comma-separated list of values that should return true (e.g., "yes, 1, y, true")',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['verifyResponse'],
			},
		},
		options: [
			{
				displayName: 'Case Sensitive',
				name: 'caseSensitive',
				type: 'boolean',
				default: false,
				description: 'Whether the comparison should be case sensitive',
			},
			{
				displayName: 'Trim Whitespace',
				name: 'trimWhitespace',
				type: 'boolean',
				default: true,
				description: 'Whether to trim whitespace from the input and true values before comparing',
			},
			{
				displayName: 'Match Mode',
				name: 'matchMode',
				type: 'options',
				options: [
					{
						name: 'Exact',
						value: 'exact',
						description: 'Input must exactly match one of the true values',
					},
					{
						name: 'Contains',
						value: 'contains',
						description: 'Input must contain one of the true values',
					},
					{
						name: 'Starts With',
						value: 'startsWith',
						description: 'Input must start with one of the true values',
					},
					{
						name: 'Ends With',
						value: 'endsWith',
						description: 'Input must end with one of the true values',
					},
					{
						name: 'Regex',
						value: 'regex',
						description: 'True values are treated as regular expressions',
					},
				],
				default: 'exact',
				description: 'How to compare the input against true values',
			},
			{
				displayName: 'False Values',
				name: 'falseValues',
				type: 'string',
				default: '',
				description: 'Comma-separated list of values that should explicitly return false (checked before true values). Leave empty to treat all non-true values as false.',
			},
			{
				displayName: 'Return Unknown For Non-Match',
				name: 'returnUnknown',
				type: 'boolean',
				default: false,
				description: 'Whether to return "unknown" instead of false when input doesn\'t match true or false values. Useful when you need to handle unexpected responses differently.',
			},
			{
				displayName: 'Include Match Details',
				name: 'includeMatchDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to include details about which value matched in the output',
			},
		],
	},
];
