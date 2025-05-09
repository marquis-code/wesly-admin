import { ref } from "vue";
import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useUpdateCredentials = () => {
  const loading = ref(false);
  const router = useRouter()
  const { $_update_credentials } = auth_api;

  const updateCredentials = async (payload: any) => {
    loading.value = true;
    const updatedPayload = {
      body: payload
    }
    const res = await $_update_credentials(updatedPayload) as any
    if(res.type !== 'ERROR'){
      showToast({
        title: "Success",
        message: "Update was successful",
        toastType: "success",
        duration: 3000,
      });
      window.location.reload()
    //   router.push('/dashboard/investment-products')
    } else {
      showToast({
        title: "Error",
        message: res?.data?.message,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  return {
    updateCredentials,
    loading
  };
};
