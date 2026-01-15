import type {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';

export class ClearstreamTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Clearstream Trigger',
		name: 'clearstreamTrigger',
		icon: 'file:clearstream.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Clearstream webhook events for incoming texts and keywords',
		defaults: {
			name: 'Clearstream Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'clearstreamApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'responseNode',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				options: [
					{
						name: 'Incoming Text',
						value: 'text.received',
						description: 'Triggered when any text is received',
					},
					{
						name: 'Keyword Used',
						value: 'keyword.used',
						description: 'Triggered when a keyword is texted',
					},
					{
						name: 'Message Report',
						value: 'message.report',
						description: 'Triggered 30 minutes after message sent with delivery stats',
					},
					{
						name: 'Text Failed',
						value: 'text.failed',
						description: 'Triggered when an outgoing text fails',
					},
				],
				default: 'text.received',
				description: 'The Clearstream event to listen for',
			},
			{
				displayName:
					'Setup Instructions',
				name: 'setupNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						event: ['text.received', 'keyword.used', 'message.report', 'text.failed'],
					},
				},
			},
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Webhook Key',
						value: 'webhookKey',
						description: 'Verify requests using X-Clearstream-Webhook-Key header',
					},
					{
						name: 'None',
						value: 'none',
						description: 'No authentication (not recommended)',
					},
				],
				default: 'webhookKey',
				description: 'How to authenticate incoming webhook requests',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Ignore System Commands',
						name: 'ignoreSystemCommands',
						type: 'boolean',
						default: true,
						description:
							'Whether to ignore system commands like STOP, HELP, START (text.received only)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Clearstream webhooks are configured in their dashboard
				// We just need to return true to indicate the webhook is ready
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Webhook URL needs to be configured in Clearstream dashboard
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Webhook needs to be removed from Clearstream dashboard
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const event = this.getNodeParameter('event') as string;
		const authentication = this.getNodeParameter('authentication') as string;
		const options = this.getNodeParameter('options') as IDataObject;

		// Verify webhook authentication
		if (authentication === 'webhookKey') {
			const credentials = await this.getCredentials('clearstreamApi');
			const webhookKey = credentials.webhookKey as string;

			if (webhookKey) {
				const receivedKey = req.headers['x-clearstream-webhook-key'] as string;
				if (receivedKey !== webhookKey) {
					return {
						webhookResponse: {
							status: 401,
							body: { error: 'Unauthorized' },
						},
					};
				}
			}
		}

		const body = req.body as IDataObject;

		// Check if this is the event type we're listening for
		const receivedEvent = body.event as string;
		if (receivedEvent && receivedEvent !== event) {
			// Not the event we're interested in, acknowledge but don't process
			return {
				webhookResponse: {
					status: 200,
					body: { received: true, skipped: true },
				},
			};
		}

		// For text.received, optionally filter out system commands
		if (event === 'text.received' && options.ignoreSystemCommands) {
			const textBody = ((body.data as IDataObject)?.body as string) || '';
			const systemCommands = ['STOP', 'HELP', 'START', 'UNSTOP', 'CANCEL', 'END', 'QUIT'];
			if (systemCommands.includes(textBody.toUpperCase().trim())) {
				return {
					webhookResponse: {
						status: 200,
						body: { received: true, skipped: true, reason: 'system_command' },
					},
				};
			}
		}

		// Parse the incoming data
		const data = body.data as IDataObject;

		// Build enriched response data
		const outputData: IDataObject = {
			event: receivedEvent || event,
			timestamp: body.timestamp || new Date().toISOString(),
			...data,
		};

		// For text.received and keyword.used, include subscriber info if available
		if (body.subscriber) {
			outputData.subscriber = body.subscriber;
		}

		// Include thread info if available
		if (body.thread) {
			outputData.thread = body.thread;
		}

		// Include keyword info for keyword.used events
		if (body.keyword) {
			outputData.keyword = body.keyword;
		}

		// Include media if present
		if (body.media) {
			outputData.media = body.media;
		}

		return {
			workflowData: [this.helpers.returnJsonArray([outputData])],
			// Don't send a response body - let the Respond to Webhook node handle it
		};
	}
}
