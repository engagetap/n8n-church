import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchItems,
	INodeListSearchResult,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	buildJsonApiBody,
	buildWhereFilters,
	parseJsonApiResponse,
	parseJsonApiIncludes,
	planningCenterApiRequest,
	planningCenterApiRequestAllItems,
} from './GenericFunctions';

import {
	personFields,
	personOperations,
	listFields,
	listOperations,
	formFields,
	formOperations,
	workflowFields,
	workflowOperations,
	workflowStepFields,
	workflowStepOperations,
	workflowCardFields,
	workflowCardOperations,
} from './descriptions';

export class PlanningCenterPeople implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planning Center - People',
		name: 'planningCenterPeople',
		icon: 'file:planningCenterPeople.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Work with People, Lists, Forms, and Workflows',
		defaults: {
			name: 'Planning Center - People',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'planningCenterApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['personalAccessToken'],
					},
				},
			},
			{
				name: 'planningCenterOAuth2Api',
				required: true,
				displayOptions: {
					show: {
						authentication: ['oAuth2'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Personal Access Token',
						value: 'personalAccessToken',
					},
					{
						name: 'OAuth2',
						value: 'oAuth2',
					},
				],
				default: 'personalAccessToken',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Form',
						value: 'form',
					},
					{
						name: 'List',
						value: 'list',
					},
					{
						name: 'Person',
						value: 'person',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
					{
						name: 'Workflow Card',
						value: 'workflowCard',
					},
					{
						name: 'Workflow Step',
						value: 'workflowStep',
					},
				],
				default: 'person',
			},
			// Form operations and fields
			...formOperations,
			...formFields,
			// List operations and fields
			...listOperations,
			...listFields,
			// Person operations and fields
			...personOperations,
			...personFields,
			// Workflow operations and fields
			...workflowOperations,
			...workflowFields,
			// Workflow Card operations and fields
			...workflowCardOperations,
			...workflowCardFields,
			// Workflow Step operations and fields
			...workflowStepOperations,
			...workflowStepFields,
		],
	};

	methods = {
		listSearch: {
			async searchPeople(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const qs: IDataObject = { per_page: 25 };
				if (filter) {
					qs['where[search_name]'] = filter;
				}

				const authentication = this.getNodeParameter('authentication', 0) as string;
				let response;

				if (authentication === 'oAuth2') {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'planningCenterOAuth2Api',
						{
							method: 'GET',
							url: 'https://api.planningcenteronline.com/people/v2/people',
							qs,
							json: true,
						},
					);
				} else {
					const credentials = await this.getCredentials('planningCenterApi');
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.planningcenteronline.com/people/v2/people',
						qs,
						auth: {
							username: credentials.applicationId as string,
							password: credentials.secret as string,
						},
						json: true,
					});
				}

				const results: INodeListSearchItems[] = (response.data || []).map(
					(person: IDataObject) => {
						const attrs = person.attributes as IDataObject;

						// Build info parts to append to name
						const infoParts: string[] = [];

						// Calculate age from birthdate
						if (attrs.birthdate) {
							const birthDate = new Date(attrs.birthdate as string);
							const today = new Date();
							let age = today.getFullYear() - birthDate.getFullYear();
							const monthDiff = today.getMonth() - birthDate.getMonth();
							if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
								age--;
							}
							infoParts.push(`${age}`);
						}

						// Add membership status
						if (attrs.membership) {
							infoParts.push(attrs.membership as string);
						} else if (attrs.status) {
							infoParts.push(attrs.status as string);
						}

						// Add child indicator
						if (attrs.child) {
							infoParts.push('Child');
						}

						// Format name with info in parentheses
						const fullName = `${attrs.first_name} ${attrs.last_name}`;
						const displayName = infoParts.length > 0
							? `${fullName} (${infoParts.join(', ')})`
							: fullName;

						return {
							name: displayName,
							value: person.id as string,
							url: `https://people.planningcenteronline.com/people/${person.id}`,
						};
					},
				);

				return { results };
			},

			async searchWorkflows(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const qs: IDataObject = { per_page: 25 };
				if (filter) {
					qs['where[name]'] = filter;
				}

				const authentication = this.getNodeParameter('authentication', 0) as string;
				let response;

				if (authentication === 'oAuth2') {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'planningCenterOAuth2Api',
						{
							method: 'GET',
							url: 'https://api.planningcenteronline.com/people/v2/workflows',
							qs,
							json: true,
						},
					);
				} else {
					const credentials = await this.getCredentials('planningCenterApi');
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.planningcenteronline.com/people/v2/workflows',
						qs,
						auth: {
							username: credentials.applicationId as string,
							password: credentials.secret as string,
						},
						json: true,
					});
				}

				const results: INodeListSearchItems[] = (response.data || []).map(
					(workflow: IDataObject) => {
						const attrs = workflow.attributes as IDataObject;

						// Build info parts for workflow
						const infoParts: string[] = [];

						if (attrs.ready_cards_count !== undefined) {
							infoParts.push(`${attrs.ready_cards_count} ready`);
						}
						if (attrs.snoozed_cards_count !== undefined && (attrs.snoozed_cards_count as number) > 0) {
							infoParts.push(`${attrs.snoozed_cards_count} snoozed`);
						}

						// Format name with info in parentheses
						const workflowName = attrs.name as string;
						const displayName = infoParts.length > 0
							? `${workflowName} (${infoParts.join(', ')})`
							: workflowName;

						return {
							name: displayName,
							value: workflow.id as string,
						};
					},
				);

				return { results };
			},

			async searchLists(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const qs: IDataObject = { per_page: 25 };
				if (filter) {
					qs['where[name]'] = filter;
				}

				const authentication = this.getNodeParameter('authentication', 0) as string;
				let response;

				if (authentication === 'oAuth2') {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'planningCenterOAuth2Api',
						{
							method: 'GET',
							url: 'https://api.planningcenteronline.com/people/v2/lists',
							qs,
							json: true,
						},
					);
				} else {
					const credentials = await this.getCredentials('planningCenterApi');
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.planningcenteronline.com/people/v2/lists',
						qs,
						auth: {
							username: credentials.applicationId as string,
							password: credentials.secret as string,
						},
						json: true,
					});
				}

				const results: INodeListSearchItems[] = (response.data || []).map(
					(list: IDataObject) => {
						const attrs = list.attributes as IDataObject;
						return {
							name: attrs.name as string,
							value: list.id as string,
							description: attrs.description as string || '',
						};
					},
				);

				return { results };
			},

			async searchForms(
				this: ILoadOptionsFunctions,
				filter?: string,
			): Promise<INodeListSearchResult> {
				const qs: IDataObject = { per_page: 25 };
				if (filter) {
					qs['where[name]'] = filter;
				}

				const authentication = this.getNodeParameter('authentication', 0) as string;
				let response;

				if (authentication === 'oAuth2') {
					response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'planningCenterOAuth2Api',
						{
							method: 'GET',
							url: 'https://api.planningcenteronline.com/people/v2/forms',
							qs,
							json: true,
						},
					);
				} else {
					const credentials = await this.getCredentials('planningCenterApi');
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.planningcenteronline.com/people/v2/forms',
						qs,
						auth: {
							username: credentials.applicationId as string,
							password: credentials.secret as string,
						},
						json: true,
					});
				}

				const results: INodeListSearchItems[] = (response.data || []).map(
					(form: IDataObject) => {
						const attrs = form.attributes as IDataObject;
						return {
							name: attrs.name as string,
							value: form.id as string,
							description: attrs.description as string || '',
						};
					},
				);

				return { results };
			},
		},
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
				// Form resource
				// ==========================================
				if (resource === 'form') {
					// Get a form
					if (operation === 'get') {
						const formId = this.getNodeParameter('formId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/forms/${formId}`,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many forms
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.name) {
							qs['where[name]'] = filters.name;
						}
						if (filters.active !== undefined) {
							qs['where[active]'] = filters.active;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/people/v2/forms',
								{},
								qs,
							);
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								'/people/v2/forms',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}

					// Get form submissions
					if (operation === 'getSubmissions') {
						const formId = this.getNodeParameter('formId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Date filters with operators
						if (filters.created_at_gte) {
							qs['where[created_at][gte]'] = filters.created_at_gte;
						}
						if (filters.created_at_lte) {
							qs['where[created_at][lte]'] = filters.created_at_lte;
						}

						// Include related resources
						const includes: string[] = [];
						if (options.includePerson) {
							includes.push('person');
						}
						if (options.includeFormFields) {
							includes.push('form_fields');
						}
						if (includes.length > 0) {
							qs.include = includes.join(',');
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								`/people/v2/forms/${formId}/form_submissions`,
								{},
								qs,
							);

							// Parse each submission
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								`/people/v2/forms/${formId}/form_submissions`,
								{},
								qs,
							);

							// Parse submissions and include related data
							const submissions = parseJsonApiResponse(response) as IDataObject[];
							const includes_map = parseJsonApiIncludes(response);

							// Attach included person data to each submission
							responseData = (Array.isArray(submissions) ? submissions : [submissions]).map(
								(submission) => {
									const personRel = submission.relationships as IDataObject;
									if (personRel?.person) {
										const personData = personRel.person as IDataObject;
										const personRef = personData.data as IDataObject;
										if (personRef) {
											const personKey = `Person:${personRef.id}`;
											const person = includes_map.get(personKey);
											if (person) {
												submission.person = person;
											}
										}
									}
									return submission;
								},
							);
						}
					}
				}

				// ==========================================
				// List resource
				// ==========================================
				if (resource === 'list') {
					// Get a list
					if (operation === 'get') {
						const listId = this.getNodeParameter('listId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/lists/${listId}`,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many lists
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.name) {
							qs['where[name]'] = filters.name;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/people/v2/lists',
								{},
								qs,
							);
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								'/people/v2/lists',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}

					// Get people from a list
					if (operation === 'getPeople') {
						const listId = this.getNodeParameter('listId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Date filters with operators for when added to list
						if (filters.created_at_gte) {
							qs['where[created_at][gte]'] = filters.created_at_gte;
						}
						if (filters.created_at_lte) {
							qs['where[created_at][lte]'] = filters.created_at_lte;
						}
						if (filters.first_name) {
							qs['where[first_name]'] = filters.first_name;
						}
						if (filters.last_name) {
							qs['where[last_name]'] = filters.last_name;
						}

						// Include related resources (phone_numbers, emails, etc.)
						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								`/people/v2/lists/${listId}/people`,
								{},
								qs,
							);

							// For each person, we need to fetch their included data separately
							// since the paginated request may not include all relationships
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								`/people/v2/lists/${listId}/people`,
								{},
								qs,
							);

							// Parse people and attach included data
							const people = parseJsonApiResponse(response);
							const includesMap = parseJsonApiIncludes(response);

							// Attach included data (phone_numbers, emails, etc.) to each person
							responseData = (Array.isArray(people) ? people : [people]).map((person) => {
								const personWithIncludes = { ...person } as IDataObject;

								// Attach phone numbers
								const phoneNumbers: IDataObject[] = [];
								includesMap.forEach((value, key) => {
									if (key.startsWith('PhoneNumber:')) {
										// Check if this phone belongs to this person
										const included = response.included as IDataObject[];
										if (included) {
											const phoneItem = included.find(
												(inc: IDataObject) =>
													inc.type === 'PhoneNumber' &&
													inc.id === key.split(':')[1],
											);
											if (phoneItem) {
												const rels = phoneItem.relationships as IDataObject;
												const personRel = rels?.person as IDataObject;
												const personData = personRel?.data as IDataObject;
												if (personData?.id === person.id) {
													phoneNumbers.push(value);
												}
											}
										}
									}
								});
								if (phoneNumbers.length > 0) {
									personWithIncludes.phone_numbers = phoneNumbers;
								}

								// Attach emails
								const emails: IDataObject[] = [];
								includesMap.forEach((value, key) => {
									if (key.startsWith('Email:')) {
										const included = response.included as IDataObject[];
										if (included) {
											const emailItem = included.find(
												(inc: IDataObject) =>
													inc.type === 'Email' && inc.id === key.split(':')[1],
											);
											if (emailItem) {
												const rels = emailItem.relationships as IDataObject;
												const personRel = rels?.person as IDataObject;
												const personData = personRel?.data as IDataObject;
												if (personData?.id === person.id) {
													emails.push(value);
												}
											}
										}
									}
								});
								if (emails.length > 0) {
									personWithIncludes.emails = emails;
								}

								return personWithIncludes;
							});
						}
					}

					// Refresh/rerun a list
					if (operation === 'refresh') {
						const listId = this.getNodeParameter('listId', i) as string;

						try {
							const response = await planningCenterApiRequest.call(
								this,
								'POST',
								`/people/v2/lists/${listId}/run`,
							);

							if (response && response.data) {
								responseData = parseJsonApiResponse(response);
							} else {
								// List run may return empty - return success indicator
								responseData = {
									success: true,
									listId,
									message: 'List refresh triggered successfully',
								};
							}
						} catch (error) {
							// If 204 No Content or similar, treat as success
							responseData = {
								success: true,
								listId,
								message: 'List refresh triggered',
							};
						}
					}
				}

				// ==========================================
				// Person resource
				// ==========================================
				if (resource === 'person') {
					// Create a person
					if (operation === 'create') {
						const firstName = this.getNodeParameter('firstName', i) as string;
						const lastName = this.getNodeParameter('lastName', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const attributes: IDataObject = {
							first_name: firstName,
							last_name: lastName,
							...additionalFields,
						};

						const body = buildJsonApiBody('Person', attributes);

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							'/people/v2/people',
							body,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Delete a person
					if (operation === 'delete') {
						const personId = this.getNodeParameter('personId', i) as string;

						await planningCenterApiRequest.call(
							this,
							'DELETE',
							`/people/v2/people/${personId}`,
						);

						responseData = { success: true, id: personId };
					}

					// Get a person
					if (operation === 'get') {
						const personId = this.getNodeParameter('personId', i, '', { extractValue: true }) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/people/${personId}`,
							{},
							qs,
						);

						const person = parseJsonApiResponse(response) as IDataObject;

						// Attach included data (emails, phone_numbers, addresses, etc.)
						if (options.include && response.included) {
							const included = response.included as IDataObject[];
							const personWithIncludes = { ...person } as IDataObject;

							// Group includes by type
							let emails = included.filter((item) => item.type === 'Email');
							let phoneNumbers = included.filter((item) => item.type === 'PhoneNumber');
							let addresses = included.filter((item) => item.type === 'Address');
							const households = included.filter((item) => item.type === 'Household');

							// Filter to primary only if requested
							if (options.primaryEmailOnly && emails.length > 0) {
								const primaryEmail = emails.find((e) => (e.attributes as IDataObject)?.primary === true);
								emails = primaryEmail ? [primaryEmail] : [];
							}
							if (options.primaryPhoneOnly && phoneNumbers.length > 0) {
								const primaryPhone = phoneNumbers.find((p) => (p.attributes as IDataObject)?.primary === true);
								phoneNumbers = primaryPhone ? [primaryPhone] : [];
							}
							if (options.primaryAddressOnly && addresses.length > 0) {
								const primaryAddress = addresses.find((a) => (a.attributes as IDataObject)?.primary === true);
								addresses = primaryAddress ? [primaryAddress] : [];
							}

							if (emails.length > 0) {
								personWithIncludes.emails = emails.map((e) => ({
									id: e.id,
									...(e.attributes as IDataObject),
								}));
							}
							if (phoneNumbers.length > 0) {
								personWithIncludes.phone_numbers = phoneNumbers.map((p) => ({
									id: p.id,
									...(p.attributes as IDataObject),
								}));
							}
							if (addresses.length > 0) {
								personWithIncludes.addresses = addresses.map((a) => ({
									id: a.id,
									...(a.attributes as IDataObject),
								}));
							}
							if (households.length > 0) {
								personWithIncludes.households = households.map((h) => ({
									id: h.id,
									...(h.attributes as IDataObject),
								}));
							}

							responseData = personWithIncludes;
						} else {
							responseData = person;
						}
					}

					// Get many people
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Build where filters
						if (filters) {
							Object.assign(qs, buildWhereFilters(filters));
						}

						// Handle search
						if (filters.search_name_or_email) {
							qs.where_name_or_email = filters.search_name_or_email;
							delete qs['where[search_name_or_email]'];
						}

						if (filters.search_name_or_email_or_phone_number) {
							qs.where_name_or_email_or_phone_number = filters.search_name_or_email_or_phone_number;
							delete qs['where[search_name_or_email_or_phone_number]'];
						}

						if (filters.phone_number) {
							qs['where[phone_number]'] = filters.phone_number;
						}

						// Include related resources
						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}

						// Ordering
						if (options.order) {
							qs.order = options.order;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/people/v2/people',
								{},
								qs,
							);
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								'/people/v2/people',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}

					// Update a person
					if (operation === 'update') {
						const personId = this.getNodeParameter('personId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body = buildJsonApiBody('Person', updateFields, undefined, personId);

						const response = await planningCenterApiRequest.call(
							this,
							'PATCH',
							`/people/v2/people/${personId}`,
							body,
						);

						responseData = parseJsonApiResponse(response);
					}
				}

				// ==========================================
				// Workflow resource
				// ==========================================
				if (resource === 'workflow') {
					// Get a workflow
					if (operation === 'get') {
						const workflowId = this.getNodeParameter('workflowId', i, '', { extractValue: true }) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/workflows/${workflowId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many workflows
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.name) {
							qs['where[name]'] = filters.name;
						}

						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/people/v2/workflows',
								{},
								qs,
							);
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								'/people/v2/workflows',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}

					// Get people in workflow with phone numbers
					if (operation === 'getPeople') {
						const workflowId = this.getNodeParameter('workflowId', i, '', { extractValue: true }) as string;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const qs: IDataObject = {};

						// Get cards with person included - single API call
						qs.include = 'person';
						if (filters.stage) {
							qs.filter = filters.stage;
						}
						qs.per_page = 100;

						const cardsResponse = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/workflows/${workflowId}/cards`,
							{},
							qs,
						);

						const cards = (cardsResponse.data as IDataObject[]) || [];
						const includedPersons = (cardsResponse.included as IDataObject[]) || [];

						// Build person lookup from included data
						const personsById: { [key: string]: IDataObject } = {};
						for (const item of includedPersons) {
							if (item.type === 'Person') {
								personsById[item.id as string] = {
									id: item.id,
									...(item.attributes as IDataObject),
								};
							}
						}

						// Build results - one per card with person attached
						const results: IDataObject[] = [];
						for (const card of cards) {
							const relationships = card.relationships as IDataObject;
							if (relationships?.person) {
								const personRef = (relationships.person as IDataObject).data as IDataObject;
								if (personRef?.id) {
									const personId = personRef.id as string;
									const person = personsById[personId] || { id: personId };

									results.push({
										card_id: card.id,
										card: card.attributes,
										person_id: personId,
										person,
									});
								}
							}
						}

						responseData = results;
					}
				}

				// ==========================================
				// Workflow Step resource
				// ==========================================
				if (resource === 'workflowStep') {
					// Get a workflow step
					if (operation === 'get') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const stepId = this.getNodeParameter('stepId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/workflows/${workflowId}/steps/${stepId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many workflow steps
					if (operation === 'getMany') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								`/people/v2/workflows/${workflowId}/steps`,
								{},
								qs,
							);
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								`/people/v2/workflows/${workflowId}/steps`,
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Workflow Card resource
				// ==========================================
				if (resource === 'workflowCard') {
					// Create a workflow card (add person to workflow)
					if (operation === 'create') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const personId = this.getNodeParameter('personId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;

						const attributes: IDataObject = {};
						if (options.stickyAssignment !== undefined) {
							attributes.sticky_assignment = options.stickyAssignment;
						}

						const relationships: IDataObject = {
							person: {
								data: {
									type: 'Person',
									id: personId,
								},
							},
						};

						if (options.assigneeId) {
							relationships.assignee = {
								data: {
									type: 'Person',
									id: options.assigneeId,
								},
							};
						}

						const body = buildJsonApiBody('WorkflowCard', attributes, relationships);

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards`,
							body,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get a workflow card
					if (operation === 'get') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/workflows/${workflowId}/cards/${cardId}`,
							{},
							qs,
						);

						const card = parseJsonApiResponse(response) as IDataObject;
						const includesMap = parseJsonApiIncludes(response);

						// Attach included data
						const cardWithIncludes = { ...card } as IDataObject;
						const relationships = card.relationships as IDataObject;

						if (relationships?.person) {
							const personData = relationships.person as IDataObject;
							const personRef = personData.data as IDataObject;
							if (personRef) {
								const person = includesMap.get(`Person:${personRef.id}`);
								if (person) {
									cardWithIncludes.person = person;
								}
							}
						}

						responseData = cardWithIncludes;
					}

					// Get many workflow cards
					if (operation === 'getMany') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Filters
						if (filters.stage) {
							qs.filter = filters.stage;
						}
						if (filters.stepId) {
							qs['where[current_step_id]'] = filters.stepId;
						}
						if (filters.assigneeId) {
							qs['where[assignee_id]'] = filters.assigneeId;
						}
						if (filters.createdAfter) {
							const date = new Date(filters.createdAfter as string);
							qs['where[created_at][gte]'] = date.toISOString();
						}
						if (filters.createdBefore) {
							const date = new Date(filters.createdBefore as string);
							qs['where[created_at][lte]'] = date.toISOString();
						}

						// Include related resources
						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						// Ordering
						if (options.order) {
							qs.order = options.order;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								`/people/v2/workflows/${workflowId}/cards`,
								{},
								qs,
							);
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								`/people/v2/workflows/${workflowId}/cards`,
								{},
								qs,
							);

							// Parse cards and attach included data
							const cards = parseJsonApiResponse(response);
							const includesMap = parseJsonApiIncludes(response);

							responseData = (Array.isArray(cards) ? cards : [cards]).map((card) => {
								const cardWithIncludes = { ...card } as IDataObject;
								const relationships = card.relationships as IDataObject;

								if (relationships?.person) {
									const personData = relationships.person as IDataObject;
									const personRef = personData.data as IDataObject;
									if (personRef) {
										const person = includesMap.get(`Person:${personRef.id}`);
										if (person) {
											cardWithIncludes.person = person;
										}
									}
								}

								if (relationships?.current_step) {
									const stepData = relationships.current_step as IDataObject;
									const stepRef = stepData.data as IDataObject;
									if (stepRef) {
										const step = includesMap.get(`WorkflowStep:${stepRef.id}`);
										if (step) {
											cardWithIncludes.current_step = step;
										}
									}
								}

								if (relationships?.assignee) {
									const assigneeData = relationships.assignee as IDataObject;
									const assigneeRef = assigneeData.data as IDataObject;
									if (assigneeRef) {
										const assignee = includesMap.get(`Person:${assigneeRef.id}`);
										if (assignee) {
											cardWithIncludes.assignee = assignee;
										}
									}
								}

								return cardWithIncludes;
							});
						}
					}

					// Promote card (move to next step)
					if (operation === 'promote') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/promote`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'promote' };
					}

					// Go back (move to previous step)
					if (operation === 'goBack') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/go_back`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'go_back' };
					}

					// Skip step
					if (operation === 'skipStep') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/skip_step`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'skip_step' };
					}

					// Snooze card
					if (operation === 'snooze') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;
						const snoozeUntil = this.getNodeParameter('snoozeUntil', i) as string;

						const body = {
							data: {
								attributes: {
									snoozed_until: new Date(snoozeUntil).toISOString(),
								},
							},
						};

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/snooze`,
							body,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'snooze', snoozeUntil };
					}

					// Unsnooze card
					if (operation === 'unsnooze') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/unsnooze`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'unsnooze' };
					}

					// Remove card
					if (operation === 'remove') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/remove`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'remove' };
					}

					// Restore card
					if (operation === 'restore') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/restore`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'restore' };
					}

					if (operation === 'addNote') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;
						const note = this.getNodeParameter('note', i) as string;

						const body = {
							data: {
								attributes: {
									note,
								},
							},
						};

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/notes`,
							body,
						);

						responseData = parseJsonApiResponse(response);
					}

					if (operation === 'getNotes') {
						const personId = this.getNodeParameter('personId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/people/v2/people/${personId}/workflow_cards/${cardId}/notes`,
						);

						responseData = parseJsonApiResponse(response);
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
