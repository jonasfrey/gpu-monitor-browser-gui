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
        s_name_brand_model_gpu,
        a_o_gpu_property_value,
        o_gpu_xml_info,
    ){
        this.s_name_brand_model_gpu = s_name_brand_model_gpu
        this.a_o_gpu_property_value = a_o_gpu_property_value
        this.o_gpu_xml_info = o_gpu_xml_info
    }
}
class O_gpu_property{
    constructor(
        s_property_accessor_nvidia_smi, 
        s_title, 
        s_description,

    ){
        this.s_property_accessor_nvidia_smi = s_property_accessor_nvidia_smi, 
        this.s_title = s_title, 
        this.s_description = s_description
    }
}
class O_gpu_property_value{
    constructor(
        o_gpu_property,
        s_value, 
        o_number_value, 
        n_nor, 
        o_number_value_max, 
        o_number_value_min, 
    ){
        this.o_gpu_property = o_gpu_property
        this.s_value = s_value,
        this.o_number_value = o_number_value,
        this.n_nor = n_nor, 
        this.o_number_value_max = o_number_value_max, 
        this.o_number_value_min = o_number_value_min 
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
        s_name_brand_model_gpu,
        s_id_gpu, 
        n_min_backview, 
        n_sec_interval,
        n_tickinterval,
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
        this.s_name_brand_model_gpu = s_name_brand_model_gpu
        this.s_id_gpu = s_id_gpu
        this.n_tickinterval = n_tickinterval
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
    O_threshhold
}