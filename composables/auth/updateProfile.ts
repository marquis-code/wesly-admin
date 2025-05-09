import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useUpdateProfile = () => {
  const router = useRouter();
  const loading = ref(false);
  const { showToast } = useCustomToast();
  const { user } = useUser(); // Assuming `user` contains the current profile

  // Initial credential state
  const credential = ref({
    email: "",
    firstName: "",
    middleName: "",
    lastName: "",
    bvn: "",
    domain: "",
    phoneNumber: "",
    gender: "",
    nin: "",
    dob: "",
    termsAndCondition: "",
    avatar: "",
  }) as any

  const updateProfile = async () => {
    loading.value = true;

    try {
      // Compare the current user profile with updated credentials
      const updatedData = Object.keys(credential.value).reduce((acc, key) => {
        if (credential.value[key] !== user.value[key]) {
          acc[key] = credential.value[key];
        }
        return acc;
      }, {} as Record<string, any>);

      if (Object.keys(updatedData).length === 0) {
        showToast({
          title: "No Changes",
          message: "No updates detected in your profile.",
          toastType: "info",
          duration: 3000,
        });
        loading.value = false;
        return;
      }

      // Make the API call with updated data only
      const res = (await auth_api.$_update_profile(updatedData, user?.value?.id)) as any;
      loading.value = false;

      if (res.type !== "ERROR") {
        // Update user data locally
        useUser().createUser(res.data);
        showToast({
          title: "Success",
          message: "Your profile has been updated successfully!",
          toastType: "success",
          duration: 3000,
        });
        router.push("/dashboard");
      } else {
        showToast({
          title: "Error",
          message: res.message || "Failed to update profile.",
          toastType: "error",
          duration: 3000,
        });
      }
    } catch (error) {
      loading.value = false;
      showToast({
        title: "Error",
        message: "An error occurred while updating your profile.",
        toastType: "error",
        duration: 3000,
      });
    }
  };

  return { credential, updateProfile, loading };
};
