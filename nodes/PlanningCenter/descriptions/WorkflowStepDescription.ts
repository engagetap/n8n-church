import type { INodeProperties } from 'n8n-workflow';

export const workflowStepOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflowStep'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a workflow step by ID',
				action: 'Get a workflow step',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get all steps for a workflow',
				action: 'Get workflow steps',
			},
		],
		default: 'getMany',
	},
];

export const workflowStepFields: INodeProperties[] = [
	// ----------------------------------
	//         workflowStep:get
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowStep'],
				operation: ['get'],
			},
		},
		description: 'The ID of the workflow containing the step',
	},
	{
		displayName: 'Step ID',
		name: 'stepId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowStep'],
				operation: ['get'],
			},
		},
		description: 'The ID of the step to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflowStep'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Default Assignee', value: 'default_assignee' },
				],
				default: [],
				description: 'Related resources to include in the response',
			},
		],
	},

	// ----------------------------------
	//         workflowStep:getMany
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowStep'],
				operation: ['getMany'],
			},
		},
		description: 'The ID of the workflow to get steps for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['workflowStep'],
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
				resource: ['workflowStep'],
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
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflowStep'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Default Assignee', value: 'default_assignee' },
				],
				default: [],
				description: 'Related resources to include in the response',
			},
		],
	},
];
