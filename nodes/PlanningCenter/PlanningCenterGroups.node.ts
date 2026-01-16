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
	parseJsonApiResponse,
	parseJsonApiIncludes,
	planningCenterApiRequest,
	planningCenterApiRequestAllItems,
} from './GenericFunctions';

import {
	groupFields,
	groupOperations,
	groupTypeFields,
	groupTypeOperations,
	groupMembershipFields,
	groupMembershipOperations,
	groupEventFields,
	groupEventOperations,
} from './descriptions';

export class PlanningCenterGroups implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planning Center - Groups',
		name: 'planningCenterGroups',
		icon: 'file:planningCenterGroups.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Work with Groups, Group Types, Memberships, and Events',
		defaults: {
			name: 'Planning Center - Groups',
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
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Group Event',
						value: 'groupEvent',
					},
					{
						name: 'Group Membership',
						value: 'groupMembership',
					},
					{
						name: 'Group Type',
						value: 'groupType',
					},
				],
				default: 'group',
			},
			// Group operations and fields
			...groupOperations,
			...groupFields,
			// Group Type operations and fields
			...groupTypeOperations,
			...groupTypeFields,
			// Group Membership operations and fields
			...groupMembershipOperations,
			...groupMembershipFields,
			// Group Event operations and fields
			...groupEventOperations,
			...groupEventFields,
		],
	};

	methods = {
		listSearch: {
			async searchGroups(
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
							url: 'https://api.planningcenteronline.com/groups/v2/groups',
							qs,
							json: true,
						},
					);
				} else {
					const credentials = await this.getCredentials('planningCenterApi');
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.planningcenteronline.com/groups/v2/groups',
						qs,
						auth: {
							username: credentials.applicationId as string,
							password: credentials.secret as string,
						},
						json: true,
					});
				}

				const results: INodeListSearchItems[] = (response.data || []).map(
					(group: IDataObject) => {
						const attrs = group.attributes as IDataObject;

						// Build info parts for display in name
						const infoParts: string[] = [];

						if (attrs.memberships_count !== undefined) {
							infoParts.push(`${attrs.memberships_count} members`);
						}

						if (attrs.archived_at) {
							infoParts.push('Archived');
						}

						// Format name with info in parentheses
						const groupName = attrs.name as string;
						const displayName = infoParts.length > 0
							? `${groupName} (${infoParts.join(', ')})`
							: groupName;

						return {
							name: displayName,
							value: group.id as string,
						};
					},
				);

				return { results };
			},

			async searchGroupTypes(
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
							url: 'https://api.planningcenteronline.com/groups/v2/group_types',
							qs,
							json: true,
						},
					);
				} else {
					const credentials = await this.getCredentials('planningCenterApi');
					response = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.planningcenteronline.com/groups/v2/group_types',
						qs,
						auth: {
							username: credentials.applicationId as string,
							password: credentials.secret as string,
						},
						json: true,
					});
				}

				const results: INodeListSearchItems[] = (response.data || []).map(
					(groupType: IDataObject) => {
						const attrs = groupType.attributes as IDataObject;

						// Format name with group count in parentheses
						const typeName = attrs.name as string;
						const displayName = attrs.groups_count !== undefined
							? `${typeName} (${attrs.groups_count} groups)`
							: typeName;

						return {
							name: displayName,
							value: groupType.id as string,
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
				// Group resource
				// ==========================================
				if (resource === 'group') {
					// Get a group
					if (operation === 'get') {
						const groupId = this.getNodeParameter('groupId', i, '', { extractValue: true }) as string;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.include) {
							qs.include = (options.include as string[]).join(',');
						}

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/groups/v2/groups/${groupId}`,
							{},
							qs,
						);

						responseData = parseJsonApiResponse(response);
						if (options.include && response.included) {
							const includesMap = parseJsonApiIncludes(response);
							(responseData as IDataObject).included = Object.fromEntries(includesMap);
						}
					}

					// Get many groups
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						// Build query string from filters
						if (filters.groupTypeId) {
							qs['where[group_type_id]'] = filters.groupTypeId;
						}
						if (filters.name) {
							qs['where[name]'] = filters.name;
						}
						if (filters.enrollmentOpen) {
							qs['where[enrollment_open]'] = true;
						}
						if (filters.enrollmentStrategy) {
							qs['where[enrollment_strategy]'] = filters.enrollmentStrategy;
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
								'/groups/v2/groups',
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
								'/groups/v2/groups',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Group Type resource
				// ==========================================
				if (resource === 'groupType') {
					// Get a group type
					if (operation === 'get') {
						const groupTypeId = this.getNodeParameter('groupTypeId', i, '', { extractValue: true }) as string;

						const response = await planningCenterApiRequest.call(
							this,
							'GET',
							`/groups/v2/group_types/${groupTypeId}`,
						);

						responseData = parseJsonApiResponse(response);
					}

					// Get many group types
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (options.order) {
							qs.order = options.order;
						}

						if (returnAll) {
							const allData = await planningCenterApiRequestAllItems.call(
								this,
								'GET',
								'/groups/v2/group_types',
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
								'/groups/v2/group_types',
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Group Membership resource
				// ==========================================
				if (resource === 'groupMembership') {
					// Get many memberships
					if (operation === 'getMany') {
						const groupId = this.getNodeParameter('groupId', i, '', { extractValue: true }) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.role) {
							qs['where[role]'] = filters.role;
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
								`/groups/v2/groups/${groupId}/memberships`,
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
								`/groups/v2/groups/${groupId}/memberships`,
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
						}
					}
				}

				// ==========================================
				// Group Event resource
				// ==========================================
				if (resource === 'groupEvent') {
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
							`/groups/v2/events/${eventId}`,
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
						const groupId = this.getNodeParameter('groupId', i, '', { extractValue: true }) as string;
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;
						const filters = this.getNodeParameter('filters', i) as IDataObject;
						const options = this.getNodeParameter('options', i) as IDataObject;
						const qs: IDataObject = {};

						if (filters.startsAfter) {
							qs['where[starts_at][gte]'] = filters.startsAfter;
						}
						if (filters.startsBefore) {
							qs['where[starts_at][lte]'] = filters.startsBefore;
						}
						if (filters.upcoming) {
							qs.filter = 'upcoming';
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
								`/groups/v2/groups/${groupId}/events`,
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
								`/groups/v2/groups/${groupId}/events`,
								{},
								qs,
							);

							responseData = parseJsonApiResponse(response) as IDataObject[];
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
