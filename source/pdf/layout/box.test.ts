import * as wtf from "@joelek/wtf";
import { Atom, ChildNode, Size } from "./shared";
import { BoxNode } from "./box";

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

wtf.test(`BoxNode should support height.`, (assert) => {
	let node = new BoxNode({ height: 10 });
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

wtf.test(`BoxNode should support height "50%".`, (assert) => {
	let node = new BoxNode({ height: [50, "%"] });
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

wtf.test(`BoxNode should support height "extrinsic".`, (assert) => {
	let node = new BoxNode({ height: "extrinsic" });
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

wtf.test(`BoxNode should support height "intrinsic".`, (assert) => {
	let node = new BoxNode({ height: "intrinsic" },
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
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`BoxNode should support overflow "hidden".`, (assert) => {
	let node = new BoxNode({ overflow: "hidden" });
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

wtf.test(`BoxNode should support overflow "visible".`, (assert) => {
	let node = new BoxNode({ overflow: "visible" });
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

wtf.test(`BoxNode should support segmentation "auto".`, (assert) => {
	let node = new BoxNode({ segmentation: "auto" },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 2 })
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

wtf.test(`BoxNode should support segmentation "none".`, (assert) => {
	let node = new BoxNode({ segmentation: "none" },
		new MockSegmentedNode({ w: 0, h: 2 }),
		new MockSegmentedNode({ w: 0, h: 2 })
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

wtf.test(`BoxNode should support width.`, (assert) => {
	let node = new BoxNode({ width: 10 });
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

wtf.test(`BoxNode should support width "50%".`, (assert) => {
	let node = new BoxNode({ width: [50, "%"] });
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

wtf.test(`BoxNode should support width "extrinsic".`, (assert) => {
	let node = new BoxNode({ width: "extrinsic" });
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

wtf.test(`BoxNode should support width "intrinsic".`, (assert) => {
	let node = new BoxNode({ width: "intrinsic" },
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
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`BoxNode should support background color.`, (assert) => {
	let node = new BoxNode({ background_color: [0.1, 0.2, 0.3] });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 0
			},
			"atoms": [],
			"prefix": [
				"0.1 0.2 0.3 rg",
				"0 0 m",
				"0 0 l",
				"0 0 l",
				"0 0 l",
				"h",
				"f"
			],
			"suffix": []
		}
	]);
});

wtf.test(`BoxNode should support border color.`, (assert) => {
	let node = new BoxNode({ border_color: [0.1, 0.2, 0.3] });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 0,
				"h": 0
			},
			"atoms": [],
			"prefix": [],
			"suffix": [
				"0.1 0.2 0.3 RG"
			]
		}
	]);
});

wtf.test(`BoxNode should support border radius when clipping.`, (assert) => {
	let node = new BoxNode({ border_radius: 1, overflow: "hidden", width: 4, height: 4 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 4,
				"h": 4
			},
			"atoms": [],
			"prefix": [
				"0 -3 m",
				"0 -3.552 0.448 -4 1 -4 c",
				"3 -4 l",
				"3.552 -4 4 -3.552 4 -3 c",
				"4 -1 l",
				"4 -0.448 3.552 0 3 0 c",
				"1 0 l",
				"0.448 0 0 -0.448 0 -1 c",
				"h",
				"W",
				"n"
			],
			"suffix": []
		}
	]);
});

wtf.test(`BoxNode should support border radius when filling.`, (assert) => {
	let node = new BoxNode({ border_radius: 1, background_color: [0, 0, 0], width: 4, height: 4 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 4,
				"h": 4
			},
			"atoms": [],
			"prefix": [
				"0 0 0 rg",
				"0 -3 m",
				"0 -3.552 0.448 -4 1 -4 c",
				"3 -4 l",
				"3.552 -4 4 -3.552 4 -3 c",
				"4 -1 l",
				"4 -0.448 3.552 0 3 0 c",
				"1 0 l",
				"0.448 0 0 -0.448 0 -1 c",
				"h",
				"f"
			],
			"suffix": []
		}
	]);
});

wtf.test(`BoxNode should support border radius when stroking.`, (assert) => {
	let node = new BoxNode({ border_radius: 2, border_width: 1, width: 8, height: 8 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 8,
				"h": 8
			},
			"atoms": [],
			"prefix": [],
			"suffix": [
				"1 0 0 1 0.5 -0.5 cm",
				"1 w",
				"0 -5.5 m",
				"0 -6.328 0.672 -7 1.5 -7 c",
				"5.5 -7 l",
				"6.328 -7 7 -6.328 7 -5.5 c",
				"7 -1.5 l",
				"7 -0.672 6.328 0 5.5 0 c",
				"1.5 0 l",
				"0.672 0 0 -0.672 0 -1.5 c",
				"h",
				"S"
			]
		}
	]);
});

wtf.test(`BoxNode should support border width.`, (assert) => {
	let node = new BoxNode({ border_width: 1 });
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 2,
				"h": 2
			},
			"atoms": [],
			"prefix": [],
			"suffix": [
				"1 0 0 1 0.5 -0.5 cm",
				"1 w",
				"0 0 m",
				"0 -1 l",
				"1 -1 l",
				"1 0 l",
				"h",
				"S"
			]
		}
	]);
});

wtf.test(`BoxNode should support padding.`, (assert) => {
	let node = new BoxNode({ padding: [1] },
		new MockSegmentedNode({ w: 2, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 4,
				"h": 4
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 1,
						"y": 1
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});

wtf.test(`BoxNode should support padding "20%".`, (assert) => {
	let node = new BoxNode({ padding: [20, "%"], width: 50 },
		new MockSegmentedNode({ w: 2, h: 2 })
	);
	let atoms = node.createSegments({ w: 0, h: 0 }, { w: 0, h: Infinity });
	assert.equals(atoms, [
		{
			"size": {
				"w": 50,
				"h": 22
			},
			"atoms": [
				{
					"size": {
						"w": 2,
						"h": 2
					},
					"position": {
						"x": 10,
						"y": 10
					}
				}
			],
			"prefix": [],
			"suffix": []
		}
	]);
});
