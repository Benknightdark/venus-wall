#!/bin/bash

[ `uname -s` != "Darwin" ] && return
# 清除所有daprd執行緒
ps aux | grep daprd|grep -v grep | awk '{print $2}'|xargs kill -9
# 取出當前的目錄
PWD="${PWD}"

function iterm () {
    osascript &>/dev/null <<EOF
tell application "iTerm"
	tell current window
		create tab with default profile
		create tab with default profile
		create tab with default profile
		create tab with default profile
		create tab with default profile
	end tell
	
	tell current session of tab 1 of current window	
		write text "cd $PWD"
		write text "daprd --app-id 'api-service' --app-port '8780' --components-path './components' --dapr-grpc-port '53317' --dapr-http-port '3500' --metrics-port '9090'"
	end tell
	
	tell current session of tab 2 of current window
		write text "cd $PWD"
		write text "daprd --app-id 'jkf-worker' --app-port '8789' --components-path './components' --dapr-grpc-port '53318' --dapr-http-port '3501' --metrics-port '9091'"
	end tell

	tell current session of tab 3 of current window
		write text "cd $PWD"
		write text "daprd --app-id 'mdk-worker' --app-port '8790' --components-path './components' --dapr-grpc-port '53319' --dapr-http-port '3502' --metrics-port '9092'"
	end tell

	tell current session of tab 4 of current window
		write text "cd $PWD"
		write text "daprd --app-id 'data-processor' --app-port '5235' --components-path './components' --dapr-grpc-port '53320' --dapr-http-port '3503' --metrics-port '9093'"
	end tell

	tell current session of tab 5 of current window
		write text "cd $PWD"
		write text "daprd --app-id 'jkf-crawler' --app-port '8800' --components-path './components' --dapr-grpc-port '53321' --dapr-http-port '3504' --metrics-port '9094'"
	end tell

	tell current session of tab 6 of current window
		write text "cd $PWD"
		write text "daprd --app-id 'mdk-crawler' --app-port '8791' --components-path './components' --dapr-grpc-port '53322' --dapr-http-port '3505' --metrics-port '9095'"
	end tell

	tell tab 1 of current window
		select
	end tell
end tell
EOF
}
iterm