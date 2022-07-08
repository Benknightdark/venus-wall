import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "../../../../components/loading";
import { adminGlobalStore, defaultAdminGlobalStoreData } from "../../../../stores/admin-global-store";
import { useForum } from "../../../../utils/admin/forumHook";
import AdminLayout from "../../../utils/admin-layout";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { ToastMessageType, useToast } from "../../../../utils/toastMessageHook";
import { ForumForm } from "../../../../components/forum/componets/forumForm";

const schema = yup.object({
    Name: yup.string().required(),
    WorkerName: yup.string().required(),
}).required();

const Index = () => {
    const { data: adminGlobalStoreData, mutate: adminGlobalStoreMutate } = useSWR(adminGlobalStore, { fallbackData: defaultAdminGlobalStoreData })
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors }, setValue, watch, setFocus } = useForm({
        resolver: yupResolver(schema),
    });
    const [forumDataID,setForumDataID]=useState(uuidv4())
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
        console.log(data);
        const newData = {
            forum: {
                ID:forumDataID,
                Name: data['Name'],
                WorkerName: data['WorkerName']
            },
            webPageList: data['webPageList']
        }
        const req = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/api/forum`, {
            method: 'POST',
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
        adminGlobalStoreMutate({ ...defaultAdminGlobalStoreData, pageTitle: '論壇管理', pageDescription: '新增頁面' }, false);
    }, [adminGlobalStoreMutate])

    return (
        <div>
            <div className="mt-2 ">
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3">
                    <ForumForm
                        errors={errors}
                        register={register}
                        append={append}
                        controlledFields={controlledFields}
                        forumDataId={forumDataID}
                        remove={remove}
                        webPageFieldArrayName={webPageFieldArrayName}
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
Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    )
}
export default Index;