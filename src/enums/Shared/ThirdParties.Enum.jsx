import { ValidateMicroSoftToken, ValidateOracleSSOToken } from '../../services';

export const ThirdPartiesEnum = {
  Microsoft: {
    key: 1,
    value: 'microsoft',
    color: '#0167b9',
    icon: 'fab fa-windows',
    path: '/oauth/web/adfs/authhandler',
    providerKey: 'microsoft_azure_sso',
    routeKey: 'microsoft',
    validationApi: ValidateMicroSoftToken,
  },
  Oracle: {
    key: 2,
    value: 'oracle',
    color: '#c84734',
    icon: 'fas fa-database',
    path: '/oauth/web/adfs/authhandler',
    providerKey: 'oracle_sso',
    routeKey: 'oracle',
    validationApi: ValidateOracleSSOToken,
  },
};
