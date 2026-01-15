import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	parseJsonApiResponse,
	parseJsonApiIncludes,
	planningCenterApiRequest,
	planningCenterApiRequestAllItems,
} from './GenericFunctions';

import {
	serviceTypeFields,
	serviceTypeOperations,
	planFields,
	planOperations,
	teamMemberFields,
	teamMemberOperations,
} from './descriptions';

export class PlanningCenterServices implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planning Center - Services',
		name: 'planningCenterServices',
		icon: 'file:planningCenterServices.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Work with Service Types, Plans, and Team Members',
		defaults: {
			name: 'Planning Center - Services',
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
				],
				default: 'serviceType',
			},
			// Plan operations and fields
			...planOperations,
			...planFields,
			// Service Type operations and fields
			...serviceTypeOperations,
			...serviceTypeFields,
			// Team Member operations and fields
			...teamMemberOperations,
			...teamMemberFields,
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
				// Service Type resource
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
				// Plan resource
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
							// Cap at 200 plans max to avoid API rate limits
							const maxPlans = 200;
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								`/services/v2/service_types/${serviceTypeId}/plans`,
								{},
								qs,
							);
							const limitedData = allData.slice(0, maxPlans);
							responseData = limitedData.map((item) =>
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
				// Team Member resource
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

						// Client-side filtering by status (API doesn't support server-side filtering)
						if (filters.status) {
							responseData = (responseData as IDataObject[]).filter(
								(member) => member.status === filters.status,
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
