pid_websersocket=$(pgrep -f "websersocket_0628a90e-0163-400d-bee6-e31e990e9197.js")
watch -n 1 ps -p $pid_websersocket -o pid,etime,%cpu,%mem,cmd