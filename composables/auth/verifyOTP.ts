import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";

const credential = {
  email: ref(""),
  code: ref(""),
} as any;


export const use_auth_verify_otp = () => {
  const Router = useRouter();
  const { showToast } = useCustomToast();
  const route = useRoute()
  const router = useRouter()

  const loading = ref(false);

  const verify_OTP = async () => {
    loading.value = true;
    try {
      const res = (await auth_api.$_email_activation({
        email: route.query.userId,
        code: credential.code.value
      })) as any;

      loading.value = false;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: res.data.message,
          toastType: "success",
          duration: 3000,
        });
        if(res.data.next === 'BVN_Validation'){
          router.push(`/profile-setup?userId=${res?.data?.userId}&email=${res?.data?.email}`)
        }
        router.push('/login')
      } else {
        console.log(res.data)
        showToast({
          title: "Error",
          message: res.data.message,
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error: any) {
      router.push('/login')
      loading.value = false;
      showToast({
        title: "Error",
        message: error.message,
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return { credential, verify_OTP, loading };
};
