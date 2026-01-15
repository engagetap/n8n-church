import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

import * as crypto from 'crypto';

export class PlanningCenterTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planning Center Trigger',
		name: 'planningCenterTrigger',
		icon: 'file:planningCenter.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive real-time webhooks from Planning Center',
		defaults: {
			name: 'Planning Center Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Authenticity Secret',
				name: 'authenticitySecret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				required: true,
				description:
					'The authenticity secret from your Planning Center webhook subscription. Get this from https://api.planningcenteronline.com/webhooks',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				required: true,
				default: [],
				description: 'The events to listen for. Select the events you have subscribed to in Planning Center.',
				options: [
					// People Events
					{
						name: 'Person - Created',
						value: 'people.v2.events.person.created',
					},
					{
						name: 'Person - Updated',
						value: 'people.v2.events.person.updated',
					},
					{
						name: 'Person - Destroyed',
						value: 'people.v2.events.person.destroyed',
					},
					{
						name: 'Email - Created',
						value: 'people.v2.events.email.created',
					},
					{
						name: 'Email - Updated',
						value: 'people.v2.events.email.updated',
					},
					{
						name: 'Email - Destroyed',
						value: 'people.v2.events.email.destroyed',
					},
					{
						name: 'Phone Number - Created',
						value: 'people.v2.events.phone_number.created',
					},
					{
						name: 'Phone Number - Updated',
						value: 'people.v2.events.phone_number.updated',
					},
					{
						name: 'Phone Number - Destroyed',
						value: 'people.v2.events.phone_number.destroyed',
					},
					{
						name: 'Address - Created',
						value: 'people.v2.events.address.created',
					},
					{
						name: 'Address - Updated',
						value: 'people.v2.events.address.updated',
					},
					{
						name: 'Address - Destroyed',
						value: 'people.v2.events.address.destroyed',
					},
					{
						name: 'Form Submission - Created',
						value: 'people.v2.events.form_submission.created',
					},
					{
						name: 'Workflow Card - Created',
						value: 'people.v2.events.workflow_card.created',
					},
					{
						name: 'Workflow Card - Updated',
						value: 'people.v2.events.workflow_card.updated',
					},
					{
						name: 'Workflow Card - Destroyed',
						value: 'people.v2.events.workflow_card.destroyed',
					},
					// Services Events
					{
						name: 'Plan - Created',
						value: 'services.v2.events.plan.created',
					},
					{
						name: 'Plan - Updated',
						value: 'services.v2.events.plan.updated',
					},
					{
						name: 'Plan - Destroyed',
						value: 'services.v2.events.plan.destroyed',
					},
					{
						name: 'Team Member - Scheduled',
						value: 'services.v2.events.plan_person.created',
					},
					{
						name: 'Team Member - Updated',
						value: 'services.v2.events.plan_person.updated',
					},
					{
						name: 'Team Member - Removed',
						value: 'services.v2.events.plan_person.destroyed',
					},
					// Check-Ins Events
					{
						name: 'Check-In - Created',
						value: 'check_ins.v2.events.check_in.created',
					},
					{
						name: 'Check-In - Updated',
						value: 'check_ins.v2.events.check_in.updated',
					},
					// Giving Events
					{
						name: 'Donation - Created',
						value: 'giving.v2.events.donation.created',
					},
					{
						name: 'Donation - Updated',
						value: 'giving.v2.events.donation.updated',
					},
					{
						name: 'Donation - Destroyed',
						value: 'giving.v2.events.donation.destroyed',
					},
					// Catch-all
					{
						name: 'All Events',
						value: '*',
					},
				],
			},
			{
				displayName: 'Workflow Card Filters',
				name: 'workflowCardFilters',
				type: 'multiOptions',
				default: [],
				description: 'Only trigger on specific types of workflow card changes. Leave empty to trigger on all updates.',
				displayOptions: {
					show: {
						events: ['people.v2.events.workflow_card.updated', '*'],
					},
				},
				options: [
					{
						name: 'Step Changed',
						value: 'stepChanged',
						description: 'Card moved to a different step',
					},
					{
						name: 'Stage Changed',
						value: 'stageChanged',
						description: 'Stage changed (ready, snoozed, completed, removed)',
					},
					{
						name: 'Assignee Changed',
						value: 'assigneeChanged',
						description: 'Card assigned to a different person',
					},
					{
						name: 'Completed',
						value: 'completed',
						description: 'Card finished the workflow',
					},
					{
						name: 'Removed',
						value: 'removed',
						description: 'Card was removed from workflow',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description:
							'Whether to verify the webhook signature using the authenticity secret. Disable only for testing.',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Planning Center webhooks are created manually in the PC UI
				// We just need to provide the URL for them to configure
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Webhooks must be created manually in Planning Center
				// Nothing to do here
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Webhooks must be deleted manually in Planning Center
				// Nothing to do here
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const bodyData = this.getBodyData() as IDataObject;
		const headerData = this.getHeaderData();

		const authenticitySecret = this.getNodeParameter('authenticitySecret') as string;
		const events = this.getNodeParameter('events') as string[];
		const options = this.getNodeParameter('options') as IDataObject;
		const verifySignature = options.verifySignature !== false;

		// Verify the webhook signature
		if (verifySignature && authenticitySecret) {
			const signature = headerData['x-pco-webhooks-authenticity'] as string;

			if (!signature) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'Missing X-PCO-Webhooks-Authenticity header' },
					},
				};
			}

			// Get raw body for signature verification
			// Try to use rawBody if available, otherwise fall back to stringified body
			const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody?.toString()
				|| JSON.stringify(bodyData);
			const expectedSignature = crypto
				.createHmac('sha256', authenticitySecret)
				.update(rawBody)
				.digest('hex');

			// Use timing-safe comparison to prevent timing attacks
			const signatureBuffer = Buffer.from(signature);
			const expectedBuffer = Buffer.from(expectedSignature);

			if (
				signatureBuffer.length !== expectedBuffer.length ||
				!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
			) {
				return {
					webhookResponse: {
						status: 401,
						body: { error: 'Invalid webhook signature' },
					},
				};
			}
		}

		// Parse the webhook structure - Planning Center sends data as an array of EventDelivery objects
		const dataArray = bodyData.data as IDataObject[] | undefined;
		const eventDelivery = dataArray?.[0] as IDataObject | undefined;
		const eventAttributes = eventDelivery?.attributes as IDataObject | undefined;

		// Get the event type from the EventDelivery attributes
		const webhookType = eventAttributes?.name as string;
		const isAllEvents = events.includes('*');
		const isMatchingEvent = events.some((event) => webhookType?.includes(event) || event === webhookType);

		if (!isAllEvents && !isMatchingEvent) {
			// Event doesn't match, acknowledge but don't trigger workflow
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, ignored: true, reason: 'Event type not subscribed', receivedType: webhookType },
				},
			};
		}

		// Parse the nested payload (it's a JSON string inside the EventDelivery)
		let payload: IDataObject = {};
		try {
			const payloadString = eventAttributes?.payload as string;
			if (payloadString) {
				payload = JSON.parse(payloadString) as IDataObject;
			}
		} catch {
			// If parsing fails, use empty object
		}

		// Extract the actual resource data from the parsed payload
		const resourceData = payload.data as IDataObject | undefined;
		const attributes = (resourceData?.attributes as IDataObject) || {};
		const relationships = (resourceData?.relationships as IDataObject) || {};
		const meta = payload.meta as IDataObject | undefined;
		const previous = meta?.previous as IDataObject | undefined;

		// Calculate changes for workflow cards
		const previousRel = previous?.relationships as IDataObject | undefined;
		const previousAttrs = previous?.attributes as IDataObject | undefined;

		// Step change detection
		const currentStepRel = relationships.current_step as IDataObject | undefined;
		const currentStepData = currentStepRel?.data as IDataObject | undefined;
		const currentStepId = currentStepData?.id as string | undefined;
		const previousStepRel = previousRel?.current_step as IDataObject | undefined;
		const previousStepData = previousStepRel?.data as IDataObject | undefined;
		const previousStepId = previousStepData?.id as string | undefined;
		const stepChanged = currentStepId !== undefined && previousStepId !== undefined && currentStepId !== previousStepId;

		// Stage change detection
		const currentStage = attributes.stage as string | undefined;
		const previousStage = previousAttrs?.stage as string | undefined;
		const stageChanged = currentStage !== undefined && previousStage !== undefined && currentStage !== previousStage;

		// Assignee change detection
		const currentAssigneeRel = relationships.assignee as IDataObject | undefined;
		const currentAssigneeData = currentAssigneeRel?.data as IDataObject | undefined;
		const currentAssigneeId = currentAssigneeData?.id as string | undefined;
		const previousAssigneeRel = previousRel?.assignee as IDataObject | undefined;
		const previousAssigneeData = previousAssigneeRel?.data as IDataObject | undefined;
		const previousAssigneeId = previousAssigneeData?.id as string | undefined;
		const assigneeChanged = currentAssigneeId !== undefined && previousAssigneeId !== undefined && currentAssigneeId !== previousAssigneeId;

		// Completed detection (stage changed to completed)
		const completed = currentStage === 'completed' && previousStage !== 'completed';

		// Removed detection (stage changed to removed)
		const removed = currentStage === 'removed' && previousStage !== 'removed';

		// Apply workflow card filters if specified
		let workflowCardFilters: string[] = [];
		try {
			workflowCardFilters = this.getNodeParameter('workflowCardFilters', []) as string[];
		} catch {
			// Parameter may not exist for non-workflow-card events
		}

		if (workflowCardFilters.length > 0 && webhookType?.includes('workflow_card')) {
			const matchesFilter = workflowCardFilters.some((filter) => {
				switch (filter) {
					case 'stepChanged':
						return stepChanged;
					case 'stageChanged':
						return stageChanged;
					case 'assigneeChanged':
						return assigneeChanged;
					case 'completed':
						return completed;
					case 'removed':
						return removed;
					default:
						return false;
				}
			});

			if (!matchesFilter) {
				return {
					webhookResponse: {
						status: 200,
						body: { received: true, ignored: true, reason: 'No selected filter matched' },
					},
				};
			}
		}

		// Build the output data
		const returnData: IDataObject = {
			// Webhook metadata
			webhookId: eventDelivery?.id,
			eventType: webhookType,
			attemptNumber: eventAttributes?.attempt,
			receivedAt: new Date().toISOString(),

			// Payload data
			resourceId: resourceData?.id,
			resourceType: resourceData?.type,
			attributes,
			relationships,

			// Change detection (for workflow cards)
			changes: {
				stepChanged,
				stageChanged,
				assigneeChanged,
				completed,
				removed,
			},
			currentStepId,
			previousStepId,
			currentStage,
			previousStage,
			currentAssigneeId,
			previousAssigneeId,

			// Previous state (useful for detecting changes)
			previous,

			// Raw data for advanced use
			raw: bodyData,
		};

		return {
			workflowData: [[{ json: returnData }]],
			webhookResponse: {
				status: 200,
				body: { received: true },
			},
		};
	}
}
