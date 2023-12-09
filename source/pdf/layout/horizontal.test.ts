import * as wtf from "@joelek/wtf";
import { Atom, ChildNode, Size } from "./shared";
import { HorizontalLayoutNode } from "./horizontal";

class MockNode extends ChildNode {
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

wtf.test(`HorizontalLayoutNode should create one segment when there are no children.`, (assert) => {
	let node = new HorizontalLayoutNode({});
	let atoms = node.createSegments({ w: 0, h: 10 }, { w: 0, h: 2 });
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

wtf.test(`HorizontalLayoutNode should provide each child with the size left in the current segment.`, (assert) => {
	let node = new HorizontalLayoutNode({},
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

wtf.test(`HorizontalLayoutNode should support height.`, (assert) => {
	let node = new HorizontalLayoutNode({ height: 10 });
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

wtf.test(`HorizontalLayoutNode should support height "50%".`, (assert) => {
	let node = new HorizontalLayoutNode({ height: "50%" });
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

wtf.test(`HorizontalLayoutNode should support height "extrinsic".`, (assert) => {
	let node = new HorizontalLayoutNode({ height: "extrinsic" });
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

wtf.test(`HorizontalLayoutNode should support height "intrinsic".`, (assert) => {
	let node = new HorizontalLayoutNode({ height: "intrinsic" },
		new MockNode({ w: 0, h: 10 })
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

wtf.test(`HorizontalLayoutNode should support overflow "hidden".`, (assert) => {
	let node = new HorizontalLayoutNode({ overflow: "hidden" });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 0
			},
			"atoms": [],
			"prefix": [
				"0 0 0 0 re",
				"W",
				"n"
			],
			"suffix": []
		}
	]);
});

wtf.test(`HorizontalLayoutNode should support overflow "visible".`, (assert) => {
	let node = new HorizontalLayoutNode({ overflow: "visible" });
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

wtf.test(`HorizontalLayoutNode should support segmentation "auto".`, (assert) => {
	let node = new HorizontalLayoutNode({ segmentation: "auto" },
		new MockNode({ w: 1, h: 2 }),
		new MockNode({ w: 3, h: 2 }, { w: 5, h: 2 })
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

wtf.test(`HorizontalLayoutNode should support segmentation "none".`, (assert) => {
	let node = new HorizontalLayoutNode({ segmentation: "none" },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 }, { w: 0, h: 2 })
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

wtf.test(`HorizontalLayoutNode should support width.`, (assert) => {
	let node = new HorizontalLayoutNode({ width: 10 });
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

wtf.test(`HorizontalLayoutNode should support width "50%".`, (assert) => {
	let node = new HorizontalLayoutNode({ width: "50%" });
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

wtf.test(`HorizontalLayoutNode should support width "extrinsic".`, (assert) => {
	let node = new HorizontalLayoutNode({ width: "extrinsic" });
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

wtf.test(`HorizontalLayoutNode should support width "intrinsic".`, (assert) => {
	let node = new HorizontalLayoutNode({ width: "intrinsic" },
		new MockNode({ w: 10, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align x "left" when there is no horizontal overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_x: "left", width: 8 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 2, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align x "left" when there is horizontal overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_x: "left", width: 8 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 10, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align x "center" when there is no horizontal overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_x: "center", width: 8 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 2, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align x "center" when there is horizontal overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_x: "center", width: 8 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 10, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align x "right" when there is no horizontal overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_x: "right", width: 8 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 2, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align x "right" when there is horizontal overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_x: "right", width: 8 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 10, h: 0 })
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

wtf.test(`HorizontalLayoutNode should support align y "top" when there is no vertical overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_y: "top", height: 8 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 })
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

wtf.test(`HorizontalLayoutNode should support align y "top" when there is vertical overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_y: "top", height: 8 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 10 })
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

wtf.test(`HorizontalLayoutNode should support align y "middle" when there is no vertical overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_y: "middle", height: 8 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 })
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

wtf.test(`HorizontalLayoutNode should support align y "middle" when there is vertical overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_y: "middle", height: 8 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 10 })
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

wtf.test(`HorizontalLayoutNode should support align y "bottom" when there is no vertical overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_y: "bottom", height: 8 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 })
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

wtf.test(`HorizontalLayoutNode should support align y "bottom" when there is vertical overflow.`, (assert) => {
	let node = new HorizontalLayoutNode({ align_y: "bottom", height: 8 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 10 })
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

wtf.test(`HorizontalLayoutNode should support gap.`, (assert) => {
	let node = new HorizontalLayoutNode({ gap: 1 },
		new MockNode({ w: 2, h: 0 }),
		new MockNode({ w: 2, h: 0 })
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
