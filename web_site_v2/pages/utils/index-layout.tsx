import { NextPage } from "next";
import { useRouter } from "next/router";
import { Fragment, PropsWithChildren, useState } from "react";
import { GiSpiderMask, GiHamburgerMenu } from 'react-icons/gi'

const IndexLayout = ({ children }: PropsWithChildren<{}>) => {
    const router = useRouter();

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