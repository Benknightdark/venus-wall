import { FcOvertime } from "react-icons/fc"

export const CrawlerList = (props: any) => {
    return <li className="border-b-4 border-green-500">
        <a className="flex flex-col justify-start items-start">
            <div><span className="text-red-600">{props.w.ForumName}/{props.w.WebPageName} -Page{props.w.Page}</span> 開始爬取</div>
            <div className='flex flex-row  space-x-2'>
                <FcOvertime className='w-5 h-5'></FcOvertime><span className='text-gray-400'>{props.w.CreateDateTime.toString().split('.')[0]}</span>
            </div>
    </a>
    </li>;
}