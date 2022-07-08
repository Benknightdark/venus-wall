import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import AdminLayout from "../../../utils/admin-layout";
import { ForumDescription } from "../../../../components/forum/componets/forumDescription";
import { ToastMessageType, useToast } from "../../../../utils/toastMessageHook";

const Delete = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    const toast=useToast();
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '刪除頁面' }, false)
    })
    return (
        <div className="flex flex-col space-y-2 ">
            <ForumDescription id={id}></ForumDescription>
            <div className=' flex flex-row items-center  justify-center space-x-2'>
                <button className="btn btn-active btn-error" onClick={async () => {
                    const req = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/api/forum/${id}`, {
                        method: 'DELETE',
                    })
                    if (req.status === 200) {
                        toast.show(true, (await req.json())['message'], ToastMessageType.Success);
                        router.push('/admin/forum')
                    } else {
                        toast.show(true, (await req.text()), ToastMessageType.Error);
                    }
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