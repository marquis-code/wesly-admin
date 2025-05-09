import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from '@/composables/core/useCustomToast'


export const useCallback = () => {
  const router = useRouter();
  const loading = ref(false);
  const { showToast } = useCustomToast();

  const callback = async (code: any, session_state: any, sid: any) => {
    loading.value = true;
    const res = (await auth_api.$_callback(code, session_state, sid)) as any;
    loading.value = false;
    if (res.type !== "ERROR") {
      showToast({
        title: "Success",
        message: "Callback was successful!",
        toastType: "success",
        duration: 3000
      });
      router.push("/idp-verification-page");
    }
  };
  return { callback, loading };
};
