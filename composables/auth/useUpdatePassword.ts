import { ref } from "vue";
import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useUpdatePassword = () => {
  const loading = ref(false);
  const router = useRouter()
  const { $_update_password } = auth_api;

  const updatePassword = async (payload: any) => {
    loading.value = true;
    const res = await $_update_password(payload) as any
    console.log(res, 'reshere')
    if(res.type !== 'ERROR'){
      showToast({
        title: "Success",
        message: "Password Update was successful",
        toastType: "success",
        duration: 3000,
      });
      localStorage.clear()
      // window.location.href = "/admin"
    } else {
      showToast({
        title: "Error",
        message: res?.data?.responseCode || res?.data?.message || res?.data?.error,
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
    return res
  };

  return {
    updatePassword,
    loading
  };
};
