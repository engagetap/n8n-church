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
	checkInEventFields,
	checkInEventOperations,
	checkInFields,
	checkInOperations,
	checkInLocationFields,
	checkInLocationOperations,
} from './descriptions';

export class PlanningCenterCheckIns implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Planning Center - Check-Ins',
		name: 'planningCenterCheckIns',
		icon: 'file:planningCenterCheckIns.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Work with Check-In Events, Check-Ins, and Locations',
		defaults: {
			name: 'Planning Center - Check-Ins',
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
				],
				default: 'checkInEvent',
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
						if (filters.createdAfter) {
							qs['where[created_at][gte]'] = filters.createdAfter;
						}
						if (filters.createdBefore) {
							qs['where[created_at][lte]'] = filters.createdBefore;
						}
						if (filters.checkedOutAfter) {
							qs['where[checked_out_at][gte]'] = filters.checkedOutAfter;
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
