import { ReactElement } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admon-global-store";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '看版管理', pageDescription: '管理要爬的看版' }, false)
    return (
        <div>
            Enter
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