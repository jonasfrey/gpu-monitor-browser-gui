import { 
    O_gpu_property,
    O_gpu_property_value,
    O_graph_type
 } from "./classes.module.js"




let o_gpu_property__gpu_name = new O_gpu_property(
    'GPU Name', 
    'The official name of the GPU, identifying its model and variant.'
);

let o_gpu_property__gpu_utilization = new O_gpu_property(
    'GPU Utilization', 
    'The percentage of GPU utilization, showing how much of the GPU’s processing power is currently in use.'
);

let o_gpu_property__temperature = new O_gpu_property(
    'Temperature', 
    'The current temperature of the GPU in degrees Celsius.'
);

let o_gpu_property__power_draw = new O_gpu_property(
    'Power Draw', 
    'The current power consumption of the GPU in watts.'
);

let o_gpu_property__memory_info = new O_gpu_property(
    'Memory Info', 
    [
        'Information about the total memory, used memory, and free memory of the GPU.',
        ' FB memory usage on NVIDIA and VRAM usage on AMD.'
    ].join('')
);

let o_gpu_property__memory_info_graphics_translation_table_amd_specific = new O_gpu_property(
    'Memory Info GTT (AMD only)', 
    'Information about Graphics Translation Table (GTT) memory usage, which is system memory that the AMD GPU can access.'
);

let o_gpu_property__memory_info_bar1_nvidia_specific = new O_gpu_property(
    'Memory Info BAR1 (NVIDIA)', 
    'Information about BAR1 memory usage, which is used by the NVIDIA GPU to communicate with the CPU by mapping part of its memory for CPU access.'
);

let o_gpu_property__pci_address = new O_gpu_property(
    'PCI Address', 
    'The PCI address uniquely identifying the location of the GPU on the system’s PCI bus.'
);

let o_gpu_property__memory_info_per_process_nvidia_specific = new O_gpu_property(
    'Processes memory info', 
    'How much memory each process uses'
);



let o_gpu_property__graphics_clock = new O_gpu_property(
    'Graphics Clock', 
    'The current clock speed of the GPU’s graphics core, measured in MHz. This controls the core processing power of the GPU.'
);

let o_gpu_property__sm_clock = new O_gpu_property(
    'SM Clock', 
    'The clock speed of the Streaming Multiprocessors (SM) on the GPU, which handle parallel workloads. Measured in MHz.'
);

let o_gpu_property__mem_clock = new O_gpu_property(
    'Memory Clock', 
    'The current clock speed of the GPU’s memory, measured in MHz. This influences the speed at which the GPU accesses its VRAM.'
);

let o_gpu_property__video_clock = new O_gpu_property(
    'Video Clock', 
    'The clock speed of the GPU’s video processing engine, measured in MHz. This is used for video encoding and decoding tasks.'
);



let o_graph_type__text = new O_graph_type(
    'Text information',
    './graph_text.png' 
);
let o_graph_type__gauge = new O_graph_type(
    'Gauge',
    './graph_gauge_chart.png' 
);
let o_graph_type__xy = new O_graph_type(
    'XY',
    './graph_xychart.png' 
);
let a_o_graph_type = [
    o_graph_type__text,
    o_graph_type__gauge,
    o_graph_type__xy,
]

let a_o_gpu_property = [
    o_gpu_property__gpu_name,
    o_gpu_property__gpu_utilization,
    o_gpu_property__temperature,
    o_gpu_property__power_draw,
    o_gpu_property__memory_info,
    o_gpu_property__memory_info_graphics_translation_table_amd_specific,
    o_gpu_property__memory_info_bar1_nvidia_specific,
    o_gpu_property__pci_address,
    o_gpu_property__memory_info_per_process_nvidia_specific,
    o_gpu_property__graphics_clock,
    o_gpu_property__sm_clock,
    o_gpu_property__mem_clock,
    o_gpu_property__video_clock,
]

export {
    a_o_gpu_property,
    o_gpu_property__gpu_name,
    o_gpu_property__gpu_utilization,
    o_gpu_property__temperature,
    o_gpu_property__power_draw,
    o_gpu_property__memory_info,
    o_gpu_property__memory_info_graphics_translation_table_amd_specific,
    o_gpu_property__memory_info_bar1_nvidia_specific,
    o_gpu_property__pci_address,
    o_gpu_property__memory_info_per_process_nvidia_specific,
    o_gpu_property__graphics_clock,
    o_gpu_property__sm_clock,
    o_gpu_property__mem_clock,
    o_gpu_property__video_clock,


    a_o_graph_type,
    o_graph_type__text,
    o_graph_type__gauge,
    o_graph_type__xy
}