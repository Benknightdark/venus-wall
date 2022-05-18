const Loading = () => {
    return (
        <div
            className="fixed  inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        >
            <div className="flex flex-col items-center justify-center">
            <progress className="progress w-screen"></progress>
            </div>
        </div>
    );
}

export default Loading;