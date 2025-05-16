import { GATEWAY_ENDPOINT } from '../axios.config'

export const document_api = {
	 $_upload_account_document: () => {
		const url = '/providers/upload-file?type=customer'
		return GATEWAY_ENDPOINT.post(url)
	},
    $_upload_saving_document: () => {
		const url = '/providers/upload-file?type=savings'
		return GATEWAY_ENDPOINT.post(url)
	},
	$_fetch_saving_document: () => {
		const url = '/providers/upload-file?type=customer'
		return GATEWAY_ENDPOINT.get(url)
	},
    $_fetch_account_document: () => {
		const url = '/providers/upload-file?type=savings'
		return GATEWAY_ENDPOINT.get(url)
	},
}

