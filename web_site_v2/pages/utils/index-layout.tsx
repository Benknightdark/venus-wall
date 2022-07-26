import { useRouter } from "next/router";
import { Fragment, PropsWithChildren } from 'react';
import { GiSpiderMask } from 'react-icons/gi'
import { MdOutlineManageAccounts } from "react-icons/md";
import useSWR from 'swr';
import Select from 'react-select';
import { ISelectOption, IGroupedOption } from '../../models/selectModel';
import { fetcher } from "../../utils/fetcherHelper";
import { globalSettingStore, initialGlobalSettingStore } from '../../stores/global-setting-store';
import ToastMessage from "../../components/toast-message";
import ModalMessage from "../../components/modal-message";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { FiRefreshCcw } from 'react-icons/fi'
import { BsArrowBarUp } from 'react-icons/bs'
import { useToast } from "../../utils/toastMessageHook";
import Image from 'next/image'



const IndexLayout = ({ children }: PropsWithChildren<{}>) => {
    const router = useRouter();
    const toast = useToast();
    const { data: webPageSelectData, mutate: mutateWebPageSelectData, error: webPageSelectDataError } =
        useSWR(`${process.env.NEXT_PUBLIC_APIURL}/api/webpage?for=index`, fetcher, {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })
    const { data: globalStoreData, mutate: globalStoreDataMutate } = useSWR(globalSettingStore,
        { fallbackData: initialGlobalSettingStore })
    return (
        <Fragment>
            <div className="flex flex-col h-screen">
                {/* 標題列 */}
                <header className="bg-gradient-to-r from-rose-100 to-teal-100  w-full">
                    {globalStoreData.showToast && <ToastMessage />}
                    {globalStoreData.showModal && <ModalMessage />}
                    <div className="p-3">
                        <div className="flex items-center justify-between flex-wrap">
                            <div className="w-0 flex-1 flex items-center">
                                <span className="flex p-1 rounded-sm bg-red-300 ">
                                    <Image
                                        className='cursor-pointer'
                                        src="/images/logo.png"
                                        alt="Picture of the author"
                                        width={100}
                                        height={40}
                                        onClick={
                                            () => {
                                                router.push('/')
                                            }
                                        }
                                    />
                                </span>
                                <p className="ml-3 mr-3 font-medium text-white truncate">
                                </p>
                                {webPageSelectData && <Select<ISelectOption, false, IGroupedOption>
                                    options={webPageSelectData}
                                    isClearable={true}
                                    placeholder="篩選看版"
                                    defaultValue={globalStoreData.selectedBoard}
                                    onChange={(newValue) => {
                                        globalStoreDataMutate({
                                            ...initialGlobalSettingStore,
                                            showImage: globalStoreData.showImage,
                                            selectedBoard: newValue == null ? null : newValue
                                        }, false)

                                    }}
                                />}
                            </div>
                            <div className="divider divider-horizontal"></div>
                            {
                                !globalStoreData.showImage ? <div className="tooltip tooltip-bottom tooltip-success z-50" data-tip="顯示圖片">
                                    <AiFillEye className="toolbar-icon" aria-hidden="true"
                                        onClick={
                                            () => {
                                                globalStoreDataMutate({
                                                    ...initialGlobalSettingStore,
                                                    selectedBoard: globalStoreData.selectedBoard,
                                                    showImage: true
                                                }, false)
                                            }
                                        }
                                    ></AiFillEye></div>
                                    : <div className="tooltip tooltip-bottom tooltip-success z-50" data-tip="隱藏圖片">
                                        <AiFillEyeInvisible className="toolbar-icon" aria-hidden="true"
                                            onClick={
                                                () => {
                                                    globalStoreDataMutate({
                                                        ...initialGlobalSettingStore,
                                                        selectedBoard: globalStoreData.selectedBoard,
                                                        showImage: false
                                                    }, false)
                                                }
                                            }
                                        ></AiFillEyeInvisible></div>
                            }
                            <div className="divider divider-horizontal"></div>
                            <div className="tooltip tooltip-bottom tooltip-info z-50" data-tip="重新整理">
                                <FiRefreshCcw className="toolbar-icon" aria-hidden="true"
                                    onClick={
                                        () => {
                                            router.reload();
                                        }
                                    }
                                ></FiRefreshCcw></div>
                            <div className="divider divider-horizontal"></div>
                            <div className="tooltip tooltip-left tooltip-error z-50" data-tip="前往管理頁面">
                                <MdOutlineManageAccounts className="toolbar-icon" aria-hidden="true"
                                    onClick={
                                        () => {
                                            router.push('/admin/')
                                        }
                                    }
                                ></MdOutlineManageAccounts>
                            </div>
                        </div>
                    </div>
                </header>
                {/* 內容主頁 */}
                <div className=" bg-slate-50 dark:bg-black flex-1 overflow-y-auto overflow-x-hidden" id="contentBody">
                    {children}
                    <button title="回到最上頁"
                        onClick={() => {
                            document.getElementById('contentBody')?.scrollTo({ top: 0, behavior: 'auto' });
                            toast.showSuccess('已回到最上頁')
                        }}
                        className="fixed z-90 bottom-10 right-8
                        bg-gradient-to-r from-teal-200 to-lime-200
                         w-20 h-20 rounded-full drop-shadow-lg flex justify-center
                        items-center 
                        text-white text-4xl 
                        hover:text-gray-800                     
                        hover:bg-gradient-to-r 
                        hover:from-yellow-200 
                        hover:via-pink-200 
                        hover:to-pink-400
                        hover:drop-shadow-2xl hover:animate-bounce duration-300">
                        <BsArrowBarUp></BsArrowBarUp>
                    </button>
                </div>
                {/* 頁腳 */}
                <footer className="py-5 
bg-gradient-to-bl from-indigo-900 via-indigo-400 to-indigo-900
                text-center text-white">
                    @{new Date().getFullYear()} made by ben 😎
                </footer>
            </div>
        </Fragment>

    );
}

export default IndexLayout;