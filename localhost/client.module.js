import {
  f_add_css,
  f_s_css_prefixed,
  o_variables,
  f_s_css_from_o_variables,
} from "https://deno.land/x/f_add_css@1.1/mod.js";

import { f_s_timestring_from_n_ms } from "https://deno.land/x/date_functions@1.4/mod.js";

import { f_o_html__and_make_renderable } from "https://deno.land/x/f_o_html_from_o_js@3.6/mod.js";

import {
  f_clear_all_notifications,
  f_clear_o_notification,
  f_o_js as f_o_js__notifier,
  f_o_throw_notification,
  s_css,
} from "https://deno.land/x/f_o_html_from_o_js@3.5/localhost/jsh_modules/notifire/mod.js";

import {
  f_o_webgl_program,
  f_delete_o_webgl_program,
  f_resize_canvas_from_o_webgl_program,
  f_render_from_o_webgl_program,
  f_o_number_value__from_s_input,
  f_a_n_nor__rgb__from_a_n_nor__hsl,
  f_swap_in_array,
} from "https://deno.land/x/handyhelpers@4.1.1/mod.js";

window.f_o_number_value__from_s_input = f_o_number_value__from_s_input;
import { f_s_hms__from_n_ts_ms_utc } from "https://deno.land/x/date_functions@1.4/mod.js";
import {
  O_graph,
  O_gpu_info,
  O_gpu_property_value_visualization,
  O_window,
  O_threshhold,
  O_gpu_readout_info,
  O_configuration,
} from "./classes.module.js";
import {
  a_o_gpu_property,
  a_o_graph_type,
  o_gpu_property__gpu_utilization,
  o_gpu_property__memory_info_per_process_nvidia_specific,
  o_graph_type__gauge,
  o_graph_type__text,
  o_graph_type__xy,
} from "./runtimedata.module.js";

let f_n_ts_sec_lt_from_s_date = function (s) {
  try {
    const dateString = s; //'28.08.2024 23:20:00';

    // Split the date and time parts
    const [datePart, timePart] = dateString.split(" ");

    // Split the date into day, month, year
    const [day, month, year] = datePart.split(".").map(Number);

    // Split the time into hours, minutes, seconds
    const [hours, minutes, seconds] = timePart.split(":").map(Number);

    // Create a Date object (months are 0-based in JS, so subtract 1 from month)
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    // Get the timestamp
    const timestamp = date.getTime();
    return timestamp;
  } catch (error) {
    return null;
  }
};

let a_o_gpu_readout_info = [
  await (async () => {
    let o = await fetch("./f_o_gpu_readout_info");
    if (!o.ok) {
      let s = await o.text();
      console.error(s);
      alert(s);
    }
    let o_data = await o.json();
    return o_data;
  })(),
];

let o_window__default = new O_window(
  0.1,
  0.1,
  0,
  0.1,
  0.1,
  o_gpu_property__gpu_utilization.s_name,
  o_graph_type__gauge,
  o_gpu_property__gpu_utilization,
  [
    new O_threshhold(0.5, "#00ff00"),
    new O_threshhold(0.9, "#EBBA38"),
    new O_threshhold(1.0, "#EA2815"),
  ],
  a_o_gpu_readout_info[0].a_o_gpu_info[0].s_pci,
  a_o_gpu_readout_info[0].a_o_gpu_info[0].s_name_brand_model_gpu,
  true,
  false,
);
let o_configuration__default = new O_configuration(
  "New configuration",
  [o_window__default],
  true,
  1,
  1,
  10,
);

// set the current gpu for the default configuration object
for (let o of o_configuration__default.a_o_window) {
  o.s_name_brand_model_gpu = a_o_gpu_readout_info
    .at(-1)
    .a_o_gpu_info.at(-1).s_name_brand_model_gpu;
  o.s_pci = a_o_gpu_readout_info.at(-1).a_o_gpu_info.at(-1).s_pci;
}

let a_o_configuration = await (await fetch("./f_a_o_configuration")).json();
console.log(a_o_configuration);
if (
  !a_o_configuration.find((o) => o.s_name == o_configuration__default.s_name)
) {
  a_o_configuration.push(o_configuration__default);
}

let o_state = {
  o_overlay: {
    b_render: false,
    a_o: [],
    s_style: "",
  },
  a_o_configuration,
  o_configuration: null,
  b_render_global_settings: false,
  s_searchterm_tmp: "",
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
  a_o_window: [],
  a_o_gpu_property,
  b_nvidia_smi_installed: await (
    await fetch("./f_b_nvidia_smi_installed")
  ).json(),
  s_name_gpu: "",
  o_gpu_info: null,
  a_o_gpu_readout_info,
  a_o_dataset: [],
  n_id_interval: 0,
  a_o_graph: [],
  o_state__notifier: {},
};

o_state.o_configuration = o_state.a_o_configuration[0];

let f_update_e_chart = function (o_echart) {
  console.log(o_echart);
  let o_window = o_state.o_configuration.a_o_window.find((o_window, n_idx) => {
    return o_window.o_echart == o_echart;
  });
  let n_idx = o_state.o_configuration.a_o_window.indexOf(o_window);
  if (n_idx > -1) {
    let o_el = Array.from(document.querySelectorAll("canvas"))[n_idx];

    if (!o_el?.parentElement) {
      return;
    }
    // Get the parent element's dimensions (but use offsetWidth/offsetHeight for rendering)
    let o = o_el.parentElement;
    let canvasWidth = o?.offsetWidth;
    let canvasHeight = o?.offsetHeight;
    let n_min = Math.min(canvasWidth, canvasHeight);
    // Set the canvas internal resolution (drawing pixels)
    o_el.width = canvasWidth;
    o_el.height = canvasHeight;
    o_el.style.width = canvasWidth + "px";
    o_el.style.height = canvasHeight + "px";
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
    o_window.o_echart.resize();
  }
};
let f_update_all_echarts = function () {
  for (let o of o_state.o_configuration.a_o_window) {
    f_update_e_chart(o.o_echart);
  }
};
window.onresize = function () {
  f_update_all_echarts();
};
let f_update_interval = async function () {
  return new Promise((f_res, f_rej) => {
    clearInterval(o_state.n_id_interval);
    o_state.n_id_interval = window.setInterval(async function () {
      console.log("interval");
      let n_datapoints_x =
        (o_state.o_configuration.n_min_backview * 60) /
        o_state.o_configuration.n_sec_interval;
      let o = await fetch("./f_o_gpu_readout_info");
      if (!o.ok) {
        await f_o_throw_notification(
          o_state.o_state__notifier,
          await o.text(),
          "error",
        );
      }
      let o_data = await o.json();

      o_state.a_o_gpu_readout_info.push(o_data);

      let a_o_el = Array.from(document.querySelectorAll("canvas"));
      // console.log(a_o_el)
      // console.log(a_o_el)
      // check if there are new graphs

      for (let n_idx in o_state.o_configuration.a_o_window) {
        let o_window = o_state.o_configuration.a_o_window[n_idx];
        let o_div = a_o_el[n_idx];

        let n_remaining = parseInt(
          Math.max(n_datapoints_x - o_state.a_o_gpu_readout_info.length, 0),
        );
        // console.log(n_remaining)
        let a_o_gpu_readout_info = [
          ...new Array(n_remaining).fill(0).map((o) => {
            return o_state.a_o_gpu_readout_info[0];
          }),
          ...o_state.a_o_gpu_readout_info.slice(
            Math.max(o_state.a_o_gpu_readout_info.length - n_datapoints_x, 0),
          ),
        ];

        let o_gpu_info = o_state.a_o_gpu_readout_info
          .at(-1)
          .a_o_gpu_info.find((o_gpu_info) => {
            return (
              o_gpu_info.s_name_brand_model_gpu ==
              o_window.s_name_brand_model_gpu
            );
          });
        // console.log(o_gpu_info)
        o_window.o_gpu_property_value_last =
          o_gpu_info.a_o_gpu_property_value.find((o) => {
            return o.o_gpu_property.s_name == o_window.o_gpu_property.s_name;
          });
        // console.log(o_gpu_property_value_last)
        let n_value_gauge;
        let s_formatter;
        let s_y_axis_name;
        let n_y_min;
        let n_y_max;
        if (
          o_window.o_gpu_property_value_last.n_nor != undefined &&
          o_window.b_use_normalized_value_percentage
        ) {
          n_value_gauge = o_window.o_gpu_property_value_last.n_nor * 100;
          s_formatter = "{value} %";
          n_y_min = 0;
          n_y_max = 100;
          s_y_axis_name = "%";
        } else {
          n_value_gauge = o_window.o_gpu_property_value_last?.o_number_value?.n;
          s_formatter = `{value} ${o_window.o_gpu_property_value_last?.o_number_value?.s_name_base_unit}`;
          n_y_min = 0;
          n_y_max = o_window.o_gpu_property_value_last?.o_number_value_max?.n;
          s_y_axis_name = o_window.o_gpu_property_value_last?.s_val;
        }
        n_value_gauge = parseInt(n_value_gauge);

        if (!o_window.o_echart) {
          console.log(o_div);
          o_window.o_echart = echarts.init(o_div);

          var option = {
            backgroundColor: "#1e1e1e", // Set the background to dark
          };

          // Set the initial option to the chart
          o_window.o_echart.setOption(option);
          o_window.o_echart.resize();
        } else {
          let o_el = o_window.o_echart._dom;
          let n_scl_x = o_el?.clientWidth;
          let n_scl_y = o_el?.clientHeight;
          let n_scl_min = Math.min(n_scl_x, n_scl_y);
          console.log(n_scl_min);

          if (o_window.o_graph_type.s_name == o_graph_type__gauge.s_name) {
            let a_o_threshhold = o_window.a_o_threshhold;
            // let a_o_threshhold = [
            //     {n: 0.3, s_col: 'green'},
            //     {n: 0.6, s_col: 'orange'},
            //     {n: 1.0, s_col: 'red'},
            //     ]

            // console.log(n_scl_x)
            let n_thick_nor = 0.33;
            let n_thick_nor2 = 0.3;
            let n_thick_nor3 = 0.27;
            let n_title_nor = 0.1;
            let n_value_gauge_min = n_y_min; //0;
            let n_value_gauge_max = n_y_max; //180.;
            let n_value_gauge_range = n_value_gauge_max - n_value_gauge_min;
            let n_value_gauge_nor =
              (n_value_gauge - n_value_gauge_min) / n_value_gauge_range;
            a_o_threshhold = a_o_threshhold.sort((o1, o2) => {
              return o2.n - o1.n;
            });
            let s_col_gauge_level = "black";
            for (let o_threshhold of a_o_threshhold) {
              if (n_value_gauge_nor < o_threshhold.n) {
                s_col_gauge_level = o_threshhold.s_col;
              }
            }
            let s_col_titile = "grey";
            let o_center = { center: ["50%", "60%"] };
            console.log(s_col_gauge_level);
            let n_font_nor = 0.1;
            let s_col_bg = "#1e1e1e";
            let s_col_border = "#1e1e1e";
            let o_option = {
              series: [
                {
                  ...o_center,
                  type: "gauge",
                  startAngle: 200,
                  endAngle: -20,
                  min: n_value_gauge_min,
                  max: n_value_gauge_max,
                  splitNumber: 1, // how many label numbers shown
                  itemStyle: { color: s_col_gauge_level },
                  progress: {
                    show: true,
                    color: s_col_gauge_level,
                    width: n_scl_min * 0.5 * n_thick_nor3,
                  },
                  pointer: { show: false },
                  axisLine: { show: false },
                  axisLabel: { show: false },
                  anchor: { show: false },
                  title: {
                    show: true,
                    color: s_col_titile,
                    fontSize: n_scl_min * 0.5 * n_title_nor,
                  },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  detail: {
                    valueAnimation: true,
                    width: "10%",
                    lineHeight: 20,
                    borderRadius: 20,
                    // offsetCenter: [0, '-15%'],
                    fontSize: n_scl_min * 0.5 * n_font_nor,
                    formatter: s_formatter,
                    color: "inherit",
                  },
                  data: [{ value: n_value_gauge, name: o_window.s_title }],
                },

                {
                  ...o_center,

                  type: "gauge",
                  startAngle: 200,
                  endAngle: -20,
                  min: n_value_gauge_min,
                  max: n_value_gauge_max,
                  itemStyle: { show: false },
                  progress: { show: false },
                  pointer: { show: false },
                  axisLine: {
                    lineStyle: {
                      width: n_scl_min * 0.5 * n_thick_nor,
                      color: [
                        ...a_o_threshhold.reverse().map((o) => {
                          return [o.n, o.s_col];
                        }),
                      ],
                    },
                  },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  detail: { show: false },
                  data: [],
                },

                {
                  ...o_center,

                  type: "gauge",
                  startAngle: 200,
                  endAngle: -20,
                  min: n_value_gauge_min,
                  max: n_value_gauge_max,
                  itemStyle: { show: false },
                  progress: { show: false },
                  pointer: { show: false },
                  axisLine: {
                    lineStyle: {
                      width: n_scl_min * 0.5 * n_thick_nor2,
                      color: [[1, s_col_border]],
                    },
                  },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  detail: { show: false },
                  data: [],
                },

                {
                  ...o_center,

                  type: "gauge",
                  startAngle: 200,
                  endAngle: -20,
                  min: n_value_gauge_min,
                  max: n_value_gauge_max,
                  itemStyle: { show: false },
                  progress: { show: false },
                  pointer: { show: false },
                  axisLine: {
                    lineStyle: {
                      width: n_scl_min * 0.5 * n_thick_nor3,
                      color: [[1, s_col_bg]],
                    },
                  },
                  axisTick: { show: false },
                  splitLine: { show: false },
                  axisLabel: { show: false },
                  detail: { show: false },
                  data: [],
                },
              ],
            };

            o_window.o_echart.setOption(o_option);
          }
          let o_legend = {};
          let n_ts_ms_now = new Date().getTime();

          if (o_window.o_graph_type.s_name == o_graph_type__xy.s_name) {
            let o_legend = {
              data: [o_window.o_gpu_property.s_name],
            };
            let a_o_xy = a_o_gpu_readout_info.map(
              (o_gpu_readout_info, n_idx) => {
                // console.log(o_gpu_readout_info.a_o_gpu_info)
                let o_gpu_info = o_gpu_readout_info.a_o_gpu_info.find(
                  (o_gpu_info) => {
                    return (
                      o_gpu_info.s_name_brand_model_gpu ==
                        o_window.s_name_brand_model_gpu &&
                      o_gpu_info.s_id_gpu == o_window.s_id_gpu
                    );
                  },
                );
                // console.log(o_gpu_info)
                let o_gpu_property_value =
                  o_gpu_info.a_o_gpu_property_value.find(
                    (o_gpu_property_value) => {
                      return (
                        o_gpu_property_value.o_gpu_property.s_name ==
                        o_window.o_gpu_property.s_name
                      );
                    },
                  );
                let n_value_y = 0;
                if (
                  o_gpu_property_value.n_nor != undefined &&
                  o_window.b_use_normalized_value_percentage
                ) {
                  n_value_y = o_gpu_property_value.n_nor * 100;
                } else {
                  n_value_y = o_gpu_property_value.o_number_value.n;
                }

                // console.log(a_o_gpu_readout_info)
                n_idx = parseInt(n_idx);
                let n_ms_diff =
                  Math.floor(
                    parseInt(o_gpu_readout_info.n_ts_ms - n_ts_ms_now) / 100,
                  ) * 100;
                // console.log(n_ms_diff);
                let s_timestring =
                  `-` + f_s_timestring_from_n_ms(Math.abs(n_ms_diff));
                // return s_timestring

                return { n_y: n_value_y, n_x: s_timestring };
              },
            );
            let a_o_serie = [
              {
                data: a_o_xy.map((o) => o.n_y),
                // data: [...new Array(10).fill(0).map(()=>{return Math.random()*100})],
                showSymbol: false,
                color: "rgba(0,255,0,0.5)",
                type: "line",
                areaStyle: {
                  //' background color'/ fill color below line
                  color: "rgba(0,255,0)",
                  opacity: 0.3,
                },
                lineStyle: {
                  width: 1, //px
                },
                name: o_window.o_gpu_property.s_name,
              },
            ];
            if (
              o_window.o_gpu_property.s_name ==
              o_gpu_property__memory_info_per_process_nvidia_specific.s_name
            ) {
              n_y_min = 0;
              n_y_max = 50;
              let f_s_name_from_o_gpu_property_value_per_process = function (
                o,
              ) {
                let s = o.o_meta.process_name.split(" ").shift();
                let a_s_part = s.split("/");
                return `${a_s_part.length > 1 ? "..." : ""}${a_s_part.at(-1)} ${parseInt(o.n_nor * 100)}%`;
              };
              let a_o_gpu_property_value_per_process =
                o_state.a_o_gpu_readout_info
                  .at(-1)
                  .a_o_gpu_info.find((o_gpu_info) => {
                    return (
                      o_gpu_info.s_name_brand_model_gpu ==
                        o_window.s_name_brand_model_gpu &&
                      o_gpu_info.s_id_gpu == o_window.s_id_gpu
                    );
                  })
                  .a_o_gpu_property_value.filter((o) => {
                    return (
                      o.o_gpu_property.s_name ==
                      o_gpu_property__memory_info_per_process_nvidia_specific.s_name
                    );
                  });
              o_legend = {
                data: [
                  ...a_o_gpu_property_value_per_process.map((o) =>
                    f_s_name_from_o_gpu_property_value_per_process(o),
                  ),
                ],
                textStyle: {
                  color: "#FFFFFF", // Set legend text color to white
                  // You can also set fontSize, fontFamily, etc., if needed
                  // fontSize: 14,
                  // fontFamily: 'Arial',
                },
                // Optional: Adjust legend position or orientation
                orient: "vertical",
                // left: 'center',
                // top: 'top',
              };
              a_o_serie = [
                ...a_o_gpu_property_value_per_process.map(
                  (o_gpu_property_value_per_process, n_idx) => {
                    n_idx = parseInt(n_idx);
                    let n_idx_nor =
                      n_idx / a_o_gpu_property_value_per_process.length;
                    let a_n_nor_rgb = f_a_n_nor__rgb__from_a_n_nor__hsl(
                      n_idx_nor,
                      0.5,
                      0.5,
                    );
                    let s_col = `rgba(${parseInt(a_n_nor_rgb[0] * 255)},${parseInt(a_n_nor_rgb[1] * 255)},${parseInt(a_n_nor_rgb[2] * 255)},1)`;

                    return {
                      data: o_state.a_o_gpu_readout_info.map(
                        (o_gpu_readout_info) => {
                          let o_gpu_info = o_gpu_readout_info.a_o_gpu_info.find(
                            (o_gpu_info) => {
                              return (
                                o_gpu_info.s_name_brand_model_gpu ==
                                  o_window.s_name_brand_model_gpu &&
                                o_gpu_info.s_id_gpu == o_window.s_id_gpu
                              );
                            },
                          );
                          let o_gpu_property_value_per_process2 =
                            o_gpu_info.a_o_gpu_property_value.find((o2) => {
                              return (
                                o2?.o_meta?.pid ==
                                o_gpu_property_value_per_process?.o_meta?.pid
                              );
                            });

                          if (!o_gpu_property_value_per_process2) {
                            return 0; // process may have been started and maybe did not exist yet, so cannot be found in earlier data
                          }
                          let n_value_y = 0;
                          if (
                            o_gpu_property_value_per_process2.n_nor !=
                              undefined &&
                            o_window.b_use_normalized_value_percentage
                          ) {
                            n_value_y =
                              o_gpu_property_value_per_process2.n_nor * 100;
                          } else {
                            n_value_y =
                              o_gpu_property_value_per_process2.o_number_value
                                .n;
                          }
                          console.log({
                            n_value_y,
                            process_name:
                              o_gpu_property_value_per_process2.o_meta
                                .process_name,
                          });
                          return n_value_y;
                        },
                      ),
                      name: f_s_name_from_o_gpu_property_value_per_process(
                        o_gpu_property_value_per_process,
                      ),
                      // data: [...new Array(10).fill(0).map(()=>{return Math.random()*100})],
                      showSymbol: false,
                      color: s_col,
                      // color: 'red',
                      type: "line",
                      areaStyle: {
                        //' background color'/ fill color below line
                        // color: 'red',
                        color: s_col,
                        opacity: 0.3,
                      },
                      lineStyle: {
                        width: 1, //px
                      },
                    };
                  },
                ),
              ];
            }
            let o_option = {
              legend: o_legend,
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: a_o_xy.map((o) => o.n_x),
              },
              yAxis: {
                type: "value",
                min: n_y_min,
                max: n_y_max,
                interval: parseInt((n_y_max - n_y_min) / 4), //y axis 25%, 50%, 75%, 100%
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#ccc",
                    width: 1, //px //Math.sqrt(n_scl_min)*0.1
                  },
                },
                axisLabel: {
                  formatter: s_formatter,
                },
              },
              series: a_o_serie,
              // animation: false,
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
                formatter: "{a}: {c}%", // This adds the formatting to show the percentage
              },
            };
            console.log(o_option);
            o_window.o_echart.setOption(o_option);

            // o_window.o_echart.setOption({
            //     backgroundColor: '#1e1e1e', // Set the background to dark
            //     title: {
            //         text: '',
            //         textStyle: {
            //             color: '#ffffff' // White title text for better contrast
            //         }
            //     },
            //     tooltip: {
            //         trigger: 'axis',
            //         backgroundColor: '#333', // Dark background for tooltips
            //         textStyle: {
            //             color: '#ffffff' // White tooltip text
            //         }
            //     },
            //     grid: {
            //         top: 40,     // Adjust top padding
            //         left: 40,    // Adjust left padding
            //         right: 40,   // Adjust right padding
            //         bottom: 40   // Adjust bottom padding
            //     },
            //     xAxis: {
            //         interval: o_state.o_configuration.n_tickinterval,
            //         type: 'category',
            //         boundaryGap: false,
            //         data: [],
            //         axisLabel: {
            //             color: '#ffffff',  // Optional: Set text color for the labels
            //             fontSize: 9,      // Optional: Set font size
            //             // rotate: 45         // Optional: Rotate labels (if needed)
            //         },
            //         axisLine: {
            //             lineStyle: {
            //                 color: '#ffffff' // White axis line
            //             }
            //         },
            //         splitLine: {
            //             show: false // Disable grid lines if not necessary
            //         }
            //     },
            //     yAxis: {
            //         name: s_y_axis_name,
            //         type: 'value',
            //         min: n_y_min,
            //         max: n_y_max,
            //         axisLine: {
            //             lineStyle: {
            //                 color: '#ffffff' // White axis line
            //             }
            //         },
            //         axisLabel: {
            //             color: '#ffffff' // White axis labels
            //         },
            //         splitLine: {
            //             lineStyle: {
            //                 color: '#444' // Darker color for grid lines to blend with background
            //             }
            //         }
            //     },
            //     animation: false, // Disable all animations globally,
            //     series: [
            //         (()=>{
            //             let o_gpu_property = o_window.o_gpu_property;
            //             // o_window.a_o_gpu_property.map(
            //                 // o_gpu_property => {
            //                     // console.log(o_gpu_property_value_visualization)
            //                     // console.log(a_o_gpu_readout_info)
            //                     let a_n_y = a_o_gpu_readout_info.map(
            //                         o_gpu_readout_info=>{
            //                             // console.log(o_gpu_readout_info.a_o_gpu_info)
            //                             let o_gpu_info = o_gpu_readout_info.a_o_gpu_info.find(
            //                                 o_gpu_info=>{
            //                                     return o_gpu_info.s_name_brand_model_gpu == o_window.s_name_brand_model_gpu
            //                                     && o_gpu_info.s_id_gpu == o_window.s_id_gpu
            //                                 }
            //                             );
            //                             // console.log(o_gpu_info)
            //                             let o_gpu_property_value = o_gpu_info.a_o_gpu_property_value.find(o=>{
            //                                 return o.o_gpu_property.s_name == o_gpu_property.s_name
            //                             });
            //                             // console.log(o_gpu_property_value)
            //                             let n_nor = (o_gpu_property_value.n_nor != undefined) ? o_gpu_property_value.n_nor : o_gpu_property_value.o_number_value.n;

            //                             return n_nor;
            //                         }
            //                     );
            //                     // console.log(a_n_y)
            //                     return {
            //                         name: o_gpu_property.s_name,
            //                         type: 'line',
            //                         data: a_n_y,
            //                         // new Array(100).fill(0).map(n=>Math.random())  // Update series data,
            //                         lineStyle: {
            //                             color: 'red'
            //                         }
            //                     }
            //                 // }
            //             // )
            //         })()

            //     ]

            // })
          }
        }
      }
      return f_res(true);
    }, o_state.o_configuration.n_sec_interval * 1000);
  });
};

window.o_state = o_state;

o_variables.n_rem_font_size_base = 0.78; // adjust font size, other variables can also be adapted before adding the css to the dom
o_variables.n_rem_padding_interactive_elements = 0.5; // adjust padding for interactive elements
f_add_css(
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
);
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
    canvas{
        position: absolute;
        width:100%;
        height:100%;
        top:0;
        left:0;
        z-index:-1;
    }


    ${f_s_css_from_o_variables(o_variables)}
    `,
);

let f_o_assigned = function (s_name, v, o_to_assign_to = o_state) {
  let o = {};
  if (typeof v.f_o_jsh == "function") {
    o = v;
  } else {
    if (typeof v == "function") {
      o.f_o_jsh = v;
    } else {
      o.f_o_jsh = function () {
        return v;
      };
    }
  }
  return Object.assign(o_to_assign_to, {
    [s_name]: o,
  })[s_name];
};

// Determine the current domain
const s_hostname = window.location.hostname;

// Create the WebSocket URL, assuming ws for http and wss for https
const s_protocol_ws = window.location.protocol === "https:" ? "wss:" : "ws:";
const s_url_ws = `${s_protocol_ws}//${s_hostname}:${window.location.port}`;

// Create a new WebSocket instance
const o_ws = new WebSocket(s_url_ws);

// Set up event listeners for your WebSocket
o_ws.onopen = function (o_e) {
  console.log({
    o_e,
    s: "o_ws.onopen called",
  });
};

o_ws.onerror = function (o_e) {
  console.log({
    o_e,
    s: "o_ws.onerror called",
  });
};

o_ws.onmessage = function (o_e) {
  console.log({
    o_e,
    s: "o_ws.onmessage called",
  });
  o_state.a_o_msg.push(o_e.data);
  o_state?.o_js__a_o_mod?._f_render();
};
window.addEventListener("pointerdown", (o_e) => {
  o_ws.send("pointerdown on client");
});

let f_n_clamped = function (n, n_min, n_max) {
  return Math.max(Math.min(n, n_max), n_min);
};

let f_s_html_highlighted = function (s_text, s_searchterm) {
  s_searchterm = s_searchterm.trim();
  // Escape any special characters in the search term
  let s_searchterm_escaped = s_searchterm.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    "\\$&",
  );

  // Create a regex with the search term and replace matches with highlighted HTML
  let regex = new RegExp(s_searchterm_escaped, "gi");
  return s_text.replace(regex, function (match) {
    return `<span style="background-color: #64642c">${match}</span>`;
  });
};

window.onpointermove = async (o_e) => {
  if (o_state.o_window__pointerdown) {
    let n_trn_x_nor_pointer = o_e.clientX / window.innerWidth;
    let n_trn_y_nor_pointer = o_e.clientY / window.innerHeight;
    if (o_state.o_el_target_window_pointerdown.className.includes("resize")) {
      o_state.o_window__pointerdown.n_scl_x_nor = Math.abs(
        n_trn_x_nor_pointer - o_state.o_window__pointerdown.n_trn_x_nor,
      );
      o_state.o_window__pointerdown.n_scl_y_nor = Math.abs(
        n_trn_y_nor_pointer - o_state.o_window__pointerdown.n_trn_y_nor,
      );
    } else {
      o_state.o_window__pointerdown.n_trn_x_nor =
        n_trn_x_nor_pointer +
        (o_state.o_window_pointerdown_copy.n_trn_x_nor -
          o_state.n_trn_x_nor_pointerdown);
      o_state.o_window__pointerdown.n_trn_y_nor =
        n_trn_y_nor_pointer +
        (o_state.o_window_pointerdown_copy.n_trn_y_nor -
          o_state.n_trn_y_nor_pointerdown);
      // console.log(o_state.o_window__pointerdown);
    }
    // await o_state.o_window__pointerdown._f_update()
    await o_state.o_js__a_o_window._f_render();
  }
};
window.onpointerup = function () {
  o_state.o_window__pointerdown = null;
};
window.onpointerdown = async function (o_e) {
  if (
    !o_e.target.className.includes("overlay_activator") &&
    o_e.target.closest(".o_overlay") == undefined
  ) {
    o_state.o_overlay.b_render = false;
    o_state.o_js__o_overlay._f_render();
  }
};
window.onkeydown = function (o_e) {
  if (o_e.code == "Escape") {
    console.log(o_e.code);
    o_state.o_overlay.b_render = false;
    o_state.o_js__o_overlay._f_render();
  }
};

document.body.appendChild(
  await f_o_html__and_make_renderable({
    a_o: [
      f_o_js__notifier(o_state.o_state__notifier),
      {
        s_tag: "div",
        class: "b_nvidia_smi_installed",
        b_render: o_state.b_nvidia_smi_installed == false,
        innerText:
          "nvidia-smi is not installed. if you have a NVIDIA gpu, run `sudo apt install nvidia-smi` to install the programm.",
      },
      f_o_assigned("o_js__o_overlay", () => {
        return {
          class: "o_overlay",
          b_render: o_state.o_overlay.b_render == true,
          style: o_state.o_overlay.s_style,
          a_o: o_state.o_overlay.a_o,
        };
      }),
      {
        b_render: o_state.b_nvidia_smi_installed,
        a_o: [
          f_o_assigned("o_js__a_o_configuration", {
            s_tag: "select",
            onchange: async (o_e) => {
              let o_configuration = o_state.a_o_configuration.find((o) => {
                return o.s_name == o_e.target.value;
              });
              console.log(o_configuration);
              if (o_configuration) {
                o_state.o_configuration = o_configuration;
                await o_state.o_js__s_o_configuration_s_name._f_render();
                await o_state.o_js__a_o_window._f_render();
              }
            },
            a_o: [
              ...o_state.a_o_configuration.map((o) => {
                return {
                  innerText: o.s_name,
                  value: o.s_name,
                  s_tag: "option",
                };
              }),
            ],
          }),
          f_o_assigned("o_js__s_o_configuration_s_name", () => {
            console.log("asdf");
            return {
              s_tag: "input",
              value: o_state.o_configuration.s_name,
              oninput: (o_e) => {
                o_state.o_configuration.s_name = o_e.target.value;
              },
            };
          }),
          {
            s_tag: "button",
            innerText: "save or update configuration",
            onpointerdown: async () => {
              let o_resp = await fetch("./f_createorupdate_configuration", {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify(
                  Object.assign({}, o_state.o_configuration),
                  function (s_prop, value) {
                    // If the property is in the ignored list, skip it
                    if (
                      s_prop.includes("o_js__") ||
                      s_prop.includes("o_echart") ||
                      s_prop.includes("o_jsh") ||
                      s_prop.includes("f_o_jsh")
                    ) {
                      return undefined;
                    }

                    // Otherwise, return the value
                    return value;
                  },
                ),
              });
              await f_o_throw_notification(
                o_state.o_state__notifier,
                await o_resp.text(),
                !o_resp.ok ? "error" : "success",
              );
            },
          },
          {
            class: "fa-solid fa-ban",
            s_tag: "button",
            onpointerdown: async () => {
              o_state.o_configuration.a_o_window =
                o_state.o_configuration.a_o_window.filter((o) => {
                  return o != o_window;
                });
              await o_state.o_js__a_o_window._f_render();
            },
          },
          {
            class: "settings fas fa-cog",
            s_tag: "button",
            onpointerdown: async () => {
              o_state.b_render_global_settings = true;
              await o_state.o_js__global_settings._f_render();
            },
          },
          f_o_assigned("o_js__global_settings", () => {
            console.log(o_state?.b_render_global_settings);
            return {
              b_render: o_state?.b_render_global_settings,
              a_o: [
                {
                  innerText: "Global settings",
                },
                {
                  innerText: "Minutes Backview",
                },
                {
                  s_tag: "input",
                  value: o_state.o_configuration.n_min_backview,
                  min: 1,
                  max: 30,
                  step: 1,
                  type: "number",
                  oninput: async (o_e) => {
                    o_state.o_configuration.n_min_backview = parseInt(
                      o_e.target.value,
                    );
                  },
                },
                {
                  innerText: "Seconds Interval",
                },
                {
                  s_tag: "input",
                  value: o_state.o_configuration.n_sec_interval,
                  min: 0.1,
                  max: 30,
                  step: 0.1,
                  type: "number",
                  oninput: async (o_e) => {
                    o_state.o_configuration.n_sec_interval = parseFloat(
                      o_e.target.value,
                    );
                    f_update_interval();
                  },
                },
                f_o_assigned("o_js__b_auto_update_title", {
                  s_tag: "button",

                  a_o: [
                    {
                      innerText: "Auto update title",
                    },
                    {
                      class: `fa-regular fa-square${o_state.b_auto_update_title ? "-check" : ""}`,
                    },
                  ],
                  onpointerdown: async () => {
                    o_state.b_auto_update_title = !o_state.b_auto_update_title;
                    await o_state.o_js__b_auto_update_title._f_render();
                  },
                }),
                {
                  class: "fa-solid fa-xmark",
                  style: "position:absolute; right: 0; top:0",
                  s_tag: "button",
                  onpointerdown: async () => {
                    o_state.b_render_global_settings = false;
                    await o_state.o_js__global_settings._f_render();
                    await o_state.o_js__a_o_window._f_render();
                  },
                },
              ],
            };
          }),

          f_o_assigned("o_js__a_o_window", {
            f_after_f_o_html__and_make_renderable: async () => {
              f_update_all_echarts();
            },
            f_o_jsh: () => {
              return {
                a_o: o_state.o_configuration.a_o_window.map(
                  (o_window, n_idx_a_o_window) => {
                    n_idx_a_o_window = parseInt(n_idx_a_o_window);
                    return {
                      class: `clickable hovered`,
                      onpointerdown: async function (o_e) {
                        o_state.o_el_target_window_pointerdown = o_e.target;
                        o_state.o_window_pointerdown_copy = Object.assign(
                          {},
                          o_window,
                        );
                        o_state.o_window__pointerdown = o_window;
                        o_state.n_trn_x_nor_pointerdown =
                          o_e.clientX / window.innerWidth;
                        o_state.n_trn_y_nor_pointerdown =
                          o_e.clientY / window.innerHeight;
                        let o_window__last =
                          o_state.o_configuration.a_o_window.at(-1);
                        if (o_window__last != o_window) {
                          // this will move the window on top, since its z-index is also the index in array
                          let n_idx1 =
                            o_state.o_configuration.a_o_window.indexOf(
                              o_window,
                            );
                          let n_idx2 =
                            o_state.o_configuration.a_o_window.indexOf(
                              o_window__last,
                            );
                          o_state.o_configuration.a_o_window[n_idx1] =
                            o_window__last;
                          o_state.o_configuration.a_o_window[n_idx2] = o_window;
                        }
                      },

                      style: [
                        `top: ${parseInt(o_window.n_trn_y_nor * window.innerHeight)}px`,
                        `left: ${parseInt(o_window.n_trn_x_nor * window.innerWidth)}px`,
                        `width: ${parseInt(o_window.n_scl_x_nor * window.innerWidth)}px`,
                        `height: ${parseInt(o_window.n_scl_y_nor * window.innerHeight)}px`,
                        `position:absolute`,
                        `z-index: ${n_idx_a_o_window * o_state.o_configuration.a_o_window.length}`,
                        // `background-color: rgba(${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},${parseInt(Math.random()*255)},1)`
                      ].join(";"),
                      a_o: [
                        {
                          style:
                            "position: absolute;top:0;left:0;width:100%;display:flex;flex-direction:row",
                          a_o: [
                            {
                              innerText: o_window.s_title,
                              style: "font-size: 1rem; text-align:center",
                              class: "overlay_activator clickable",
                              onpointerdown: async (o_e) => {
                                o_state.o_overlay.b_render = true;
                                o_state.o_overlay.a_o = [
                                  {
                                    s_tag: "input",
                                    type: "text",
                                    oninput: async (o_e) => {
                                      o_state.s_searchterm_tmp =
                                        o_e.target.value;
                                      await o_state.o_js__a_o_gpu_property._f_render();
                                      console.log("asdf");
                                      console.log(
                                        o_state.o_js__a_o_gpu_property,
                                      );
                                    },
                                  },
                                  f_o_assigned("o_js__a_o_gpu_property", () => {
                                    return {
                                      style:
                                        "max-height: 300px; overflow-y:scroll",
                                      a_o: o_state.a_o_gpu_property
                                        .filter((o_gpu_property) => {
                                          if (o_state.s_searchterm_tmp == "") {
                                            return true;
                                          }
                                          return (
                                            o_gpu_property.s_name
                                              .toLowerCase()
                                              .includes(
                                                o_state.s_searchterm_tmp,
                                              ) ||
                                            o_gpu_property.s_description
                                              .toLowerCase()
                                              .includes(
                                                o_state.s_searchterm_tmp,
                                              )
                                          );
                                        })
                                        .map((o_gpu_property) => {
                                          return {
                                            onpointerdown: async (o_e) => {
                                              o_window.o_gpu_property =
                                                o_gpu_property;
                                              o_window.s_title =
                                                o_gpu_property.s_name;
                                              await o_state.o_js__a_o_window._f_render();
                                            },
                                            class: "clickable",
                                            data_value: o_gpu_property.s_name,
                                            a_o: [
                                              {
                                                innerHTML: f_s_html_highlighted(
                                                  o_gpu_property.s_name
                                                    .split(".")
                                                    .join(" "),
                                                  o_state.s_searchterm_tmp,
                                                ),
                                              },
                                              {
                                                innerHTML: f_s_html_highlighted(
                                                  o_gpu_property.s_description,
                                                  o_state.s_searchterm_tmp,
                                                ),
                                              },
                                            ],
                                          };
                                        }),
                                    };
                                  }),
                                ];
                                let nx = o_e.clientX;
                                let ny = o_e.clientY;
                                let n_width = 500;
                                let n_height = 300;
                                let nx2 = Math.min(
                                  nx,
                                  window.innerWidth - n_width,
                                );
                                let ny2 = Math.min(
                                  ny,
                                  window.innerHeight - n_height,
                                );
                                o_state.o_overlay.s_style = [
                                  "background: red",
                                  `width: ${n_width}px`,
                                  `height: ${n_height}px`,
                                  "position:fixed",
                                  "z-index:1111",
                                  `left: ${nx2}px`,
                                  `top: ${ny2}px`,
                                ].join(";");
                                o_state.o_js__o_overlay._f_render();
                              },
                            },
                            f_o_assigned(
                              "o_js__b_use_normalized_value_percentage",
                              () => {
                                return {
                                  innerText:
                                    o_window.b_use_normalized_value_percentage
                                      ? "%"
                                      : o_window?.o_gpu_property_value_last?.s_val
                                          ?.split(" ")
                                          ?.pop(),
                                  class: "overlay_activator clickable",
                                  onpointerdown: async (o_e) => {
                                    o_window.b_use_normalized_value_percentage =
                                      !o_window.b_use_normalized_value_percentage;
                                    await o_state.o_js__b_use_normalized_value_percentage._f_render();
                                  },
                                };
                              },
                            ),
                          ],
                        },
                        f_o_assigned("a_o_threshhold", () => {
                          return {
                            style: "position: absolute; top:0; right: 0",
                            a_o: [
                              ...o_window.a_o_threshhold.map((o_threshhold) => {
                                return {
                                  class:
                                    "overlay_activator o_threshhold clickable",
                                  style: [
                                    `width: 1rem`,
                                    `height: 1rem`,
                                    `background-color: ${o_threshhold.s_col}`,
                                  ].join(";"),
                                  innerText: `${parseInt(o_threshhold.n * 100)
                                    .toString()
                                    .padStart(2, " ")} %`,
                                  onpointerdown: async (o_e) => {
                                    o_state.o_overlay.b_render = true;
                                    o_state.o_overlay.a_o = [
                                      {
                                        class: "o_threshhold",
                                        style:
                                          "display:flex; flex-direction:row",
                                        a_o: [
                                          {
                                            s_tag: "input",
                                            type: "number",
                                            step: 0.1,
                                            value: o_threshhold.n,
                                            oninput: (o_e) => {
                                              o_threshhold.n = parseFloat(
                                                o_e.target.value,
                                              );
                                            },
                                          },
                                          {
                                            s_tag: "input",
                                            type: "color",
                                            value: o_threshhold.s_col,
                                            oninput: (o_e) => {
                                              o_threshhold.s_col =
                                                o_e.target.value;
                                            },
                                          },
                                        ],
                                      },
                                    ];
                                    let nx = o_e.clientX;
                                    let ny = o_e.clientY;
                                    let n_width = 200;
                                    let n_height = 20;
                                    let nx2 = Math.min(
                                      nx,
                                      window.innerWidth - n_width,
                                    );
                                    let ny2 = Math.min(
                                      ny,
                                      window.innerHeight - n_height,
                                    );
                                    o_state.o_overlay.s_style = [
                                      "background: red",
                                      `width: ${n_width}px`,
                                      `height: ${n_height}px`,
                                      "position:fixed",
                                      "z-index:1111",
                                      `left: ${nx2}px`,
                                      `top: ${ny2}px`,
                                    ].join(";");
                                    await o_state.o_js__o_overlay._f_render();
                                  },
                                };
                              }),
                              {
                                class: "settings fas fa-plus",
                                onpointerdown: async () => {
                                  console.log("asdf");
                                },
                              },
                            ],
                          };
                        }),
                        {
                          b_render:
                            o_window.o_graph_type.s_name ==
                            o_graph_type__text.s_name,
                          innerText: o_window.o_gpu_property_value_last.s_val,
                          s_tag: "h2",
                          style: [
                            "width: 100%;",
                            "left: 50%;",
                            "top: 50%;",
                            "position: absolute;",
                            "transform: translate(-50%, -50%);",
                            "text-align: center;",
                          ].join(""),
                        },
                        {
                          s_tag: "canvas",
                        },
                        f_o_assigned(
                          "o_settings",
                          () => {
                            if (o_window.b_render_settings != true) {
                              return {};
                            }
                            return {
                              b_render: o_window.b_render_settings == true,
                              style:
                                "left: 0;top:0;width:100%;background-color:rgba(255,0,0,0.5)",

                              innerText: "overlay",
                              class: "o_window__settings",
                              a_o: [
                                {
                                  innerText: "Title",
                                },
                                f_o_assigned("o_js__s_title", {
                                  s_tag: "input",
                                  value: o_window?.s_title,
                                  oninput: (o_e) => {
                                    o_window.s_title = o_e.target.value;
                                  },
                                }),
                                {
                                  innerText: "GPU",
                                },
                                f_o_assigned("o_js__a_o_gpu_readout_info", {
                                  a_o: o_state.a_o_gpu_readout_info
                                    .at(-1)
                                    .a_o_gpu_info.map((o_gpu_info) => {
                                      let s_id_gpu =
                                        o_gpu_info.a_o_gpu_property_value.find(
                                          (o2) =>
                                            o2.o_gpu_property.s_name == "@id",
                                        );
                                      let s_product_name =
                                        o_gpu_info.a_o_gpu_property_value.find(
                                          (o2) =>
                                            o2.o_gpu_property.s_name ==
                                            "product_name",
                                        );
                                      return {
                                        class: [
                                          `clickable`,
                                          o_window.s_id_gpu == s_id_gpu
                                            ? "hovered"
                                            : "",
                                        ].join(" "),
                                        onpointerdown: async () => {
                                          o_window.s_name_brand_model_gpu =
                                            s_product_name;
                                          o_window.s_id_gpu = s_id_gpu;
                                          await o_state.o_js__a_o_gpu_readout_info._f_render();
                                        },
                                        innerText: s_product_name + s_id_gpu,
                                      };
                                    }),
                                }),
                                {
                                  innerText: "Graph type",
                                },
                                {
                                  style: "display:flex;flex-direction:row",
                                  a_o: o_state.a_o_graph_type.map(
                                    (o_graph_type) => {
                                      return {
                                        class: [
                                          `clickable`,
                                          o_window?.o_graph_type.s_name ==
                                          o_graph_type.s_name
                                            ? "hovered"
                                            : "",
                                        ].join(" "),
                                        onpointerdown: async () => {
                                          o_window.o_graph_type = o_graph_type;
                                        },
                                        a_o: [
                                          {
                                            innerText: o_graph_type.s_name,
                                          },
                                          {
                                            s_tag: "img",
                                            style:
                                              "max-width: 100px;max-height:100px",
                                            src: o_graph_type.s_name_img,
                                          },
                                        ],
                                      };
                                    },
                                  ),
                                },

                                {
                                  class: "fa-solid fa-xmark",
                                  style: "position:absolute; right: 0; top:0",
                                  s_tag: "button",
                                  onpointerdown: async () => {
                                    o_window.b_render_settings = false;
                                    await o_state.o_js__a_o_window._f_render();
                                  },
                                },
                              ],
                            };
                          },
                          o_window,
                        ),
                        {
                          style: "position:absolute;bottom:0;left:0",
                          class: "settings fas fa-cog",
                          s_tag: "button",
                          onpointerdown: async () => {
                            o_window.b_render_settings =
                              o_window.b_render_settings == false;
                            await o_window?.o_settings._f_render();
                          },
                        },
                        {
                          style: "position:absolute; right:0;bottom:0",
                          class:
                            "resize fa-solid fa-up-right-and-down-left-from-center",
                          s_tag: "button",
                        },
                      ],
                    };
                  },
                ),
              };
            },
          }),

          {
            s_tag: "button",
            innerText: "add graph",
            onpointerdown: async () => {
              let n_new = o_state.o_configuration.a_o_window.length + 1;
              o_state.o_configuration.a_o_window.push(
                Object.assign({}, o_window__default),
              );
              for (let n_idx in o_state.o_configuration.a_o_window) {
                let n_nor = parseInt(n_idx) / n_new;
                // o_state.o_configuration.a_o_window[n_idx].n_trn_z_nor = n_nor;
              }
              await o_state.o_js__a_o_window._f_render();
            },
          },
        ],
      },
    ],
  }),
);
// import 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.min.js'
// Register all necessary components (optional, depending on what you need)
// Chart.register(...registerables);

// Example: Creating a simple chart

let f_n_nor1 = function (o, o_parent) {
  let n_total = parseInt(o_parent.querySelector("total")?.innerHTML);
  return parseInt(o.innerHTML) / n_total;
};
let f_n_nor2 = function (o, o_parent) {
  let n_nor = parseInt(o.innerHTML) / 100.0;
  return n_nor;
};

if (o_state.b_nvidia_smi_installed) {
  await f_update_interval();
} else {
  f_o_throw_notification(o_state.o_state__notifier, "nvidia smi not installed");
}

f_update_all_echarts();
