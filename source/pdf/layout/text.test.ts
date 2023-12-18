import * as wtf from "@joelek/wtf";
import * as truetype from "../../truetype";
import { TextNode } from "./text";

const FONT_HANDLER = new truetype.FontHandler()
	.addTypesetter("sans-serif", "normal", "normal", new truetype.Typesetter(new Map(), 1));

wtf.test(`TextNode should create one segment with one column when all of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aaaaaa bbbbbb", FONT_HANDLER, { columns: 1, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 2 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaaaa) Tj"
							]
						},
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bbbbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create two segments with one column when only some of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aaaaaa bbbbbb", FONT_HANDLER, { columns: 1, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 1 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		},
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(bbbbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create one segment with one column when none of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aaaaaa bbbbbb", FONT_HANDLER, { columns: 1, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 0 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaaaa) Tj"
							]
						},
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bbbbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create one segment with two columns when all of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aaa bbb ccc ddd", FONT_HANDLER, { columns: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 2 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 3,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaa) Tj"
							]
						},
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bbb) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 3,
						"h": 2
					},
					"position": {
						"x": 3,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ccc) Tj"
							]
						},
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(ddd) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create two segments with two columns when only some of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aaa bbb ccc ddd", FONT_HANDLER, { columns: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 1 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 3,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaa) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 3,
						"h": 1
					},
					"position": {
						"x": 3,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(bbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		},
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 3,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ccc) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 3,
						"h": 1
					},
					"position": {
						"x": 3,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ddd) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create one segment with two columns when none of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aaa bbb ccc ddd", FONT_HANDLER, { columns: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 0 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 3,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaa) Tj"
							]
						},
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bbb) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 3,
						"h": 2
					},
					"position": {
						"x": 3,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ccc) Tj"
							]
						},
						{
							"size": {
								"w": 3,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(ddd) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create one segment with three columns when all of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aa bb cc dd ee ff", FONT_HANDLER, { columns: 3, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 2 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aa) Tj"
							]
						},
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bb) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(cc) Tj"
							]
						},
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(dd) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ee) Tj"
							]
						},
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(ff) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create two segments with three columns when only some of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aa bb cc dd ee ff", FONT_HANDLER, { columns: 3, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 1 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aa) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(bb) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(cc) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		},
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(dd) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ee) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ff) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should create one segment with three columns when none of the lines fit within the remaining height.`, (assert) => {
	let node = new TextNode("aa bb cc dd ee ff", FONT_HANDLER, { columns: 3, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 0 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aa) Tj"
							]
						},
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bb) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(cc) Tj"
							]
						},
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(dd) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(ee) Tj"
							]
						},
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(ff) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support height.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { height: 10, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 10
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support height "50%".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { height: [50, "%"], width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 5
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support height "extrinsic".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { height: "extrinsic", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 10
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support height "intrinsic".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { height: "intrinsic", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support overflow "hidden".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { overflow: "hidden", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"0 0 m",
				"0 -1 l",
				"6 -1 l",
				"6 0 l",
				"h",
				"W",
				"n",
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support overflow "visible".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { overflow: "visible", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support segmentation "auto".`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { segmentation: "auto", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 1 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		},
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(bbbb) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support segmentation "none".`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { segmentation: "none", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 1 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 2
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						},
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(bbbb) Tj"
							],
							"position": {
								"x": 0,
								"y": 1
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});




wtf.test(`TextNode should support width.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { width: 10 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 10,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support width "50%".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { width: [50, "%"] });
	let atoms = node.createSegments({ w: 10, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 5,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 5,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support width "extrinsic".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { width: "extrinsic" });
	let atoms = node.createSegments({ w: 10, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 10,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support width "intrinsic".`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { width: "intrinsic" });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 4,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 4,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"prefix": [
								"(aaaa) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support color.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { color: { r: 0.1, g: 0.2, b: 0.3 }, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"0.1 0.2 0.3 rg",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support font size.`, (assert) => {
	let node = new TextNode("aa", FONT_HANDLER, { font_size: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 2 Tf",
				"2 TL",
				"3 Tr",
				"1 0 0 1 0 -2 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support gutter.`, (assert) => {
	let node = new TextNode("aa bb", FONT_HANDLER, { columns: 2, gutter: [2], width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aa) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 1
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(bb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support gutter "20%".`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { columns: 2, gutter: [20, "%"], width: 10 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 4,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				},
				{
					"size": {
						"w": 4,
						"h": 1
					},
					"position": {
						"x": 6,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(bbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support letter spacing`, (assert) => {
	let node = new TextNode("aa", FONT_HANDLER, { letter_spacing: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"2 Tc",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line anchor "meanline".`, (assert) => {
	let glyph_data = new Map<string, truetype.GlyphData>();
	glyph_data.set("x", {
		index: 10,
		box: {
			x_min: 0.0,
			y_min: 0.1,
			x_max: 0.0,
			y_max: 0.2
		}
	});
	let font_handler = new truetype.FontHandler()
		.addTypesetter("sans-serif", "normal", "normal", new truetype.Typesetter(new Map(), 1, undefined, glyph_data, undefined));
	let node = new TextNode("aaaa", font_handler, { line_anchor: "meanline", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -0.2 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line anchor "capline".`, (assert) => {
	let glyph_data = new Map<string, truetype.GlyphData>();
	glyph_data.set("I", {
		index: 10,
		box: {
			x_min: 0.0,
			y_min: 0.3,
			x_max: 0.0,
			y_max: 0.4
		}
	});
	let font_handler = new truetype.FontHandler()
		.addTypesetter("sans-serif", "normal", "normal", new truetype.Typesetter(new Map(), 1, undefined, glyph_data, undefined));
	let node = new TextNode("aaaa", font_handler, { line_anchor: "capline", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -0.4 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line anchor "topline".`, (assert) => {
	let fallback_box: truetype.Box = {
		x_min: 0.0,
		y_min: 0.5,
		x_max: 0.0,
		y_max: 0.6
	};
	let font_handler = new truetype.FontHandler()
		.addTypesetter("sans-serif", "normal", "normal", new truetype.Typesetter(new Map(), 1, undefined, undefined, fallback_box));
	let node = new TextNode("aaaa", font_handler, { line_anchor: "topline", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -0.6 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line anchor "bottomline".`, (assert) => {
	let fallback_box: truetype.Box = {
		x_min: 0.0,
		y_min: 0.7,
		x_max: 0.0,
		y_max: 0.8
	};
	let font_handler = new truetype.FontHandler()
		.addTypesetter("sans-serif", "normal", "normal", new truetype.Typesetter(new Map(), 1, undefined, undefined, fallback_box));
	let node = new TextNode("aaaa", font_handler, { line_anchor: "bottomline", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -0.3 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line anchor "baseline".`, (assert) => {
	let font_handler = new truetype.FontHandler()
		.addTypesetter("sans-serif", "normal", "normal", new truetype.Typesetter(new Map(), 1, undefined, undefined, undefined));
	let node = new TextNode("aaaa", font_handler, { line_anchor: "baseline", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line height when there is a single line.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { line_height: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"2 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support line height when there is more than one line.`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { line_height: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 3
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 3
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						},
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 2
							},
							"prefix": [
								"(bbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"2 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support orphans.`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { orphans: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 1 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						},
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text align "start" when there is no horizontal overflow.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { text_align: "start", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text align "start" when there is horizontal overflow.`, (assert) => {
	let node = new TextNode("aaaaaaaa", FONT_HANDLER, { text_align: "start", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 8,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaaaaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text align "center" when there is no horizontal overflow.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { text_align: "center", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 1,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text align "center" when there is horizontal overflow.`, (assert) => {
	let node = new TextNode("aaaaaaaa", FONT_HANDLER, { text_align: "center", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 8,
								"h": 1
							},
							"position": {
								"x": -1,
								"y": 0
							},
							"prefix": [
								"(aaaaaaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text align "end" when there is no horizontal overflow.`, (assert) => {
	let node = new TextNode("aaaa", FONT_HANDLER, { text_align: "end", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 2,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text align "end" when there is horizontal overflow.`, (assert) => {
	let node = new TextNode("aaaaaaaa", FONT_HANDLER, { text_align: "end", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 8,
								"h": 1
							},
							"position": {
								"x": -2,
								"y": 0
							},
							"prefix": [
								"(aaaaaaaa) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text transform "none".`, (assert) => {
	let node = new TextNode("aa BB", FONT_HANDLER, { text_transform: "none", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 5,
								"h": 1
							},
							"prefix": [
								"(aa BB) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text transform "uppercase".`, (assert) => {
	let node = new TextNode("aa BB", FONT_HANDLER, { text_transform: "uppercase", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 5,
								"h": 1
							},
							"prefix": [
								"(AA BB) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support text transform "lowercase".`, (assert) => {
	let node = new TextNode("aa BB", FONT_HANDLER, { text_transform: "lowercase", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"atoms": [
						{
							"size": {
								"w": 5,
								"h": 1
							},
							"prefix": [
								"(aa bb) Tj"
							],
							"position": {
								"x": 0,
								"y": 0
							}
						}
					],
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support white space "wrap".`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { white_space: "wrap", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaaa) Tj"
							]
						},
						{
							"size": {
								"w": 4,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 1
							},
							"prefix": [
								"(bbbb) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support white space "nowrap".`, (assert) => {
	let node = new TextNode("aaaa bbbb", FONT_HANDLER, { white_space: "nowrap", width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 6,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(aaa...) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});

wtf.test(`TextNode should support word spacing.`, (assert) => {
	let node = new TextNode("a b", FONT_HANDLER, { word_spacing: 2, width: 6 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 6,
				"h": 1
			},
			"atoms": [
				{
					"size": {
						"w": 6,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 5,
								"h": 1
							},
							"position": {
								"x": 0,
								"y": 0
							},
							"prefix": [
								"(a b) Tj"
							]
						}
					]
				}
			],
			"prefix": [
				"BT",
				"/F0 1 Tf",
				"1 TL",
				"2 Tw",
				"3 Tr",
				"1 0 0 1 0 -1 cm"
			],
			"suffix": [
				"ET"
			]
		}
	]);
});
