import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import useSWR from "swr";
import Loading from "../../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import { useForum } from "../../../../utils/admin/forumHook";
import AdminLayout from "../../../utils/admin-layout";
import {  useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { ToastMessageType, useToast } from "../../../../utils/toastMessageHook";
import { ForumForm } from "../componets/forumForm";

const schema = yup.object({
    Name: yup.string().required(),
    WorkerName: yup.string().required(),
}).required();

const Edit = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { id } = router.query
    const { webPageData, webPageMutate, webPageError, forumData, forumMutate, forumError } = useForum(id?.toString()!);
    const { register, handleSubmit, control, formState: { errors }, setValue, watch, setFocus } = useForm({
        resolver: yupResolver(schema),
    });
    const webPageFieldArrayName = 'webPageList'
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: webPageFieldArrayName
    });
    const watchFieldArray = watch(webPageFieldArrayName);
    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index]
        };
    });
    const toast = useToast();
    const onSubmit = async (data: any) => {
        const newData = {
            forum: {
                CreatedTime: data['CreatedTime'],
                Enable: data['Enable'],
                ID: data['ID'],
                Name: data['Name'],
                Seq: data['Seq'],
                WorkerName: data['WorkerName']
            },
            webPageList: data['webPageList']
        }
        const req = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/api/forum`, {
            method: 'PUT',
            body: JSON.stringify(newData),
            headers: {
                'content-type': 'application/json'
            }
        })
        if (req.status === 200) {
            toast.show(true, (await req.json())['message'], ToastMessageType.Success);
            router.push('/admin/forum')
        } else {
            toast.show(true, (await req.text()), ToastMessageType.Error);
        }

    };

    useEffect(() => {
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '編輯頁面' }, false);

        setTimeout(() => {
            try {
                Object.keys(forumData).map(k => {
                    setValue(k, forumData[k]!)
                })
                replace(webPageData)
            } catch (e) {
                console.log(e)
            }
        }, 1000);

    }, [append, forumData, setValue, setFocus, adminGlobalStoreMutate, webPageData, replace])
    if (!webPageData && !forumData) return <Loading></Loading>
    if (webPageError && forumError) return <Loading></Loading>
    return (
        <div>
            <div className="mt-2 ">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
                    <ForumForm errors={errors} register={register} append={append}
                        controlledFields={controlledFields}
                        forumData={forumData} 
                        remove={remove} webPageFieldArrayName={webPageFieldArrayName}
                    />
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