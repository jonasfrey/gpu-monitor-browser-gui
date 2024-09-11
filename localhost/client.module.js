
import {
    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables
} from "https://deno.land/x/f_add_css@1.1/mod.js"

import {
    f_s_timestring_from_n_ms
}
from "https://deno.land/x/date_functions@1.4/mod.js"

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
import { O_graph, O_gpu_info, O_gpu_property_value_visualization, O_window } from "./classes.module.js"
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
    o_el_target_window_pointerdown: null,
    o_window_pointerdown_copy: null,
    n_trn_x_nor_pointerdown: 0,
    n_trn_y_nor_pointerdown: 0,
    o_window__pointerdown: null,
    o_window__settings: null,
    a_o_window: [
        new O_window(
            0.2, 
            0.2, 
            0.,
            0.2, 
            0.2
        )
    ],
    a_o_gpu_property,
    b_nvidia_smi_installed: await (await fetch('./f_b_nvidia_smi_installed')).json(),
    s_name_gpu : '', 
    o_gpu_info: null, 
    a_o_gpu_readout_info: [], 
    a_o_dataset: [], 
    n_id_interval: 0,
    a_o_graph: [], 
    o_state__notifier: {}
}
let f_clear_echart_instances = function(){
    for(let o of o_state.a_o_graph){
        if(o.o_echart){
            o.o_echart.dispose();
            o.o_echart = null;
        }
    }
}
let f_resize_echart_graphs = function(){
    for(let o of o_state.a_o_graph){
        if(o.o_echart){
            o.o_echart.resize();
        }
    }
}
window.onresize = function(){f_resize_echart_graphs()}
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

        let a_o_div = Array.from(document.querySelectorAll('.canvas_container'));
        // console.log(a_o_div)
        // check if there are new graphs


        for(let n_idx in o_state.a_o_graph){

            let o_graph = o_state.a_o_graph[n_idx];
            let o_div = a_o_div[n_idx]

            let n_remaining = Math.max(o_state.n_datapoints_x-o_state.a_o_gpu_readout_info.length, 0);
            let a_o_gpu_readout_info = [
                ...new Array(
                    n_remaining,
                ).fill(0).map(o=>{
                    return o_state.a_o_gpu_readout_info[0]
                }),
                ...o_state.a_o_gpu_readout_info.slice(
                    Math.max(o_state.a_o_gpu_readout_info.length-o_state.n_datapoints_x, 0)
                )
            ];
            // console.log(a_o_gpu_readout_info)
            let n_ts_ms_now = new Date().getTime();
            let a_n_x = a_o_gpu_readout_info.map((o_gpu_readout_info, n_idx)=>{
                n_idx = parseInt(n_idx)
                let n_ms_diff = Math.floor(parseInt(o_gpu_readout_info.n_ts_ms - n_ts_ms_now)/100)*100
                console.log(n_ms_diff);
                let s_timestring = `-`+f_s_timestring_from_n_ms(Math.abs(n_ms_diff));
                return s_timestring
            });
            if(!o_graph.o_echart){
                o_graph.o_echart = echarts.init(o_div);

                var option = {
                    backgroundColor: '#1e1e1e', // Set the background to dark
                    title: {
                        text: '',
                        textStyle: {
                            color: '#ffffff' // White title text for better contrast
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        backgroundColor: '#333', // Dark background for tooltips
                        textStyle: {
                            color: '#ffffff' // White tooltip text
                        }
                    },
                    grid: {
                        top: 40,     // Adjust top padding
                        left: 40,    // Adjust left padding
                        right: 40,   // Adjust right padding
                        bottom: 40   // Adjust bottom padding
                    },
                    xAxis: {
                        interval: o_graph.n_tickinterval,
                        type: 'category',
                        boundaryGap: false,
                        data: [],
                        axisLabel: {
                            color: '#ffffff',  // Optional: Set text color for the labels
                            fontSize: 9,      // Optional: Set font size
                            // rotate: 45         // Optional: Rotate labels (if needed)
                        },
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff' // White axis line
                            }
                        },
                        splitLine: {
                            show: false // Disable grid lines if not necessary
                        }
                    },
                    yAxis: {
                        type: 'value',
                        min: 0,
                        max: 1,
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff' // White axis line
                            }
                        },
                        axisLabel: {
                            color: '#ffffff' // White axis labels
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#444' // Darker color for grid lines to blend with background
                            }
                        }
                    },
                    series: [], 
                    animation: false // Disable all animations globally

                };
                
                // Set the initial option to the chart
                o_graph.o_echart.setOption(option);
                o_graph.o_echart.resize();
                

            }else{

                // Update the chart with the new data
                o_graph.o_echart.setOption({
                    xAxis: {
                        data: a_n_x,
                        // new Array(100).fill(0).map(n=>n)  // Update x-axis data
                    },
                    // series: [{
                    //     name: 'Data Series',
                    //     type: 'line',
                    //     data: [10, 15, 13, 18, 22, 30, 40], // Corresponding data points for each label
                    //     lineStyle: {
                    //         color: 'blue'
                    //     }
                    // }]
                    series: [
                        ...o_graph.a_o_gpu_property_value_visualization.map(
                            o_gpu_property_value_visualization => {
                                // console.log(o_gpu_property_value_visualization)
                                // console.log(a_o_gpu_readout_info)
                                let a_n_y = a_o_gpu_readout_info.map(
                                    o_gpu_readout_info=>{
                                        // console.log(o_gpu_readout_info.a_o_gpu_info)
                                        let o_gpu_info = o_gpu_readout_info.a_o_gpu_info.find(
                                            o_gpu_info=>{
                                                return o_gpu_info.s_name_brand_model_gpu == o_graph.s_name_brand_model_gpu
                                            }
                                        );
                                        // console.log(o_gpu_info)
                                        let o_gpu_property_value = o_gpu_info.a_o_gpu_property_value.find(o=>{
                                            return o.o_gpu_property.s_property_accessor_nvidia_smi == o_gpu_property_value_visualization.o_gpu_property.s_property_accessor_nvidia_smi
                                        });
                                        console.log(o_gpu_property_value)
                                        let n_nor = (o_gpu_property_value.n_nor) ? o_gpu_property_value.n_nor : o_gpu_property_value.o_number_value.n;

                                        return n_nor;
                                    }
                                );
                                // console.log(a_n_y)
                                return {
                                    name: o_gpu_property_value_visualization.o_gpu_property.s_property_accessor_nvidia_smi,
                                    type: 'line',
                                    data: a_n_y,
                                    // new Array(100).fill(0).map(n=>Math.random())  // Update series data, 
                                    lineStyle: {
                                        color: o_gpu_property_value_visualization.s_rgba_color_interpolation
                                    }
                                }
                            }
                        )
                        
                    ]

                })
        
            }
        }
    },o_state.n_ms_interval)
}


window.o_state = o_state

o_variables.n_rem_font_size_base = 0.78 // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
f_add_css(
    `
    button, select {
        max-width: 100%;
        white-space: normal;
    }
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


window.onpointermove = async (o_e)=>{
    if(o_state.o_window__pointerdown){
        let n_trn_x_nor_pointer = o_e.clientX / window.innerWidth;
        let n_trn_y_nor_pointer = o_e.clientY / window.innerHeight;
        if(o_state.o_el_target_window_pointerdown.className.includes('resize')){
            o_state.o_window__pointerdown.n_scl_x_nor =  n_trn_x_nor_pointer - o_state.o_window__pointerdown.n_trn_x_nor
            o_state.o_window__pointerdown.n_scl_y_nor =  n_trn_y_nor_pointer - o_state.o_window__pointerdown.n_trn_y_nor
        }else{

            o_state.o_window__pointerdown.n_trn_x_nor = n_trn_x_nor_pointer + (o_state.o_window_pointerdown_copy.n_trn_x_nor - o_state.n_trn_x_nor_pointerdown)
            o_state.o_window__pointerdown.n_trn_y_nor = n_trn_y_nor_pointer + (o_state.o_window_pointerdown_copy.n_trn_y_nor - o_state.n_trn_y_nor_pointerdown)
            // console.log(o_state.o_window__pointerdown);
        }
        // await o_state.o_window__pointerdown._f_update()
        await o_state.o_js__a_o_window._f_render()
    }
}
window.onpointerup = function(){
    o_state.o_window__pointerdown = null
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
                            o_js__o_window_settings: {
                                f_render:()=>{
                                    return {
                                        class: "o_window__settings",
                                        b_render: o_state?.o_window__settings != null, 
                                        a_o: [
                                            {

                                            }
                                        ]
                                    }
                                }
                            }

                        }
                    ).o_js__o_window_settings,
                    Object.assign(
                        o_state, {
                            o_js__a_o_window: {
                                f_o_jsh:()=>{
                                    return {
                                        a_o: o_state.a_o_window.map(o_window=>{
                                            return {
                                                onpointerdown : function(o_e){
                                                    o_state.o_el_target_window_pointerdown = o_e.target;
                                                    o_state.o_window_pointerdown_copy = Object.assign({}, o_window);
                                                    o_state.o_window__pointerdown = o_window
                                                    o_state.n_trn_x_nor_pointerdown = (o_e.clientX / window.innerWidth)
                                                    o_state.n_trn_y_nor_pointerdown = (o_e.clientY / window.innerHeight)
                                                },
                                                
                                                style: [
                                                    `top: ${parseInt(o_window.n_trn_y_nor*window.innerHeight)}px`,
                                                    `left: ${parseInt(o_window.n_trn_x_nor*window.innerWidth)}px`,
                                                    `width: ${parseInt(o_window.n_scl_y_nor*window.innerHeight)}px`,
                                                    `height: ${parseInt(o_window.n_scl_x_nor*window.innerWidth)}px`,
                                                    `position:absolute`, 
                                                    `z-index: ${o_window.n_trn_z_nor*o_state.a_o_window.length}`,
                                                    `background-color: rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},1)`
                                                ].join(';'), 
                                                a_o: [
                                                    {
                                                        class: "fas fa-cog", 
                                                        s_tag: "button", 
                                                    }, 
                                                    {
                                                        style: "position:absolute; right:0;bottom:0",
                                                        class: "resize fa-solid fa-up-right-and-down-left-from-center", 
                                                        s_tag: "button", 
                                                    },
                                                ]
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    ).o_js__a_o_window,
                    {
                        s_tag: "button", 
                        innerText: "add graph",
                        onclick : async ()=>{
                            let n_new = o_state.a_o_window.length+1;
                            o_state.a_o_window.push(
                                new O_window(0.1, .1, 0., .1, .1)
                                )
                            for(let n_idx in o_state.a_o_window){
                                let n_nor = parseInt(n_idx)/n_new;
                                o_state.a_o_window[n_idx].n_trn_z_nor = n_nor;
                            }
                            await o_state.o_js__a_o_window._f_render();
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





if(!o_state.b_nvidia_smi_installed){
    f_o_throw_notification(o_state.o_state__notifier, 'nvidia smi not installed')
}

if(o_state.b_nvidia_smi_installed){
    f_update_interval();
}

