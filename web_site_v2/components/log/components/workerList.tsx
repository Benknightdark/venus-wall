import { FcOvertime } from "react-icons/fc"

export const WorkerList = (props: any) => {
    return <li
        className="border-b-4 border-blue-500" >
            <a className="flex flex-col justify-start items-start">
            {props.w.WebPageName}
            <div className='flex flex-row space-x-2'>
                <FcOvertime className='w-5 h-5'></FcOvertime><span className='text-gray-400'>{props.w.CreateDateTime.toString().split('.')[0]}</span>
            </div>
        </a>
    </li>
}