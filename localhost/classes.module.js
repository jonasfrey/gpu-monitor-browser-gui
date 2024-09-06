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

class O_chart{
    constructor(){

    }
}
export {
    O_nvidia_smi_info, 
    O_chart
}