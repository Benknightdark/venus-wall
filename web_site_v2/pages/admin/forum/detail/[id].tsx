import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import AdminLayout from "../../../utils/admin-layout";
import {ForumDescription} from "../../../../components/forum/componets/forumDescription";

const Detail = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '明細頁面' }, false)
    })
    return (
        <div className="flex flex-col space-y-2 ">
            <ForumDescription id={id} enableCrawler={true}></ForumDescription>            
            <div className=' flex flex-row items-center  justify-center space-x-2'>
                <button className="btn btn-active btn-primary" onClick={() => { router.push(`/admin/forum/edit/${id}`) }}>編輯</button>
                <button className="btn btn-active" onClick={router.back}>返回</button>
            </div>
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