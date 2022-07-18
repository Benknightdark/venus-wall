import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import Loading from "../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import { fetcher } from "../../../utils/fetcherHelper";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const { data: workerData, mutate: workerMutate, error: workerError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/log/worker?limit=10&offset=0`, fetcher
    ,{
        refreshInterval:10
    });
    const { data: crawlerData, mutate: crawlerMutate, error: crawlerError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/log/crawler?limit=10&offset=0`, fetcher,{
        refreshInterval:10
    });
    const { data: processorData, mutate: processorMutate, error: processorError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/log/processor?limit=10&offset=0`, fetcher,{
        refreshInterval:10
    });

    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '爬蟲執行記錄查詢', pageDescription: '查詢爬蟲的執行記錄' }, false)
    })
    if (workerError || crawlerError || processorError) return <Loading></Loading>
    if (!workerData || !crawlerData || !processorData) return <Loading></Loading>

    return (
        <div className="flex flex-col md:flex-row md:flex-wrap  space-x-3 justify-center">
            <div className="card  bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Worker Log</h2>
                    <div className='flex flex-col'>
                    {
                        workerData&&workerData.map((w:any)=><div className='bounce 1s ease-in-out 5t' key={w.ID}>{w.WebPageName}</div>)
                    }
                    </div>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">看更多</button>
                    </div>
                </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Crawler Log</h2>
                    <div className='flex flex-col'>
                    {
                        crawlerData&&crawlerData.map((w:any)=><div className='bounce 1s ease-in-out 5t' key={w.ID}>{w.Page} - {w.WebPageName} - {w.RootPageUrl}</div>)
                    }
                    </div>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">看更多</button>
                    </div>
                </div>
            </div>

            <div className="card  bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Processor Log</h2>
                    <div className='flex flex-col'>
                    {
                        processorData&&processorData.map((w:any)=><div className='bounce 1s ease-in-out 5t' key={w.ID}> {w.WebPageName} - {w.Title}</div>)
                    }
                    </div>                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">看更多</button>
                    </div>
                </div>
            </div>
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