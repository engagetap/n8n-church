import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class PlanningCenterOAuth2Api implements ICredentialType {
	name = 'planningCenterOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Planning Center OAuth2 API';

	documentationUrl = 'https://developer.planning.center/docs/#/overview/authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://api.planningcenteronline.com/oauth/authorize',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://api.planningcenteronline.com/oauth/token',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'people services check_ins giving groups calendar',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
