export const CrawlerList = (props: any) => {
    return <li className="border-b-4 border-green-500">
        <a><span className="text-red-600">{props.w.ForumName}/{props.w.WebPageName} -Page{props.w.Page}</span> 開始爬取
    </a></li>;
}