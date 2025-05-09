import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";

export const useResetPassword = () => {
  const Router = useRouter();
  const loading = ref(false);
  const { showToast } = useCustomToast();
  const credential = {
    newPassword: ref(""),
    repeatNewPassword: ref(""),
    token: ref("")
  };

  const resetPassword = async () => {
    if (!credential.newPassword.value) {
      showToast({
        title: "Error",
        message: "New Password is required.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    if (!credential.repeatNewPassword.value) {
      showToast({
        title: "Error",
        message: "Repeat password is required.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    if (!credential.token.value) {
      showToast({
        title: "Error",
        message: "Token is required.",
        toastType: "error",
        duration: 3000,
      });
      return;
    }

    loading.value = true;

    try {
      const res = (await auth_api.$_reset_password({
        token: credential.token.value,
        newPassword: credential.newPassword.value,
        repeatNewPassword: credential.repeatNewPassword.value
      })) as any;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Hurray!! Password reset was successful. Please Login",
          toastType: "success",
          duration: 3000,
        });

        // Redirect to the verify OTP page
        Router.push("/login");
      } else {
        showToast({
          title: "Error",
          message: res.data.message || "Something went wrong",
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

  return { credential, resetPassword, loading };
};
