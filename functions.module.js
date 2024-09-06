
let s_path_abs_file_current = new URL(import.meta.url).pathname;
let s_path_abs_folder_current = s_path_abs_file_current.split('/').slice(0, -1).join('/');

let f_o_config = async function(){
    let s_json__o_config = await Deno.readTextFile(
        `${s_path_abs_folder_current}/o_config.gitignored.json`
    );
    return JSON.parse(s_json__o_config);
}

export {
    f_o_config
}