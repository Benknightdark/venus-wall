import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { GoLinkExternal } from "react-icons/go";
import useSWR from "swr";
import Loading from "../../../components/loading";
import { CrawlerList } from "../../../components/log/components/crawlerList";
import { ProcessorList } from "../../../components/log/components/processorList";
import { WorkerList } from "../../../components/log/components/workerList";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../stores/admin-global-store";
import { crawlerApiUrl, processorApiUrl, workerApiUrl } from "../../../utils/admin/logUtils";
import { fetcher } from "../../../utils/fetcherHelper";
import AdminLayout from "../../utils/admin-layout";

const Index = () => {
    const router = useRouter();
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore,
        { fallbackData: defaultAdminGlobalStoreData })
    const { data: workerData, mutate: workerMutate, error: workerError } = useSWR(`${workerApiUrl}?limit=10&offset=0`, fetcher
        , {
            refreshInterval: 5
        });
    const { data: crawlerData, mutate: crawlerMutate, error: crawlerError } = useSWR(`${crawlerApiUrl}?limit=10&offset=0`, fetcher, {
        refreshInterval: 5
    });
    const { data: processorData, mutate: processorMutate, error: processorError } = useSWR(`${processorApiUrl}?limit=10&offset=0`, fetcher, {
        refreshInterval: 5
    });

    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '爬蟲執行記錄查詢', pageDescription: '查詢爬蟲的執行記錄' }, false)
    })
    if (workerError || crawlerError || processorError) return <Loading></Loading>
    if (!workerData || !crawlerData || !processorData) return <Loading></Loading>

    return (
        <div>
            <div className="flex flex-col  md:flex-row md:flex-wrap  md:space-x-3  justify-center items-center">
                <div className="card  bg-base-100 shadow-xl w-96 h-fit mt-3">
                    <div className="card-body bg-orange-100 ">
                        <div className='flex flex-row justify-between'>
                            <h2 className="card-title underline decoration-1">Worker Log</h2>
                            <div className="tooltip" data-tip="看更多">
                                <GoLinkExternal className='h-5 w-5 cursor-pointer hover:text-red-400' onClick={() => {
                                    router.push(`/admin/log/more/worker`)
                                }}></GoLinkExternal></div>
                        </div>
                        <div className='flex flex-col  h-48 overflow-y-scroll'>
                            <ul className="menu menu-compact bg-base-100 rounded-box">
                                {
                                    workerData && workerData.map((w: any) => <WorkerList key={w.ID} w={w}></WorkerList>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="card  bg-base-100 shadow-xl w-96 h-fit mt-3">
                    <div className="card-body bg-blue-100 w-96">
                        <div className='flex flex-row justify-between'>
                        <h2 className="card-title underline decoration-1">Crawler Log</h2>
                            <div className="tooltip" data-tip="看更多">
                                <GoLinkExternal className='h-5 w-5 cursor-pointer hover:text-red-400' onClick={() => {
                                router.push(`/admin/log/more/crawler`)
                            }}></GoLinkExternal></div>
                        </div>
                        <div className='flex flex-col  h-48 overflow-y-scroll'>
                            <ul className="menu menu-compact bg-base-100 rounded-box">
                                {
                                    crawlerData && crawlerData.map((w: any) => <CrawlerList key={w.ID} w={w}></CrawlerList>)
                                }
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col pt-3'>
                <div className="card  bg-base-100 shadow-xl w-full">
                    <div className="card-body bg-green-100">
                        <h2 className="card-title  underline decoration-1">Processor Log</h2>
                        <div className='flex flex-col'>

                            <ul className="menu menu-compact bg-base-100 rounded-box">
                                {
                                    processorData && processorData.map((w: any) => <ProcessorList key={w.ID} w={w}></ProcessorList>)
                                }
                            </ul>
                        </div>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary" onClick={() => {
                                router.push(`/admin/log/more/processor`)
                            }}>看更多</button>
                        </div>
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