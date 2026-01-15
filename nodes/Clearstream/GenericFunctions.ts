import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	ILoadOptionsFunctions,
	IRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.getclearstream.com/v1';

export async function clearstreamApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('clearstreamApi');

	const options: IRequestOptions = {
		method,
		uri: `${BASE_URL}${endpoint}`,
		headers: {
			'X-Api-Key': credentials.apiKey as string,
			'Content-Type': 'application/json',
		},
		qs,
		body,
		json: true,
	};

	// Add subaccount header if specified
	if (credentials.accountId) {
		options.headers!['X-Account-Id'] = credentials.accountId as string;
	}

	// Remove empty body for GET/DELETE requests
	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}

	// Remove empty query string
	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.request(options);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function clearstreamApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	dataKey: string = 'data',
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];

	let page = 1;
	let hasMore = true;

	qs.limit = qs.limit || 100;

	while (hasMore) {
		qs.page = page;
		const response = await clearstreamApiRequest.call(this, method, endpoint, body, qs);

		const items = response[dataKey] as IDataObject[];
		if (items && items.length > 0) {
			returnData.push(...items);
		}

		// Check pagination metadata
		const meta = response as IDataObject;
		const totalPages = meta.pages as number;

		if (page >= totalPages || !items || items.length === 0) {
			hasMore = false;
		} else {
			page++;
		}
	}

	return returnData;
}

export function formatPhoneNumber(phone: string): string {
	// Remove all non-numeric characters except +
	let cleaned = phone.replace(/[^\d+]/g, '');

	// If it doesn't start with +, assume US and add +1
	if (!cleaned.startsWith('+')) {
		if (cleaned.length === 10) {
			cleaned = '+1' + cleaned;
		} else if (cleaned.length === 11 && cleaned.startsWith('1')) {
			cleaned = '+' + cleaned;
		}
	}

	return cleaned;
}
