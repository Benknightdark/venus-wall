import { NextPage } from "next";
import { DeepRequired, FieldErrorsImpl, FieldValues, UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayReplace, UseFieldArraySwap, UseFieldArrayUpdate, UseFormRegister } from "react-hook-form";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { FaPlusCircle } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';
interface IForumForm {
    errors: FieldErrorsImpl<DeepRequired<FieldValues>>
    register: UseFormRegister<FieldValues>
    controlledFields: any[]
    remove: UseFieldArrayRemove
    swap: UseFieldArraySwap
    append: UseFieldArrayAppend<FieldValues>
    replace:UseFieldArrayReplace<FieldValues>
    webPageFieldArrayName: string
    forumDataId: string
}
export const ForumForm = (props: IForumForm) => {
    return <>
        <label className="block">
            <span className="text-gray-700">Name</span>
            <input type="text" placeholder="Name" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full"    {...props.register("Name")} />
            <p className="text-red-500">{(props?.errors as any).name?.message}</p>
        </label>
        <label className="block">
            <span className="text-gray-700">Worker Name</span>
            <input type="text" placeholder="Worker Name" className="mt-1 block  rounded-md 
                        input input-bordered input-primary w-full"   {...props.register("WorkerName")} />
            <p className="text-red-500">{(props?.errors as any).workerName?.message}</p>
        </label>
        <div className="flex flex-col">
            <div className="flex p-2 text-sm text-gray-700 bg-orange-100 rounded-lg  
                                            justify-between"  role="alert">
                <h1 className="text-lg font-bold">看版</h1>
                <button className='monochrome-purple-btn  flex space-x-2' type='button'
                    onClick={() => {
                        props.append({
                            ID: uuidv4(),
                            Name: "",
                            Url: "",
                            Seq: props.controlledFields.length + 1,
                            Enable: true,
                            ForumID: props.forumDataId
                        })
                    }}
                >
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
                        props.controlledFields && <tbody>
                            {props.controlledFields.map((field: any, index: any) => {
                                return (
                                    <tr key={field.id}>
                                        <th className='w-16	'>
                                            <div className="flex flex-l">
                                                <div className="tooltip" data-tip="刪除">
                                                    <button type='button' className='pill-red-btn' onClick={() => {
                                                        props.remove(index)
                                                    }}><FiTrash2></FiTrash2></button>
                                                </div>
                                                <div className="tooltip" data-tip="上移">
                                                    <button type='button' className='pill-green-btn' onClick={() => {
                                                        if (index !== 0) {
                                                            console.log(props.controlledFields)
                                                            const t1=props.controlledFields[index]
                                                            const t2=props.controlledFields[index-1]
                                                            const temp=t1.Seq
                                                            t1.Seq=t2.Seq
                                                            t2.Seq=temp
                                                            props.swap(index, index - 1)
                                                        }
                                                    }}><AiOutlineArrowUp></AiOutlineArrowUp></button>
                                                </div>
                                                <div className="tooltip" data-tip="下移">
                                                    <button type='button' className='pill-blue-btn' onClick={() => {
                                                        if (index !== props.controlledFields.length - 1) {
                                                            const t1=props.controlledFields[index]
                                                            const t2=props.controlledFields[index+1]
                                                            const temp=t1.Seq
                                                            t1.Seq=t2.Seq
                                                            t2.Seq=temp
                                                            props.swap(index, index + 1)
                                                        }

                                                    }}><AiOutlineArrowDown></AiOutlineArrowDown></button>
                                                </div>
                                            </div>
                                        </th>
                                        <th>
                                            <input key={field.id}
                                                className="mt-1 block  rounded-md 
                                                        input input-bordered input-primary w-full"
                                                {...props.register(`${props.webPageFieldArrayName}.${index}.Name` as const,
                                                    { required: true })} />
                                        </th>
                                        <th>
                                            <input key={field.id}
                                                className="mt-1 block  rounded-md 
                                                        input input-bordered input-primary w-full"
                                                {...props.register(`${props.webPageFieldArrayName}.${index}.Url` as const,
                                                    { required: true })} />
                                        </th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    </>
}
