
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
    n_ms_interval:500, 
    n_datapoints_x: 200, 
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
                            o_js__n_ms_interval: {
                                f_o_jsh:()=>{
                                    return {
                                        a_o: [
                                            {
                                                innerText: "Milliseconds interval", 
                                            },
                                            {
                                                s_tag: "input", 
                                                
                                                value: o_state.n_ms_interval, 
                                                oninput: ()=>{
                                                    let n = parseInt(o_e.target.value)
                                                    o_state.n_ms_interval = Math.max(100, n);
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                    ).o_js__n_ms_interval,
                    Object.assign(
                        o_state, 
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
                                                value: o_state.n_datapoints_x, 
                                                oninput: ()=>{
                                                    let n = parseInt(o_e.target.value)
                                                    o_state.n_datapoints_x = Math.min(1000, n);
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }, 
                    ).o_js__n_datapoints_x, 
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
                                                                                                        f_resize_echart_graphs();
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
                                                                f_clear_echart_instances();
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
                                    [], 
                                    5
                                )
                            )
                            await o_state.o_js__a_o_graph._f_render();
                            f_clear_echart_instances();
                            f_resize_echart_graphs();
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

