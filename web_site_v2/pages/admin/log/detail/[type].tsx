import { useRouter } from "next/router";
import React, { ReactElement, useEffect } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import { getLogApiUrl } from "../../../../utils/admin/logUtils";
import AdminLayout from "../../../utils/admin-layout";


const Detail = () => {
    const router = useRouter();
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const apiUrl:string=getLogApiUrl(router.query['type']?.toString()!);
    useEffect(() => {
        adminGlobalStoreMutate({
            ...defaultAdminGlobalStoreData,
            pageTitle: `${router.query?.type}執行記錄`, pageDescription: `查詢所有${router.query?.type}的執行記錄`
        }, false)
    })
    return (
        <div>
            {
            }
        </div>
    );
}
Detail.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Detail;