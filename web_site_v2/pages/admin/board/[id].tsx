import { useRouter } from "next/router";
import { ReactElement } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const router = useRouter();
    const { id } = router.query;
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '看版管理', pageDescription: '管理看版裡的文章和圖片' }, false)
    return (
        <div>
            {id}
        </div>
    );
}
Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Index;