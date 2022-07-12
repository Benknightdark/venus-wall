import Link from "next/link"
import { GoGlobe } from "react-icons/go"
import Loading from "../../loading";
import { useForum } from "../../../utils/admin/forumHook";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ToastMessageType, useToast } from "../../../utils/toastMessageHook";

export const ForumDescription = (props: any) => {
    const { webPageData, webPageMutate, webPageError, forumData, forumMutate, forumError } = useForum(props.id?.toString()!);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [modalData, setModalData] = useState({ modalTitle: '', selectedId: '' })
    const toast = useToast();
    const onSubmit = async (data: any) => {
        console.log(data)
        const req = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/api/item/${modalData.selectedId?.toString().toUpperCase()}?start=${data.start}&end=${data.end}`
            , {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                }
            }
        )
        if (req.status === 200) {
            const res = await req.json();
            toast.show(true,`成功執行【${modalData.modalTitle}】爬蟲，並從第${data.start}頁抓到第${data.end}頁`, ToastMessageType.Success);
        } else {
            toast.show(true, await req.text(), ToastMessageType.Error);
        }
    };

    if (!webPageData && !forumData) return <Loading></Loading>
    if (webPageError && forumError) return <Loading></Loading>
    return <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
            {<h3 className="text-lg leading-6 font-medium text-gray-900">{forumData['Name']}</h3>}
            {<p className="mt-1 max-w-2xl text-sm text-gray-500">建立時間：{forumData['CreatedTime']}</p>}
        </div>
        <div className="border-t border-gray-200">
            <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">WorkerName</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{forumData['WorkerName']}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Seq</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{forumData['Seq']}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Enable</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <input type="checkbox" className="toggle" disabled checked={forumData['Enable']} />
                    </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">WebPages</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul role="list" className="border border-gray-200 rounded-md divide-y divide-gray-200">
                            {
                                webPageData && webPageData.map((w: any) => <li
                                    key={w.ID}
                                    className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                    <div className="w-0 flex-1 flex items-center cursor-pointer"
                                        onClick={() => {
                                            window.open(w.Url, '_blank')!.focus();
                                        }}
                                    >
                                        <GoGlobe className="flex-shrink-0 h-5 w-5 text-gray-400"></GoGlobe>
                                        <span className="ml-2 flex-1 w-0 truncate "> {w.Name} </span>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <Link href={`/admin/board/${w.ID}`}
                                        >
                                            <a className="monochrome-lime-btn">看更多</a>
                                        </Link>
                                    </div>
                                    {
                                        props.enableCrawler && <div className="flex-shrink-0">
                                            <a className="monochrome-teal-btn cursor-pointer" onClick={() => {
                                                setModalData({ modalTitle: `${forumData['Name']}/${w.Name}`, selectedId: w.ID })
                                                document.getElementById('crawler-modal-btn')!.click();
                                            }}>啟動爬蟲</a>
                                        </div>
                                    }
                                </li>)
                            }
                        </ul>
                    </dd>
                </div>
            </dl>
        </div>
        <label htmlFor="crawler-modal" className="btn modal-button hidden" id='crawler-modal-btn'>open modal</label>

        <input type="checkbox" id="crawler-modal" className="modal-toggle" />
        <label htmlFor="crawler-modal" className="modal cursor-pointer">
            <form className="modal-box relative" onSubmit={handleSubmit(onSubmit)}>
                <div className='font-lg'>執行【{modalData?.modalTitle}】爬蟲</div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">開始頁數</span>
                    </label>
                    <input type="number" defaultValue={0} placeholder="開始頁數" className="input input-bordered w-full max-w-xs"
                        {...register("start", { min: 0, required: true })}
                    />
                    {errors.start && <div className="text-red-500">開始頁數不能是空值</div>}
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">結束頁數</span>
                    </label>
                    <input type="number" defaultValue={0} placeholder="結束頁數" className="input input-bordered w-full max-w-xs"
                        {...register("end", { min: 0, required: true })}
                    />
                    {errors.end && <div className="text-red-500">結束頁數不能是空值</div>}
                </div>
                <div className='pt-2'></div>
                <button type="submit" className="btn btn-primary">執行</button>
            </form>
        </label>
    </div>
}
