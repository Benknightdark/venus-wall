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
        , {
            refreshInterval: 5
        });
    const { data: crawlerData, mutate: crawlerMutate, error: crawlerError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/log/crawler?limit=10&offset=0`, fetcher, {
        refreshInterval: 5
    });
    const { data: processorData, mutate: processorMutate, error: processorError } = useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/log/processor?limit=10&offset=0`, fetcher, {
        refreshInterval: 5
    });

    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '爬蟲執行記錄查詢', pageDescription: '查詢爬蟲的執行記錄' }, false)
    })
    if (workerError || crawlerError || processorError) return <Loading></Loading>
    if (!workerData || !crawlerData || !processorData) return <Loading></Loading>

    return (
        <div>
            <div className="flex flex-col md:flex-row md:flex-wrap  space-x-3 justify-center">
                <div className="card  bg-base-100 shadow-xl w-96 h-fit">
                    <div className="card-body bg-orange-100 ">
                        <h2 className="card-title underline decoration-1">Worker Log</h2>
                        <div className='flex flex-col  h-48 overflow-y-scroll'>
                            <ul className="menu menu-compact bg-base-100 rounded-box">
                                {
                                    workerData && workerData.map((w: any) => <li 
                                    className='' key={w.ID}><a>{w.WebPageName}</a></li>)
                                }
                            </ul>

                        </div>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">看更多</button>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl h-fit">
                    <div className="card-body bg-blue-100 w-96">
                        <h2 className="card-title underline decoration-1">Crawler Log</h2>
                        <div className='flex flex-col  h-48 overflow-y-scroll'>
                            <ul className="menu menu-compact bg-base-100 rounded-box">
                                {
                                    crawlerData && crawlerData.map((w: any) => <li className='' key={w.ID}><a><span className="text-red-600">{w.ForumName}/{w.WebPageName} -Page{w.Page}</span> 開始爬取</a></li>)
                                }
                            </ul>

                        </div>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">看更多</button>
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
                                    processorData && processorData.map((w: any) => <li
                                    onClick={()=>{
                                        window.open(w.Url, '_blank')!.focus();
                                    }}
                                        className='animate__animated animate__flipInX animate__delay-1s
                                        ' key={w.ID}>
                                        <a><span className="text-red-600">【{w.ForumName}/{w.WebPageName} - {w.Title}】</span> 已寫入資料庫</a>
                                    </li>)
                                }
                            </ul>
                        </div>  
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">看更多</button>
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