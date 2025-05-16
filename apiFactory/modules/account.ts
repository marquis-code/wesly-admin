import { GATEWAY_ENDPOINT } from '@/apiFactory/axios.config'

export const document_api = {
	 $_upload_account_document: (paylaod) => {
		console.log('from api factory')
		const url = '/auth/providers/upload-file?type=customer'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
    $_upload_saving_document: (paylaod) => {
		const url = '/auth/providers/upload-file?type=savings'
		return GATEWAY_ENDPOINT.post(url, payload)
	},
	$_fetch_saving_document: () => {
		const url = '/auth/providers/upload-file?type=customer'
		return GATEWAY_ENDPOINT.get(url)
	},
    $_fetch_account_document: () => {
		const url = '/auth/providers/upload-file?type=savings'
		return GATEWAY_ENDPOINT.get(url)
	},
}

