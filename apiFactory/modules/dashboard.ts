import { GATEWAY_ENDPOINT } from '../axios.config'
export const dashboard_api = {
    $_get_dashboard_stats: () => {
        let url = `/auth/dashboard-data`;
        return GATEWAY_ENDPOINT.get(url);
      },
      $_get_profile: () => {
        let url = `/auth/user/me`;
        return GATEWAY_ENDPOINT.get(url);
      }
}
