// here only struct/object/class/model definitions should be mentioned

// for example
class O_gpu_readout_info{
    constructor(
        n_ts_ms,
        s_ymd_hms,
        a_o_gpu_info,
        o_nvidia_smi_xml,
    ){
        this.n_ts_ms = n_ts_ms
        this.s_ymd_hms = s_ymd_hms
        this.a_o_gpu_info = a_o_gpu_info
        this.o_nvidia_smi_xml = o_nvidia_smi_xml
    }
}
class O_gpu_info{
    constructor(
        s_pci,
        s_name_brand_model_gpu,
        a_o_gpu_property_value,
    ){
        this.s_pci = s_pci
        this.s_name_brand_model_gpu = s_name_brand_model_gpu
        this.a_o_gpu_property_value = a_o_gpu_property_value
    }
}
class O_gpu_property{
    constructor(
        s_name,  
        s_description,
    ){
        this.s_name = s_name
        this.s_description = s_description
    }
}
class O_gpu_property_value{
    constructor(
        o_gpu_property,
        s_val, 
        s_unit,
        o_number_value_max, 
        o_number_value, 
        n_nor,
        o_meta
    ){
        this.o_gpu_property = o_gpu_property
        this.s_val = s_val
        this.s_unit = s_unit
        this.o_number_value_max = o_number_value_max
        this.o_number_value = o_number_value
        this.n_nor = n_nor
        this.o_meta = o_meta
    }
}

class O_gpu_property_value_visualization{
    constructor(
        o_gpu_property, 
        s_rgba_color_interpolation, 
        s_interpolation_style
    ){
        this.o_gpu_property = o_gpu_property
        this.s_rgba_color_interpolation = s_rgba_color_interpolation
        this.s_interpolation_style = s_interpolation_style
    }
}
class O_graph{
    constructor(
        s_name_brand_model_gpu, 
        a_o_gpu_property_value_visualization, 
        n_tickinterval
    ){
        this.s_name_brand_model_gpu = s_name_brand_model_gpu 
        this.a_o_gpu_property_value_visualization = a_o_gpu_property_value_visualization 
        this.n_tickinterval = n_tickinterval
        this.o_echart = null
    }
}
class O_graph_type{
    constructor(
        s_name, 
        s_name_img, 
    ){
        this.s_name = s_name
        this.s_name_img = s_name_img
    }
}

class O_threshhold{
    constructor(
        n, 
        s_col
    ){
        this.n = n 
        this.s_col = s_col
    }
}
class O_configuration{
    constructor(
        s_name,
        a_o_window,
        b_auto_update_title,
        n_min_backview,
        n_sec_interval, 
        n_tickinterval
    ){
        this.s_name = s_name
        this.a_o_window = a_o_window
        this.b_auto_update_title = b_auto_update_title
        this.n_min_backview = n_min_backview
        this.n_sec_interval = n_sec_interval
        this.n_tickinterval = n_tickinterval
    }
}
class O_window{
    constructor(
        n_trn_x_nor,
        n_trn_y_nor, 
        n_trn_z_nor,
        n_scl_x_nor, 
        n_scl_y_nor,
        s_title, 
        o_graph_type,
        o_gpu_property,
        a_o_threshhold, 
        s_pci,
        s_name_brand_model_gpu, 
        b_use_normalized_value_percentage
    ){
        this.n_trn_x_nor = n_trn_x_nor,
        this.n_trn_y_nor = n_trn_y_nor, 
        this.n_trn_z_nor = n_trn_z_nor
        this.n_scl_x_nor = n_scl_x_nor, 
        this.n_scl_y_nor = n_scl_y_nor
        this.o_gpu_property = o_gpu_property
        this.s_title = s_title
        this.o_graph_type = o_graph_type
        this.a_o_threshhold = a_o_threshhold
        this.o_echart = null
        this.s_pci = s_pci
        this.s_name_brand_model_gpu = s_name_brand_model_gpu
        this.b_use_normalized_value_percentage = b_use_normalized_value_percentage
    }
}
export {
    O_gpu_info, 
    O_gpu_readout_info,
    O_graph, 
    O_gpu_property, 
    O_gpu_property_value,
    O_gpu_property_value_visualization,
    O_window,
    O_graph_type,
    O_threshhold, 
    O_configuration
}