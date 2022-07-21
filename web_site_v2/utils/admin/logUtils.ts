export const workerApiUrl = `${process.env.NEXT_PUBLIC_APIURL}/api/log/worker`;
export const crawlerApiUrl = `${process.env.NEXT_PUBLIC_APIURL}/api/log/crawler`;
export const processorApiUrl = `${process.env.NEXT_PUBLIC_APIURL}/api/log/processor`;
export const getLogApiUrl = (type: string) => {
    let apiUrl: string = ''

    switch (type) {
        case 'worker':
            apiUrl=workerApiUrl;
            break;
        case 'crawler':
            apiUrl=crawlerApiUrl;
            break;
        case 'processor':
            apiUrl=processorApiUrl;
                break;                
        default:
            break;
    }
    return apiUrl
}