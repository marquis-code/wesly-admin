import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from '@/composables/core/useCustomToast'


export const useGetIDPVerificationPage = () => {
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const getIDPVerificationPage = async () => {
    loading.value = true;
    const res = (await auth_api.$_get_idp_verification()) as any;
    loading.value = false;
    if (res.type !== "ERROR") {
      showToast({
        title: "Success",
        message: "IDP verifucation page fetched was successful!",
        toastType: "success",
        duration: 3000
      });
    }
  };
  return { getIDPVerificationPage, loading };
};
