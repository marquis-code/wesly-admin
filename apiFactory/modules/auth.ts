import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_V1 } from '../axios.config'

export const auth_api = {
	 $_register: (payload: any) => {
		const url = '/users/register'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_login: (credential: any) => {
		const url = '/users/login'
		return GATEWAY_ENDPOINT.post(url, credential)
	},
	$_reset_password: (payload: any) => {
		const url = '/reset-password'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_resend_otp: (payload: any) => {
		const url = '/users/resend-activation-code'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_forgot_password: (payload: any) => {
		const url = '/forgot-password'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_logout: (payload: any) => {
		const url = '/users/logout'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_email_activation: (payload: any) => {
		const url = '/users/email-activation'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_update_profile: (payload: any, id: string) => {
		const url = `/users/email-activation/${id}`
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_fetch_bvn_data: (payload: any) => {
		const url = '/bvn/get-bvn-data'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_callback: (code: any, session_state: any, sid: any) => {
		const url = `/igree/callback
		?code=${code}
		&acr_values=otp
		&scope=address+email_address+banking_data+profile+contact_info+bvn
		&session_state=${session_state}
		&sid=${sid}`
		return GATEWAY_ENDPOINT.get(url)
	},
	$_get_idp_verification: () => {
		const url = `/igree/get-link`
		return GATEWAY_ENDPOINT.get(url)
	},
	$_get_credentials: () => {
        let url = `/auth/providers/credentials`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_update_credentials: (payload: any) => {
        let url = `/auth/providers/credentials`;
        return GATEWAY_ENDPOINT.post(url, payload);
      },
	  $_admin_login: (credential: any) => {
		const url = '/auth/signin'
		return GATEWAY_ENDPOINT.post(url, credential)
	},
	$_update_password: (payload: any) => {
        let url = `/auth/providers/update-password`;
        return GATEWAY_ENDPOINT.post(url, payload);
      },
	$_upload_file: (payload: any) => {
        let url = `/auth/providers/upload-file`;
        return GATEWAY_ENDPOINT.post(url, payload);
      },
}
