# Browser GPU Monitor
![graphs](./gpu_monitor.png)
# Installation and run
`
  git clone https://github.com/jonasfrey/gpu-monitor-browser-gui.git
  &&
  cd gpu-monitor-browser-gui
  &&
  deno run -A websersocket_0628a90e-0163-400d-bee6-e31e990e9197.js
`
# requirements
`deno` (js), `nvidia-smi` OR `amdgpu_top`

## install denojs

`curl -fsSL https://deno.land/install.sh | sh`

or more installation options on https://docs.deno.com/runtime/fundamentals/installation/

## install nvidia-smi or
`sudo apt install nvidia`
## or amdgpu_top
`sudo apt install amdgpu_top`


# Running / starting it
`deno run -A websersocket_0628a90e-0163-400d-bee6-e31e990e9197.js`
then hit enter a few times to generate a self signed certificate (needed for local https server...)

finally visit : https://localhost:8443

## requirements
the gpu performance data comes from two existing programms you one of these
### NVIDIA `nvidia-smi`
`sudo apt install nvidia-smi`
### AMD `amdgpu_top`
`sudo apt instal amdgpu_top`
