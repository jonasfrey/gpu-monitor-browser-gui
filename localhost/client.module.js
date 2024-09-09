
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@1.1/mod.js"



import {
    f_o_html__and_make_renderable,
}
from 'https://deno.land/x/f_o_html_from_o_js@2.9/mod.js'

import {
    f_clear_all_notifications,
    f_clear_o_notification,
    f_o_js as f_o_js__notifier,
    f_o_throw_notification,
    s_css
} from "https://deno.land/x/f_o_html_from_o_js@3.5/localhost/jsh_modules/notifire/mod.js"

import {
    f_o_webgl_program,
    f_delete_o_webgl_program,
    f_resize_canvas_from_o_webgl_program,
    f_render_from_o_webgl_program,
    f_o_number_value__from_s_input
} from "https://deno.land/x/handyhelpers@4.1.1/mod.js"

window.f_o_number_value__from_s_input = f_o_number_value__from_s_input
import {
    f_s_hms__from_n_ts_ms_utc,
} from "https://deno.land/x/date_functions@1.4/mod.js"
import { O_graph, O_gpu_info, O_gpu_property_value_visualization } from "./classes.module.js"
import { a_o_gpu_property, o_gpu_property__clocks_graphics_clock } from "./runtimedata.module.js"

let f_n_ts_sec_lt_from_s_date = function(s){
    try {
        const dateString = s;//'28.08.2024 23:20:00';

        // Split the date and time parts
        const [datePart, timePart] = dateString.split(' ');
    
        // Split the date into day, month, year
        const [day, month, year] = datePart.split('.').map(Number);
    
        // Split the time into hours, minutes, seconds
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
    
        // Create a Date object (months are 0-based in JS, so subtract 1 from month)
        const date = new Date(year, month - 1, day, hours, minutes, seconds);
    
        // Get the timestamp
        const timestamp = date.getTime();
        return timestamp
    } catch (error) {
        return null
    }

}

let o_state = {
    a_o_gpu_property,
    b_nvidia_smi_installed: await (await fetch('./f_b_nvidia_smi_installed')).json(),
    s_name_gpu : '', 
    o_gpu_info: null, 
    a_o_gpu_readout_info: [], 
    a_o_dataset: [], 
    n_ms_interval: 500,
    n_ms_interval_min: 100,
    n_ms_interval_max: 2000,
    n_id_interval: 0,
    n_datapoints_x: 20,
    n_datapoints_x_min: 1,
    n_datapoints_x_max: 500,
    a_o_graph: [], 
    o_state__notifier: {}
}
let f_update_interval = function(){

    clearInterval(o_state.n_id_interval);
    o_state.n_id_interval = window.setInterval(async function(){
        let o = await fetch('./f_o_gpu_readout_info');
        if(!o.ok){
            await f_o_throw_notification(o_state.o_state__notifier, await o.text(), 'error');
        }
        let o_data = await o.json();

        o_state.a_o_gpu_readout_info.push(
            o_data
        );

        // check if there are new graphs
        for(let n_idx in o_state.a_o_graph){
            let o_graph = o_state.a_o_graph[n_idx];
            let o_div = Array.from(document.querySelectorAll('.canvas_container'))[n_idx]

            if(!o_graph.o_echart){
                o_graph.o_echart = echarts.init(o_div);
        
                // Initial data
                var xData = [];
                var yData = [];
        
                // Populate with initial data
                for (let i = 0; i < 500; i++) {
                    xData.push(i);
                    yData.push(Math.random() * 100);
                }
        
                // Option to configure the chart
                var option = {
                    title: {
                        text: 'Real-time Data Chart'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: new Array(100).fill(0).map(n=>n)
                    },
                    yAxis: {
                        type: 'value',
                        min: 0,
                        max: 100
                    },
                    series: [{
                        name: 'Random Data',
                        type: 'line',
                        data: new Array(100).fill(0).map(n=>Math.random()),
                        smooth: true,  // Makes the line smooth
                        lineStyle: {
                            color: 'blue'
                        }
                    }]
                };
                        // Set the initial option to the chart
                o_graph.o_echart.setOption(option);

            }else{

                // Update the chart with the new data
                o_graph.o_echart.setOption({
                    xAxis: {
                        data: new Array(100).fill(0).map(n=>n)  // Update x-axis data
                    },
                    series: [{
                        data: new Array(100).fill(0).map(n=>Math.random())  // Update series data
                    }]

                })
        
            }
        }
    },o_state.n_ms_interval)
}


window.o_state = o_state

o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    input[type="color"] {
        padding: 0rem;
        width: 2rem;
        height: 2rem;
    }
    body{
        min-height: 100vh;
        min-width: 100vw;
        /* background: rgba(0,0,0,0.84);*/
    }
    .o_graph{
        width: 100vw;
        margin: auto;
    }
    /* Ensure the canvas fills the container */
    canvas {
      width: 100% !important;  /* Ensure the canvas takes up full width */
      height: 100% !important; /* Ensure the canvas takes up full height */
    }
    .leftright{
        display:flex;
        width: 100%;
        flex-direction: row;
    }
    .left{
        max-width: 20vw;
        width: 20vw;
        background: red;
        flex: 1 1 auto;
    }
    .canvas_container{
        flex: 1 1 auto;
        
    }

    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
)




// Determine the current domain
const s_hostname = window.location.hostname;

// Create the WebSocket URL, assuming ws for http and wss for https
const s_protocol_ws = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const s_url_ws = `${s_protocol_ws}//${s_hostname}:${window.location.port}`;

// Create a new WebSocket instance
const o_ws = new WebSocket(s_url_ws);

// Set up event listeners for your WebSocket
o_ws.onopen = function(o_e) {
    console.log({
        o_e, 
        s: 'o_ws.onopen called'
    })
};

o_ws.onerror = function(o_e) {
    console.log({
        o_e, 
        s: 'o_ws.onerror called'
    })
};

o_ws.onmessage = function(o_e) {
    console.log({
        o_e, 
        s: 'o_ws.onmessage called'
    })
    o_state.a_o_msg.push(o_e.data);
    o_state?.o_js__a_o_mod?._f_render();

};
window.addEventListener('pointerdown', (o_e)=>{
    o_ws.send('pointerdown on client')
})

let f_n_clamped = function(n, n_min, n_max){
    return Math.max(Math.min(n, n_max), n_min);
}
document.body.appendChild(
    await f_o_html__and_make_renderable({
        a_o: [
            f_o_js__notifier(o_state.o_state__notifier),
            {
                s_tag: "div", 
                class: "b_nvidia_smi_installed", 
                b_render: o_state.b_nvidia_smi_installed == false,
                innerText: "nvidia-smi is not installed. if you have a NVIDIA gpu, run `sudo apt install nvidia-smi` to install the programm."
            },
            {
                b_render: o_state.b_nvidia_smi_installed,
                a_o: [   
                    Object.assign(
                        o_state, 
                        {
                            o_js__a_o_graph: {
                                f_o_jsh:()=>{
                                    return {
                                        a_o: [
                                            o_state.a_o_graph.map(o_graph=>{
                                                return {
                                                    class: "o_graph", 
                                                    a_o: [
                                                        {
                                                            s_tag: "select", 
                                                            a_o: [
                                                                ...o_state.a_o_gpu_readout_info.at(-1).a_o_gpu_info.map(o=>{
                                                                    return {
                                                                        s_tag: "option", 
                                                                        ...((o_graph.s_name_brand_model_gpu == o.s_name_brand_model_gpu) ? {
                                                                            selected: true
                                                                        } : {}),
                                                                        value: o.s_name_brand_model_gpu,
                                                                        innerText: o.s_name_brand_model_gpu
                                                                    }
                                                                })
                                                            ],
                                                            onchange : async (o_e)=>{
                                                                let s = o_e.target.value;
                                                                o_graph.s_name_brand_model_gpu = s
                                                            }
                                                        },
                                                        {
                                                            class: "leftright", 
                                                            a_o: [
                                                                {
                                                                    class: "left", 
                                                                    a_o: [
                                                                        Object.assign(
                                                                            o_graph, 
                                                                            {
                                                                                o_js__n_ms_interval: {
                                                                                    f_o_jsh:()=>{
                                                                                        return {
                                                                                            a_o: [
                                                                                                {
                                                                                                    innerText: "Milliseconds interval", 
                                                                                                },
                                                                                                {
                                                                                                    s_tag: "input", 
                                                                                                    value: o_graph.n_ms_interval, 
                                                                                                    oninput: ()=>{
                                                                                                        let n = parseInt(o_e.target.value)
                                                                                                        o_graph.n_ms_interval = Math.max(100, n);
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                        ).o_js__n_ms_interval,
                                                                        Object.assign(
                                                                            o_graph, 
                                                                            { 
                                                                                o_js__n_datapoints_x: {
                                                                                    f_o_jsh:()=>{
                                                                                        return {
                                                                                            a_o: [
                                                                                                {
                                                                                                    innerText: "Datapoints x", 
                                                                                                },
                                                                                                {
                                                                                                    s_tag: "input", 
                                                                                                    value: o_graph.n_datapoints_x, 
                                                                                                    oninput: ()=>{
                                                                                                        let n = parseInt(o_e.target.value)
                                                                                                        o_graph.n_datapoints_x = Math.min(1000, n);
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }, 
                                                                        ).o_js__n_datapoints_x, 
                                                                        Object.assign(
                                                                            o_graph, 
                                                                            {
                                                                                o_js_a_o_gpu_property_value_visualization: {
                                                                                    f_o_jsh: ()=>{
                                                                                        return {
                                                                                            a_o: [
                                                                                                ...o_graph.a_o_gpu_property_value_visualization.map(
                                                                                                    o_gpu_property_value_visualization=>{
                                                                                                        return {
                                                                                                            a_o: [
                                                                                                                {
                                                                                                                    s_tag: "select", 
                                                                                                                    a_o: [
                                                                                                                        ...o_state.a_o_gpu_property.map(
                                                                                                                            o_gpu_property=>{
                                                                                                                                return {
                                                                                                                                    s_tag: "option",
                                                                                                                                    value: o_gpu_property.s_property_accessor_nvidia_smi, 
                                                                                                                                    innerText: o_gpu_property.s_property_accessor_nvidia_smi, 
                                                                                                                                    ...(
                                                                                                                                        (
                                                                                                                                            o_gpu_property.s_property_accessor_nvidia_smi == 
                                                                                                                                            o_gpu_property_value_visualization.o_gpu_property.s_property_accessor_nvidia_smi)
                                                                                                                                            ? {
                                                                                                                                                selected: true
                                                                                                                                            } : {}
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            }
                                                                                                                        )
                                                                                                                    ], 
                                                                                                                    onchange: async (o_e)=>{
                                                                                                                        let o_gpu_property = o_state.a_o_gpu_property.find(
                                                                                                                            o=>{
                                                                                                                                return o.s_property_accessor_nvidia_smi == o_e.target.value
                                                                                                                            }
                                                                                                                        );
                                                                                                                        o_gpu_property_value_visualization.o_gpu_property = o_gpu_property
                                                                                                                        
                                                                                                                        await o_graph.o_js_a_o_gpu_property_value_visualization._f_render();
                                                                                                                    }
                                                                                                                },
                                                                                                                {
                                                                                                                    innerText: o_gpu_property_value_visualization.o_gpu_property.s_title,
                                                                                                                },
                                                                                                                {
                                                                                                                    innerText: o_gpu_property_value_visualization.o_gpu_property.s_description,
                                                                                                                },
                                                                                                                {
                                                                                                                    s_tag: "input", 
                                                                                                                    type: 'color', 
                                                                                                                    value: o_gpu_property_value_visualization.s_rgba_color_interpolation,
                                                                                                                }, 
                                                                                                                {
                                                                                                                    s_tag: "button",
                                                                                                                    innerText: "remove property", 
                                                                                                                    onclick: async ()=>{
                                                                                                                        o_graph.a_o_gpu_property_value_visualization = o_graph.a_o_gpu_property_value_visualization.filter(o2=>{
                                                                                                                            o2 != o_gpu_property_value_visualization
                                                                                                                        })
                                                                                                                        await o_graph.o_js_a_o_gpu_property_value_visualization._f_render();
                                                                                                                    }
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    }
                                                                                                ), 
                                                                                                {
                                                                                                    s_tag :"button", 
                                                                                                    innerText: "add a property", 
                                                                                                    onclick: async ()=>{
                                                                                                        o_graph.a_o_gpu_property_value_visualization.push(
                                                                                                            new O_gpu_property_value_visualization(
                                                                                                                o_state.a_o_gpu_property[0],
                                                                                                                'rgba(128, 0, 0, 1.0)',
                                                                                                                'linear'
                                                                                                            )
                                                                                                        )
                                                                                                        await o_graph.o_js_a_o_gpu_property_value_visualization._f_render();
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        ).o_js_a_o_gpu_property_value_visualization
                                                                    ]
                                                                }, 
                                                                {
                                                                    class: 'canvas_container', 
                                                                    a_o: []
                                                                }, 
                                                            ]
                                                        },
                                                        {
                                                            s_tag: "button", 
                                                            innerText: "remove graph", 
                                                            onclick: async ()=>{
                                                                o_state.a_o_graph = o_state.a_o_graph.filter(o2=>{
                                                                    return o2!= o_graph
                                                                });
                                                                await o_state.o_js__a_o_graph._f_render();
                                                            }
                                                        }
                                                    ]
                                                }
                                            }), 
                                        ]

                                    }
                                }
                            }
                        }
                    ).o_js__a_o_graph,
                    {
                        s_tag: "button", 
                        innerText: "add graph",
                        onclick : async ()=>{
                            o_state.a_o_graph.push(
                                new O_graph(
                                    o_state.a_o_gpu_readout_info.at(-1).a_o_gpu_info[0].s_name_brand_model_gpu,
                                    1000, 
                                    10,
                                    []
                                )
                            )
                            await o_state.o_js__a_o_graph._f_render();
                            console.log(o_state.a_o_graph)
                        }
                    }              
                ]
            }
        ]
    })
)

// import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.min.js'
// Register all necessary components (optional, depending on what you need)
// Chart.register(...registerables);

// Example: Creating a simple chart

let f_n_nor1 = function(
    o, 
    o_parent
){

    let n_total = parseInt(o_parent.querySelector('total')?.innerHTML);
    return parseInt(o.innerHTML) / n_total
}
let f_n_nor2 = function(
    o, 
    o_parent
){
    let n_nor = parseInt(o.innerHTML) / 100.0;
    return n_nor
}
let a_o_prop = [
    
    // { f_n_nor: f_n_nor1, s_prop: 'fb_memory_usage.total', showLine: true },
    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'fb_memory_usage.reserved', 
        s_title: 'Frame Buffer Memory Reserved',
        s_description: 'How much memory is reserved for the frame buffer. This memory is allocated but not necessarily used for immediate rendering.'
    },
    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'fb_memory_usage.used', 
        s_title: 'Frame Buffer Memory Used',
        s_description: 'The amount of frame buffer memory actively being used by the GPU for rendering tasks and operations.'
    },
    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'fb_memory_usage.free', 
        s_title: 'Frame Buffer Memory Free',
        s_description: 'The available frame buffer memory that can be allocated for future rendering operations.'
    },

    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'bar1_memory_usage.used', 
        s_title: 'BAR1 Memory Used',
        s_description: 'The amount of memory used by BAR1, which is used for communication between the CPU and GPU. It maps parts of GPU memory for CPU access.'
    },
    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'bar1_memory_usage.free', 
        s_title: 'BAR1 Memory Free',
        s_description: 'The available BAR1 memory that the CPU can map and use for communication with the GPU.'
    },

    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'cc_protected_memory_usage.used', 
        s_title: 'CC Protected Memory Used',
        s_description: 'The amount of memory used for protected content, which is secured by Content and Context Protection (CCP).'
    },
    {   
        f_n_nor: f_n_nor1, 
        s_prop: 'cc_protected_memory_usage.free', 
        s_title: 'CC Protected Memory Free',
        s_description: 'The available memory for protected content secured under Content and Context Protection (CCP).'
    },

    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.gpu_util', 
        s_title: 'GPU Utilization',
        s_description: 'The percentage of GPU utilization, showing how much of the GPU’s processing power is currently in use.'
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.memory_util', 
        s_title: 'Memory Utilization',
        s_description: 'The percentage of memory utilization, showing how much of the GPU’s memory is currently in use.'
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.encoder_util', 
        s_title: 'Encoder Utilization',
        s_description: 'The percentage of utilization for the GPU’s video encoder, showing how much of the encoder’s resources are being used.'
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.decoder_util', 
        s_title: 'Decoder Utilization',
        s_description: 'The percentage of utilization for the GPU’s video decoder, showing how much of the decoder’s resources are being used.'
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.jpeg_util', 
        s_title: 'JPEG Decoder Utilization',
        s_description: 'The percentage of utilization for the GPU’s JPEG decoding engine, showing how much of the JPEG decoder’s resources are being used.'
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.ofa_util', 
        s_title: 'Optical Flow Accelerator Utilization',
        s_description: 'The percentage of utilization for the GPU’s Optical Flow Accelerator (OFA), which is used for motion estimation and similar tasks.'
    },

    {   
        s_prop: 'temperature.gpu_temp', 
        s_title: 'GPU Temperature',
        s_description: 'The current temperature of the GPU in degrees Celsius.'
    },
    {   
        s_prop: 'temperature.gpu_temp_max_threshold', 
        s_title: 'Max GPU Temperature Threshold',
        s_description: 'The maximum safe operating temperature for the GPU, beyond which it may throttle or shut down to prevent damage.'
    },
    {   
        s_prop: 'temperature.gpu_temp_slow_threshold', 
        s_title: 'GPU Slowdown Temperature Threshold',
        s_description: 'The temperature at which the GPU will start to reduce its clock speeds (throttle) to prevent overheating.'
    },
    {   
        s_prop: 'temperature.gpu_temp_max_gpu_threshold', 
        s_title: 'Max GPU Temperature',
        s_description: 'The highest temperature the GPU has reached during operation.'
    },

    {   
        s_prop: 'gpu_power_readings.power_draw', 
        s_title: 'GPU Power Draw',
        s_description: 'The current power consumption of the GPU in watts.'
    },
    {   
        s_prop: 'gpu_power_readings.current_power_limit', 
        s_title: 'Current Power Limit',
        s_description: 'The current power limit set for the GPU, which can be dynamically adjusted based on workload or system configuration.'
    },
    {   
        s_prop: 'gpu_power_readings.requested_power_limit', 
        s_title: 'Requested Power Limit',
        s_description: 'The power limit requested by the system or software for the GPU.'
    },
    {   
        s_prop: 'gpu_power_readings.default_power_limit', 
        s_title: 'Default Power Limit',
        s_description: 'The default power limit set by the manufacturer for the GPU.'
    },
    {   
        s_prop: 'gpu_power_readings.min_power_limit', 
        s_title: 'Minimum Power Limit',
        s_description: 'The minimum power limit the GPU can operate under without shutting down or malfunctioning.'
    },
    {   
        s_prop: 'gpu_power_readings.max_power_limit', 
        s_title: 'Maximum Power Limit',
        s_description: 'The maximum power limit the GPU can draw without exceeding safety limits.'
    },

    {   
        s_prop: 'clocks.graphics_clock', 
        s_title: 'Graphics Clock Speed',
        s_description: 'The current clock speed of the GPU’s graphics core, measured in MHz.'
    },
    {   
        s_prop: 'clocks.sm_clock', 
        s_title: 'SM Clock Speed',
        s_description: 'The clock speed of the GPU’s streaming multiprocessor (SM), which handles parallel workloads.'
    },
    {   
        s_prop: 'clocks.mem_clock', 
        s_title: 'Memory Clock Speed',
        s_description: 'The current clock speed of the GPU’s memory, measured in MHz.'
    },
    {   
        s_prop: 'clocks.video_clock', 
        s_title: 'Video Clock Speed',
        s_description: 'The clock speed of the GPU’s video processing engine, measured in MHz.'
    },
]




if(!o_state.b_nvidia_smi_installed){
    f_o_throw_notification(o_state.o_state__notifier, 'nvidia smi not installed')
}

if(o_state.b_nvidia_smi_installed){
    f_update_interval();
}

