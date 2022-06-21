import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import Loading from "../../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admon-global-store";
import { useForum } from "../../../../utils/admin/forumHook";
import AdminLayout from "../../../utils/admin-layout";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FaPlusCircle } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { ReactSortable } from "react-sortablejs";

const schema = yup.object({
    name: yup.string().required(),
    workerName: yup.number().required(),
    seq: yup.number().positive().integer().required(),
    enable: yup.bool().required(),
    createdTime: yup.date().required()
}).required();
const Edit = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    const { webPageData, webPageMutate, webPageError, forumData, forumMutate, forumError } = useForum(id?.toString()!);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });
    const onSubmit = (data: any) => console.log(data);
    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '編輯頁面' }, false);
    })
    if (!webPageData && !forumData) return <Loading></Loading>
    if (webPageError && forumError) return <Loading></Loading>
    return (
        <div>
            <div className="mt-2 ">

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
                    <label className="block">
                        <span className="text-gray-700">Name</span>
                        <input type="text" placeholder="Name" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full"   {...register("name")} />
                        <p className="text-red-500">{errors.name?.message}</p>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Worker Name</span>
                        <input type="text" placeholder="Worker Name" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full" {...register("workerName")} />
                        <p className="text-red-500">{errors.workerName?.message}</p>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Seq</span>
                        <input type="number" placeholder="Seq" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full" {...register("seq")} />
                        <p className="text-red-500">{errors.seq?.message}</p>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Enable</span>
                        <input type="number" placeholder="Enable" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full" {...register("enable")} />
                        <p className="text-red-500">{errors.enable?.message}</p>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">CreatedTime</span>
                        <input type="number" placeholder="CreatedTime" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full" {...register("createdTime")} />
                        <p className="text-red-500">{errors.createdTime?.message}</p>
                    </label>

                    <div className="flex flex-col">
                        {/* <DndProvider backend={HTML5Backend}> */}
                        <div className="flex p-2 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                            justify-between"  role="alert">
                            <h1 className="text-lg font-bold">Boards</h1>
                            <button className='monochrome-purple-btn  flex space-x-2'>
                                <FaPlusCircle className='w-4 h-4'></FaPlusCircle>
                                新增
                            </button>
                        </div>
                        <div className="overflow-x-auto ">
                            <table className="table w-full ">
                                <thead className=''>
                                    <tr>
                                        <th className='bg-green-200 w-16'></th>
                                        <th className='bg-green-200'>Name</th>
                                        <th className='bg-green-200'>Url</th>
                                    </tr>
                                </thead>
                                {
                                    webPageData && <tbody>
                                        {
                                            webPageData.map((f: any) =>
                                                <tr key={f.key}>
                                                    <th className='w-16	'>
                                                        <div className="flex flex-l">
                                                            <div className="tooltip" data-tip="刪除">
                                                                <button className='pill-red-btn' onClick={() => {
                                                                }}><FiTrash2></FiTrash2></button>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th>{f.Name}</th>
                                                    <th>{f.Url}</th>
                                                </tr>)
                                        }
                                    </tbody>
                                }
                            </table>
                        </div>
                        {/* </DndProvider> */}
                    </div>

                    <div className="flex flex-row items-center  justify-center space-x-2">
                        <button type="submit" className="btn btn-success">送出</button>
                        <button type='button' className="btn btn-active" onClick={router.back}>返回</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
Edit.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Edit;