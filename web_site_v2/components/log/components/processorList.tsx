export const ProcessorList = (props: any) => {
    return <li
        onClick={() => {
            window.open(props.w.Url, '_blank')!.focus();
        }}
        className='animate__animated animate__flipInX animate__delay-1s
border-b-4 border-gray-500
' >
        <a><span className="text-red-600">【{props.w.ForumName}/{props.w.WebPageName} - {props.w.Title}】</span> 已寫入資料庫</a>
    </li>;
}