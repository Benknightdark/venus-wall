import { Fragment, PropsWithChildren } from "react";
import { GiSpiderBot, GiSpiderMask } from "react-icons/gi";
import { AiFillHome } from 'react-icons/ai'
import { MdManageSearch } from 'react-icons/md'
import { useRouter } from "next/router";
import Link from "next/link";
const AdminLayout = ({ children }: PropsWithChildren<{}>) => {
    const router = useRouter();
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
                                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
                                <p className="ml-3 mr-3 font-medium text-white truncate">
                                    <span className='text-white hover:font-bold cursor-pointer'>管理後台</span>
                                </p>

                            </div>
                        </div>
                    </div>
                </header>

                {/* 內容主頁 */}
                <div className=" bg-base-200  flex-1 overflow-y-hidden overflow-x-hidden" id="contentBody">
                    <div className="drawer drawer-mobile">
                        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex flex-col items-center justify-between">
                            <div className="w-full pt-5 pb-20 pr-10 pl-10">
                                {children}
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