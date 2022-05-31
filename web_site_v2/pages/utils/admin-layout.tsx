import { Fragment, PropsWithChildren } from "react";
import { GiSpiderMask } from "react-icons/gi";

const AdminLayout = ({ children }: PropsWithChildren<{}>) => {
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

                                            }
                                        }
                                    ></GiSpiderMask>
                                </span>
                                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
                                <p className="ml-3 mr-3 font-medium text-white truncate">
                                    <span className='text-white hover:font-bold'>管理後台</span>
                                </p>

                            </div>
                        </div>
                    </div>
                </header>
                <div className='flex flex-row'>
                    <div className="drawer drawer-mobile">
                        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content flex flex-col items-center justify-center">
                            {/* 內容主頁 */}
                            <div className=" bg-slate-50  flex-1 w-full overflow-y-auto overflow-x-hidden
                            p-4 
                            " 
                            id="contentBody">
                                <div className='border border-indigo-600'>
                                    {children}
                                </div>
                            </div>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                            <ul className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                                <li><a>Sidebar Item 1</a></li>
                                <li><a>Sidebar Item 2</a></li>
                            </ul>
                        </div>

                    </div>

                </div>
            </div>
        </Fragment>
    );
}

export default AdminLayout;