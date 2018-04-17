"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var firebase = require("firebase-admin");
var utils = require("../utils");
exports.router = express.Router();
exports.router.post('/', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _a, userID, raterID, value, rater, user, rating;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Rating body:', req.body);
                _a = req.body, userID = _a.userID, raterID = _a.raterID;
                value = req.body.value;
                if (!raterID)
                    return [2, utils.errorRes(res, 400, 'Rating must have rater id')];
                if (!userID)
                    return [2, utils.errorRes(res, 400, 'Rating must have user id')];
                if (!value)
                    return [2, utils.errorRes(res, 400, 'Rating must have a value')];
                value = parseFloat(value);
                if (value < 0.5 || value > 5)
                    return [2, utils.errorRes(res, 400, 'Rating value must be <= 5 and >= 0.5')];
                return [4, firebase.firestore().collection('/users').where('uid', '==', raterID).get()];
            case 1:
                rater = _b.sent();
                return [4, firebase.firestore().collection('/users').where('uid', '==', userID).get()];
            case 2:
                user = _b.sent();
                if (rater.empty)
                    return [2, utils.errorRes(res, 400, "Rater with id: " + raterID + " does not exist")];
                if (user.empty)
                    return [2, utils.errorRes(res, 400, "User with id: " + userID + " does not exist")];
                rating = {
                    rater: raterID,
                    user: userID,
                    value: value
                };
                return [4, firebase.firestore().doc("/ratings/" + userID + "_" + raterID).set(rating)];
            case 3:
                _b.sent();
                return [2, utils.successRes(res, rating)];
        }
    });
}); });
//# sourceMappingURL=ratings.js.map