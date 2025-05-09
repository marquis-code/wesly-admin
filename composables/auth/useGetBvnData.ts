import { useUser } from "@/composables/auth/user";
import { auth_api } from "@/apiFactory/modules/auth";
import { useCustomToast } from '@/composables/core/useCustomToast'


export const useGetBvnData = () => {
  const bvnObj = ref({})
  const loading = ref(false);
  const { showToast } = useCustomToast();
  const { user }  = useUser()

  const getBvnData = async () => {
    loading.value = true;
    const res = (await auth_api.$_fetch_bvn_data({
      code: user.value.code,
      user_id: user.value.id,
    })) as any;
    loading.value = false;
    if (res.type !== "ERROR") {
      bvnObj.value = res.data
      showToast({
        title: "Success",
        message: "BVN data fetched successfully!",
        toastType: "success",
        duration: 3000
      });
    }
  };


  onMounted(() => {
    getBvnData()
  })
  return { getBvnData, loading };
};
