export declare function parseTrueTypeData(buffer: ArrayBuffer): {
    header: {
        scaler_type: number;
        num_tables: number;
        search_range: number;
        entry_selector: number;
        range_shift: number;
        tables: {
            tag: string;
            checksum: number;
            offset: number;
            length: number;
        }[];
    };
    cmap: {
        version: 0;
        mappings: {
            code_point: number;
            index: number;
        }[];
    };
    head: {
        version: 65536;
        font_revision: number;
        check_sum_adjustment: number;
        magic_number: number;
        flags: number;
        units_per_em: number;
        date_created: bigint;
        date_modified: bigint;
        x_min: number;
        y_min: number;
        x_max: number;
        y_max: number;
        mac_style: number;
        lowest_recommended_ppem: number;
        font_direction_hint: number;
        index_to_loc_format: number;
        glyph_data_format: number;
    };
    hhea: {
        version: 65536;
        ascent: number;
        descent: number;
        line_gap: number;
        advance_width_max: number;
        min_left_side_bearing: number;
        min_right_side_bearing: number;
        x_max_extent: number;
        caret_slope_rise: number;
        caret_slope_run: number;
        caret_offset: number;
        reserved_1: number;
        reserved_2: number;
        reserved_3: number;
        reserved_4: number;
        metric_data_format: number;
        num_long_hor_metrics: number;
    };
    maxp: {
        version: 65536;
        num_glyphs: number;
        max_points: number;
        max_contours: number;
        max_component_points: number;
        max_component_contours: number;
        max_zones: number;
        max_twilight_points: number;
        max_storage: number;
        max_function_defs: number;
        max_instruction_defs: number;
        max_stack_elements: number;
        max_size_of_instructions: number;
        max_component_elements: number;
        max_component_depth: number;
    } | {
        version: 20480;
        num_glyphs: number;
        max_points?: undefined;
        max_contours?: undefined;
        max_component_points?: undefined;
        max_component_contours?: undefined;
        max_zones?: undefined;
        max_twilight_points?: undefined;
        max_storage?: undefined;
        max_function_defs?: undefined;
        max_instruction_defs?: undefined;
        max_stack_elements?: undefined;
        max_size_of_instructions?: undefined;
        max_component_elements?: undefined;
        max_component_depth?: undefined;
    };
    hmtx: {
        metrics: {
            advance_width: number;
            left_side_bearing: number;
        }[];
    };
    loca: {
        offsets: number[];
    };
    glyf: {
        glyphs: {
            x_min: number;
            y_min: number;
            x_max: number;
            y_max: number;
            data: {
                type: "normal";
                contour_end_point_indices: number[];
                instructions: number[];
                flags: number[];
                x_coordinates: number[];
                y_coordinates: number[];
            } | {
                type: "compound";
                components: {
                    flags: number;
                    glyph_index: number;
                    arguments_type: "indices" | "coordinates";
                    arg0: number;
                    arg1: number;
                    a: number;
                    b: number;
                    c: number;
                    d: number;
                }[];
                instructions: number[];
            };
        }[];
    };
    name: {};
    post: {};
};
export type TrueTypeData = ReturnType<typeof parseTrueTypeData>;
export type MeasuredLine = {
    line_string: string;
    line_width: number;
};
export type Options = {
    letter_spacing: number;
    word_spacing: number;
};
export type Box = {
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;
};
export declare class Typesetter {
    protected widths: Map<string, number>;
    protected fallback_width: number;
    protected kernings: Map<string, number>;
    protected boxes: Map<string, Box>;
    protected fallback_box: Box;
    protected options: Options;
    protected getKerning(prefix: string, suffix: string): number;
    protected segmentIntoLines(string: string): Array<string>;
    protected segmentIntoCharacters(string: string): Array<string>;
    protected segmentIntoWords(string: string): Array<string>;
    constructor(widths: Map<string, number>, fallback_width: number, kernings?: Map<string, number>, boxes?: Map<string, Box>, fallback_box?: Box, options?: Partial<Options>);
    clampString(string: string, target_width: number): Array<MeasuredLine>;
    getCharacterBox(character: string): Box;
    measureString(string: string): number;
    withOptions(options: Partial<Options>): Typesetter;
    wrapString(string: string, target_width: number): Array<MeasuredLine>;
    wrapStringUsingLineBreaks(string: string): Array<MeasuredLine>;
    static createFromFont(font: TrueTypeData): Typesetter;
}
