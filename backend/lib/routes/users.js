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
exports.router.get("/", utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var userDocs, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, firebase.firestore().collection('/users').get()];
            case 1:
                userDocs = _a.sent();
                return [2, utils.successRes(res, userDocs.docs.map(function (doc) { return doc.data(); }))];
            case 2:
                error_1 = _a.sent();
                console.error('Error:', error_1);
                return [2, utils.errorRes(res, 400, error_1)];
            case 3: return [2];
        }
    });
}); });
exports.router.get('/:uid', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var userSnap, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, firebase.firestore().doc("/users/" + req.params.uid).get()];
            case 1:
                userSnap = _a.sent();
                console.log('UserSnap:', userSnap.data());
                return [2, utils.successRes(res, userSnap.data())];
            case 2:
                error_2 = _a.sent();
                console.error('Error:', error_2);
                return [2, utils.errorRes(res, 400, error_2)];
            case 3: return [2];
        }
    });
}); });
exports.router.post('/:uid', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var tok, userRef, data, newUser, writeTime, _a, _b, _c, error_3;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                return [4, utils.getIDToken(req.headers.token)];
            case 1:
                tok = _d.sent();
                if (!tok)
                    return [2, utils.errorRes(res, 401, 'Invalid token')];
                if (tok.uid !== req.params.uid)
                    return [2, utils.errorRes(res, 401, 'Unauthorized')];
                if (!req.params.uid)
                    return [2, utils.errorRes(res, 400, 'User must have a uid')];
                if (!req.body.photoUrl)
                    return [2, utils.errorRes(res, 400, 'User must have a photo url')];
                if (!req.body.email)
                    return [2, utils.errorRes(res, 400, 'User must have a description')];
                if (!req.body.displayName)
                    return [2, utils.errorRes(res, 400, 'User must have a display name')];
                userRef = firebase.firestore().doc("/users/" + req.params.uid);
                return [4, userRef.get()];
            case 2:
                data = _d.sent();
                if (data.exists)
                    return [2, utils.errorRes(res, 400, "User: " + req.params.uid + " already exits")];
                newUser = {
                    uid: req.params.uid,
                    photoUrl: req.body.photoUrl,
                    displayName: req.body.displayName,
                    contactInfo: {
                        email: req.body.email,
                        address: req.body.address || '',
                        hideAddress: false,
                        phoneNumber: req.body.phoneNumber || '',
                        hidePhoneNumber: false
                    },
                    totalRatings: 5,
                    numRatings: 1,
                    lat: 0,
                    lng: 0,
                    radius: 25000
                };
                return [4, userRef.set(newUser)];
            case 3:
                writeTime = (_d.sent()).writeTime;
                _b = (_a = utils).successRes;
                _c = [res];
                return [4, userRef.get()];
            case 4: return [2, _b.apply(_a, _c.concat([(_d.sent()).data()]))];
            case 5:
                error_3 = _d.sent();
                console.error('Error:', error_3);
                return [2, utils.errorRes(res, 400, error_3)];
            case 6: return [2];
        }
    });
}); });
exports.router.put('/:uid', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var tok, userBuilder, contactBuilder, userRef, userSnap, _a, _b, _c, error_4;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 4, , 5]);
                console.log('Put user body:', req.body);
                return [4, utils.getIDToken(req.headers.token)];
            case 1:
                tok = _d.sent();
                if (!tok)
                    return [2, utils.errorRes(res, 401, 'Invalid token')];
                if (tok.uid !== req.params.uid)
                    return [2, utils.errorRes(res, 401, 'Unauthorized')];
                userBuilder = {};
                Object.assign(userBuilder, req.body.photoUrl && { photoUrl: req.body.photoUrl }, req.body.displayName && { displayName: req.body.displayName }, req.body.lat && { lat: req.body.lat }, req.body.lng && { lng: req.body.lng }, req.body.radius && { radius: req.body.radius });
                if (req.body.contactInfo) {
                    contactBuilder = {};
                    Object.assign(contactBuilder, req.body.contactInfo.address && { address: req.body.contactInfo.address }, req.body.contactInfo.phoneNumber && { phoneNumber: req.body.contactInfo.phoneNumber }, 'hideAddress' in req.body.contactInfo && { hideAddress: req.body.contactInfo.hideAddress ? true : false }, 'hidePhoneNumber' in req.body.contactInfo && { hidePhoneNumber: req.body.contactInfo.hidePhoneNumber ? true : false });
                    if (Object.keys(contactBuilder).length)
                        Object.assign(userBuilder, { contactInfo: contactBuilder });
                }
                userRef = firebase.firestore().doc("/users/" + req.params.uid);
                return [4, userRef.set(userBuilder, { merge: true })];
            case 2:
                userSnap = _d.sent();
                _b = (_a = utils).successRes;
                _c = [res];
                return [4, userRef.get()];
            case 3: return [2, _b.apply(_a, _c.concat([(_d.sent()).data()]))];
            case 4:
                error_4 = _d.sent();
                console.error('Error:', error_4);
                return [2, utils.errorRes(res, 400, error_4)];
            case 5: return [2];
        }
    });
}); });
exports.router.delete('/:uid', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var tok, userSnap, userPosts, batchDelete_1, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                return [4, utils.getIDToken(req.headers.token)];
            case 1:
                tok = _a.sent();
                if (!tok)
                    return [2, utils.errorRes(res, 401, 'Invalid token')];
                if (tok.uid !== req.params.uid)
                    return [2, utils.errorRes(res, 401, 'Unauthorized')];
                return [4, firebase.firestore().doc("/users/" + req.params.uid).get()];
            case 2:
                userSnap = _a.sent();
                return [4, firebase.firestore().doc("/users/" + req.params.uid).delete()];
            case 3:
                _a.sent();
                return [4, firebase.auth().deleteUser(tok.uid)];
            case 4:
                _a.sent();
                return [4, firebase.firestore().collection('/posts').where('userId', '==', req.params.uid).get()];
            case 5:
                userPosts = _a.sent();
                batchDelete_1 = firebase.firestore().batch();
                userPosts.forEach(function (post) { return batchDelete_1.delete(post.ref); });
                return [4, batchDelete_1.commit()];
            case 6:
                _a.sent();
                return [2, utils.successRes(res, userSnap.data())];
            case 7:
                error_5 = _a.sent();
                console.error('Error:', error_5);
                return [2, utils.errorRes(res, 400, error_5)];
            case 8: return [2];
        }
    });
}); });
//# sourceMappingURL=users.js.map