
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
import { O_chart, O_nvidia_smi_info } from "./classes.module.js"

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
    s_name_gpu : '', 
    o_nvidia_smi_info: null, 
    a_o_nvidia_smi_info: [], 
    a_o_dataset: [], 
    n_ms_interval: 100,
    n_ms_interval_min: 100,
    n_ms_interval_max: 2000,
    n_id_interval: 0,
    n_datapoints_x: 100,
    n_datapoints_x_min: 1,
    n_datapoints_x_max: 500,
    a_o_chart: []
}
let f_update_interval = function(){

    clearInterval(o_state.n_id_interval);
    o_state.n_id_interval = window.setInterval(async function(){
        let o = await fetch('./f_o_nvidia_smi_info');
        if(!o.ok){
            await f_o_throw_notification(o_state.o_state__notifier, await o.text(), 'error');
        }
        let o_data = await o.json();
        // console.log(o_data);
        // Create a DOMParser instance
        const o_parser = new DOMParser();
        const o_xml = o_parser.parseFromString(o_data.s_xml_nvidia_smi_output, "application/xml");
        let s_name_gpu = o_xml.querySelector('gpu product_name')?.innerHTML
        if(o_state.s_name_gpu != s_name_gpu){
            o_state.s_name_gpu = s_name_gpu
            if(!o_state.o_js__s_name_gpu.b_rendering){
                o_state.o_js__s_name_gpu._f_render();
            }
        }
        o_state.a_o_nvidia_smi_info.push(
            Object.assign(
                {_o_xml: o_xml}, 
                o_data
            )
        );
    
        f_update_a_o_chart();
    },o_state.n_ms_interval)
}
f_update_interval();

window.o_state = o_state

o_variables.n_rem_font_size_base = 1. // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css(
    `
    body{
        min-height: 100vh;
        min-width: 100vw;
        /* background: rgba(0,0,0,0.84);*/
    }
    .o_chart{
        width: 100vw;
        height: 300px;
        margin: auto;
    }
    /* Ensure the canvas fills the container */
    canvas {
      width: 100% !important;  /* Ensure the canvas takes up full width */
      height: 100% !important; /* Ensure the canvas takes up full height */
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
            Object.assign(
                o_state, 
                {
                    o_js__inputs: {
                        f_o_jsh:()=>{
                            return  {
                                class: "inputs", 
                                a_o: [
                                    Object.assign(
                                        o_state, 
                                        {
                                            o_js__s_name_gpu: {
                                                f_o_jsh:()=>{
                                                    return {
                                                        s_tag: "h2", 
                                                        innerText: o_state.s_name_gpu
                                                    }
                                                }
                                            }
                                        }
                                    ).o_js__s_name_gpu,
                                    
                                    {
                                        s_tag: "label", 
                                        innerText: "Update Interval (milliseconds)", 
                                    },
                                    {
                                        s_tag: "input", 
                                        type: 'number', 
                                        value: o_state.n_ms_interval, 
                                        step: 10, 
                                        oninput: async (o_e)=>{
                                            let n = o_e.target.value;
                                            o_state.n_ms_interval = f_n_clamped(
                                                parseInt(n), 
                                                o_state.n_ms_interval_min, 
                                                o_state.n_ms_interval_max
                                            );
                                            await o_state.o_js__inputs._f_render();
                                            f_update_interval();
                                        }
                                    }, 
                                    {
                                        s_tag: "label", 
                                        innerText: "Datapoints (x-axis)", 
                                    },
                                    {
                                        s_tag: "input", 
                                        type: 'number', 
                                        value: o_state.n_datapoints_x, 
                                        n_min: 1, 
                                        n_max: 100, 
                                        step: 10, 
                                        oninput: async (o_e)=>{
                                            let n = o_e.target.value;
                                            o_state.n_datapoints_x = f_n_clamped(
                                                parseInt(n), 
                                                o_state.n_datapoints_x_min, 
                                                o_state.n_datapoints_x_max
                                            );
                                            await o_state.o_js__inputs._f_render();
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ).o_js__inputs,
            {
                class: "a_o_chart", 
                a_o: [

                ]
            },
            {
                s_tag: "button", 
                innerText: "add", 
                onclick: ()=>{f_add_o_chart()}
            },
            {
                class: "help", 
                // innerHTML: f_
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
    {   f_n_nor: f_n_nor1, s_prop: 'fb_memory_usage.reserved', 
        showLine: true, 
        hidden: true
    },
    {   f_n_nor: f_n_nor1, s_prop: 'fb_memory_usage.used', 
        showLine: true, 
        hidden: true
    },
    {   f_n_nor: f_n_nor1, s_prop: 'fb_memory_usage.free', 
        showLine: true, 
        hidden: true
    },

    {   f_n_nor: f_n_nor1, s_prop: 'bar1_memory_usage.used', 
        showLine: true, 
        hidden: true
    },
    {   f_n_nor: f_n_nor1, s_prop: 'bar1_memory_usage.free', 
        showLine: true, 
        hidden: true
    },


    {   f_n_nor: f_n_nor1, s_prop: 'cc_protected_memory_usage.used', 
        showLine: true, 
        hidden: true
    },
    {   f_n_nor: f_n_nor1, s_prop: 'cc_protected_memory_usage.free', 
        showLine: true, 
        hidden: true
    },

    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.gpu_util', 
        showLine: true, 
        hidden: false
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.memory_util', 
        showLine: true, 
        hidden: true
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.encoder_util', 
        showLine: true, 
        hidden: true
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.decoder_util', 
        showLine: true, 
        hidden: true
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.jpeg_util', 
        showLine: true, 
        hidden: true
    },
    {   
        f_n_nor: f_n_nor2,
        s_prop: 'utilization.ofa_util', 
        showLine: true, 
        hidden: true
    },

    {   
        s_prop: 'temperature.gpu_temp', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'temperature.gpu_temp_max_threshold', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'temperature.gpu_temp_slow_threshold', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'temperature.gpu_temp_max_gpu_threshold', 
        showLine: true, 
        hidden: true
    },

    {   
        s_prop: 'gpu_power_readings.power_draw', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'gpu_power_readings.current_power_limit', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'gpu_power_readings.requested_power_limit', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'gpu_power_readings.default_power_limit', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'gpu_power_readings.min_power_limit', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'gpu_power_readings.max_power_limit', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'clocks.graphics_clock', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'clocks.sm_clock', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'clocks.mem_clock', 
        showLine: true, 
        hidden: true
    },
    {   
        s_prop: 'clocks.video_clock', 
        showLine: true, 
        hidden: true
    },

]



let f_update_a_o_chart = function(){

    o_state.a_o_dataset = a_o_prop.map((o, n_idx)=>{
        let n_idx_nor = n_idx / a_o_prop.length;
        let o_col = {
            // hsla(120,100%,50%,0.3);}
            backgroundColor: `hsla(${n_idx_nor*360}, 50%, 50%, 1)`,
            borderColor: `hsla(${n_idx_nor*360}, 50%, 50%, 1)`, 
        }
    
        
        return Object.assign(
            {
                // tension: 0.4,// non linear interpolation between datapoints
                label: o.s_prop, 
                // data: [ 
                //     {x: 1725617097690, y: 5},
                     
                //     {x: 1725617098698, y: 7},
                     
                //     {x: 1725617099706, y: 18},
                     
                //     {x: 1725617100707, y: 19},
                     
                //     {x: 1725617101707, y: 19}]
                data: o_state.a_o_nvidia_smi_info.slice(
                    o_state.a_o_nvidia_smi_info.length-o_state.n_datapoints_x
                ).map(o_nvidia_smi_info=>{
                    
                    if(!o.f_n_nor){
                        return false;
                    }
                    let o_parent = o_nvidia_smi_info._o_xml.querySelector(o.s_prop.split('.').shift());
                    let o_child = o_parent.querySelector(o.s_prop.split('.').slice(1).join(' '));
                    let n_total = parseInt(o_parent.querySelector('total')?.innerHTML);
                    let n_nor = o.f_n_nor(o_child, o_parent);
                    
                    
                    let a_s_unit_possible = [
                        'MiB',
                        '%',
                        'C',
                        'W',
                        'MHz',
                        'mV'
                    ];

                    return {
                        x: o_nvidia_smi_info.n_ts_ms,
                        y: parseFloat(n_nor*100).toFixed(2)
                    }
                }).filter(v=>v)
            }, 
            o, 
            o_col
        )
    })

    for(let o_chart of o_state.a_o_chart){

        o_state.a_o_dataset.forEach(
            o_dataset1=>{
                let o_dataset2 = o_chart.data.datasets.find(o2=>{
                    return o2.label == o_dataset1.label
                });
                if(!o_dataset2){
                    o_chart.data.datasets.push(o_dataset1)
                }
                if(o_dataset2){
                    o_dataset2.data = o_dataset1.data
                }
            }
        )
        const dataset = o_chart.data.datasets[0].data;

    
        // Dynamically set the x-axis range based on the first and last data points
        const minX = dataset[0].x;
        const maxX = dataset[dataset.length - 1].x;
    
        o_chart.options.scales.x.min = minX;
        o_chart.options.scales.x.max = maxX;

        o_chart.update()
    }


}

f_update_a_o_chart()

let f_add_o_chart = async function(){
    
    document.querySelector(`.a_o_chart`)?.appendChild(
        await f_o_html__and_make_renderable(
            {
                s_tag: "div", 
                class: "o_chart", 
                a_o: [
                    {
                        s_tag: "button", 
                        innerText: "delete", 
                        onclick: function(o_e){
                            let o_div_o_chart = o_e.target.closest('.o_chart');
                            let n_idx = Array.from(document.querySelectorAll('.a_o_chart .o_chart')).indexOf(o_div_o_chart);
                            console.log(n_idx)
                            let o_chart = o_state.a_o_chart[n_idx];
                            o_chart.destroy();
                            o_state.a_o_chart = o_state.a_o_chart.filter(o=>o!=o_chart);
                            o_div_o_chart.remove()
                            Array.from(document.querySelectorAll('.o_chart')).forEach(o=>o.style.height = Math.floor(100/o_state.a_o_chart.length)+'vh')

                        }
                    },
                    {
                        s_tag : "canvas"
                    }
                ]
            }
        )
    )
    let o_ctx = Array.from(document.querySelectorAll(`.a_o_chart canvas`)).pop().getContext('2d')
    let o_chart = new Chart(
        o_ctx, 
        {
            type: 'scatter',
            data: {
                datasets: [
                    ...o_state.a_o_dataset,
                ]
            },
            options: {
                maintainAspectRatio: false,
                animation: true,  // Disable animation
                scales: {
                    x: {
                        type: 'linear',  // Use linear scale to control the delta display
                        title: {
                            display: true,
                            text: 'Seconds Ago',
                            color: 'white',
                        },
                        ticks: {
                            callback: function(value, index, values) {
                                if(o_state.a_o_nvidia_smi_info.length == 0){
                                    return ''
                                }
                                const latestTimestamp = o_state.a_o_nvidia_smi_info[o_state.a_o_nvidia_smi_info.length - 1].n_ts_ms;
                                const secondsAgo = ((latestTimestamp - value) / 1000).toFixed(1);
                                return `-${secondsAgo} sec`;
                            },
                            color: 'white',
                            reverse: true,  // Ensure the chart moves from right to left
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)',
                        }
                    },
                    y: {
                        min: 0, 
                        max: 100,
                        title: {
                            display: true,
                            text: '%',
                            color: 'white'  // White text for dark theme
                        },
                        ticks: {
                            color: 'white',  // White ticks
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.2)'  // Light grid lines for dark theme
                        }
                    }
                }, 
                tooltips: {
                    callbacks: {
                        // Customize the tooltip title
                        title: function(tooltipItem) {
                            return 'Custom Tooltip Title';
                        },
                        // Customize the tooltip label (data for each point)
                        label: function(tooltipItem, data) {
                            const xValue = new Date(tooltipItem.xLabel).toLocaleString();
                            const yValue = tooltipItem.yLabel;
        
                            // Add custom text here
                            return `At ${xValue}, the utilization was ${yValue}%`;
                        }
                    }
                },
                plugins: {
                    // zoom: {
                    //     pan: {
                    //         enabled: true,
                    //         mode: 'xy',
                    //     },
                    //     zoom: {
                    //         wheel: {
                    //             enabled: true, // Enable zooming with the mouse wheel
                    //         },
                    //         pinch: {
                    //             enabled: true, // Enable zooming with pinch gestures on touch devices
                    //         },
                    //         mode: 'xy',
                    //     }
                    // }, 
                    legend: {
                        position:'left',
                        // labels: {
                        //     color: 'white',  // White text for the legend
                        //     font: {
                        //         size: 12  // Adjust font size if needed
                        //     }
                        // }
                        labels: {
                            generateLabels: function(chart) {
                                const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                                labels.forEach(label => {
                                    // If the dataset is hidden, reduce the contrast by changing the font color
                                    if (label.hidden) {
                                        label.fontColor = 'rgba(255, 255, 255, 0.3)';  // Lower contrast for hidden datasets
                                    } else {
                                        label.fontColor = 'white';  // Regular contrast for visible datasets
                                    }
                                });
                                return labels;
                            },
                            color: 'white'  // Default legend text color
                        },
                        onHover: function(e, legendItem, legend) {
                            // Get the overlay div
                            // console.log(e, legendItem, legend)
                            const overlay = document.getElementById('legend-overlay');

                            console.log()
                            // // Display the overlay with the dataset label when hovering over the legend
                            // overlay.style.display = 'block';
                            // overlay.innerText = `You are hovering over ${legendItem.text}`;

                            // // Position the overlay near the mouse cursor
                            // overlay.style.left = `${e.clientX + 10}px`;
                            // overlay.style.top = `${e.clientY + 10}px`;
                        },
                        onLeave: function() {
                            // Hide the overlay when the user stops hovering over the legend item
                            const overlay = document.getElementById('legend-overlay');
                            // overlay.style.display = 'none';
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Dark background for tooltips
                        titleColor: 'white',  // White tooltip title text
                        bodyColor: 'white'  // White tooltip body text
                    }
                }
        
            }, 
            plugins: []
    
        }
    );

    o_state.a_o_chart.push(o_chart)
    Array.from(document.querySelectorAll('.o_chart')).forEach(o=>o.style.height = Math.floor(100/o_state.a_o_chart.length)+'vh')

}


f_add_o_chart();
f_add_o_chart();
f_add_o_chart();