import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	clearstreamApiRequest,
	clearstreamApiRequestAllItems,
	formatPhoneNumber,
} from './GenericFunctions';

import {
	accountFields,
	accountOperations,
	keywordFields,
	keywordOperations,
	listFields,
	listOperations,
	messageFields,
	messageOperations,
	subscriberFields,
	subscriberOperations,
	tagFields,
	tagOperations,
	textFields,
	textOperations,
	threadFields,
	threadOperations,
	utilityFields,
	utilityOperations,
} from './descriptions';

export class Clearstream implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Clearstream',
		name: 'clearstream',
		icon: 'file:clearstream.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send SMS messages and manage subscribers with Clearstream',
		defaults: {
			name: 'Clearstream',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clearstreamApi',
				required: true,
			},
			{
				name: 'planningCenterApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['utility'],
						operation: ['validateThreadData'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Keyword',
						value: 'keyword',
					},
					{
						name: 'List',
						value: 'list',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Subscriber',
						value: 'subscriber',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'Thread',
						value: 'thread',
					},
					{
						name: 'Utility',
						value: 'utility',
					},
				],
				default: 'subscriber',
			},
			// Account
			...accountOperations,
			...accountFields,
			// Keyword
			...keywordOperations,
			...keywordFields,
			// List
			...listOperations,
			...listFields,
			// Message
			...messageOperations,
			...messageFields,
			// Subscriber
			...subscriberOperations,
			...subscriberFields,
			// Tag
			...tagOperations,
			...tagFields,
			// Text
			...textOperations,
			...textFields,
			// Thread
			...threadOperations,
			...threadFields,
			// Utility
			...utilityOperations,
			...utilityFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ==========================================
				// Account resource
				// ==========================================
				if (resource === 'account') {
					if (operation === 'get') {
						responseData = await clearstreamApiRequest.call(this, 'GET', '/account');
					}

					if (operation === 'getHeaders') {
						responseData = await clearstreamApiRequest.call(this, 'GET', '/account/headers');
					}

					if (operation === 'getStats') {
						responseData = await clearstreamApiRequest.call(this, 'GET', '/stats/account');
					}
				}

				// ==========================================
				// Subscriber resource
				// ==========================================
				if (resource === 'subscriber') {
					if (operation === 'create') {
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							mobile_number: mobileNumber,
							...additionalFields,
						};

						responseData = await clearstreamApiRequest.call(this, 'POST', '/subscribers', body);
					}

					if (operation === 'get') {
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						responseData = await clearstreamApiRequest.call(
							this,
							'GET',
							`/subscribers/${encodeURIComponent(mobileNumber)}`,
						);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = { ...filters, ...options };

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(
								this,
								'GET',
								'/subscribers',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								'/subscribers',
								{},
								qs,
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						responseData = await clearstreamApiRequest.call(
							this,
							'PATCH',
							`/subscribers/${encodeURIComponent(mobileNumber)}`,
							updateFields,
						);
					}

					if (operation === 'delete') {
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						const deleteOptions = this.getNodeParameter('deleteOptions', i) as IDataObject;
						const qs: IDataObject = {};

						if (deleteOptions.include_subaccounts) {
							qs.include_subaccounts = true;
						}

						responseData = await clearstreamApiRequest.call(
							this,
							'DELETE',
							`/subscribers/${encodeURIComponent(mobileNumber)}`,
							{},
							qs,
						);
					}
				}

				// ==========================================
				// List resource
				// ==========================================
				if (resource === 'list') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'POST', '/lists', { name });
					}

					if (operation === 'get') {
						const listId = this.getNodeParameter('listId', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'GET', `/lists/${listId}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(this, 'GET', '/lists');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								'/lists',
								{},
								{ limit },
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'update') {
						const listId = this.getNodeParameter('listId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'PATCH', `/lists/${listId}`, {
							name,
						});
					}

					if (operation === 'delete') {
						const listId = this.getNodeParameter('listId', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'DELETE', `/lists/${listId}`);
					}

					if (operation === 'getSubscribers') {
						const listId = this.getNodeParameter('listId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(
								this,
								'GET',
								`/lists/${listId}/subscribers`,
								{},
								filters,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								`/lists/${listId}/subscribers`,
								{},
								{ ...filters, limit },
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'addSubscriber') {
						const listId = this.getNodeParameter('listId', i) as string;
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						responseData = await clearstreamApiRequest.call(
							this,
							'POST',
							`/lists/${listId}/subscribers`,
							{ mobile_number: mobileNumber },
						);
					}

					if (operation === 'removeSubscriber') {
						const listId = this.getNodeParameter('listId', i) as string;
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						responseData = await clearstreamApiRequest.call(
							this,
							'DELETE',
							`/lists/${listId}/subscribers/${encodeURIComponent(mobileNumber)}`,
						);
					}
				}

				// ==========================================
				// Message resource
				// ==========================================
				if (resource === 'message') {
					if (operation === 'send') {
						const credentials = await this.getCredentials('clearstreamApi');
						const body = this.getNodeParameter('body', i) as string;
						const sendTo = this.getNodeParameter('sendTo', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const requestBody: IDataObject = {
							body,
							...options,
						};

						if (sendTo === 'lists') {
							const listIds = this.getNodeParameter('listIds', i) as string;
							requestBody.lists = listIds.split(',').map((id) => id.trim());
						} else {
							const mobileNumbers = this.getNodeParameter('mobileNumbers', i) as string;
							requestBody.subscribers = mobileNumbers
								.split(',')
								.map((num) => formatPhoneNumber(num.trim()));
						}

						// Use default number from credentials if not specified in options
						if (!requestBody.number && credentials.defaultNumber) {
							requestBody.number = credentials.defaultNumber;
						}

						responseData = await clearstreamApiRequest.call(this, 'POST', '/messages', requestBody);
					}

					if (operation === 'get') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'GET', `/messages/${messageId}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.type) qs.type = filters.type;
						if (filters.status) qs.status = filters.status;
						if (filters.created_at_min) qs.created_at_min = filters.created_at_min;
						if (filters.created_at_max) qs.created_at_max = filters.created_at_max;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(
								this,
								'GET',
								'/messages',
								{},
								qs,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.limit = limit;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								'/messages',
								{},
								qs,
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'delete') {
						const messageId = this.getNodeParameter('messageId', i) as string;
						responseData = await clearstreamApiRequest.call(
							this,
							'DELETE',
							`/messages/${messageId}`,
						);
					}
				}

				// ==========================================
				// Text resource
				// ==========================================
				if (resource === 'text') {
					if (operation === 'send') {
						const mobileNumbers = this.getNodeParameter('mobileNumbers', i) as string;
						const body = this.getNodeParameter('body', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const requestBody: IDataObject = {
							receivers: mobileNumbers.split(',').map((num) => formatPhoneNumber(num.trim())),
							body,
							...options,
						};

						responseData = await clearstreamApiRequest.call(this, 'POST', '/texts', requestBody);
					}
				}

				// ==========================================
				// Thread resource
				// ==========================================
				if (resource === 'thread') {
					if (operation === 'get') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'GET', `/threads/${threadId}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(
								this,
								'GET',
								'/threads',
								{},
								filters,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								'/threads',
								{},
								{ ...filters, limit },
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'getReplies') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(
								this,
								'GET',
								`/threads/${threadId}/replies`,
							);
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								`/threads/${threadId}/replies`,
								{},
								{ limit },
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'sendReply') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const body = this.getNodeParameter('body', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						responseData = await clearstreamApiRequest.call(
							this,
							'POST',
							`/threads/${threadId}/replies`,
							{ text: body, ...options },
						);
					}

					if (operation === 'create') {
						const credentials = await this.getCredentials('clearstreamApi');
						const mobileNumber = formatPhoneNumber(
							this.getNodeParameter('mobileNumber', i) as string,
						);
						const body = this.getNodeParameter('body', i) as string;
						const header = this.getNodeParameter('header', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const requestBody: IDataObject = {
							mobile_number: mobileNumber,
							reply_header: header,
							reply_body: body,
							...options,
						};

						// Use default number from credentials if not specified in options
						if (!requestBody.number && credentials.defaultNumber) {
							requestBody.number = credentials.defaultNumber;
						}

						responseData = await clearstreamApiRequest.call(this, 'POST', '/threads', requestBody);
					}

					if (operation === 'archive') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						responseData = await clearstreamApiRequest.call(
							this,
							'DELETE',
							`/threads/${threadId}`,
						);
					}

					if (operation === 'storeThreadData') {
						const threadId = this.getNodeParameter('threadId', i) as string;
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						// Build the data structure for Data Table storage
						const valueObj = {
							threadId,
							personId,
							cardId,
							workflowId,
							sentAt: Date.now(),
							status: 'awaiting_response',
							...additionalFields,
						};

						responseData = {
							key: String(threadId),
							value: JSON.stringify(valueObj),
						};
					}
				}

				// ==========================================
				// Keyword resource
				// ==========================================
				if (resource === 'keyword') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const requestBody: IDataObject = { name };

						if (options.optin_lists) {
							requestBody.optin_lists = (options.optin_lists as string)
								.split(',')
								.map((id) => id.trim());
						}
						if (options.autoresponse) {
							requestBody.autoresponse = options.autoresponse;
						}
						if (options.autoresponse_header) {
							requestBody.autoresponse_header = options.autoresponse_header;
						}

						responseData = await clearstreamApiRequest.call(
							this,
							'POST',
							'/keywords',
							requestBody,
						);
					}

					if (operation === 'get') {
						const keywordId = this.getNodeParameter('keywordId', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'GET', `/keywords/${keywordId}`);
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(this, 'GET', '/keywords');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								'/keywords',
								{},
								{ limit },
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'delete') {
						const keywordId = this.getNodeParameter('keywordId', i) as string;
						responseData = await clearstreamApiRequest.call(
							this,
							'DELETE',
							`/keywords/${keywordId}`,
						);
					}
				}

				// ==========================================
				// Tag resource
				// ==========================================
				if (resource === 'tag') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						responseData = await clearstreamApiRequest.call(this, 'POST', '/tags', { name });
					}

					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await clearstreamApiRequestAllItems.call(this, 'GET', '/tags');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const response = await clearstreamApiRequest.call(
								this,
								'GET',
								'/tags',
								{},
								{ limit },
							);
							responseData = (response.data as IDataObject[]) || [];
						}
					}

					if (operation === 'addToSubscribers') {
						const tagId = this.getNodeParameter('tagId', i) as string;
						const mobileNumbers = this.getNodeParameter('mobileNumbers', i) as string;

						responseData = await clearstreamApiRequest.call(
							this,
							'POST',
							`/tags/${tagId}/subscribers`,
							{
								mobile_numbers: mobileNumbers.split(',').map((num) => formatPhoneNumber(num.trim())),
							},
						);
					}
				}

				// ==========================================
				// Utility resource
				// ==========================================
				if (resource === 'utility') {
					if (operation === 'validateThreadData') {
						const webhookThreadId = this.getNodeParameter('webhookThreadId', i) as string;
						const storedData = this.getNodeParameter('storedData', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						// Parse options
						const webhookPhone = (options.webhookPhone as string) || '';
						const messageBody = (options.messageBody as string) || '';
						const maxResponseTime = (options.maxResponseTime as number) || 0;
						const requiredStatus = (options.requiredStatus as string) || '';
						const normalizePhones = options.normalizePhones !== false; // Default true

						// Helper to normalize phone numbers
						const normalizePhone = (phone: string): string => {
							if (!normalizePhones) return phone;
							return phone.replace(/\D/g, '');
						};

						// Try to parse stored data
						let parsedData: IDataObject;
						try {
							parsedData = JSON.parse(storedData) as IDataObject;
						} catch {
							responseData = {
								isValid: false,
								error: 'Invalid stored data - could not parse JSON',
								storedData,
							};
							// Skip to next iteration
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray(responseData),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);
							continue;
						}

						// Validate thread ID match
						const storedThreadId = String(parsedData.threadId || '');
						const threadIdMatch = String(webhookThreadId) === storedThreadId;

						if (!threadIdMatch) {
							responseData = {
								isValid: false,
								error: 'Thread ID mismatch',
								expectedThreadId: storedThreadId,
								receivedThreadId: webhookThreadId,
							};
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray(responseData),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);
							continue;
						}

						// Validate phone number if provided
						let phoneMatch = true;
						if (webhookPhone && parsedData.phoneNumber) {
							const normalizedWebhookPhone = normalizePhone(webhookPhone);
							const normalizedStoredPhone = normalizePhone(String(parsedData.phoneNumber));
							phoneMatch = normalizedWebhookPhone === normalizedStoredPhone;

							if (!phoneMatch) {
								responseData = {
									isValid: false,
									error: 'Phone number mismatch',
									expectedPhone: parsedData.phoneNumber,
									receivedPhone: webhookPhone,
								};
								const executionData = this.helpers.constructExecutionMetaData(
									this.helpers.returnJsonArray(responseData),
									{ itemData: { item: i } },
								);
								returnData.push(...executionData);
								continue;
							}
						}

						// Validate status if required
						if (requiredStatus && parsedData.status !== requiredStatus) {
							responseData = {
								isValid: false,
								error: 'Status mismatch',
								expectedStatus: requiredStatus,
								currentStatus: parsedData.status,
							};
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray(responseData),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);
							continue;
						}

						// Calculate response time
						const now = Date.now();
						const sentAt = parsedData.sentAt as number || 0;
						const responseTime = sentAt ? now - sentAt : 0;

						// Validate response time if max is set
						if (maxResponseTime > 0 && responseTime > maxResponseTime) {
							responseData = {
								isValid: false,
								error: 'Response time exceeded',
								maxResponseTime,
								actualResponseTime: responseTime,
								sentAt,
							};
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray(responseData),
								{ itemData: { item: i } },
							);
							returnData.push(...executionData);
							continue;
						}

						// Verify card with Planning Center if enabled
						const verifyWithPlanningCenter = options.verifyWithPlanningCenter as boolean || false;
						const requiredCardStage = (options.requiredCardStage as string) || 'ready';
						let cardStage = '';
						let cardData: IDataObject | null = null;

						if (verifyWithPlanningCenter) {
							const personId = parsedData.personId as string;
							const cardId = parsedData.cardId as string;

							if (!personId || !cardId) {
								responseData = {
									isValid: false,
									error: 'Missing personId or cardId for Planning Center verification',
									personId: personId || 'missing',
									cardId: cardId || 'missing',
								};
								const executionData = this.helpers.constructExecutionMetaData(
									this.helpers.returnJsonArray(responseData),
									{ itemData: { item: i } },
								);
								returnData.push(...executionData);
								continue;
							}

							try {
								// Get Planning Center credentials
								const pcCredentials = await this.getCredentials('planningCenterApi');
								const appId = pcCredentials.appId as string;
								const secret = pcCredentials.secret as string;
								const authString = Buffer.from(`${appId}:${secret}`).toString('base64');

								// Make API call to get the workflow card
								const pcResponse = await this.helpers.httpRequest({
									method: 'GET',
									url: `https://api.planningcenteronline.com/people/v2/people/${personId}/workflow_cards/${cardId}`,
									headers: {
										'Authorization': `Basic ${authString}`,
										'Content-Type': 'application/json',
									},
									json: true,
								});

								if (pcResponse.data) {
									cardData = pcResponse.data as IDataObject;
									const attributes = cardData.attributes as IDataObject || {};
									cardStage = attributes.stage as string || '';

									// Check card stage based on required stage
									let stageValid = false;
									switch (requiredCardStage) {
										case 'any':
											stageValid = true;
											break;
										case 'any_active':
											stageValid = cardStage !== 'removed';
											break;
										case 'ready':
											stageValid = cardStage === 'ready';
											break;
										case 'snoozed':
											stageValid = cardStage === 'snoozed';
											break;
										default:
											stageValid = cardStage === requiredCardStage;
									}

									if (!stageValid) {
										responseData = {
											isValid: false,
											error: 'Card stage does not match required stage',
											requiredStage: requiredCardStage,
											actualStage: cardStage,
											cardId,
											personId,
										};
										const executionData = this.helpers.constructExecutionMetaData(
											this.helpers.returnJsonArray(responseData),
											{ itemData: { item: i } },
										);
										returnData.push(...executionData);
										continue;
									}
								}
							} catch (pcError) {
								const errorMessage = (pcError as Error).message || 'Unknown error';
								// Check if it's a 404 (card not found)
								if (errorMessage.includes('404') || errorMessage.includes('not found')) {
									responseData = {
										isValid: false,
										error: 'Workflow card not found in Planning Center',
										cardId,
										personId,
									};
								} else {
									responseData = {
										isValid: false,
										error: 'Failed to verify card with Planning Center',
										details: errorMessage,
										cardId,
										personId,
									};
								}
								const executionData = this.helpers.constructExecutionMetaData(
									this.helpers.returnJsonArray(responseData),
									{ itemData: { item: i } },
								);
								returnData.push(...executionData);
								continue;
							}
						}

						// All validations passed - return success with all data
						responseData = {
							isValid: true,
							threadId: storedThreadId,
							personId: parsedData.personId || '',
							cardId: parsedData.cardId || '',
							workflowId: parsedData.workflowId || '',
							phoneNumber: parsedData.phoneNumber || '',
							sentAt,
							responseTime,
							status: parsedData.status || '',
							questionType: parsedData.questionType || '',
							messageBody,
							...(verifyWithPlanningCenter && { cardStage, cardVerified: true }),
						};
					}

					if (operation === 'verifyResponse') {
						const inputValue = this.getNodeParameter('inputValue', i) as string;
						const trueValuesStr = this.getNodeParameter('trueValues', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						// Parse options
						const caseSensitive = options.caseSensitive as boolean || false;
						const trimWhitespace = options.trimWhitespace !== false; // Default true
						const matchMode = (options.matchMode as string) || 'exact';
						const falseValuesStr = (options.falseValues as string) || '';
						const returnUnknown = options.returnUnknown as boolean || false;
						const includeMatchDetails = options.includeMatchDetails as boolean || false;

						// Parse true and false values
						const trueValues = trueValuesStr.split(',').map((v) => {
							let val = v;
							if (trimWhitespace) val = val.trim();
							if (!caseSensitive) val = val.toLowerCase();
							return val;
						}).filter((v) => v.length > 0);

						const falseValues = falseValuesStr.split(',').map((v) => {
							let val = v;
							if (trimWhitespace) val = val.trim();
							if (!caseSensitive) val = val.toLowerCase();
							return val;
						}).filter((v) => v.length > 0);

						// Normalize input
						let normalizedInput = inputValue;
						if (trimWhitespace) normalizedInput = normalizedInput.trim();
						if (!caseSensitive) normalizedInput = normalizedInput.toLowerCase();

						// Check for match
						let result: boolean | string = false;
						let matchedValue: string | null = null;
						let matchType: string | null = null;

						// Helper function for matching
						const checkMatch = (input: string, values: string[], mode: string): string | null => {
							for (const val of values) {
								let matched = false;
								switch (mode) {
									case 'exact':
										matched = input === val;
										break;
									case 'contains':
										matched = input.includes(val);
										break;
									case 'startsWith':
										matched = input.startsWith(val);
										break;
									case 'endsWith':
										matched = input.endsWith(val);
										break;
									case 'regex':
										try {
											const regex = new RegExp(val, caseSensitive ? '' : 'i');
											matched = regex.test(inputValue); // Use original input for regex
										} catch {
											// Invalid regex, skip
										}
										break;
								}
								if (matched) return val;
							}
							return null;
						};

						// Check false values first (if provided)
						if (falseValues.length > 0) {
							const falseMatch = checkMatch(normalizedInput, falseValues, matchMode);
							if (falseMatch) {
								result = false;
								matchedValue = falseMatch;
								matchType = 'false';
							}
						}

						// Check true values (only if not already matched as false)
						if (matchType !== 'false') {
							const trueMatch = checkMatch(normalizedInput, trueValues, matchMode);
							if (trueMatch) {
								result = true;
								matchedValue = trueMatch;
								matchType = 'true';
							} else if (returnUnknown) {
								result = 'unknown';
								matchType = 'unknown';
							}
						}

						// Build response
						responseData = {
							result,
							input: inputValue,
						};

						if (includeMatchDetails) {
							(responseData as IDataObject).matchedValue = matchedValue;
							(responseData as IDataObject).matchType = matchType;
							(responseData as IDataObject).matchMode = matchMode;
							(responseData as IDataObject).caseSensitive = caseSensitive;
						}
					}
				}

				// Return data
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
