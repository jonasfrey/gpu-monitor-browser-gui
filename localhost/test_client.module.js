import {
    f_display_test_selection_or_run_selected_test_and_print_summary,
    f_o_test, 
    f_assert_equals
} from "https://deno.land/x/deno_test_server_and_client_side@1.3/mod.js"

//readme.md:start
//md: #template structure
//md: ## ./
//md: all but ./localhost inside this directory is considered server side
//md: ./localhost this is client side code
//readme.md:end

//./readme.md:start
//md: ![./logo.png](./logo.png)
//./readme.md:end

//./readme.md:start
//md: # Title of the project 0628a90e-0163-400d-bee6-e31e990e9197
//./readme.md:end

// import { stuff} from './client.module.js'

let a_o_test = [
    f_o_test(
        'assert_equals_1_eq_1', 
        async ()=>{
            //./readme.md:start
            //md: ## most simple example 
            //md: description
            f_assert_equals(1,1);
            //./readme.md:end
        }
    ),
]


f_display_test_selection_or_run_selected_test_and_print_summary(
    a_o_test
)
// //readme.md:end