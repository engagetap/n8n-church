import type { INodeProperties } from 'n8n-workflow';

export const workflowCardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflowCard'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Add a person to a workflow',
				action: 'Add person to workflow',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a workflow card by ID',
				action: 'Get a workflow card',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get workflow cards',
				action: 'Get workflow cards',
			},
			{
				name: 'Go Back',
				value: 'goBack',
				description: 'Move a card back to the previous step',
				action: 'Move card back',
			},
			{
				name: 'Promote',
				value: 'promote',
				description: 'Move a card to the next step',
				action: 'Move card forward',
			},
			{
				name: 'Remove',
				value: 'remove',
				description: 'Remove a card from the workflow',
				action: 'Remove card from workflow',
			},
			{
				name: 'Restore',
				value: 'restore',
				description: 'Restore a removed card',
				action: 'Restore card',
			},
			{
				name: 'Skip Step',
				value: 'skipStep',
				description: 'Skip the current step and move to the next',
				action: 'Skip step',
			},
			{
				name: 'Snooze',
				value: 'snooze',
				description: 'Snooze a card until a specified date',
				action: 'Snooze card',
			},
			{
				name: 'Unsnooze',
				value: 'unsnooze',
				description: 'Remove snooze from a card',
				action: 'Unsnooze card',
			},
		],
		default: 'getMany',
	},
];

export const workflowCardFields: INodeProperties[] = [
	// ----------------------------------
	//         workflowCard:create
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['create'],
			},
		},
		description: 'The ID of the workflow to add the person to',
	},
	{
		displayName: 'Person ID',
		name: 'personId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['create'],
			},
		},
		description: 'The ID of the person to add to the workflow',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Assignee ID',
				name: 'assigneeId',
				type: 'string',
				default: '',
				description: 'The ID of the person to assign the card to',
			},
			{
				displayName: 'Sticky Assignment',
				name: 'stickyAssignment',
				type: 'boolean',
				default: false,
				description: 'Whether the assignee should remain assigned through all steps',
			},
		],
	},

	// ----------------------------------
	//         workflowCard:get
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['get'],
			},
		},
		description: 'The ID of the workflow containing the card',
	},
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['get'],
			},
		},
		description: 'The ID of the card to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Activities', value: 'activities' },
					{ name: 'Assignee', value: 'assignee' },
					{ name: 'Current Step', value: 'current_step' },
					{ name: 'Notes', value: 'notes' },
					{ name: 'Person', value: 'person' },
					{ name: 'Workflow', value: 'workflow' },
				],
				default: ['person'],
				description: 'Related resources to include in the response',
			},
		],
	},

	// ----------------------------------
	//         workflowCard:getMany
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['getMany'],
			},
		},
		description: 'The ID of the workflow to get cards for',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
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
				resource: ['workflowCard'],
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
				resource: ['workflowCard'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Stage',
				name: 'stage',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Ready', value: 'ready' },
					{ name: 'Snoozed', value: 'snoozed' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Removed', value: 'removed' },
				],
				default: '',
				description: 'Filter by card stage',
			},
			{
				displayName: 'Step ID',
				name: 'stepId',
				type: 'string',
				default: '',
				description: 'Filter by specific workflow step ID',
			},
			{
				displayName: 'Assignee ID',
				name: 'assigneeId',
				type: 'string',
				default: '',
				description: 'Filter by assignee person ID',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Only return cards created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdBefore',
				type: 'dateTime',
				default: '',
				description: 'Only return cards created before this date',
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
				resource: ['workflowCard'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Include',
				name: 'include',
				type: 'multiOptions',
				options: [
					{ name: 'Activities', value: 'activities' },
					{ name: 'Assignee', value: 'assignee' },
					{ name: 'Current Step', value: 'current_step' },
					{ name: 'Notes', value: 'notes' },
					{ name: 'Person', value: 'person' },
					{ name: 'Workflow', value: 'workflow' },
				],
				default: ['person'],
				description: 'Related resources to include. Person is essential for getting contact information.',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{ name: 'Created At (Ascending)', value: 'created_at' },
					{ name: 'Created At (Descending)', value: '-created_at' },
					{ name: 'Updated At (Ascending)', value: 'updated_at' },
					{ name: 'Updated At (Descending)', value: '-updated_at' },
				],
				default: '-created_at',
				description: 'How to order the returned cards',
			},
		],
	},

	// ----------------------------------
	//         workflowCard actions (shared fields)
	// ----------------------------------
	{
		displayName: 'Workflow ID',
		name: 'workflowId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['promote', 'goBack', 'skipStep', 'snooze', 'unsnooze', 'remove', 'restore'],
			},
		},
		description: 'The ID of the workflow containing the card',
	},
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['promote', 'goBack', 'skipStep', 'snooze', 'unsnooze', 'remove', 'restore'],
			},
		},
		description: 'The ID of the card to perform the action on',
	},

	// ----------------------------------
	//         workflowCard:snooze (additional field)
	// ----------------------------------
	{
		displayName: 'Snooze Until',
		name: 'snoozeUntil',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['workflowCard'],
				operation: ['snooze'],
			},
		},
		description: 'Date and time to snooze the card until',
	},
];
