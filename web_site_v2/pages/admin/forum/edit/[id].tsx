import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import Loading from "../../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admon-global-store";
import { useForum } from "../../../../utils/admin/forumHook";
import AdminLayout from "../../../utils/admin-layout";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { FaPlusCircle } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { ReactSortable } from "react-sortablejs";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

const schema = yup.object({
    Name: yup.string().required(),
    WorkerName: yup.string().required(),
    // Seq: yup.number().positive().integer().required(),
    // Enable: yup.bool().required(),
    // CreatedTime: yup.date().required()
}).required();
const Edit = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    const { webPageData, webPageMutate, webPageError, forumData, forumMutate, forumError } = useForum(id?.toString()!);
    const { register, handleSubmit,control,  formState: { errors },setValue } = useForm({
        resolver: yupResolver(schema),
        //defaultValues: forumData,
    });
    const onSubmit = async (data:any) => {
        console.log('ddd')
        console.log(data); };

    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '編輯頁面' }, false);
        try{
            Object.keys(forumData).map(k=>{
                setValue(k,forumData[k]!)
            })
        }catch(e){
            console.log(e)
        }
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
                        input input-bordered input-primary w-full"    {...register("Name")} />
                        <p className="text-red-500">{(errors as any).name?.message}</p>
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Worker Name</span>
                        <input type="text" placeholder="Worker Name" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full"   {...register("WorkerName")} />
                        <p className="text-red-500">{(errors as any).workerName?.message}</p>
                    </label>                   
                    <div className="flex flex-col">
                        <div className="flex p-2 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                            justify-between"  role="alert">
                            <h1 className="text-lg font-bold">看版</h1>
                            <button className='monochrome-purple-btn  flex space-x-2' type='button'>
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