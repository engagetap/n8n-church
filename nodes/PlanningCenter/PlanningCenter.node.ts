import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
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
	serviceTypeFields,
	serviceTypeOperations,
	planFields,
	planOperations,
	teamMemberFields,
	teamMemberOperations,
	workflowFields,
	workflowOperations,
	workflowStepFields,
	workflowStepOperations,
	workflowCardFields,
	workflowCardOperations,
	checkInEventFields,
	checkInEventOperations,
	checkInFields,
	checkInOperations,
	checkInLocationFields,
	checkInLocationOperations,
} from './descriptions';

export class PlanningCenter implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planning Center',
		name: 'planningCenter',
		icon: 'file:planningCenter.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Planning Center Online API',
		defaults: {
			name: 'Planning Center',
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
						name: 'Check-In',
						value: 'checkIn',
					},
					{
						name: 'Check-In Event',
						value: 'checkInEvent',
					},
					{
						name: 'Check-In Location',
						value: 'checkInLocation',
					},
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
						name: 'Plan',
						value: 'plan',
					},
					{
						name: 'Service Type',
						value: 'serviceType',
					},
					{
						name: 'Team Member',
						value: 'teamMember',
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
			// Check-In operations and fields
			...checkInOperations,
			...checkInFields,
			// Check-In Event operations and fields
			...checkInEventOperations,
			...checkInEventFields,
			// Check-In Location operations and fields
			...checkInLocationOperations,
			...checkInLocationFields,
			// Form operations and fields
			...formOperations,
			...formFields,
			// List operations and fields
			...listOperations,
			...listFields,
			// Person operations and fields
			...personOperations,
			...personFields,
			// Plan operations and fields
			...planOperations,
			...planFields,
			// Service Type operations and fields
			...serviceTypeOperations,
			...serviceTypeFields,
			// Team Member operations and fields
			...teamMemberOperations,
			...teamMemberFields,
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ==========================================
				// Check-In resource
				// ==========================================
				if (resource === 'checkIn') {
					// Get a check-in
					if (operation === 'get') {
						const checkInId = this.getNodeParameter('checkInId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/check-ins/v2/check_ins/${checkInId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
						if (options.include && response.included) {
							const includesMap = parseJsonApiIncludes(response);
							(responseData as IDataObject).included = Object.fromEntries(includesMap);
						}
					}

					// Get many check-ins
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Build query string
						if (filters.eventId) {
							qs['where[event_id]'] = filters.eventId;
						}
						if (filters.locationId) {
							qs['where[location_id]'] = filters.locationId;
						}
						if (filters.personId) {
							qs['where[person_id]'] = filters.personId;
						}
						if (filters.securityCode) {
							qs['where[security_code]'] = filters.securityCode;
						}
						if (filters.filter) {
							qs.filter = filters.filter;
						}
						if (filters.createdAfter) {
							qs['where[created_at][gte]'] = filters.createdAfter;
						}
						if (filters.createdBefore) {
							qs['where[created_at][lte]'] = filters.createdBefore;
						}
						if (filters.checkedOutAfter) {
							qs['where[checked_out_at][gte]'] = filters.checkedOutAfter;
						}
						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}
						if (options.order) {
							qs.order = options.order;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/check-ins/v2/check_ins',
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
								'/check-ins/v2/check_ins',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Check-In Event resource
				// ==========================================
				if (resource === 'checkInEvent') {
					// Get an event
					if (operation === 'get') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/check-ins/v2/events/${eventId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
						if (options.include && response.included) {
							const includesMap = parseJsonApiIncludes(response);
							(responseData as IDataObject).included = Object.fromEntries(includesMap);
						}
					}

					// Get many events
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.name) {
							qs['where[name]'] = filters.name;
						}
						if (filters.filter) {
							qs.filter = filters.filter;
						}
						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}
						if (options.order) {
							qs.order = options.order;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/check-ins/v2/events',
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
								'/check-ins/v2/events',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Check-In Location resource
				// ==========================================
				if (resource === 'checkInLocation') {
					// Get a location
					if (operation === 'get') {
						const locationId = this.getNodeParameter('locationId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/check-ins/v2/locations/${locationId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
						if (options.include && response.included) {
							const includesMap = parseJsonApiIncludes(response);
							(responseData as IDataObject).included = Object.fromEntries(includesMap);
						}
					}

					// Get many locations
					if (operation === 'getMany') {
						const eventId = this.getNodeParameter('eventId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.filter) {
							qs.filter = filters.filter;
						}
						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}
						if (options.order) {
							qs.order = options.order;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								`/check-ins/v2/events/${eventId}/locations`,
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
								`/check-ins/v2/events/${eventId}/locations`,
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

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
						const personId = this.getNodeParameter('personId', i) as string;
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

						responseData = parseJsonApiResponse(response);
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
				// Service Type resource (Services product)
				// ==========================================
				if (resource === 'serviceType') {
					// Get a service type
					if (operation === 'get') {
						const serviceTypeId = this.getNodeParameter('serviceTypeId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/services/v2/service_types/${serviceTypeId}`,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many service types
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
								'/services/v2/service_types',
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
								'/services/v2/service_types',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Plan resource (Services product)
				// ==========================================
				if (resource === 'plan') {
					// Get a plan
					if (operation === 'get') {
						const serviceTypeId = this.getNodeParameter('serviceTypeId', i) as string;
						const planId = this.getNodeParameter('planId', i) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include && (options.include as string[]).length > 0) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/services/v2/service_types/${serviceTypeId}/plans/${planId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many plans
					if (operation === 'getMany') {
						const serviceTypeId = this.getNodeParameter('serviceTypeId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// "Next X Days" filter - get future plans and filter client-side by sort_date
						const nextDaysFilter = filters.nextDays as number | undefined;
						if (nextDaysFilter) {
							qs.filter = 'future';
						} else {
							// Manual date filters using Planning Center's filter params
							if (filters.after) {
								// Convert datetime to YYYY-MM-DD if needed
								const afterDate = new Date(filters.after as string);
								qs.after = afterDate.toISOString().split('T')[0];
							}
							if (filters.before) {
								const beforeDate = new Date(filters.before as string);
								qs.before = beforeDate.toISOString().split('T')[0];
							}
							// Future/past filters - use filter=value format
							if (filters.future) {
								qs.filter = 'future';
							}
							if (filters.past) {
								qs.filter = 'past';
							}
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
								`/services/v2/service_types/${serviceTypeId}/plans`,
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
								`/services/v2/service_types/${serviceTypeId}/plans`,
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}

						// Client-side filtering for "Next X Days" - filter by sort_date
						if (nextDaysFilter) {
							const now = new Date();
							const cutoffDate = new Date();
							cutoffDate.setDate(now.getDate() + nextDaysFilter);

							responseData = (Array.isArray(responseData) ? responseData : [responseData]).filter(
								(plan) => {
									const sortDate = plan.sort_date as string;
									if (!sortDate) return false;
									const planDate = new Date(sortDate);
									return planDate >= now && planDate <= cutoffDate;
								},
							);
						}
					}
				}

				// ==========================================
				// Workflow resource (People product)
				// ==========================================
				if (resource === 'workflow') {
					// Get a workflow
					if (operation === 'get') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
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
				}

				// ==========================================
				// Workflow Step resource (People product)
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
				// Workflow Card resource (People product)
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
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/promote`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'promote' };
					}

					// Go back (move to previous step)
					if (operation === 'goBack') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/go_back`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'go_back' };
					}

					// Skip step
					if (operation === 'skipStep') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/skip_step`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'skip_step' };
					}

					// Snooze card
					if (operation === 'snooze') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
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
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/snooze`,
							body,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'snooze', snoozeUntil };
					}

					// Unsnooze card
					if (operation === 'unsnooze') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/unsnooze`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'unsnooze' };
					}

					// Remove card
					if (operation === 'remove') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/remove`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'remove' };
					}

					// Restore card
					if (operation === 'restore') {
						const workflowId = this.getNodeParameter('workflowId', i) as string;
						const cardId = this.getNodeParameter('cardId', i) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'POST',
							`/people/v2/workflows/${workflowId}/cards/${cardId}/actions/restore`,
						);

						responseData = response.data ? parseJsonApiResponse(response) : { success: true, cardId, action: 'restore' };
					}
				}

				// ==========================================
				// Team Member resource (Services product)
				// ==========================================
				if (resource === 'teamMember') {
					// Get many team members for a plan
					if (operation === 'getMany') {
						const serviceTypeId = this.getNodeParameter('serviceTypeId', i) as string;
						const planId = this.getNodeParameter('planId', i) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Status filter - uses filter=value format
						if (filters.status) {
							qs.filter = filters.status;
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
								`/services/v2/service_types/${serviceTypeId}/plans/${planId}/team_members`,
								{},
								qs,
							);

							// Parse and attach included person data
							responseData = allData.map((item) =>
								parseJsonApiResponse({ data: item }),
							) as IDataObject[];
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							qs.per_page = limit;

							const response = await planningCenterApiRequest.call(
								this,
								'GET',
								`/services/v2/service_types/${serviceTypeId}/plans/${planId}/team_members`,
								{},
								qs,
							);

							// Parse team members and include related data
							const teamMembers = parseJsonApiResponse(response);
							const includesMap = parseJsonApiIncludes(response);

							// Attach included person data to each team member
							responseData = (Array.isArray(teamMembers) ? teamMembers : [teamMembers]).map(
								(member) => {
									const memberWithIncludes = { ...member } as IDataObject;

									// Attach person data
									const relationships = member.relationships as IDataObject;
									if (relationships?.person) {
										const personData = relationships.person as IDataObject;
										const personRef = personData.data as IDataObject;
										if (personRef) {
											const personKey = `Person:${personRef.id}`;
											const person = includesMap.get(personKey);
											if (person) {
												memberWithIncludes.person = person;
											}
										}
									}

									// Attach team data
									if (relationships?.team) {
										const teamData = relationships.team as IDataObject;
										const teamRef = teamData.data as IDataObject;
										if (teamRef) {
											const teamKey = `Team:${teamRef.id}`;
											const team = includesMap.get(teamKey);
											if (team) {
												memberWithIncludes.team = team;
											}
										}
									}

									return memberWithIncludes;
								},
							);
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
