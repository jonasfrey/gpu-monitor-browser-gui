import { 
    O_gpu_property,
    O_gpu_property_value,
    O_graph_type
 } from "./classes.module.js"


let o_gpu_property__fb_memory_usage_reserved = new O_gpu_property(
    'fb_memory_usage.reserved', 
    'Frame Buffer Memory Reserved', 
    'How much memory is reserved for the frame buffer. This memory is allocated but not necessarily used for immediate rendering.'
);
let o_gpu_property__fb_memory_usage_used = new O_gpu_property(
    'fb_memory_usage.used', 
    'Frame Buffer Memory Used', 
    'The amount of frame buffer memory actively being used by the GPU for rendering tasks and operations.'
);

let o_gpu_property__fb_memory_usage_free = new O_gpu_property(
    'fb_memory_usage.free', 
    'Frame Buffer Memory Free', 
    'The available frame buffer memory that can be allocated for future rendering operations.'
);

let o_gpu_property__bar1_memory_usage_used = new O_gpu_property(
    'bar1_memory_usage.used', 
    'BAR1 Memory Used', 
    'The amount of memory used by BAR1, which is used for communication between the CPU and GPU. It maps parts of GPU memory for CPU access.'
);

let o_gpu_property__bar1_memory_usage_free = new O_gpu_property(
    'bar1_memory_usage.free', 
    'BAR1 Memory Free', 
    'The available BAR1 memory that the CPU can map and use for communication with the GPU.'
);

let o_gpu_property__cc_protected_memory_usage_used = new O_gpu_property(
    'cc_protected_memory_usage.used', 
    'CC Protected Memory Used', 
    'The amount of memory used for protected content, which is secured by Content and Context Protection (CCP).'
);

let o_gpu_property__cc_protected_memory_usage_free = new O_gpu_property(
    'cc_protected_memory_usage.free', 
    'CC Protected Memory Free', 
    'The available memory for protected content secured under Content and Context Protection (CCP).'
);

let o_gpu_property__utilization_gpu_util = new O_gpu_property(
    'utilization.gpu_util', 
    'GPU Utilization', 
    'The percentage of GPU utilization, showing how much of the GPU’s processing power is currently in use.'
);

let o_gpu_property__utilization_memory_util = new O_gpu_property(
    'utilization.memory_util', 
    'Memory Utilization', 
    'The percentage of memory utilization, showing how much of the GPU’s memory is currently in use.'
);

let o_gpu_property__utilization_encoder_util = new O_gpu_property(
    'utilization.encoder_util', 
    'Encoder Utilization', 
    'The percentage of utilization for the GPU’s video encoder, showing how much of the encoder’s resources are being used.'
);

let o_gpu_property__utilization_decoder_util = new O_gpu_property(
    'utilization.decoder_util', 
    'Decoder Utilization', 
    'The percentage of utilization for the GPU’s video decoder, showing how much of the decoder’s resources are being used.'
);

let o_gpu_property__utilization_jpeg_util = new O_gpu_property(
    'utilization.jpeg_util', 
    'JPEG Decoder Utilization', 
    'The percentage of utilization for the GPU’s JPEG decoding engine, showing how much of the JPEG decoder’s resources are being used.'
);

let o_gpu_property__utilization_ofa_util = new O_gpu_property(
    'utilization.ofa_util', 
    'Optical Flow Accelerator Utilization', 
    'The percentage of utilization for the GPU’s Optical Flow Accelerator (OFA), which is used for motion estimation and similar tasks.'
);

let o_gpu_property__temperature_gpu_temp = new O_gpu_property(
    'temperature.gpu_temp', 
    'GPU Temperature', 
    'The current temperature of the GPU in degrees Celsius.'
);

let o_gpu_property__temperature_gpu_temp_max_threshold = new O_gpu_property(
    'temperature.gpu_temp_max_threshold', 
    'Max GPU Temperature Threshold', 
    'The maximum safe operating temperature for the GPU, beyond which it may throttle or shut down to prevent damage.'
);

let o_gpu_property__temperature_gpu_temp_slow_threshold = new O_gpu_property(
    'temperature.gpu_temp_slow_threshold', 
    'GPU Slowdown Temperature Threshold', 
    'The temperature at which the GPU will start to reduce its clock speeds (throttle) to prevent overheating.'
);

let o_gpu_property__temperature_gpu_temp_max_gpu_threshold = new O_gpu_property(
    'temperature.gpu_temp_max_gpu_threshold', 
    'Max GPU Temperature', 
    'The highest temperature the GPU has reached during operation.'
);

let o_gpu_property__gpu_power_readings_power_draw = new O_gpu_property(
    'gpu_power_readings.power_draw', 
    'GPU Power Draw', 
    'The current power consumption of the GPU in watts.'
);

let o_gpu_property__gpu_power_readings_current_power_limit = new O_gpu_property(
    'gpu_power_readings.current_power_limit', 
    'Current Power Limit', 
    'The current power limit set for the GPU, which can be dynamically adjusted based on workload or system configuration.'
);

let o_gpu_property__gpu_power_readings_requested_power_limit = new O_gpu_property(
    'gpu_power_readings.requested_power_limit', 
    'Requested Power Limit', 
    'The power limit requested by the system or software for the GPU.'
);

let o_gpu_property__gpu_power_readings_default_power_limit = new O_gpu_property(
    'gpu_power_readings.default_power_limit', 
    'Default Power Limit', 
    'The default power limit set by the manufacturer for the GPU.'
);

let o_gpu_property__gpu_power_readings_min_power_limit = new O_gpu_property(
    'gpu_power_readings.min_power_limit', 
    'Minimum Power Limit', 
    'The minimum power limit the GPU can operate under without shutting down or malfunctioning.'
);

let o_gpu_property__gpu_power_readings_max_power_limit = new O_gpu_property(
    'gpu_power_readings.max_power_limit', 
    'Maximum Power Limit', 
    'The maximum power limit the GPU can draw without exceeding safety limits.'
);

let o_gpu_property__clocks_graphics_clock = new O_gpu_property(
    'clocks.graphics_clock', 
    'Graphics Clock Speed', 
    'The current clock speed of the GPU’s graphics core, measured in MHz.'
);

let o_gpu_property__clocks_sm_clock = new O_gpu_property(
    'clocks.sm_clock', 
    'SM Clock Speed', 
    'The clock speed of the GPU’s streaming multiprocessor (SM), which handles parallel workloads.'
);

let o_gpu_property__clocks_mem_clock = new O_gpu_property(
    'clocks.mem_clock', 
    'Memory Clock Speed', 
    'The current clock speed of the GPU’s memory, measured in MHz.'
);
let o_gpu_property__clocks_video_clock = new O_gpu_property(
    'clocks.video_clock', 
    'Video Clock Speed', // title
    'The clock speed of the GPU’s video processing engine, measured in MHz. This controls the rate at which the video processing hardware operates.' // description
);
let o_gpu_property__product_name = new O_gpu_property(
    'product_name', 
    'Product Name', // title
    'The official name of the GPU, identifying its model and variant.' // description
);

let o_gpu_property__product_brand = new O_gpu_property(
    'product_brand', 
    'Product Brand', // title
    'The brand under which the GPU is marketed, such as NVIDIA GeForce or AMD Radeon.' // description
);

let o_gpu_property__product_architecture = new O_gpu_property(
    'product_architecture', 
    'Product Architecture', // title
    'The underlying architecture of the GPU, representing its generation and core technology, such as Ampere, RDNA, or Turing.' // description
);

let o_gpu_property__vbios_version = new O_gpu_property(
    'vbios_version', 
    'VBIOS Version', // title
    'The version of the Video BIOS (VBIOS) running on the GPU, which controls low-level operations and configurations.' // description
);

let o_gpu_property__display_mode = new O_gpu_property(
    'display_mode', 
    'Display Mode', // title
    'The current display mode, indicating whether the GPU is rendering content on connected displays (active) or not (idle).' // description
);

let o_gpu_property__display_active = new O_gpu_property(
    'display_active', 
    'Display Active', // title
    'Indicates whether the GPU is actively connected to and driving a display.' // description
);

let o_gpu_property__persistence_mode = new O_gpu_property(
    'persistence_mode', 
    'Persistence Mode', // title
    'Indicates whether the GPU is in persistence mode, which keeps the GPU driver loaded even when no applications are using the GPU.' // description
);

let o_gpu_property__addressing_mode = new O_gpu_property(
    'addressing_mode', 
    'Addressing Mode', // title
    'The memory addressing mode used by the GPU, which determines how the GPU accesses its memory.' // description
);

let o_gpu_property__accounting_mode = new O_gpu_property(
    'accounting_mode', 
    'Accounting Mode', // title
    'Indicates whether the GPU’s resource usage accounting mode is enabled, tracking the consumption of GPU resources for processes.' // description
);

let o_gpu_property__accounting_mode_buffer_size = new O_gpu_property(
    'accounting_mode_buffer_size', 
    'Accounting Mode Buffer Size', // title
    'The buffer size allocated for tracking and storing GPU resource usage information when accounting mode is enabled.' // description
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
    o_gpu_property__fb_memory_usage_reserved,
    o_gpu_property__fb_memory_usage_used,
    o_gpu_property__fb_memory_usage_free,
    o_gpu_property__bar1_memory_usage_used,
    o_gpu_property__bar1_memory_usage_free,
    o_gpu_property__cc_protected_memory_usage_used,
    o_gpu_property__cc_protected_memory_usage_free,
    o_gpu_property__utilization_gpu_util,
    o_gpu_property__utilization_memory_util,
    o_gpu_property__utilization_encoder_util,
    o_gpu_property__utilization_decoder_util,
    o_gpu_property__utilization_jpeg_util,
    o_gpu_property__utilization_ofa_util,
    o_gpu_property__temperature_gpu_temp,
    o_gpu_property__temperature_gpu_temp_max_threshold,
    o_gpu_property__temperature_gpu_temp_slow_threshold,
    o_gpu_property__temperature_gpu_temp_max_gpu_threshold,
    o_gpu_property__gpu_power_readings_power_draw,
    o_gpu_property__gpu_power_readings_current_power_limit,
    o_gpu_property__gpu_power_readings_requested_power_limit,
    o_gpu_property__gpu_power_readings_default_power_limit,
    o_gpu_property__gpu_power_readings_min_power_limit,
    o_gpu_property__gpu_power_readings_max_power_limit,
    o_gpu_property__clocks_graphics_clock,
    o_gpu_property__clocks_sm_clock,
    o_gpu_property__clocks_mem_clock,
    o_gpu_property__clocks_video_clock, 
    o_gpu_property__product_name,
    o_gpu_property__product_brand,
    o_gpu_property__product_architecture,
    o_gpu_property__vbios_version,
    o_gpu_property__display_mode,
    o_gpu_property__display_active,
    o_gpu_property__persistence_mode,
    o_gpu_property__addressing_mode,
    o_gpu_property__accounting_mode,
    o_gpu_property__accounting_mode_buffer_size
]

export {
    a_o_gpu_property,
    o_gpu_property__fb_memory_usage_reserved,
    o_gpu_property__fb_memory_usage_used,
    o_gpu_property__fb_memory_usage_free,
    o_gpu_property__bar1_memory_usage_used,
    o_gpu_property__bar1_memory_usage_free,
    o_gpu_property__cc_protected_memory_usage_used,
    o_gpu_property__cc_protected_memory_usage_free,
    o_gpu_property__utilization_gpu_util,
    o_gpu_property__utilization_memory_util,
    o_gpu_property__utilization_encoder_util,
    o_gpu_property__utilization_decoder_util,
    o_gpu_property__utilization_jpeg_util,
    o_gpu_property__utilization_ofa_util,
    o_gpu_property__temperature_gpu_temp,
    o_gpu_property__temperature_gpu_temp_max_threshold,
    o_gpu_property__temperature_gpu_temp_slow_threshold,
    o_gpu_property__temperature_gpu_temp_max_gpu_threshold,
    o_gpu_property__gpu_power_readings_power_draw,
    o_gpu_property__gpu_power_readings_current_power_limit,
    o_gpu_property__gpu_power_readings_requested_power_limit,
    o_gpu_property__gpu_power_readings_default_power_limit,
    o_gpu_property__gpu_power_readings_min_power_limit,
    o_gpu_property__gpu_power_readings_max_power_limit,
    o_gpu_property__clocks_graphics_clock,
    o_gpu_property__clocks_sm_clock,
    o_gpu_property__clocks_mem_clock,
    o_gpu_property__clocks_video_clock, 
    o_gpu_property__product_name,
    o_gpu_property__product_brand,
    o_gpu_property__product_architecture,
    o_gpu_property__vbios_version,
    o_gpu_property__display_mode,
    o_gpu_property__display_active,
    o_gpu_property__persistence_mode,
    o_gpu_property__addressing_mode,
    o_gpu_property__accounting_mode,
    o_gpu_property__accounting_mode_buffer_size,



    a_o_graph_type,
    o_graph_type__text,
    o_graph_type__gauge,
    o_graph_type__xy
}