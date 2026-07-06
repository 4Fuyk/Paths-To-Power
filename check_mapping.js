const fs = require('fs');

const { normalizeName, getRegionIdFromNormalizedName } = require('./src/utils/mapUtils.ts'); // Wait, require won't work on TS directly without ts-node. Let's just implement the logic inline.

