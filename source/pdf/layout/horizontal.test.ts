import * as wtf from "@joelek/wtf";
import { Atom, ChildNode, NodeStyle, Size } from "./shared";
import { HorizontalNode } from "./horizontal";

class MockNode extends ChildNode {
	constructor(style?: Partial<NodeStyle>) {
		super(style);
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom> {
		return [
			{
				size: {
					w: target_size?.w ?? 0,
					h: target_size?.h ?? 0
				}
			}
		];
	}
};

class MockSegmentedNode extends ChildNode {
	protected sizes: Array<Size>;

	constructor(...sizes: Array<Partial<Size>>) {
		super();
		this.sizes = [] as Array<Size>;
		for (let size of sizes) {
			this.sizes.push({
				w: size.w ?? 0,
				h: size.h ?? 0
			});
		}
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom> {
		return this.sizes.map((size) => {
			return {
				size
			};
		});
	}
};

class MockRemainingHeightNode extends ChildNode {
	constructor() {
		super();
	}

	createSegments(segment_size: Size, segment_left: Size, target_size?: Partial<Size>): Array<Atom> {
		return [
			{
				size: {
					w: 0,
					h: segment_left.h
				}
			}
		];
	}
};

wtf.test(`HorizontalNode should support children with fractional widths.`, (assert) => {
	let node = new HorizontalNode({ width: 10, gap: [1] },
		new MockNode({ width: [1, "fr"] }),
		new MockNode({ width: [2] }),
		new MockNode({ width: [2, "fr"] })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 3,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 4,
						"h": 0
					},
					"position": {
						"x": 6,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 4,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support children with fractional heights.`, (assert) => {
	let node = new HorizontalNode({ height: 10, gap: [1] },
		new MockNode({ height: [1, "fr"] }),
		new MockNode({ height: [2] }),
		new MockNode({ height: [2, "fr"] })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 2,
				"h": 10
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 5
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 5
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 1,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 10
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should create one segment when there are no children.`, (assert) => {
	let node = new HorizontalNode({});
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 0
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should provide each child with the size left in the current segment.`, (assert) => {
	let node = new HorizontalNode({},
		new MockRemainingHeightNode()
	);
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 2 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support height.`, (assert) => {
	let node = new HorizontalNode({ height: 10 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 10
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support height "50%".`, (assert) => {
	let node = new HorizontalNode({ height: [50, "%"] });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 5
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support height "extrinsic".`, (assert) => {
	let node = new HorizontalNode({ height: "extrinsic" });
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 10
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support height "intrinsic".`, (assert) => {
	let node = new HorizontalNode({ height: "intrinsic" },
		new MockSegmentedNode({ w: 0, h: 10 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 10
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 10
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support overflow "hidden".`, (assert) => {
	let node = new HorizontalNode({ overflow: "hidden" });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 0
			},
			"atoms": [],
			"prefix": [
				"0 0 m",
				"0 0 l",
				"0 0 l",
				"0 0 l",
				"h",
				"W",
				"n"
			],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support overflow "visible".`, (assert) => {
	let node = new HorizontalNode({ overflow: "visible" });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 0
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support segmentation "auto".`, (assert) => {
	let node = new HorizontalNode({ segmentation: "auto" },
		new MockSegmentedNode({ w: 1, h: 2 }),
		new MockSegmentedNode({ w: 3, h: 2 }, { w: 5, h: 2 })
	);
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
						"w": 1,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 1,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 5,
						"h": 2
					},
					"position": {
						"x": 1,
						"y": 0
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
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		},
		{
			"size": {
				"w": 6,
				"h": 2
			},
			"atoms": [
				{
					"size": {
						"w": 1,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": []
				},
				{
					"size": {
						"w": 5,
						"h": 2
					},
					"position": {
						"x": 1,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 5,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support segmentation "none".`, (assert) => {
	let node = new HorizontalNode({ segmentation: "none" },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 2 }, { w: 0, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 2 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 4
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						},
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 2
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support width.`, (assert) => {
	let node = new HorizontalNode({ width: 10 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 0
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support width "50%".`, (assert) => {
	let node = new HorizontalNode({ width: [50, "%"] });
	let atoms = node.createSegments({ w: 10, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 5,
				"h": 0
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support width "extrinsic".`, (assert) => {
	let node = new HorizontalNode({ width: "extrinsic" });
	let atoms = node.createSegments({ w: 10, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 0
			},
			"atoms": [],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support width "intrinsic".`, (assert) => {
	let node = new HorizontalNode({ width: "intrinsic" },
		new MockSegmentedNode({ w: 10, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 10,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 10,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 10,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align x "left" when there is no horizontal overflow.`, (assert) => {
	let node = new HorizontalNode({ align_x: "left", width: 8 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 2, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align x "left" when there is horizontal overflow.`, (assert) => {
	let node = new HorizontalNode({ align_x: "left", width: 8 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 10, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 10,
						"h": 0
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 10,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align x "center" when there is no horizontal overflow.`, (assert) => {
	let node = new HorizontalNode({ align_x: "center", width: 8 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 2, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align x "center" when there is horizontal overflow.`, (assert) => {
	let node = new HorizontalNode({ align_x: "center", width: 8 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 10, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": -2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 10,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 10,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align x "right" when there is no horizontal overflow.`, (assert) => {
	let node = new HorizontalNode({ align_x: "right", width: 8 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 2, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 6,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align x "right" when there is horizontal overflow.`, (assert) => {
	let node = new HorizontalNode({ align_x: "right", width: 8 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 10, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": -4,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 10,
						"h": 0
					},
					"position": {
						"x": -2,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 10,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align y "top" when there is no vertical overflow.`, (assert) => {
	let node = new HorizontalNode({ align_y: "top", height: 8 },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align y "top" when there is vertical overflow.`, (assert) => {
	let node = new HorizontalNode({ align_y: "top", height: 8 },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 10 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 10
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align y "middle" when there is no vertical overflow.`, (assert) => {
	let node = new HorizontalNode({ align_y: "middle", height: 8 },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 3
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 3
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align y "middle" when there is vertical overflow.`, (assert) => {
	let node = new HorizontalNode({ align_y: "middle", height: 8 },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 10 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 3
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 0,
						"y": -1
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 10
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align y "bottom" when there is no vertical overflow.`, (assert) => {
	let node = new HorizontalNode({ align_y: "bottom", height: 8 },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 6
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 6
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support align y "bottom" when there is vertical overflow.`, (assert) => {
	let node = new HorizontalNode({ align_y: "bottom", height: 8 },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 10 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 6
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 2
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 0,
						"y": -2
					},
					"atoms": [
						{
							"size": {
								"w": 0,
								"h": 10
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support gap.`, (assert) => {
	let node = new HorizontalNode({ gap: [1] },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 2, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 5,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 3,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalNode should support gap "20%".`, (assert) => {
	let node = new HorizontalNode({ gap: [20, "%"], width: 50 },
		new MockSegmentedNode({ w: 2, h: 0 }),
		new MockSegmentedNode({ w: 2, h: 0 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 50,
				"h": 0
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 0,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 12,
						"y": 0
					},
					"atoms": [
						{
							"size": {
								"w": 2,
								"h": 0
							},
							"position": {
								"x": 0,
								"y": 0
							}
						}
					]
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});
