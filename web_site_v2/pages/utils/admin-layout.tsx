import { Fragment, PropsWithChildren } from "react";
import { GiHamburgerMenu, GiSpiderBot, GiSpiderMask } from "react-icons/gi";
import { AiFillHome, AiOutlineRead } from 'react-icons/ai'
import { MdManageSearch } from 'react-icons/md'
import { useRouter } from "next/router";
import Link from "next/link";
import { FcRefresh } from "react-icons/fc";
import useSWR from "swr";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../stores/admon-global-store";
const AdminLayout = ({ children }: PropsWithChildren<{}>) => {
    const router = useRouter();
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })

    return (
        <Fragment>
            <div className="flex flex-col h-screen">
                {/* 標題列 */}
                <header className="bg-gradient-to-r from-blue-400 to-gray-200  w-full">
                    <div className="p-3">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex p-2 rounded-lg bg-indigo-800 ">
                                    <GiSpiderMask className="h-6 w-6 text-white cursor-pointer" aria-hidden="true"
                                        onClick={
                                            () => {
                                                router.push('/admin')
                                            }
                                        }
                                    ></GiSpiderMask>
                                </span>
                                <p className="ml-3 mr-3 font-medium text-white truncate">
                                    <span className='text-white hover:font-bold cursor-pointer'>管理者後台</span>
                                </p>
                            </div>
                            <label htmlFor="my-drawer-2" className=" drawer-button 
                            hover:opacity-100 opacity-50
                            lg:hidden hover:shadow-lg hover:shadow-slate-900">
                                <GiHamburgerMenu className="w-10 h-10 cursor-pointer"></GiHamburgerMenu>
                            </label>
                        </div>
                    </div>
                </header>
                {/* 內容主頁 */}
                <div className=" bg-base-200  flex-1 overflow-y-hidden overflow-x-hidden" id="contentBody">
                    <div className="drawer drawer-mobile">
                        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex flex-col items-center justify-between">
                            <div className="w-full pt-5 pb-20 pr-10 pl-10">
                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                                {adminGlobalStoreData.pageTitle}</h2>
                                            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <AiOutlineRead className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"></AiOutlineRead>
                                                    {adminGlobalStoreData.pageDescription}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 flex lg:mt-0 lg:ml-4">
                                            <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md
                                            shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none
                                            focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                onClick={router.reload}
                                            >
                                                <FcRefresh className="-ml-1 mr-2 h-5 w-5 text-gray-500"></FcRefresh>
                                                重新整理
                                            </button>
                                        </div>
                                    </div>
                                    {children}
                                </div>

                            </div>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                            <ul className="menu overflow-y-auto w-60 bg-base-100 text-base-content">
                                <li><Link href="/"><a><AiFillHome></AiFillHome>首頁</a></Link></li>
                                <li><Link href="/admin/forum"><a><MdManageSearch></MdManageSearch>論壇管理</a></Link></li>
                                <li><Link href="/admin/log"><a><GiSpiderBot></GiSpiderBot>爬蟲執行記錄管理</a></Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AdminLayout;