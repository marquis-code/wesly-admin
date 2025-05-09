import axios, { type AxiosResponse } from "axios";
import { useUser } from "@/composables/auth/user";
import { useCustomToast } from '@/composables/core/useCustomToast'

const { 
  token, 
  logOut } = useUser();
// const token = ref(`eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzM4NTAxNzYwLCJleHAiOjE3MzkxMDY1NjB9.KPC7QUR4kGCUcVvNdGj58MwadOQYLC04v1ObTZsAZEeTpILjyshUhj8MwUkdVhgCky8lG4o3p2WDrYkhKYUl8A`)
const { showToast } = useCustomToast();

const $GATEWAY_ENDPOINT_WITHOUT_VERSION = import.meta.env
  .VITE_BASE_URL as string;
const $GATEWAY_ENDPOINT = import.meta.env.VITE_BASE_URL + "/api";
const $GATEWAY_ENDPOINT_V1 = import.meta.env.VITE_BASE_URL + "/api/v1";
const $IMAGE_UPLOAD_ENDPOINT = import.meta.env.VITE_IMAGE_UPLOAD_BASE_URL as string;
const $TERMI_ENDPOINT =  import.meta.env.VITE_TERMI_URL

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    'x-api-key': 'bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr',
  },
});

export const TERMI_GATEWAY_ENDPOINT = axios.create({
  baseURL: $TERMI_ENDPOINT
});

export const GATEWAY_ENDPOINT_V1 = axios.create({
  baseURL: $GATEWAY_ENDPOINT_V1
});

export const GATEWAY_ENDPOINT_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    'x-api-key': 'bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr',
    Authorization: `Bearer ${token.value}`,
  },
});

export const GATEWAY_ENDPOINT_WITH_AUTH_FORM_DATA = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
  headers: {
    'x-api-key': 'bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr',
    Authorization: `Bearer ${token.value}`,
    "Content-Type": "multipart/form-data",
  },
});

export const GATEWAY_ENDPOINT_WITHOUT_VERSION = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
});
export const GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH = axios.create({
  baseURL: $GATEWAY_ENDPOINT_WITHOUT_VERSION,
  headers: {
    'x-api-key': 'bwt2r25gw1hw9WdGWSryW626Th2AHF836dGr',
    Authorization: `Bearer ${token.value}`,
  },
});
export const IMAGE_UPLOAD_ENDPOINT = axios.create({
  baseURL: $IMAGE_UPLOAD_ENDPOINT,
});
export interface CustomAxiosResponse extends AxiosResponse {
  value?: any;
  type?: string;
}

const instanceArray = [
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_V1,
  GATEWAY_ENDPOINT_WITH_AUTH,
  GATEWAY_ENDPOINT_WITHOUT_VERSION,
  GATEWAY_ENDPOINT_WITHOUT_VERSION_WITH_AUTH,
  TERMI_GATEWAY_ENDPOINT
];

instanceArray.forEach((instance) => {
  instance.interceptors.request.use((config: any) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
      return response;
    },
    (err: any) => {
      if (typeof err.response === "undefined") {
        // showToast({
        //   title: "Error",
        //   message: "kindly check your network connection",
        //   toastType: "error",
        //   duration: 3000
        // });
        return {
          type: "ERROR",
          ...err.response,
        };
      }
      if (err.response.status === 401) {
        console.log(err.response.data.message)
        logOut();
        showToast({
          title: "Error",
          message: err.response.data.message,
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (statusCodeStartsWith(err.response.status, 4)) {
        console.log(err.response, 'error from axios config')
        if (err.response.data.message) {
          showToast({
            title: "Error",
            message: err.response.data.message,
            toastType: "error",
            duration: 3000
          });
        }
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 500) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        return {
          type: "ERROR",
          ...err.response,
        };
      } else if (err.response.status === 409) {
        showToast({
          title: "Error",
          message: err?.response?.data?.message || err?.response?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
        
      }
    }
  );
});

const statusCodeStartsWith = (
  statusCode: number,
  startNumber: number
): boolean => {
  const statusCodeString = statusCode.toString();
  const startNumberString = startNumber.toString();

  return statusCodeString.startsWith(startNumberString);
};
