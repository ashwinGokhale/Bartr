"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
exports.api = express();
exports.api.get('/', (req, res) => {
    res.send('this is the api');
});
//# sourceMappingURL=api.js.map