import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, PropsWithChildren, useState } from "react";
import { GiSpiderMask, GiHamburgerMenu } from 'react-icons/gi'

const IndexLayout = ({ children }: PropsWithChildren<{}>) => {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState<string>("-translate-x-full")

    return (
        <Fragment>
            <div className="flex flex-col h-screen">
                {/* 標題列 */}
                <header className="bg-gradient-to-r from-yellow-400 to-orange-200  w-full">
                    <div className="p-3">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex p-2 rounded-lg dark:bg-indigo-800 bg-yellow-600">
                                    <GiSpiderMask className="h-6 w-6 text-white cursor-pointer" aria-hidden="true"
                                        onClick={
                                            () => {
                                                router.push('/')
                                            }
                                        }
                                    ></GiSpiderMask>
                                </span>
                                <p className="ml-3 mr-3 font-medium text-white truncate">
                                    <span className='dark:text-white text-black hover:font-bold'>女神牆</span>
                                </p>

                            </div>
                            <div className="justify-end flex-row">
                                <span className="p-3 rounded-lg dark:bg-indigo-800 bg-blue-300 
                                    2xl:hidden              
                                    xl:hidden 
                                    md:hidden
                                    nmd:hidden
                                    sm: inline-flex
                                    ">
                                    <GiHamburgerMenu className="h-6 w-6 text-white cursor-pointer"
                                        onClick={
                                            () => {

                                            }
                                        }
                                    ></GiHamburgerMenu>
                                </span>
                            </div>
                        </div>
                    </div>
                </header>
                {/* 行動裝置版面的標題列 */}
                <div
                    className={
                        `sidebar bg-blue-800 text-blue-100 w-64 space-y-6 py-7 px-2
                        inset-y-0 left-0 transform  
                        z-100
                        absolute     
                        2xl:hidden              
                        xl:hidden 
                        md:hidden
                        nmd:hidden
                        sm:relative
                        sm:translate-x-0                     
                        transition duration-200 ease-in-out 
                        ${openMenu}`
                    }>
                    <a href="#" className="text-white flex items-center space-x-2 px-4">
                        <span className="text-2xl font-extrabold">🔥女神牆</span>
                    </a>
                    <nav>
                        <div className='block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white cursor-pointer'
                            onClick={
                                () => {
                                    setOpenMenu("-translate-x-full")
                                    router.push('/dashboard')
                                }
                            }
                        >
                        </div>
                    </nav>
                </div>
                {/* 內容主頁 */}
                <div className=" bg-slate-50 dark:bg-black flex-1 overflow-y-auto overflow-x-hidden" id="contentBody">
                    {children}
                </div>
                {/* 頁腳 */}
                <footer className="py-5 bg-gray-700 text-center text-white">
                    made by ben 😎
                </footer>
            </div>
        </Fragment>

    );
}

export default IndexLayout;