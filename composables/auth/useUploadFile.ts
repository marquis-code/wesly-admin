import { ref } from "vue";
import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
const { showToast } = useCustomToast();

export const useUploadFile = () => {
  const loading = ref(false);
  const router = useRouter()
  const { $_upload_file } = auth_api;

  const uploadFile = async (payload: any) => {
    loading.value = true;
    const res = await $_upload_file(payload) as any
    console.log(res, 'reshere')
    if(res.type !== 'ERROR'){
      showToast({
        title: "Success",
        message: "File Upload was successful",
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
    uploadFile,
    loading
  };
};
