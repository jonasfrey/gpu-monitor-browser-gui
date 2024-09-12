
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
from 'https://deno.land/x/f_o_html_from_o_js@3.6/mod.js'

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
import { O_graph, O_gpu_info, O_gpu_property_value_visualization, O_window, O_threshhold, O_gpu_readout_info, O_configuration } from "./classes.module.js"
import { a_o_gpu_property, a_o_graph_type, o_gpu_property__gpu_utilization, o_graph_type__gauge, o_graph_type__text, o_graph_type__xy } from "./runtimedata.module.js"

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

let a_o_gpu_readout_info= [
    await (async () => {
        let o = await fetch('./f_o_gpu_readout_info');
        if(!o.ok){
            await f_o_throw_notification(o_state.o_state__notifier, await o.text(), 'error');
        }
        let o_data = await o.json();
        return o_data;
    })()
];

let o_window__default = new O_window(
    0.1, 0.1, 
    0., 
    0.1, 0.1, 
    o_gpu_property__gpu_utilization.s_name,
    o_graph_type__gauge,
    o_gpu_property__gpu_utilization, 
    [
        new O_threshhold(0, '#00ff00'),
        new O_threshhold(0.25, '#EBCF38'),
        new O_threshhold(0.5, '#EBBA38'),
        new O_threshhold(0.75, '#EB8700'),
        new O_threshhold(0.9, '#EA2815'),
    ], 
    a_o_gpu_readout_info[0].a_o_gpu_info[0].s_pci,
    a_o_gpu_readout_info[0].a_o_gpu_info[0].s_name_brand_model_gpu
)
let o_configuration__default = new O_configuration(
    'New configuration', 
    [
        o_window__default
    ],
    true, 
    1, 
    1, 
    10
);
let a_o_configuration = await (await fetch('./f_a_o_configuration')).json();
console.log(a_o_configuration)
if(!a_o_configuration.find(o=>o.s_name == o_configuration__default.s_name)){
    a_o_configuration.push(o_configuration__default)
}

let o_state = {
    a_o_configuration,
    o_configuration: null,
    b_render_global_settings: false,
    s_searchterm_tmp : '',
    a_o_graph_type,
    o_graph_type__text,
    o_graph_type__gauge,
    o_graph_type__xy,
    o_el_target_window_pointerdown: null,
    o_window_pointerdown_copy: null,
    n_trn_x_nor_pointerdown: 0,
    n_trn_y_nor_pointerdown: 0,
    o_window__pointerdown: null,
    o_window__settings: null,
    a_o_window: [ ],
    a_o_gpu_property,
    b_nvidia_smi_installed: await (await fetch('./f_b_nvidia_smi_installed')).json(),
    s_name_gpu : '', 
    o_gpu_info: null, 
    a_o_gpu_readout_info,
    a_o_dataset: [], 
    n_id_interval: 0,
    a_o_graph: [], 
    o_state__notifier: {}
}

o_state.o_configuration = o_state.a_o_configuration[0];

let f_update_e_chart = function(o_echart){
    console.log(o_echart)
    let o_window = o_state.o_configuration.a_o_window.find((o_window, n_idx)=>{
        return o_window.o_echart == o_echart
    });
    let n_idx = o_state.o_configuration.a_o_window.indexOf(o_window);
    if(n_idx > -1){
        let o_el = Array.from(document.querySelectorAll('canvas'))[n_idx];

        if(!o_el?.parentElement){return}
        // Get the parent element's dimensions (but use offsetWidth/offsetHeight for rendering)
        let o = o_el.parentElement;
        let canvasWidth = o?.offsetWidth;
        let canvasHeight = o?.offsetHeight;
        let n_min = Math.min(canvasWidth, canvasHeight);
        // Set the canvas internal resolution (drawing pixels)
        o_el.width = canvasWidth;
        o_el.height = canvasHeight;
        o_el.style.width = canvasWidth+"px";
        o_el.style.height = canvasHeight+"px";
        // window.o_el = o_el
        // Log to verify the dimensions
        console.log(canvasWidth);
        console.log(o_el);

        // Get the current chart options
        
        let o_option = Object.assign({}, o_echart.getOption());

        // Dispose of the current ECharts instance
        o_echart.dispose();

        // Reinitialize ECharts with the resized canvas
        o_window.o_echart = echarts.init(o_el);

        // Apply the previously saved options
        o_window.o_echart.setOption(o_option);
        o_window.o_echart.setOption({
            series: [
                {
                    type: 'gauge',
                    axisLine: {
                        lineStyle: {
                            width: parseInt(n_min*0.01)  // Update the gauge bar width to 30px
                        }
                    }
                }
            ]
        }, false);  // `false` ensures that the update merges with the existing options

        // Resize the chart to fit the canvas dimensions
        o_window.o_echart.resize();
    }
}
let f_update_all_echarts = function(){
    for(let o of o_state.o_configuration.a_o_window){
        f_update_e_chart(o.o_echart)
    }
}
window.onresize = function(){
    f_update_all_echarts();
}
let f_update_interval = async function(){

    return new Promise((f_res, f_rej)=>{

        clearInterval(o_state.n_id_interval);
        o_state.n_id_interval = window.setInterval(async function(){
            console.log('interval')
            let n_datapoints_x = (o_state.o_configuration.n_min_backview*60) / o_state.o_configuration.n_sec_interval;
            let o = await fetch('./f_o_gpu_readout_info');
            if(!o.ok){
                await f_o_throw_notification(o_state.o_state__notifier, await o.text(), 'error');
            }
            let o_data = await o.json();
    
            o_state.a_o_gpu_readout_info.push(
                o_data
            );
    
            let a_o_el = Array.from(document.querySelectorAll('canvas'));
            // console.log(a_o_el)
            // console.log(a_o_el)
            // check if there are new graphs
    
    
            for(let n_idx in o_state.o_configuration.a_o_window){
    
                let o_window = o_state.o_configuration.a_o_window[n_idx];
                let o_div = a_o_el[n_idx]
    
                let n_remaining = parseInt(Math.max(n_datapoints_x-o_state.a_o_gpu_readout_info.length, 0));
                // console.log(n_remaining)
                let a_o_gpu_readout_info = [
                    ...new Array(
                        n_remaining,
                    ).fill(0).map(o=>{
                        return o_state.a_o_gpu_readout_info[0]
                    }),
                    ...o_state.a_o_gpu_readout_info.slice(
                        Math.max(o_state.a_o_gpu_readout_info.length-n_datapoints_x, 0)
                    )
                ];
                // console.log(a_o_gpu_readout_info)
                let n_ts_ms_now = new Date().getTime();
                let a_n_x = a_o_gpu_readout_info.map((o_gpu_readout_info, n_idx)=>{
                    n_idx = parseInt(n_idx)
                    let n_ms_diff = Math.floor(parseInt(o_gpu_readout_info.n_ts_ms - n_ts_ms_now)/100)*100
                    // console.log(n_ms_diff);
                    let s_timestring = `-`+f_s_timestring_from_n_ms(Math.abs(n_ms_diff));
                    return s_timestring
                });
                if(!o_window.o_echart){
                    console.log(o_div)
                    o_window.o_echart = echarts.init(o_div);
    
                    var option = {
                        backgroundColor: '#1e1e1e', // Set the background to dark
                    };
                    
                    // Set the initial option to the chart
                    o_window.o_echart.setOption(option);
                    o_window.o_echart.resize();
                    
    
                }else{
    
                    if(o_window.o_graph_type.s_name == o_graph_type__gauge.s_name){
    
                        let o_gpu_info = o_state.a_o_gpu_readout_info.at(-1).a_o_gpu_info.find(
                            o_gpu_info=>{
                                return o_gpu_info.s_name_brand_model_gpu == o_window.s_name_brand_model_gpu
                            }
                        );
                        // console.log(o_gpu_info)
                        let o_gpu_property_value = o_gpu_info.a_o_gpu_property_value.find(o=>{
                            return o.o_gpu_property.s_name == o_window.o_gpu_property.s_name
                        });
                        // console.log(o_gpu_property_value)
                        let n_nor = (o_gpu_property_value.n_nor != undefined) ? o_gpu_property_value.n_nor : o_gpu_property_value.o_number_value.n;
    
                        var n_value_gauge = parseInt(n_nor*100);  // Example gauge value (can be dynamic)
                        var needleColor = '#32cd32'; // Default color
    
                        // Change needle color based on value
                        if (n_value_gauge <= 30) {
                            needleColor = '#ff4500';  // Red for values 0-30
                        } else if (n_value_gauge <= 70) {
                            needleColor = '#ffcc00';  // Yellow for values 30-70
                        } else {
                            needleColor = '#32cd32';  // Green for values 70-100
                        }
    
                        window.oasdf = (o_window.o_echart)
                        o_window.o_echart.setOption( {
                            series: [
                                {
                                    type: 'gauge',
                                    detail: {formatter: '{value}%'},
                                    data: [{value: n_value_gauge, name: o_window.s_title}],
                                    axisLine: {
                                        lineStyle: {
                                            color: [
                                                [0.3, '#ff4500'],   // Red for 0% to 30%
                                                [0.7, '#ffcc00'],   // Yellow for 30% to 70%
                                                [1, '#32cd32']      // Green for 70% to 100%
                                            ],
                                        }
                                    },
                                    pointer: {
                                        itemStyle: {
                                            color: needleColor  // Dynamic needle color
                                        }
                                    }
                                }
                            ]
                        });
    
                    }
    
                    if(o_window.o_graph_type.s_name == o_graph_type__xy.s_name){
                        console.log(o_window.o_gpu_property);

                        o_window.o_echart.setOption({
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
                                interval: o_state.o_configuration.n_tickinterval,
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
                            animation: false, // Disable all animations globally, 
                            series: [
                                (()=>{
                                    let o_gpu_property = o_window.o_gpu_property;
                                    // o_window.a_o_gpu_property.map(
                                        // o_gpu_property => {
                                            // console.log(o_gpu_property_value_visualization)
                                            // console.log(a_o_gpu_readout_info)
                                            let a_n_y = a_o_gpu_readout_info.map(
                                                o_gpu_readout_info=>{
                                                    // console.log(o_gpu_readout_info.a_o_gpu_info)
                                                    let o_gpu_info = o_gpu_readout_info.a_o_gpu_info.find(
                                                        o_gpu_info=>{
                                                            return o_gpu_info.s_name_brand_model_gpu == o_window.s_name_brand_model_gpu
                                                            && o_gpu_info.s_id_gpu == o_window.s_id_gpu
                                                        }
                                                    );
                                                    // console.log(o_gpu_info)
                                                    let o_gpu_property_value = o_gpu_info.a_o_gpu_property_value.find(o=>{
                                                        return o.o_gpu_property.s_name == o_gpu_property.s_name
                                                    });
                                                    // console.log(o_gpu_property_value)
                                                    let n_nor = (o_gpu_property_value.n_nor != undefined) ? o_gpu_property_value.n_nor : o_gpu_property_value.o_number_value.n;
            
                                                    return n_nor;
                                                }
                                            );
                                            // console.log(a_n_y)
                                            return {
                                                name: o_gpu_property.s_name,
                                                type: 'line',
                                                data: a_n_y,
                                                // new Array(100).fill(0).map(n=>Math.random())  // Update series data, 
                                                lineStyle: {
                                                    color: 'red'
                                                }
                                            }
                                        // }
                                    // )
                                })()
                                
                            ]
        
                        })
                    }
            
                }
            }
            return f_res(true);
        },o_state.o_configuration.n_sec_interval*1000)
    })
}



window.o_state = o_state

o_variables.n_rem_font_size_base = 0.78 // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements 
f_add_css('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
f_add_css(
    `
    .o_window__settings{
        width: 100vw;
        height: 100vh;
        background: rgba(0.1,0.1,0.1,0.85);
        z-index:100000;
        left:0;
        top:0;
        position:absolute;
    }
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


    ${
        f_s_css_from_o_variables(
            o_variables
        )
    }
    `
)




let f_o_assigned = function(
    s_name, 
    v
){
    let o = {}
    if(typeof v.f_o_jsh == 'function'){
        o = v
    }else{
        if(typeof v == 'function'){
            o.f_o_jsh = v
        }else{
            o.f_o_jsh = function(){
                return v
            }
        }
    }
    return Object.assign(
        o_state, 
        {
            [s_name]: o
        }
    )[s_name]
}

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

let f_s_html_highlighted = function(s_text, s_searchterm){
    s_searchterm = s_searchterm.trim()
    // Escape any special characters in the search term
    let s_searchterm_escaped = s_searchterm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Create a regex with the search term and replace matches with highlighted HTML
    let regex = new RegExp(s_searchterm_escaped, 'gi');
    return s_text.replace(regex, function(match) {
        return `<span style="background-color: #64642c">${match}</span>`;
    });
}

window.onpointermove = async (o_e)=>{
    if(o_state.o_window__pointerdown){
        let n_trn_x_nor_pointer = o_e.clientX / window.innerWidth;
        let n_trn_y_nor_pointer = o_e.clientY / window.innerHeight;
        if(o_state.o_el_target_window_pointerdown.className.includes('resize')){
            o_state.o_window__pointerdown.n_scl_x_nor =  Math.abs(n_trn_x_nor_pointer - o_state.o_window__pointerdown.n_trn_x_nor)
            o_state.o_window__pointerdown.n_scl_y_nor =  Math.abs(n_trn_y_nor_pointer - o_state.o_window__pointerdown.n_trn_y_nor)
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
                    
                    f_o_assigned(
                        'o_js__a_o_configuration', 
                        {
                            s_tag: "select", 
                            onchange: async (o_e)=>{
                                let o_configuration = o_state.a_o_configuration.find(o=>{
                                    return o.s_name == o_e.target.value
                                })
                                console.log(o_configuration)
                                if(o_configuration){
                                    o_state.o_configuration = o_configuration
                                    await o_state.o_js__s_o_configuration_s_name._f_render()
                                    await o_state.o_js__a_o_window._f_render();
                                }
                            },
                            a_o: [
                                ...o_state.a_o_configuration.map(o=>{
                                    return {
                                        innerText: o.s_name, 
                                        value: o.s_name,
                                        s_tag: "option"
                                    }
                                })
                            ]
                        }
                    ),
                    f_o_assigned(
                        'o_js__s_o_configuration_s_name', 
                        ()=>{
                            console.log('asdf')
                            return {
                                s_tag: "input", 
                                value: o_state.o_configuration.s_name,
                                oninput: (o_e)=>{
                                    o_state.o_configuration.s_name = o_e.target.value;
                                }
                            }
                        }
                        
                    ),
                    {
                        s_tag: 'button', 
                        innerText: "save or update configuration",
                        onpointerdown: async ()=>{
                            let o_resp = await fetch(
                                './f_createorupdate_configuration', 
                                {
                                    method: "POST", 
                                    headers: {
                                        'content-type': "application/json"
                                    },
                                    body: JSON.stringify(
                                        Object.assign(
                                            {}, 
                                            o_state.o_configuration, 
                                        ), function(s_prop, value) {
                                        // If the property is in the ignored list, skip it
                                        if(
                                            s_prop.includes('o_js__')
                                            ||
                                            s_prop.includes('o_echart')
                                            || 
                                            s_prop.includes('o_jsh')
                                            || 
                                            s_prop.includes('f_o_jsh')
                                        ){
                                            return undefined
                                        }
                                        
                                        // Otherwise, return the value
                                        return value;
                                      })
                                }
                            )
                            await f_o_throw_notification(o_state.o_state__notifier, await o_resp.text(), (!o_resp.ok) ? 'error': "success");
                        }
                    },
                    {
                        class: "settings fas fa-cog", 
                        s_tag: "button",
                        onclick: async ()=>{
                            o_state.b_render_global_settings = true;
                            await o_state.o_js__global_settings._f_render()
                        } 
                    },
                    f_o_assigned(
                        'o_js__global_settings', 
                        ()=>{
                            console.log(o_state?.b_render_global_settings)
                            return                         {
                                b_render: o_state?.b_render_global_settings,
                                a_o: [
                                    {
                                        innerText: "Global settings"
                                    },
                                    {
                                        innerText: "Minutes Backview"
                                    },
                                    {
                                        s_tag: "input", 
                                        value: o_state.o_configuration.n_min_backview, 
                                        min: 1, 
                                        max: 30,
                                        step: 1,
                                        type: 'number',
                                        oninput: async (o_e)=>{
                                            o_state.o_configuration.n_min_backview = parseInt(o_e.target.value)
                                        }
                                    },
                                    {
                                        innerText: "Seconds Interval"
                                    },
                                    {
                                        s_tag: "input", 
                                        value: o_state.o_configuration.n_sec_interval, 
                                        min: 0.1, 
                                        max: 30,
                                        step: 0.1,
                                        type: 'number',
                                        oninput: async (o_e)=>{
                                            o_state.o_configuration.n_sec_interval = parseFloat(o_e.target.value)
                                            f_update_interval()
                                        }
                                    },
                                    f_o_assigned(
                                        'o_js__b_auto_update_title', 
                                        {
                                            s_tag: 'button', 
                                            
                                            a_o: [
                                                {
    
                                                    innerText: "Auto update title"
                                                }, 
                                                {
                                                    class: `fa-regular fa-square${(o_state.b_auto_update_title) ? '-check': ''}`,                                                
                                                }
                                            ] , 
                                            onpointerdown:async ()=>{
                                                o_state.b_auto_update_title = !o_state.b_auto_update_title
                                                await o_state.o_js__b_auto_update_title._f_render()
                                            }
                                        }
                                    ),
                                    {
                                        class: 'fa-solid fa-xmark',
                                        style: "position:absolute; right: 0; top:0",
                                        s_tag: 'button', 
                                        onclick: async()=>{
                                            o_state.b_render_global_settings = false;
                                            await o_state.o_js__global_settings._f_render()
                                            await o_state.o_js__a_o_window._f_render();
    
                                        }
                                    }
                                ]
                            }
                        }
                    ), 
                    f_o_assigned(
                        'o_js__o_window_settings',
                        ()=>{
                            if(!o_state.o_window__settings){
                                return {}
                            }
                            // `${(o_state.o_window__settings?.o_graph_type.s_name == o_graph_type.s_name)?'hovered': ''}
                            return {
                                class: "o_window__settings",
                                b_render: o_state?.o_window__settings != null,
                                a_o: [
                                    {
                                        innerText: "Title"
                                    },
                                    f_o_assigned('o_js__s_title', 
                                        {
                                            s_tag: 'input', 
                                            value: o_state?.o_window__settings?.s_title, 
                                            oninput: (o_e)=>{o_state.o_window__settings.s_title = o_e.target.value}
                                        }
                                    ),
                                    {
                                        innerText: "GPU"
                                    },
                                    f_o_assigned(
                                        'o_js__a_o_gpu_readout_info',
                                        {
                                                a_o: o_state.a_o_gpu_readout_info.at(-1).a_o_gpu_info.map(o_gpu_info=>{
                                                    let s_id_gpu = o_gpu_info.a_o_gpu_property_value.find(o2=>o2.o_gpu_property.s_name == '@id');
                                                    let s_product_name = o_gpu_info.a_o_gpu_property_value.find(o2=>o2.o_gpu_property.s_name == 'product_name');
                                                    return {
                                                        class: [
                                                            `clickable`,
                                                            (o_state.o_window__settings.s_id_gpu == s_id_gpu) 
                                                                ? 'hovered': ''
                                                        ].join(' '),
                                                        onclick: async ()=>{
                                                            o_state.o_window__settings.s_name_brand_model_gpu = s_product_name
                                                            o_state.o_window__settings.s_id_gpu = s_id_gpu
                                                            await o_state.o_js__a_o_gpu_readout_info._f_render();
                                                        }, 
                                                        innerText: s_product_name+s_id_gpu
                                                    }
                                            })
                                        }
                                    ),
                                    {
                                        innerText: "Graph type"
                                    },
                                    {
                                        style: 'display:flex;flex-direction:row',
                                        a_o:o_state.a_o_graph_type.map(o_graph_type=>{
                                            return {
                                                class: [
                                                    `clickable`,
                                                    (o_state.o_window__settings?.o_graph_type.s_name == o_graph_type.s_name) 
                                                        ? 'hovered': ''
                                                ].join(' '),
                                                onclick: async ()=>{
                                                    o_state.o_window__settings.o_graph_type = o_graph_type
                                                    await o_state.o_js__o_window_settings._f_render();
                                                },
                                                a_o: [
                                                    {
                                                        innerText: o_graph_type.s_name
                                                    },
                                                    {
                                                        s_tag: "img", 
                                                        style: "max-width: 100px;max-height:100px",
                                                        src: o_graph_type.s_name_img
                                                    }, 
                                                ]
                                            }
                                        })
                                    },
                                    {
                                        innerText: "Property"
                                    },
                                    f_o_assigned(
                                        'o_js__prop', 
                                        {
                                            a_o: [
                                                {
                                                    innerText: o_state.o_window__settings?.o_gpu_property?.s_name.split('.').join(' ')
                                                },
                                                {
                                                    innerText: o_state.o_window__settings?.o_gpu_property?.s_description
                                                }
                                            ]
                                        }
                                    ),
                                    {
                                        s_tag: "input", 
                                        type: "text", 
                                        oninput: async (o_e)=>{
                                            o_state.s_searchterm_tmp = o_e.target.value;
                                            await o_state.o_js__a_o_gpu_property._f_render();
                                        }
                                    },
                                    f_o_assigned(
                                        'o_js__a_o_gpu_property', 
                                        {
                                            style: "max-height: 300px; overflow-y:scroll",
                                            a_o: o_state.a_o_gpu_property
                                                .filter(o_gpu_property=>{
                                                    if(o_state.s_searchterm_tmp == ''){return true}
                                                    return o_gpu_property.s_name.toLowerCase().includes(o_state.s_searchterm_tmp)
                                                    || 
                                                    o_gpu_property.s_description.toLowerCase().includes(o_state.s_searchterm_tmp)
                                                })
                                                .map(o_gpu_property=>{
                                                return {
                                                    onpointerdown: async (o_e)=>{
                                                        o_state.o_window__settings.o_gpu_property = o_gpu_property
                                                        if(o_state.b_auto_update_title){
                                                            o_state.o_window__settings.s_title = o_gpu_property.s_title
                                                        }
                                                        await o_state.o_js__prop._f_render();
                                                        await o_state.o_js__s_title._f_render();
                                                    },
                                                    class: "clickable",
                                                    data_value: o_gpu_property.s_name,
                                                    a_o: [
                                                        {
                                                            innerHTML: f_s_html_highlighted(o_gpu_property.s_name.split('.').join(' '), o_state.s_searchterm_tmp)
                                                        },
                                                        {
                                                            innerHTML: f_s_html_highlighted(o_gpu_property.s_description, o_state.s_searchterm_tmp)
                                                        }
                                                    ]
                                                }
                                            })
                                        }
                                    ),
                                    {
                                        innerText: "threshholds"
                                    },
                                    {
                                        a_o: [
                                            ...o_state.o_window__settings?.a_o_threshhold.map(o_threshhold=>{
                                                return {
                                                    class: 'o_threshhold', 
                                                    style: "display:flex; flex-direction:row",
                                                    a_o: [
                                                        {
                                                            s_tag: 'input', 
                                                            type: 'number', 
                                                            value: o_threshhold.n, 
                                                            oninput: (o_e)=>{
                                                                o_threshhold.n = parseFloat(o_e.target.value)
                                                            }
                                                        }, 
                                                        {
                                                            s_tag: 'input', 
                                                            type: "color", 
                                                            value: o_threshhold.s_col, 
                                                            oninput: (o_e)=>{
                                                                o_threshhold.s_col = o_e.target.value
                                                            }
                                                        }
                                                    ]
                                                }
                                            })
                                        ] 
                                    },
                                    {
                                        class: 'fa-solid fa-xmark',
                                        style: "position:absolute; right: 0; top:0",
                                        s_tag: 'button', 
                                        onclick: async()=>{
                                            o_state.o_window__settings = null;
                                            await o_state.o_js__o_window_settings._f_render();
                                            await o_state.o_js__a_o_window._f_render()
                                        }
                                    }
                                ]
                            }
                        }
                    ),
                    f_o_assigned(
                        'o_js__a_o_window', 
                        {
                            f_after_f_o_html__and_make_renderable: async ()=>{
                                f_update_all_echarts();
                            },
                            f_o_jsh:()=>{
                              
                                return {
                                    a_o: o_state.o_configuration.a_o_window.map(o_window=>{
                                        return {
                                            class: `clickable hovered`,
                                            onpointerdown : async function(o_e){
                                                o_state.o_el_target_window_pointerdown = o_e.target;
                                                o_state.o_window_pointerdown_copy = Object.assign({}, o_window);
                                                o_state.o_window__pointerdown = o_window
                                                o_state.n_trn_x_nor_pointerdown = (o_e.clientX / window.innerWidth)
                                                o_state.n_trn_y_nor_pointerdown = (o_e.clientY / window.innerHeight)
                                                if(o_e.target.className.includes('settings')){
                                                    o_state.o_window__settings = o_window
                                                    await o_state.o_js__o_window_settings._f_render();
                                                }
                                            },
                                            
                                            style: [
                                                `top: ${parseInt(o_window.n_trn_y_nor*window.innerHeight)}px`,
                                                `left: ${parseInt(o_window.n_trn_x_nor*window.innerWidth)}px`,
                                                `width: ${parseInt(o_window.n_scl_x_nor*window.innerWidth)}px`,
                                                `height: ${parseInt(o_window.n_scl_y_nor*window.innerHeight)}px`,
                                                `position:absolute`, 
                                                `z-index: ${o_window.n_trn_z_nor*o_state.o_configuration.a_o_window.length}`,
                                                // `background-color: rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},1)`
                                            ].join(';'), 
                                            a_o: [
                                                {
                                                    innerText: o_window.s_title,
                                                    style: 'font-size: 1rem; width:100%; text-align:center'
                                                },
                                                {
                                                    s_tag: "canvas", 
                                                },
                                                {
                                                    class: "settings fas fa-cog", 
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
                    ),
                    {
                        s_tag: "button", 
                        innerText: "add graph",
                        onclick : async ()=>{
                            let n_new = o_state.o_configuration.a_o_window.length+1;
                            o_state.o_configuration.a_o_window.push(
                                Object.assign({}, o_window__default)    
                            )
                            for(let n_idx in o_state.o_configuration.a_o_window){
                                let n_nor = parseInt(n_idx)/n_new;
                                o_state.o_configuration.a_o_window[n_idx].n_trn_z_nor = n_nor;
                            }
                            await o_state.o_js__a_o_window._f_render();
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



if(o_state.b_nvidia_smi_installed){
    await f_update_interval();
}else{
    f_o_throw_notification(o_state.o_state__notifier, 'nvidia smi not installed')
}


