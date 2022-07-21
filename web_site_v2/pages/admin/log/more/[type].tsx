import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import { getLogApiUrl } from "../../../../utils/admin/logUtils";
import AdminLayout from "../../../utils/admin-layout";
import useSWRInfinite from 'swr/infinite'
import { fetcher } from "../../../../utils/fetcherHelper";
import Loading from "../../../../components/loading";
import { WorkerList } from "../../../../components/log/components/workerList";
import { CrawlerList } from "../../../../components/log/components/crawlerList";
import { ProcessorList } from "../../../../components/log/components/processorList";

const LogRow = (props: any) => {
    if (props.type === 'worker') {
        return <WorkerList w={props.w}></WorkerList>;
    }
    if (props.type === 'crawler') {
        return <CrawlerList w={props.w}></CrawlerList>;

    }
    if (props.type === 'processor') {
        return <ProcessorList w={props.w}></ProcessorList>;
    }
    return <div></div>
}

const Detail = () => {
    const router = useRouter();
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const apiUrl: string = getLogApiUrl(router.query['type']?.toString()!);
    const [showLoading, setShowLoading] = useState(false)
    const { data, size, setSize, error } = useSWRInfinite(index =>
        `${apiUrl}?offset=${index * 100}&limit=${100}`,
        fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })
    useEffect(() => {
        adminGlobalStoreMutate({
            ...defaultAdminGlobalStoreData,
            pageTitle: `${router.query?.type}執行記錄`, pageDescription: `查詢所有${router.query?.type}的執行記錄`
        }, false);
        try {
            const myDiv = document.getElementById('scroll-body')
            myDiv!.onscroll = async () => {
                if (showLoading) return
                if (myDiv!.offsetHeight + myDiv!.scrollTop >= myDiv!.scrollHeight) {
                    console.log("開始撈下一頁")
                    await setShowLoading(true)
                    await setSize(size + 1)
                    await setShowLoading(false)
                    console.log("完成撈下一頁")
                    console.log('----------------------------')
                }
            };
        } catch (error) {

        }
    })
    if (error) return <Loading></Loading>
    if (!data) return <Loading></Loading>
    return (
        <div className='flex flex-col space-y-2'>
            <div className='flex flex-col  h-96 overflow-y-scroll' id='scroll-body'>
                <ul className="menu menu-compact bg-base-100 rounded-box" >
                    {
                        data && data.map((item: any) => (item.map((w: any) => {
                            return <LogRow key={w.ID} w={w} type={router.query.type!}></LogRow>

                        })))
                    }
                </ul>
                {showLoading && <Loading></Loading>}

            </div>

            <div className="flex flex-row items-center  justify-center space-x-2">
                <button type='button' className="btn btn-active" onClick={router.back}>返回</button>
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