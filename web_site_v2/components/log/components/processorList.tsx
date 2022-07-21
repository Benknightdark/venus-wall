import { FcOvertime } from "react-icons/fc";

export const ProcessorList = (props: any) => {
    return <li
        onClick={() => {
            window.open(props.w.Url, '_blank')!.focus();
        }}
        className='animate__animated animate__flipInX animate__delay-1s
border-b-4 border-gray-500
' >
        <a className="flex flex-col justify-start items-start">
            <div><span className="text-red-600">【{props.w.ForumName}/{props.w.WebPageName} - {props.w.Title}】</span> 已寫入資料庫</div>
            <div className='flex flex-row  space-x-2'>
                <FcOvertime className='w-5 h-5'></FcOvertime><span className='text-gray-400'>{props.w.CreateDateTime.toString().split('.')[0]}</span>
            </div>
        </a>
    </li>;
}