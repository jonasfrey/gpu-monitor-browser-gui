
import {
    f_websersocket_serve,
    f_v_before_return_response__fileserver
} from "https://deno.land/x/websersocket@1.0.3/mod.js"

import {
    f_s_ymd_hms__from_n_ts_ms_utc
} from "https://deno.land/x/date_functions@1.4/mod.js"
import {
    f_o_command
} from "https://deno.land/x/o_command@0.9/mod.js"
import {
    O_ws_client
} from "./classes.module.js"
import { ensureDir } from "https://deno.land/std@0.224.0/fs/ensure_dir.ts";



import { parse as f_o_xml_parsed } from "https://deno.land/x/xml@5.4.16/parse.ts"

import { f_o_config } from "./functions.module.js";
import {
    f_o_number_value__from_s_input, 
    f_a_o_number_value_temperature_from_s_temp
} from "https://deno.land/x/handyhelpers@4.1.2/mod.js"

import { O_gpu_property_value, O_gpu_info, O_gpu_readout_info } from "./localhost/classes.module.js";
import { a_o_gpu_property, o_gpu_property__gpu_name, o_gpu_property__gpu_utilization, o_gpu_property__memory_info, o_gpu_property__memory_info_bar1_nvidia_specific, o_gpu_property__memory_info_graphics_translation_table_amd_specific, o_gpu_property__pci_address, o_gpu_property__power_draw, o_gpu_property__temperature } from "./localhost/runtimedata.module.js";

let s_path_abs_file_current = new URL(import.meta.url).pathname;
let s_path_abs_folder_current = s_path_abs_file_current.split('/').slice(0, -1).join('/');
const b_deno_deploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;

let a_o_ws_client = []

let f_o_fetch_cached = async function( 
    n_ms_delta_max = 1000*60*5
){
    let n_ms_now = new Date().getTime();
    let a_v_param = Array.from(arguments);
    let o = await o_kv.get([a_v_param[1]]);
    let b_update = (o?.value?.n_ms) ? Math.abs(o?.value?.n_ms-n_ms_now) > n_ms_delta_max : true;
    if(b_update){
        let o_resp = await fetch(...a_v_param.slice(1));
        let o_data = await o_resp.json();
        let o = {
            n_ms: n_ms_now, 
            o_data
        };
        let b_res = await o_kv.set([a_v_param[1]], o); 
    }
    return o?.value?.o_data
}

const o_kv = await Deno.openKv();
// let o_config = await f_o_config();
// console.log({o_config});

let b_dev = true;
let s_api_key = `rtrjRM`
let s_path_abs_folder_cached_shaders = './localhost/cached_shaders';
if(!b_deno_deploy){

    await ensureDir(s_path_abs_folder_cached_shaders)// deno deploy is read only...
}
let f_b_nvidia_smi_installed = async function(){
    let b = false;
    try {
        let o = await f_o_command('which nvidia-smi');
        b = (o.s_stdout != '');
    } catch (error) {
        
    }
    return b
}
let f_b_amdgpu_top_installed = async function(){
    let b = false;
    try {
        let o = await f_o_command('which amdgpu_top');
        b = (o.s_stdout != '');
    } catch (error) {
        
    }
    return b
}

let s_path_file_a_o_configuration = './gitignored/a_o_configuration.json'


let f_handler = async function(o_request){

    // websocket 'request' handling here
    if(o_request.headers.get('Upgrade') == 'websocket'){

        const {
            socket: o_socket,
            response: o_response
        } = Deno.upgradeWebSocket(o_request);
        let o_ws_client = new O_ws_client(
            crypto.randomUUID(),
            o_socket
        )
        a_o_ws_client.push(o_ws_client);

        o_socket.addEventListener("open", (o_e) => {
            console.log({
                o_e, 
                s: 'o_socket.open called'
            })
        });

        o_socket.addEventListener("message", async (o_e) => {
            console.log({
                o_e, 
                s: 'o_socket.message called'
            })
            let v_data = o_e.data;
            a_o_ws_client
                .filter(o=>o!=o_ws_client)  // send to all other clients, comment out to send to all clients
                .forEach(o=>{
                    o.o_socket.send('message was received from a client')

                })
        });
        o_socket.addEventListener("close", async (o_e) => {
            a_o_ws_client.splice(a_o_ws_client.indexOf(o_ws_client), 1);
            console.log({
                o_e, 
                s: 'o_socket.close called'
            })
        });

        return o_response;
    }
    // normal http request handling here
    let o_url = new URL(o_request.url);
    if(o_url.pathname == '/'){
        return new Response(
            await Deno.readTextFile(
                `${s_path_abs_folder_current}/localhost/client.html`
            ),
            { 
                headers: {
                    'Content-type': "text/html"
                }
            }
        );
    }
    if(o_url.pathname == '/f_a_o_configuration'){
        let a_o = []
        try {
            a_o = JSON.parse(await(Deno.readTextFile(s_path_file_a_o_configuration)));
        } catch (error) {
            
        }
        return new Response(
            JSON.stringify(a_o),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }
    if(o_url.pathname == '/f_createorupdate_configuration'){
        let o = await o_request.json();
        let a_o = []
        try {
            a_o = JSON.parse(await(Deno.readTextFile(s_path_file_a_o_configuration)));
        } catch (error) {
            
        }
        let o_existing = a_o.find(o2=>o2.s_name == o.s_name);
        console.log(o_existing)
        let s = 'saved'
        if(o_existing){
            let n_idx = a_o.indexOf(o_existing);
            a_o[n_idx] = o
            s = 'updated'
        }else{
            a_o.push(o);
        }

        await Deno.writeTextFile(s_path_file_a_o_configuration, JSON.stringify(a_o, null, 4))
        return new Response(`configuration ${s} successfully !`,);
    }
    if(o_url.pathname == '/f_b_nvidia_smi_installed'){
        
        let b = await f_b_nvidia_smi_installed();
        if(b_dev){
            b = true;
        }
        return new Response(
            JSON.stringify(b),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }

    if(o_url.pathname == '/f_o_gpu_readout_info'){

        let s_xml = ''
        let b_nvidia_smi = await f_b_nvidia_smi_installed();
        let b_amdgpu_top = await f_b_amdgpu_top_installed();
        if(!b_amdgpu_top && !b_nvidia_smi){
            return new Response(
                `please run 'apt install amdgpu_top' or 'apt install nvidia-smi' depending on your GPU`,
                { 
                    status:500,
                }
            );
        }
        let a_o_gpu_info = []
        let o_nvidia_smi_xml;
        let a_o_gpunvidiaoramd = []

        if(b_nvidia_smi){
            let o = await f_o_command('nvidia-smi -q -x');
            // console.log(o)
            s_xml = o.s_stdout;
            o_nvidia_smi_xml = f_o_xml_parsed(s_xml);
            await Deno.writeTextFile('./o_xml.json', JSON.stringify(o_nvidia_smi_xml, null, 4))
            // console.log(o_nvidia_smi_xml)
            let v = o_nvidia_smi_xml.nvidia_smi_log.gpu;
            if(!Array.isArray(v)){
                v = [v]
            }
            a_o_gpunvidiaoramd = v
            // i could kotzen ! fucking xml structure is behinderet as fuck just use fucking json, what is so hard
            // now this absolutely stupid workaround is necessary
        }else{
            a_o_gpunvidiaoramd = JSON.parse((await f_o_command('amdgpu_top -d --json')).s_stdout);
        }
        console.log(a_o_gpunvidiaoramd)

        a_o_gpu_info = a_o_gpunvidiaoramd.map(o_gpunvidiaoramd=>{
            console.log(o_gpunvidiaoramd)
            let a_o_gpu_property_value = a_o_gpu_property.map(
                o_gpu_property=>{
                    let o_gpu_property_value = new O_gpu_property_value(
                        o_gpu_property,
                    )
                    if(o_gpu_property.s_name == o_gpu_property__gpu_name.s_name){
                        if(b_nvidia_smi){
                            o_gpu_property_value.s_val = o_gpunvidiaoramd.product_name;
                        }else{
                            o_gpu_property_value.s_val = o_gpunvidiaoramd?.DeviceName;
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__pci_address.s_name){
                        if(b_nvidia_smi){
                            o_gpu_property_value.s_val = o_gpunvidiaoramd.pci.pci_bus_id;
                        }else{
                            o_gpu_property_value.s_val = o_gpunvidiaoramd?.PCI;
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__gpu_utilization.s_name){
                        o_gpu_property_value.s_val = '%';
                        if(b_nvidia_smi){
                            o_gpu_property_value.n_nor = parseInt(o_gpunvidiaoramd.utilization.gpu_util)/100;
                        }else{
                            o_gpu_property_value.n_nor = o_gpunvidiaoramd?.gpu_activity?.GFX?.value/100;
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__temperature.s_name){
                        o_gpu_property_value.s_val = '°C';
                        if(b_nvidia_smi){
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.temperature.gpu_temp
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.temperature.gpu_temp_max_threshold
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n

                        }else{
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.Sensors?.['Edge Temperature']?.value} ${o_gpunvidiaoramd?.Sensors?.['Edge Temperature'].unit}`
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                `200 C`//static because amdgpu_top does not provide?
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__power_draw.s_name){
                        o_gpu_property_value.s_val = 'Watt';
                        if(b_nvidia_smi){
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.gpu_power_readings.power_draw
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.gpu_power_readings.current_power_limit
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n; 

                        }else{
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.Sensors?.['GFX Power']?.value} ${o_gpunvidiaoramd?.Sensors?.['GFX Power'].unit}`
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.['Power Cap']?.max} ${o_gpunvidiaoramd?.Sensors?.['GFX Power'].unit}`
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n; 
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__memory_info.s_name){
                        if(b_nvidia_smi){
                            o_gpu_property_value.s_val = o_gpunvidiaoramd.fb_memory_usage.used.split(' ').pop().trim();
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.fb_memory_usage.used
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.fb_memory_usage.total
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n; 
                        }else{
                            o_gpu_property_value.s_val = o_gpunvidiaoramd?.VRAM?.['Total VRAM Usage']?.unit;

                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.VRAM?.['Total VRAM Usage']?.value} ${o_gpunvidiaoramd?.VRAM?.['Total VRAM Usage']?.unit}`
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.VRAM?.['Total VRAM']?.value} ${o_gpunvidiaoramd?.VRAM?.['Total VRAM']?.unit}`
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n; 
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__memory_info_bar1_nvidia_specific.s_name){
                        o_gpu_property_value.s_val = o_gpunvidiaoramd.bar1_memory_usage.used.split(' ').pop().trim();

                        if(b_nvidia_smi){
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.bar1_memory_usage.used                               
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                o_gpunvidiaoramd.bar1_memory_usage.total                                
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n; 
                        }else{

                            o_gpu_property_value.s_val = 'AMD GPU does not have this metric'
                        }
                    }
                    if(o_gpu_property.s_name == o_gpu_property__memory_info_graphics_translation_table_amd_specific.s_name){
                        o_gpu_property_value.s_val = o_gpunvidiaoramd?.VRAM?.['Total GTT Usage']?.unit;

                        if(b_nvidia_smi){
                            o_gpu_property_value.s_val = 'NVIDIA GPU does not have this metric'
                        }else{
                            o_gpu_property_value.o_number_value = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.VRAM?.['Total GTT Usage']?.value} ${o_gpunvidiaoramd?.VRAM?.['Total GTT Usage']?.unit}`
                            )
                            o_gpu_property_value.o_number_value_max = f_o_number_value__from_s_input(
                                `${o_gpunvidiaoramd?.VRAM?.['Total GTT']?.value} ${o_gpunvidiaoramd?.VRAM?.['Total GTT']?.unit}`
                            )
                            o_gpu_property_value.n_nor = o_gpu_property_value.o_number_value.n / o_gpu_property_value.o_number_value_max.n; 
                        }
                    }
                    // o_gpu_property__gpu_name,
                    // o_gpu_property__gpu_utilization,
                    // o_gpu_property__temperature,
                    // o_gpu_property__power_draw,
                    // o_gpu_property__memory_info,
                    // o_gpu_property__pci_address,

                    return o_gpu_property_value
                }
            )

            let o_gpu_info = new O_gpu_info(
                a_o_gpu_property_value.find(
                    o=>o.o_gpu_property.s_name == o_gpu_property__pci_address.s_name
                )?.s_val,
                a_o_gpu_property_value.find(
                    o=>o.o_gpu_property.s_name == o_gpu_property__gpu_name.s_name
                )?.s_val,
                a_o_gpu_property_value, 
                
            )
            return o_gpu_info; 
        })
        

    
        let n_ts_ms = new Date().getTime()
        let s_ymd_hms = f_s_ymd_hms__from_n_ts_ms_utc(n_ts_ms)
        let o_gpu_readout_info = new O_gpu_readout_info(
            n_ts_ms,
            s_ymd_hms,
            a_o_gpu_info,
            o_nvidia_smi_xml,
        )

        return new Response(
            JSON.stringify(o_gpu_readout_info),
            { 
                headers: {
                    'Content-type': "application/json"
                }
            }
        );
    }

    return f_v_before_return_response__fileserver(
        o_request,
        `${s_path_abs_folder_current}/localhost/`
    )

}

let s_name_host = Deno.hostname(); // or maybe some ip adress 112.35.8.13
let b_development = s_name_host != 'the_server_name_here';
let s_name_host2 = (b_development) ? 'localhost': s_name_host;
// let o_info_certificates = {
//     s_path_certificate_file: './self_signed_cert_0628a90e-0163-400d-bee6-e31e990e9197.crt',
//     s_path_key_file: './self_signed_key_0628a90e-0163-400d-bee6-e31e990e9197.key'
// }
await f_websersocket_serve(
    [
        {
            n_port: 8080,
            b_https: false,
            s_hostname: s_name_host,
            f_v_before_return_response: f_handler
        },
        ...[
            (!b_deno_deploy) ? {
                // ...o_info_certificates,
                n_port: 8443,
                b_https: true,
                s_hostname: s_name_host,
                f_v_before_return_response: f_handler
            } : false
        ].filter(v=>v)   
    ]
);