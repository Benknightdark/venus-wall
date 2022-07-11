export const imageFetch = async (itemId: string) => {
    const url = `${process.env.NEXT_PUBLIC_APIURL}/api/image/${itemId}`;
    const req = fetch(url);
    if ((await req).status !== 200) {
        console.log((await req).text());
        return [];
    }
    return (await req).json();
}