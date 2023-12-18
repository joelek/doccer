# @joelek/doccer

Headless document generator.

## Sponsorship

The continued development of this software depends on your sponsorship. Please consider sponsoring this project if you find that the software creates value for you and your organization.

The sponsor button can be used to view the different sponsoring options. Contributions of all sizes are welcome.

Thank you for your support!

### Ethereum

Ethereum contributions can be made to address `0xf1B63d95BEfEdAf70B3623B1A4Ba0D9CE7F2fE6D`.

![](./eth.png)

## Installation

Releases follow semantic versioning and release packages are published using the GitHub platform. Use the following command to install the latest release.

```
npm install joelek/doccer#semver:^0.0
```

Use the following command to install the very latest build. The very latest build may include breaking changes and should not be used in production environments.

```
npm install joelek/doccer#master
```

NB: This project targets TypeScript 4 in strict mode.

## Roadmap

* Add support for word-break.
* Add support for fractional widths and heights to BoxNode.
* Improve PDF serialization.
* Add command-line tool.
* Add ImageNode.
* Add support for compound paths.
* Move Typesetter and FontHandler from truetype subproject.
* Move layout from pdf subproject.
* Improve computation of binary offsets in PDF serialization.
* Add support for absolute length units.
* Implement style extension.
* Re-use style types from EDF schema.
* Read all font attributes from truetype data.
* Use "extrinsic" as default width for all node types.
* Move string encoding to stdlib.
* Move generic tokenizer to stdlib.
* Move codepage handling to stdlib.
* Add stdlib dependency.
* Document features.
* Consider extracting truetype subproject into own project.
* Move font size into Typesetter.
* Consider improving handling of missing characters in PDF conversion.
* Add support for prefix and suffix nodes.
* Parse kerning data from truetype font.
* Parse ligature data from truetype font.
* Parse PDF increments.
* Serialize PDF increments.
