import { ReactElement } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
      adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '文章管理', pageDescription: '管理要爬的文章' }, false)
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