import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";

const credential = {
  email: ref(""),
};


export const useForgotPassword = () => {
  const Router = useRouter();
  const loading = ref(false);
  const { showToast } = useCustomToast();
  const forgotPassword = async () => {
    if (!credential.email.value) {
      showToast({
        title: "Error",
        message: "Email is required.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    loading.value = true;

    try {
      const res = (await auth_api.$_forgot_password({
        email: credential.email.value,
      })) as any;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Please enter your new password to continue.@",
          toastType: "success",
          duration: 3000,
        });

        // Redirect to the verify OTP page

        Router.push(`/reset-password?token=${res.data.token}`);
      } else {
        showToast({
          title: "Error",
          message: res.data.message || "Failed to send OTP",
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error: any) {
      loading.value = false;
      showToast({
        title: "Error",
        message: error?.message || "An unexpected error occurred.",
        toastType: "error",
        duration: 3000,
      });
    }
    loading.value = false;
  };

  return { credential, forgotPassword, loading };
};
