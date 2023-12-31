function parseHeaderData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let scaler_type = dw.getUint32(o); o += 4;
	let num_tables = dw.getUint16(o); o += 2;
	let search_range = dw.getUint16(o); o += 2;
	let entry_selector = dw.getUint16(o); o +=2;
	let range_shift = dw.getUint16(o); o += 2;
	let tables = [] as Array<{
		tag: string;
		checksum: number;
		offset: number;
		length: number;
	}>;
	for (let i = 0; i < num_tables; i++) {
		let tag = String.fromCharCode(dw.getUint8(o++), dw.getUint8(o++), dw.getUint8(o++), dw.getUint8(o++));
		let checksum = dw.getUint32(o); o += 4;
		let offset = dw.getUint32(o); o += 4;
		let length = dw.getUint32(o); o += 4;
		tables.push({
			tag,
			checksum,
			offset,
			length
		});
	}
	return {
		scaler_type,
		num_tables,
		search_range,
		entry_selector,
		range_shift,
		tables
	};
};

type HeaderData = ReturnType<typeof parseHeaderData>;

function parseCmapData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let version = dw.getUint16(o); o += 2;
	if (version === 0x0000) {
		let num_subtables = dw.getUint16(o); o += 2;
		let subtables = [] as Array<{
			platform_id: number;
			platform_specific_id: number;
			local_offset: number;
		}>;
		for (let i = 0; i < num_subtables; i++) {
			let platform_id = dw.getUint16(o); o += 2;
			let platform_specific_id = dw.getUint16(o); o += 2;
			let local_offset = dw.getUint32(o); o += 4;
			subtables.push({
				platform_id,
				platform_specific_id,
				local_offset
			});
		}
		let mappings = [] as Array<{
			code_point: number;
			index: number;
		}>;
		for (let subtable of subtables) {
			let o = subtable.local_offset;
			let format = dw.getUint16(o); o += 2;
			if (format === 4) {
				let byte_length = dw.getUint16(o); o += 2;
				let language_code = dw.getUint16(o); o += 2;
				let seg_count_times_two = dw.getUint16(o); o += 2;
				let search_range = dw.getUint16(o); o += 2;
				let entry_selector = dw.getUint16(o); o += 2;
				let range_shift = dw.getUint16(o); o += 2;
				let end_codes = [] as Array<number>;
				for (let i = 0; i < seg_count_times_two >> 1; i++) {
					let end_code = dw.getUint16(o); o += 2;
					end_codes.push(end_code);
				}
				let reserved = dw.getUint16(o); o += 2;
				let start_codes = [] as Array<number>;
				for (let i = 0; i < seg_count_times_two >> 1; i++) {
					let start_code = dw.getUint16(o); o += 2;
					start_codes.push(start_code);
				}
				let deltas = [] as Array<number>;
				for (let i = 0; i < seg_count_times_two >> 1; i++) {
					let delta = dw.getUint16(o); o += 2;
					deltas.push(delta);
				}
				let relative_offsets = [] as Array<number>;
				for (let i = 0; i < seg_count_times_two >> 1; i++) {
					let relative_offset = dw.getUint16(o); o += 2;
					relative_offsets.push(relative_offset);
				}
				for (let i = 0; i < seg_count_times_two >> 1; i++) {
					let relative_offset = relative_offsets[i];
					let start_code = start_codes[i];
					let end_code = end_codes[i];
					let delta = deltas[i];
					if (relative_offset === 0) {
						for (let code_point = start_code; code_point <= end_code; code_point++) {
							let index = (code_point + delta) % 65536;
							if (index !== 0) {
								mappings.push({
									code_point,
									index
								});
							}
						}
					} else {
						let o_relative = relative_offset - seg_count_times_two + (i * 2);
						for (let code_point = start_code; code_point <= end_code; code_point++) {
							let index = dw.getUint16(o + o_relative); o_relative += 2;
							if (index !== 0) {
								mappings.push({
									code_point,
									index
								});
							}
						}
					}
				}
			} else {
				throw new Error(`Expected a supported subtable format!`);
			}
		}
		let map = new Map<number, number>();
		for (let mapping of mappings) {
			map.set(mapping.code_point, mapping.index);
		}
		mappings = [];
		for (let [code_point, index] of map.entries()) {
			mappings.push({
				code_point,
				index
			});
		}
		return {
			version: 0x0000 as const,
			mappings
		};
	}
	throw new Error(`Expected a supported table version!`);
};

type CmapData = ReturnType<typeof parseCmapData>;

function parseHeadData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let version = dw.getUint32(o); o += 4;
	if (version === 0x00010000) {
		let font_revision = dw.getUint32(o); o += 4;
		let check_sum_adjustment = dw.getUint32(o); o += 4;
		let magic_number = dw.getUint32(o); o += 4;
		let flags = dw.getUint16(o); o += 2;
		let units_per_em = dw.getUint16(o); o += 2;
		let date_created = dw.getBigUint64(o); o += 8;
		let date_modified = dw.getBigUint64(o); o += 8;
		let x_min = dw.getInt16(o); o += 2;
		let y_min = dw.getInt16(o); o += 2;
		let x_max = dw.getInt16(o); o += 2;
		let y_max = dw.getInt16(o); o += 2;
		let mac_style = dw.getUint16(o); o += 2;
		let lowest_recommended_ppem = dw.getUint16(o); o += 2;
		let font_direction_hint = dw.getInt16(o); o += 2;
		let index_to_loc_format = dw.getInt16(o); o += 2;
		let glyph_data_format = dw.getInt16(o); o += 2;
		return {
			version: 0x00010000 as const,
			font_revision,
			check_sum_adjustment,
			magic_number,
			flags,
			units_per_em,
			date_created,
			date_modified,
			x_min,
			y_min,
			x_max,
			y_max,
			mac_style,
			lowest_recommended_ppem,
			font_direction_hint,
			index_to_loc_format,
			glyph_data_format
		};
	}
	throw new Error(`Expected a supported table version!`);
};

type HeadData = ReturnType<typeof parseHeadData>;

function parseHheaData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let version = dw.getUint32(o); o += 4;
	if (version === 0x00010000) {
		let ascent = dw.getInt16(o); o += 2;
		let descent = dw.getInt16(o); o += 2;
		let line_gap = dw.getInt16(o); o += 2;
		let advance_width_max = dw.getUint16(o); o += 2;
		let min_left_side_bearing = dw.getInt16(o); o += 2;
		let min_right_side_bearing = dw.getInt16(o); o += 2;
		let x_max_extent = dw.getInt16(o); o += 2;
		let caret_slope_rise = dw.getInt16(o); o += 2;
		let caret_slope_run = dw.getInt16(o); o += 2;
		let caret_offset = dw.getInt16(o); o += 2;
		let reserved_1 = dw.getInt16(o); o += 2;
		let reserved_2 = dw.getInt16(o); o += 2;
		let reserved_3 = dw.getInt16(o); o += 2;
		let reserved_4 = dw.getInt16(o); o += 2;
		let metric_data_format = dw.getInt16(o); o += 2;
		let num_long_hor_metrics = dw.getUint16(o); o += 2;
		return {
			version: 0x00010000 as const,
			ascent,
			descent,
			line_gap,
			advance_width_max,
			min_left_side_bearing,
			min_right_side_bearing,
			x_max_extent,
			caret_slope_rise,
			caret_slope_run,
			caret_offset,
			reserved_1,
			reserved_2,
			reserved_3,
			reserved_4,
			metric_data_format,
			num_long_hor_metrics
		};
	}
	throw new Error(`Expected a supported table version!`);
};

type HheaData = ReturnType<typeof parseHheaData>;

function parseMaxpData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let version = dw.getUint32(o); o += 4;
	if (version === 0x00010000) {
		let num_glyphs = dw.getUint16(o); o += 2;
		let max_points = dw.getUint16(o); o += 2;
		let max_contours = dw.getUint16(o); o += 2;
		let max_component_points = dw.getUint16(o); o += 2;
		let max_component_contours = dw.getUint16(o); o += 2;
		let max_zones = dw.getUint16(o); o += 2;
		let max_twilight_points = dw.getUint16(o); o += 2;
		let max_storage = dw.getUint16(o); o += 2;
		let max_function_defs = dw.getUint16(o); o += 2;
		let max_instruction_defs = dw.getUint16(o); o += 2;
		let max_stack_elements = dw.getUint16(o); o += 2;
		let max_size_of_instructions = dw.getUint16(o); o += 2;
		let max_component_elements = dw.getUint16(o); o += 2;
		let max_component_depth = dw.getUint16(o); o += 2;
		return {
			version: 0x00010000 as const,
			num_glyphs,
			max_points,
			max_contours,
			max_component_points,
			max_component_contours,
			max_zones,
			max_twilight_points,
			max_storage,
			max_function_defs,
			max_instruction_defs,
			max_stack_elements,
			max_size_of_instructions,
			max_component_elements,
			max_component_depth
		};
	}
	if (version === 0x00005000) {
		let num_glyphs = dw.getUint16(o); o += 2;
		return {
			version: 0x00005000 as const,
			num_glyphs
		};
	}
	throw new Error(`Expected a supported table version!`);
};

type MaxpData = ReturnType<typeof parseMaxpData>;

function parseHmtxData(buffer: ArrayBuffer, hhea: HheaData, maxp: MaxpData) {
	let dw = new DataView(buffer);
	let o = 0;
	let metrics = [] as Array<{
		advance_width: number;
		left_side_bearing: number;
	}>;
	for (let i = 0; i < hhea.num_long_hor_metrics; i++) {
		let advance_width = dw.getUint16(o); o += 2;
		let left_side_bearing = dw.getInt16(o); o += 2;
		metrics.push({
			advance_width,
			left_side_bearing
		});
	}
	for (let i = hhea.num_long_hor_metrics; i < maxp.num_glyphs; i++) {
		let advance_width = metrics[metrics.length - 1].advance_width ?? 0;
		let left_side_bearing = dw.getInt16(o); o += 2;
		metrics.push({
			advance_width,
			left_side_bearing
		});
	}
	return {
		metrics
	};
};

type HmtxData = ReturnType<typeof parseHmtxData>;

function parseLocaData(buffer: ArrayBuffer, head: HeadData, maxp: MaxpData) {
	let dw = new DataView(buffer);
	let o = 0;
	let offsets = [] as Array<number>;
	if (head.index_to_loc_format === 0) {
		for (let i = 0; i < maxp.num_glyphs + 1; i++) {
			let offset = dw.getUint16(o); o += 2;
			offset *= 2;
			offsets.push(offset);
		}
	} else {
		for (let i = 0; i < maxp.num_glyphs + 1; i++) {
			let offset = dw.getUint32(o); o += 4;
			offsets.push(offset);
		}
	}
	return {
		offsets
	};
};

type LocaData = ReturnType<typeof parseLocaData>;

function parseGlyfData(buffer: ArrayBuffer, loca: LocaData, maxp: MaxpData) {
	let dw = new DataView(buffer);
	let o = 0;
	let glyphs = [] as Array<{
		x_min: number;
		y_min: number;
		x_max: number;
		y_max: number;
		data: {
			type: "normal";
			contour_end_point_indices: Array<number>;
			instructions: Array<number>;
			flags: Array<number>;
			x_coordinates: Array<number>;
			y_coordinates: Array<number>;
		} | {
			type: "compound";
			components: Array<{
				flags: number;
				glyph_index: number;
				arguments_type: "indices" | "coordinates";
				arg0: number;
				arg1: number;
				a: number;
				b: number;
				c: number;
				d: number;
			}>;
			instructions: Array<number>;
		};
	}>;
	for (let k = 0; k < maxp.num_glyphs; k++) {
		let o = loca.offsets[k];
		let number_of_contours = dw.getInt16(o); o += 2;
		let x_min = dw.getInt16(o); o += 2;
		let y_min = dw.getInt16(o); o += 2;
		let x_max = dw.getInt16(o); o += 2;
		let y_max = dw.getInt16(o); o += 2;
		if (number_of_contours >= 0) {
			let num_points = 0;
			let contour_end_point_indices = [] as Array<number>;
			for (let i = 0; i < number_of_contours; i++) {
				let contour_end_point_index = dw.getUint16(o); o += 2;
				contour_end_point_indices.push(contour_end_point_index);
				num_points = Math.max(num_points, contour_end_point_index + 1);
			}
			let instruction_length = dw.getUint16(o); o += 2;
			let instructions = [] as Array<number>;
			for (let i = 0; i < instruction_length; i++) {
				let instruction = dw.getUint8(o); o += 1;
				instructions.push(instruction);
			}
			let flags = [] as Array<number>;
			for (let i = 0; i < num_points; i++) {
				let flag = dw.getUint8(o); o += 1;
				flags.push(flag);
				let repeat = ((flag >> 3) & 0x01) === 0x01;
				if (repeat) {
					let repeats = dw.getUint8(o); o += 1;
					for (let j = 0; j < repeats; j++) {
						flags.push(flag);
					}
					i += repeats;
				}
			}
			let x_coordinates = [] as Array<number>;
			for (let flag of flags) {
				let x_is_uint8 = ((flag >> 1) & 0x01) === 0x01;
				if (x_is_uint8) {
					let x_coordinate = dw.getUint8(o); o += 1;
					let x_is_positive = ((flag >> 4) & 0x01) === 0x01;
					if (!x_is_positive) {
						x_coordinate = 0 - x_coordinate;
					}
					x_coordinates.push(x_coordinate);
				} else {
					let x_is_same = ((flag >> 4) & 0x01) === 0x01;
					let last_x_coordinate = x_coordinates[x_coordinates.length - 1] ?? 0;
					if (x_is_same) {
						x_coordinates.push(last_x_coordinate);
					} else {
						let x_delta = dw.getInt16(o); o += 2;
						let x_coordinate = last_x_coordinate + x_delta;
						x_coordinates.push(x_coordinate);
					}
				}
			}
			let y_coordinates = [] as Array<number>;
			for (let flag of flags) {
				let y_is_uint8 = ((flag >> 2) & 0x01) === 0x01;
				if (y_is_uint8) {
					let y_coordinate = dw.getUint8(o); o += 1;
					let y_is_positive = ((flag >> 5) & 0x01) === 0x01;
					if (!y_is_positive) {
						y_coordinate = 0 - y_coordinate;
					}
					y_coordinates.push(y_coordinate);
				} else {
					let y_is_same = ((flag >> 5) & 0x01) === 0x01;
					let last_y_coordinate = y_coordinates[y_coordinates.length - 1] ?? 0;
					if (y_is_same) {
						y_coordinates.push(last_y_coordinate);
					} else {
						let y_delta = dw.getInt16(o); o += 2;
						let y_coordinate = last_y_coordinate + y_delta;
						y_coordinates.push(y_coordinate);
					}
				}
			}
			glyphs.push({
				x_min,
				y_min,
				x_max,
				y_max,
				data: {
					type: "normal",
					contour_end_point_indices,
					instructions,
					flags,
					x_coordinates,
					y_coordinates
				}
			});
		} else {
			let components = [] as Array<{
				flags: number;
				glyph_index: number;
				arguments_type: "indices" | "coordinates";
				arg0: number;
				arg1: number;
				a: number;
				b: number;
				c: number;
				d: number;
			}>;
			let has_instructions = false;
			while (true) {
				let flags = dw.getUint16(o); o += 2;
				let glyph_index = dw.getUint16(o); o += 2;
				let args_are_words = ((flags >> 0) & 0x01) === 0x01;
				let args_are_xy_values = ((flags >> 1) & 0x01) === 0x01;
				let round_xy_to_grid = ((flags >> 2) & 0x01) === 0x01;
				let we_have_a_scale = ((flags >> 3) & 0x01) === 0x01;
				let more_components = ((flags >> 5) & 0x01) === 0x01;
				let we_have_an_x_and_y_scale = ((flags >> 6) & 0x01) === 0x01;
				let we_have_a_two_by_two = ((flags >> 7) & 0x01) === 0x01;
				let we_have_instructions = ((flags >> 8) & 0x01) === 0x01;
				let use_my_metrics = ((flags >> 9) & 0x01) === 0x01;
				let overlap_compound = ((flags >> 10) & 0x01) === 0x01;
				let arguments_type = args_are_xy_values ? "coordinates" as const : "indices" as const;
				has_instructions = we_have_instructions;
				let arg0 = 0;
				let arg1 = 0;
				if (args_are_words && args_are_xy_values) {
					arg0 = dw.getInt16(o); o += 2;
					arg1 = dw.getInt16(o); o += 2;
				} else if (!args_are_words && args_are_xy_values) {
					arg0 = dw.getInt8(o); o += 1;
					arg1 = dw.getInt8(o); o += 1;
				} else if (args_are_words && !args_are_xy_values) {
					arg0 = dw.getUint16(o); o += 2;
					arg1 = dw.getUint16(o); o += 2;
				} else if (!args_are_words && !args_are_xy_values) {
					arg0 = dw.getUint8(o); o += 1;
					arg1 = dw.getUint8(o); o += 1;
				}
				let a = 1.0;
				let b = 0.0;
				let c = 0.0;
				let d = 1.0;
				if (we_have_a_scale) {
					a = d = dw.getInt16(o) / (1 << 14); o += 2;
				} else if (we_have_an_x_and_y_scale) {
					a = dw.getInt16(o) / (1 << 14); o += 2;
					d = dw.getInt16(o) / (1 << 14); o += 2;
				} else if (we_have_a_two_by_two) {
					a = dw.getInt16(o) / (1 << 14); o += 2;
					b = dw.getInt16(o) / (1 << 14); o += 2;
					c = dw.getInt16(o) / (1 << 14); o += 2;
					d = dw.getInt16(o) / (1 << 14); o += 2;
				}
				components.push({
					flags,
					glyph_index,
					arguments_type,
					arg0,
					arg1,
					a,
					b,
					c,
					d,
				});
				if (!more_components) {
					break;
				}
			}
			let instructions = [] as Array<number>;
			if (has_instructions) {
				let instruction_length = dw.getUint16(o); o += 2;
				for (let i = 0; i < instruction_length; i++) {
					let instruction = dw.getUint8(o); o += 1;
					instructions.push(instruction);
				}
			}
			glyphs.push({
				x_min,
				y_min,
				x_max,
				y_max,
				data: {
					type: "compound",
					components,
					instructions
				}
			});
		}
	}
	return {
		glyphs
	};
};

type GlyfData = ReturnType<typeof parseGlyfData>;

function parseNameData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let format = dw.getUint16(o); o += 2;
	let count = dw.getUint16(o); o += 2;
	let string_offset = dw.getUint16(o); o += 2;
	if (format === 0) {
		let name_records = [] as Array<{
			platform_id: number;
			platform_specific_id: number;
			language_id: number;
			name_id: number;
			byte_length: number;
			byte_offset: number;
			string: string;
		}>;
		for (let i = 0; i < count; i++) {
			let platform_id = dw.getUint16(o); o += 2;
			let platform_specific_id = dw.getUint16(o); o += 2;
			let language_id = dw.getUint16(o); o += 2;
			let name_id = dw.getUint16(o); o += 2;
			let byte_length = dw.getUint16(o); o += 2;
			let byte_offset = dw.getUint16(o); o += 2;
			name_records.push({
				platform_id,
				platform_specific_id,
				language_id,
				name_id,
				byte_length,
				byte_offset,
				string: ""
			});
		}
		for (let name_record of name_records) {
			if (name_record.platform_id === 0) {
				if (name_record.platform_specific_id === 4) {
					let characters = [];
					for (let o = string_offset + name_record.byte_offset; o < string_offset + name_record.byte_offset + name_record.byte_length; o += 2) {
						characters.push(String.fromCharCode(dw.getUint8(o + 0) << 8 | dw.getUint8(o + 1)));
					}
					name_record.string = characters.join("");
				} else {
					throw new Error(`Expected a supported platform specific id!`);
				}
			} else if (name_record.platform_id === 3) {
				let characters = [];
				for (let o = string_offset + name_record.byte_offset; o < string_offset + name_record.byte_offset + name_record.byte_length; o += 2) {
					characters.push(String.fromCharCode(dw.getUint8(o + 0) << 8 | dw.getUint8(o + 1)));
				}
				name_record.string = characters.join("");
			} else {
				throw new Error(`Expected a supported platform id!`);
			}
		}
		return {
			name_records
		};
	} else {
		throw new Error(`Expected a supported format!`);
	}
};

type NameData = ReturnType<typeof parseNameData>;

function parsePostData(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	return {};
};

type PostData = ReturnType<typeof parsePostData>;

function parseOs2Data(buffer: ArrayBuffer) {
	let dw = new DataView(buffer);
	let o = 0;
	let version = dw.getUint16(o); o += 2;
	let average_weighted_advance = dw.getInt16(o); o += 2;
	let weight_class = dw.getUint16(o); o += 2;
	let width_class = dw.getUint16(o); o += 2;
	let font_flags = dw.getInt16(o); o += 2;
	let subscript_x_size = dw.getInt16(o); o += 2;
	let subscript_y_size = dw.getInt16(o); o += 2;
	let subscript_x_offset = dw.getInt16(o); o += 2;
	let subscript_y_offset = dw.getInt16(o); o += 2;
	let superscript_x_size = dw.getInt16(o); o += 2;
	let superscript_y_size = dw.getInt16(o); o += 2;
	let superscript_x_offset = dw.getInt16(o); o += 2;
	let superscript_y_offset = dw.getInt16(o); o += 2;
	let strikeout_size = dw.getInt16(o); o += 2;
	let strikeout_position = dw.getInt16(o); o += 2;
	let family_class = dw.getInt16(o); o += 2;
	let panose = new Uint8Array(buffer.slice(o, o + 10)); o += 10;
	let unicode_ranges = [] as Array<{}>;
	let a = dw.getUint32(o); o += 4;
	let b = dw.getUint32(o); o += 4;
	let c = dw.getUint32(o); o += 4;
	let d = dw.getUint32(o); o += 4;
	unicode_ranges.push(a, b, c, d);
	let font_vendor_identifier = String.fromCharCode(dw.getUint8(o++), dw.getUint8(o++), dw.getUint8(o++), dw.getUint8(o++));
	let font_style_flags = dw.getUint16(o); o += 2;
	let first_char_index = dw.getUint16(o); o += 2;
	let last_char_index = dw.getUint16(o); o += 2;
	return {
		version,
		average_weighted_advance,
		weight_class,
		width_class,
		font_flags,
		subscript_x_size,
		subscript_y_size,
		subscript_x_offset,
		subscript_y_offset,
		superscript_x_size,
		superscript_y_size,
		superscript_x_offset,
		superscript_y_offset,
		strikeout_size,
		strikeout_position,
		family_class,
		panose,
		unicode_ranges,
		font_vendor_identifier,
		font_style_flags,
		first_char_index,
		last_char_index
	};
};

type Os2Data = ReturnType<typeof parseOs2Data>;

export function parseTrueTypeData(buffer: ArrayBuffer) {
	let header = parseHeaderData(buffer);
	let cmap_table = header.tables.find((table) => table.tag === "cmap");
	if (cmap_table == null) {
		throw new Error(`Expected table "cmap" to be present!`);
	}
	let cmap = parseCmapData(buffer.slice(cmap_table.offset, cmap_table.offset + cmap_table.length));
	let head_table = header.tables.find((table) => table.tag === "head");
	if (head_table == null) {
		throw new Error(`Expected table "head" to be present!`);
	}
	let head = parseHeadData(buffer.slice(head_table.offset, head_table.offset + head_table.length));
	let hhea_table = header.tables.find((table) => table.tag === "hhea");
	if (hhea_table == null) {
		throw new Error(`Expected table "hhea" to be present!`);
	}
	let hhea = parseHheaData(buffer.slice(hhea_table.offset, hhea_table.offset + hhea_table.length));
	let maxp_table = header.tables.find((table) => table.tag === "maxp");
	if (maxp_table == null) {
		throw new Error(`Expected table "maxp" to be present!`);
	}
	let maxp = parseMaxpData(buffer.slice(maxp_table.offset, maxp_table.offset + maxp_table.length));
	let hmtx_table = header.tables.find((table) => table.tag === "hmtx");
	if (hmtx_table == null) {
		throw new Error(`Expected table "hmtx" to be present!`);
	}
	let hmtx = parseHmtxData(buffer.slice(hmtx_table.offset, hmtx_table.offset + hmtx_table.length), hhea, maxp);
	let loca_table = header.tables.find((table) => table.tag === "loca");
	if (loca_table == null) {
		throw new Error(`Expected table "loca" to be present!`);
	}
	let loca = parseLocaData(buffer.slice(loca_table.offset, loca_table.offset + loca_table.length), head, maxp);
	let glyf_table = header.tables.find((table) => table.tag === "glyf");
	if (glyf_table == null) {
		throw new Error(`Expected table "glyf" to be present!`);
	}
	let glyf = parseGlyfData(buffer.slice(glyf_table.offset, glyf_table.offset + glyf_table.length), loca, maxp);
	let name_table = header.tables.find((table) => table.tag === "name");
	if (name_table == null) {
		throw new Error(`Expected table "name" to be present!`);
	}
	let name = parseNameData(buffer.slice(name_table.offset, name_table.offset + name_table.length));
	let post_table = header.tables.find((table) => table.tag === "post");
	if (post_table == null) {
		throw new Error(`Expected table "post" to be present!`);
	}
	let post = parsePostData(buffer.slice(post_table.offset, post_table.offset + post_table.length));
	let os2_table = header.tables.find((table) => table.tag === "OS/2");
	let os2: Os2Data | undefined;
	if (os2_table != null) {
		os2 = parseOs2Data(buffer.slice(os2_table.offset, os2_table.offset + os2_table.length));
	}
	return {
		header,
		cmap,
		head,
		hhea,
		maxp,
		hmtx,
		loca,
		glyf,
		name,
		post,
		os2
	};
};

export type TrueTypeData = ReturnType<typeof parseTrueTypeData>;
