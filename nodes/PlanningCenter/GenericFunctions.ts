import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.planningcenteronline.com';

/**
 * Make an authenticated API request to Planning Center
 */
export async function planningCenterApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	options: IDataObject = {},
): Promise<IDataObject> {
	const requestOptions: IRequestOptions = {
		method,
		qs,
		uri: `${BASE_URL}${endpoint}`,
		json: true,
		...options,
	};

	if (Object.keys(body).length > 0) {
		requestOptions.body = body;
	}

	try {
		const authenticationMethod = this.getNodeParameter('authentication', 0) as string;

		if (authenticationMethod === 'oAuth2') {
			return (await this.helpers.requestOAuth2.call(
				this,
				'planningCenterOAuth2Api',
				requestOptions,
			)) as IDataObject;
		} else {
			return (await this.helpers.requestWithAuthentication.call(
				this,
				'planningCenterApi',
				requestOptions,
			)) as IDataObject;
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Handle paginated requests - fetches all items across pages
 */
export async function planningCenterApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	let nextOffset: number | undefined;

	qs.per_page = 100; // Max allowed by Planning Center

	do {
		if (nextOffset !== undefined) {
			qs.offset = nextOffset;
		}

		responseData = await planningCenterApiRequest.call(this, method, endpoint, body, qs);

		const data = responseData.data as IDataObject[];
		if (data) {
			returnData.push(...data);
		}

		// Planning Center uses meta.next.offset for pagination
		const meta = responseData.meta as IDataObject;
		const next = meta?.next as IDataObject;
		nextOffset = next?.offset as number | undefined;
	} while (nextOffset !== undefined);

	return returnData;
}

/**
 * Build a JSON-API compliant request body
 */
export function buildJsonApiBody(
	type: string,
	attributes: IDataObject,
	relationships?: IDataObject,
	id?: string,
): IDataObject {
	const data: IDataObject = {
		type,
		attributes,
	};

	if (id) {
		data.id = id;
	}

	if (relationships && Object.keys(relationships).length > 0) {
		data.relationships = relationships;
	}

	return { data };
}

/**
 * Parse a JSON-API response to extract and flatten data
 */
export function parseJsonApiResponse(response: IDataObject | undefined): IDataObject | IDataObject[] {
	if (!response) {
		return {};
	}

	if (!response.data) {
		return response;
	}

	const data = response.data;

	// Single resource
	if (!Array.isArray(data)) {
		const item = data as IDataObject;
		return {
			id: item.id,
			type: item.type,
			...(item.attributes as IDataObject),
			relationships: item.relationships,
			links: item.links,
		};
	}

	// Collection - cast to proper type for map
	const dataArray = data as IDataObject[];
	return dataArray.map((item) => ({
		id: item.id,
		type: item.type,
		...(item.attributes as IDataObject),
		relationships: item.relationships,
		links: item.links,
	}));
}

/**
 * Parse included resources from JSON-API response
 */
export function parseJsonApiIncludes(response: IDataObject): Map<string, IDataObject> {
	const includesMap = new Map<string, IDataObject>();

	const included = response.included as IDataObject[];
	if (included) {
		for (const item of included) {
			const key = `${item.type}:${item.id}`;
			includesMap.set(key, {
				id: item.id,
				type: item.type,
				...(item.attributes as IDataObject),
			});
		}
	}

	return includesMap;
}

/**
 * Convert simple filter object to Planning Center's where[] format
 */
export function buildWhereFilters(filters: IDataObject): IDataObject {
	const qs: IDataObject = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== '') {
			qs[`where[${key}]`] = value;
		}
	}

	return qs;
}

