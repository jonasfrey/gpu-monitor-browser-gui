// here only struct/object/class/model definitions should be mentioned

// for example
class O_nvidia_smi_info{
    constructor(
        s_xml_nvidia_smi_output,
        n_ts_ms,
        s_ymd_hms,
    ){
        this.s_xml_nvidia_smi_output = s_xml_nvidia_smi_output
        this.n_ts_ms = n_ts_ms
        this.s_ymd_hms = s_ymd_hms
    }
}
class O_nvidia_smi_property{
    constructor(
        s_name, 
        s_title, 
        s_description, 

    ){
        this.s_name = s_name, 
        this.s_title = s_title, 
        this.s_description = s_description
    }
}
class O_nvidia_smi_property_value{
    constructor(
        n_nor, 
        o_value_max, 
        o_value_min
    ){
        this.n_nor = n_nor, 
        this.o_value_max = o_value_max, 
        this.o_value_min = o_value_min
    }
}
class O_dataset{
    constructor(
        o_nvidia_smi_property
    ){
        this.o_nvidia_smi_property = o_nvidia_smi_property
    }
}
class O_chart{
    constructor(
        a_o_dataset
    ){
        this.a_o_dataset = a_o_dataset
    }
}
export {
    O_nvidia_smi_info, 
    O_chart, 
    O_nvidia_smi_property, 
    O_dataset, 
    O_nvidia_smi_property_value
}