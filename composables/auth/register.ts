import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
const credential = {
  username: ref(""),
  email: ref(""),
  password: ref("")
};

export const use_auth_register = () => {
  const loading = ref(false);
  const router = useRouter();
  const { showToast } = useCustomToast();

  const register = async () => {
    loading.value = true;

    const payload = {
      username: credential.username.value,
      email: credential.email.value,
      password: credential.password.value
    };

    try {
      const res = (await auth_api.$_register(payload)) as any;

      loading.value = false;

      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: res.data.message,
          toastType: "success",
          duration: 3000,
        });
        // router.push(`/verify-account?userId=${credential.email.value}`);
        router.push(`/email-sent-success?userId=${credential.email.value}`);
      } else {
        router.push(`/email-sent-success?userId=obasam@gmail.com`);
        console.log(res.data, 'error here')
        showToast({
          title: "Error",
          message: res.data.message,
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      loading.value = false;
      router.push(`/email-sent-success?userId=obasam@gmail.com`);
      showToast({
        title: "Error",
        message: "Registration failed. Please try again.",
        toastType: "error",
        duration: 3000,
      });
    }
  };

  const isFormDisabled = computed(() => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credential.email.value);
    const usernameValid = credential?.username?.value?.length > 3 // Checks if it's a string of 11 digits
    const passwordValid = credential?.password?.value?.length > 3 // Checks if it's a string of 11 digits
    return loading.value || !emailValid || !usernameValid || !passwordValid;
  });
  

  return { credential, register, loading, isFormDisabled };
};
