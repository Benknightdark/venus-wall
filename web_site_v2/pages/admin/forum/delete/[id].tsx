import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import AdminLayout from "../../../utils/admin-layout";
import {ForumDescription} from "../../../../components/forum/componets/forumDescription";

const Delete = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '刪除頁面' }, false)
    })
    return (
        <div className="flex flex-col space-y-2 ">
            <ForumDescription id={id}></ForumDescription>            
            <div className=' flex flex-row items-center  justify-center space-x-2'>
                <button className="btn btn-active btn-error" onClick={() => { 
                    
                 }}>刪除</button>
                <button className="btn btn-active" onClick={router.back}>返回</button>
            </div>
        </div>

    );
}
Delete.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Delete;