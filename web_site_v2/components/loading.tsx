const Loading = () => {
    return (
        <div
            className="fixed  inset-0 bg-transparent bg-opacity-20 overflow-y-auto h-full w-full z-50"
        >
            <div className="flex flex-col items-center justify-center">
            <progress className="progress w-screen bg-green-200"></progress>
            </div>
        </div>
    );
}

export default Loading;