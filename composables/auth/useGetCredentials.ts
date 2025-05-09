import { ref } from "vue";
import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();
export const useGetCredentials = () => {
    const loading = ref(false);
    const credentials = ref([]);
    const { $_get_credentials } = auth_api;
  
    const getCredentials = async () => {
      loading.value = true;
      const response = await $_get_credentials() as any
      console.log(response?.data, 'resheree')
      if (response.type !== "ERROR") {
        credentials.value = response?.data;
        showToast({
          title: "Success",
          message: "Credentials retrieved successfully.",
          toastType: "success",
          duration: 3000,
        });
      } else {
        showToast({
          title: "Error",
          message: `${response?.data?.message || 'Error retrieving Credentials'}`,
          toastType: "error",
          duration: 3000,
        });
      }
      loading.value = false;
    };

    onMounted(() => {
        getCredentials()
    })
  
    return {
      getCredentials,
      credentials,
      loading,
    };
  };