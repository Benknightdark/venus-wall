Get-Process -Name 'daprd' | Stop-Process

wt -p "Windows PowerShell"  -d . `
 --title api-service daprd --app-id "api-service" --app-port "8780" `
 --components-path "./components" --dapr-grpc-port "53317" --dapr-http-port "3500" --metrics-port "9090"`
 `
`; new-tab -p "Windows PowerShell" -d . --title jkf-worker daprd --app-id "jkf-worker"`
 --app-port "8789" --components-path "./components" --dapr-grpc-port "53318" --dapr-http-port "3501" --metrics-port "9091"`
 `
`; new-tab -p "Windows PowerShell" -d . --title mdk-worker daprd --app-id "mdk-worker"`
 --app-port "8790" --components-path "./components" --dapr-grpc-port "53319" --dapr-http-port "3502" --metrics-port "9092"`
 `
`; new-tab -p "Windows PowerShell" -d . --title "data-processor" daprd --app-id "data-processor"`
 --app-port "5235" --components-path "./components" --dapr-grpc-port "53320" --dapr-http-port "3503" --metrics-port "9093"`
 `
`; new-tab -p "Windows PowerShell" -d . --title jkf-crawler daprd --app-id "jkf-crawler"`
 --app-port "8800"  --components-path "./components" --dapr-grpc-port "53321" --dapr-http-port "3504" --metrics-port "9094"`
 `
`; new-tab -p "Windows PowerShell" -d . --title mdk-crawler daprd --app-id "mdk-crawler"`
 --app-port "8791"  --components-path "./components" --dapr-grpc-port "53322" --dapr-http-port "3505" --metrics-port "9095"`




