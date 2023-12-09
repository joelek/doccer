import * as wtf from "@joelek/wtf";
import { Atom, ChildNode, Size } from "./shared";
import { VerticalLayoutNode } from "./vertical";

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

wtf.test(`VerticalLayoutNode should create one segment when there are no children.`, (assert) => {
	let node = new VerticalLayoutNode({});
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

wtf.test(`VerticalLayoutNode should provide each child with the size left in the current segment.`, (assert) => {
	let node = new VerticalLayoutNode({},
		new MockNode({ w: 0, h: 1 }),
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
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 0
					}
				},
				{
					"size": {
						"w": 0,
						"h": 1
					},
					"position": {
						"x": 0,
						"y": 1
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should pack the segments as densely as possible when the first segmentation point is before the first child.`, (assert) => {
	let node = new VerticalLayoutNode({},
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 }),
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 })
	);
	let atoms = node.createSegments({ w: 0, h: 12 }, { w: 0, h: 0 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 12
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 4
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 8
					}
				}
			],
			"prefix": [],
			"suffix": []
		},
		{
			"size": {
				"w": 0,
				"h": 4
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should pack the segments as densely as possible when the first segmentation point is within the first child.`, (assert) => {
	let node = new VerticalLayoutNode({},
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 }),
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 })
	);
	let atoms = node.createSegments({ w: 0, h: 12 }, { w: 0, h: 4 });
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
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		},
		{
			"size": {
				"w": 0,
				"h": 12
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 4
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 8
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should pack the segments as densely as possible when the first segmentation point is before the second child.`, (assert) => {
	let node = new VerticalLayoutNode({},
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 }),
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 })
	);
	let atoms = node.createSegments({ w: 0, h: 12 }, { w: 0, h: 8 });
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
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 4
					}
				}
			],
			"prefix": [],
			"suffix": []
		},
		{
			"size": {
				"w": 0,
				"h": 8
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 4
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should pack the segments as densely as possible when the first segmentation point is within the second child.`, (assert) => {
	let node = new VerticalLayoutNode({},
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 }),
		new MockNode({ w: 0, h: 4 }, { w: 0, h: 4 })
	);
	let atoms = node.createSegments({ w: 0, h: 12 }, { w: 0, h: 12 });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 12
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 4
					}
				},
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 8
					}
				}
			],
			"prefix": [],
			"suffix": []
		},
		{
			"size": {
				"w": 0,
				"h": 4
			},
			"atoms": [
				{
					"size": {
						"w": 0,
						"h": 4
					},
					"position": {
						"x": 0,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support height.`, (assert) => {
	let node = new VerticalLayoutNode({ height: 10 });
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

wtf.test(`VerticalLayoutNode should support height "50%".`, (assert) => {
	let node = new VerticalLayoutNode({ height: "50%" });
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

wtf.test(`VerticalLayoutNode should support height "extrinsic".`, (assert) => {
	let node = new VerticalLayoutNode({ height: "extrinsic" });
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

wtf.test(`VerticalLayoutNode should support height "intrinsic".`, (assert) => {
	let node = new VerticalLayoutNode({ height: "intrinsic" },
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
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support overflow "hidden".`, (assert) => {
	let node = new VerticalLayoutNode({ overflow: "hidden" });
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

wtf.test(`VerticalLayoutNode should support overflow "visible".`, (assert) => {
	let node = new VerticalLayoutNode({ overflow: "visible" });
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

wtf.test(`VerticalLayoutNode should support segmentation "auto".`, (assert) => {
	let node = new VerticalLayoutNode({ segmentation: "auto" },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 })
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
					}
				}
			],
			"prefix": [],
			"suffix": []
		},
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
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support segmentation "none".`, (assert) => {
	let node = new VerticalLayoutNode({ segmentation: "none" },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 })
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
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support width.`, (assert) => {
	let node = new VerticalLayoutNode({ width: 10 });
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

wtf.test(`VerticalLayoutNode should support width "50%".`, (assert) => {
	let node = new VerticalLayoutNode({ width: "50%" });
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

wtf.test(`VerticalLayoutNode should support width "extrinsic".`, (assert) => {
	let node = new VerticalLayoutNode({ width: "extrinsic" });
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

wtf.test(`VerticalLayoutNode should support width "intrinsic".`, (assert) => {
	let node = new VerticalLayoutNode({ width: "intrinsic" },
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
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align x "left" when there is no horizontal overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_x: "left", width: 8 },
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
					}
				},
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
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align x "left" when there is horizontal overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_x: "left", width: 8 },
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
					}
				},
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
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align x "center" when there is no horizontal overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_x: "center", width: 8 },
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
						"x": 3,
						"y": 0
					}
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 3,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align x "center" when there is horizontal overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_x: "center", width: 8 },
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
						"x": 3,
						"y": 0
					}
				},
				{
					"size": {
						"w": 10,
						"h": 0
					},
					"position": {
						"x": -1,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align x "right" when there is no horizontal overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_x: "right", width: 8 },
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
						"x": 6,
						"y": 0
					}
				},
				{
					"size": {
						"w": 2,
						"h": 0
					},
					"position": {
						"x": 6,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align x "right" when there is horizontal overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_x: "right", width: 8 },
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
						"x": 6,
						"y": 0
					}
				},
				{
					"size": {
						"w": 10,
						"h": 0
					},
					"position": {
						"x": -2,
						"y": 0
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align y "top" when there is no vertical overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_y: "top", height: 8 },
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
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align y "top" when there is vertical overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_y: "top", height: 8 },
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
					}
				},
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 0,
						"y": 2
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align y "middle" when there is no vertical overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_y: "middle", height: 8 },
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
						"y": 2
					}
				},
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 4
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align y "middle" when there is vertical overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_y: "middle", height: 8 },
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
						"y": -2
					}
				},
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
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align y "bottom" when there is no vertical overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_y: "bottom", height: 8 },
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
						"y": 4
					}
				},
				{
					"size": {
						"w": 0,
						"h": 2
					},
					"position": {
						"x": 0,
						"y": 6
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support align y "bottom" when there is vertical overflow.`, (assert) => {
	let node = new VerticalLayoutNode({ align_y: "bottom", height: 8 },
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
						"y": -4
					}
				},
				{
					"size": {
						"w": 0,
						"h": 10
					},
					"position": {
						"x": 0,
						"y": -2
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`VerticalLayoutNode should support gap.`, (assert) => {
	let node = new VerticalLayoutNode({ gap: 1 },
		new MockNode({ w: 0, h: 2 }),
		new MockNode({ w: 0, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 5
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
						"y": 3
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});
