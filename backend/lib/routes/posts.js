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
var algoliasearch = require("algoliasearch");
var Multer = require("multer");
var axios_1 = require("axios");
var utils = require("../utils");
exports.router = express.Router();
var algolia = algoliasearch(process.env.ALGOLIA_APP, process.env.ALGOLIA_KEY);
var postsIndex = algolia.initIndex('posts');
var multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
exports.router.get("/geo", utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var posts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Geo Body:', req.body);
                console.log('Lat:', req.body.lat ? req.body.lat : 'NONE');
                if (!req.query.radius)
                    return [2, utils.errorRes(res, 400, 'Query must have a Radius')];
                if (isNaN(req.query.radius))
                    return [2, utils.errorRes(res, 400, 'Radius must be a number')];
                if (!req.query.lat)
                    return [2, utils.errorRes(res, 400, 'Query must have a Latitude')];
                if (isNaN(req.query.lat))
                    return [2, utils.errorRes(res, 400, 'Latitude must be a number')];
                if (!req.query.lng)
                    return [2, utils.errorRes(res, 400, 'Query must have a Longitude')];
                if (isNaN(req.query.lng))
                    return [2, utils.errorRes(res, 400, 'Longitude must be a number')];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, postsIndex.search({
                        aroundLatLng: req.query.lat + ", " + req.query.lng,
                        aroundRadius: req.query.radius
                    })];
            case 2:
                posts = _a.sent();
                return [2, utils.successRes(res, posts.hits)];
            case 3:
                error_1 = _a.sent();
                console.error('Error:', error_1);
                return [2, utils.errorRes(res, 400, error_1)];
            case 4: return [2];
        }
    });
}); });
exports.router.get('/user/:uid', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var resp, data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, firebase.firestore().collection('/posts').where('userId', '==', req.params.uid).get()];
            case 1:
                resp = _a.sent();
                data = resp.docs.map(function (doc) { return doc.data(); });
                console.log('User Posts:', data);
                return [2, utils.successRes(res, data)];
            case 2:
                error_2 = _a.sent();
                console.error('Error:', error_2);
                return [2, utils.errorRes(res, 400, error_2)];
            case 3: return [2];
        }
    });
}); });
exports.router.get("/", utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var resp, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, firebase.firestore().collection('/posts').get()];
            case 1:
                resp = _a.sent();
                return [2, utils.successRes(res, resp.docs.map(function (doc) { return doc.data(); }))];
            case 2:
                error_3 = _a.sent();
                console.error('Error:', error_3);
                return [2, utils.errorRes(res, 400, error_3)];
            case 3: return [2];
        }
    });
}); });
exports.router.get('/:postId', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var postSnap, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, firebase.firestore().doc("/posts/" + req.params.postId).get()];
            case 1:
                postSnap = _a.sent();
                return [2, utils.successRes(res, postSnap.data())];
            case 2:
                error_4 = _a.sent();
                console.error('Error:', error_4);
                return [2, utils.errorRes(res, 400, error_4)];
            case 3: return [2];
        }
    });
}); });
exports.router.delete('/:postId', utils.authorized, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var tok, post, val, err, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4, utils.getIDToken(req.headers.token)];
            case 1:
                tok = _a.sent();
                return [4, firebase.firestore().doc("/posts/" + req.params.postId).get()];
            case 2:
                post = _a.sent();
                if (post.data().userId !== tok.uid)
                    return [2, utils.errorRes(res, 401, 'Unauthorized')];
                return [4, firebase.firestore().doc("/posts/" + req.params.postId).delete()];
            case 3:
                val = _a.sent();
                return [4, utils.deletePostfromStorage(req.params.postId)];
            case 4:
                err = _a.sent();
                return [2, utils.successRes(res, post.data())];
            case 5:
                error_5 = _a.sent();
                console.error('Error:', error_5);
                return [2, utils.errorRes(res, 400, error_5)];
            case 6: return [2];
        }
    });
}); });
exports.router.put('/:postId', multer.array('photos', 12), utils.authorized, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var files, tok, lat, lng, data, postRef_1, postData, photoUrls, postBuilder, geoBuilder, _a, _b, _c, err_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                files = req.files ? req.files : Array();
                if (req.body.tags && !Array.isArray(req.body.tags))
                    req.body.tags = JSON.parse(req.body.tags);
                _d.label = 1;
            case 1:
                _d.trys.push([1, 10, , 11]);
                return [4, utils.getIDToken(req.headers.token)];
            case 2:
                tok = _d.sent();
                lat = parseInt(req.body.lat, 10);
                lng = parseInt(req.body.lng, 10);
                if (!req.body.address) return [3, 4];
                return [4, axios_1.default.get('https://maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            address: req.body.address,
                            key: process.env.GMAPS_KEY
                        }
                    })];
            case 3:
                data = (_d.sent()).data;
                if (!data.results.length)
                    return [2, utils.errorRes(res, 400, 'Invalid address: ' + req.body.address)];
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;
                _d.label = 4;
            case 4: return [4, firebase.firestore().doc("/posts/" + req.params.postId)];
            case 5:
                postRef_1 = _d.sent();
                return [4, postRef_1.get()];
            case 6:
                postData = _d.sent();
                if (!postData.exists)
                    return [2, utils.errorRes(res, 400, 'Post does not exist')];
                return [4, Promise.all(files.map(function (file) { return utils.uploadImageToStorage(file, postRef_1.id); }))];
            case 7:
                photoUrls = _d.sent();
                postBuilder = {};
                geoBuilder = {};
                Object.assign(postBuilder, { photoUrls: Object.values(postData.data().photoUrls).concat(photoUrls) }, req.body.title && { title: req.body.title }, req.body.description && { description: req.body.description }, (req.body.tags || req.body.title) && { tags: req.body.tags ? req.body.tags : req.body.title }, req.body.type && { type: req.body.type }, { lastModified: new Date() });
                Object.assign(geoBuilder, lat && { lat: lat }, lng && { lng: lng });
                if (Object.keys(geoBuilder))
                    Object.assign(postBuilder, { _geoloc: geoBuilder });
                return [4, postRef_1.set(postBuilder, { merge: true })];
            case 8:
                _d.sent();
                _b = (_a = utils).successRes;
                _c = [res];
                return [4, postRef_1.get()];
            case 9: return [2, _b.apply(_a, _c.concat([(_d.sent()).data()]))];
            case 10:
                err_1 = _d.sent();
                console.error('Error:', err_1);
                return [2, utils.errorRes(res, 400, err_1)];
            case 11: return [2];
        }
    });
}); });
exports.router.post('/', multer.array('photos', 12), utils.authorized, function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var files, tok, lat, lng, data, newPostRef_1, photoUrls, userSnap, postBuilder, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = req.files;
                if (!req.body.title)
                    return [2, utils.errorRes(res, 400, 'Post must have a title')];
                if (!files || !files.length)
                    return [2, utils.errorRes(res, 400, 'Post must have a picture')];
                if (!req.body.description)
                    return [2, utils.errorRes(res, 400, 'Post must have a description')];
                if (!req.body.type)
                    return [2, utils.errorRes(res, 400, 'Post must have a type')];
                if (req.body.type !== 'good' && req.body.type !== 'service')
                    return [2, utils.errorRes(res, 400, 'Invalid post type: ' + req.body.type)];
                if (!req.body.lat && !req.body.lng && !req.body.address)
                    return [2, utils.errorRes(res, 400, 'Post must have a Geo location or Address')];
                if (!Array.isArray(req.body.tags))
                    req.body.tags = JSON.parse(req.body.tags);
                console.log('Post body:', req.body);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4, utils.getIDToken(req.headers.token)];
            case 2:
                tok = _a.sent();
                if (!tok)
                    return [2, utils.errorRes(res, 401, 'Invalid token')];
                lat = parseInt(req.body.lat, 10);
                lng = parseInt(req.body.lng, 10);
                if (!req.body.address) return [3, 4];
                return [4, axios_1.default.get('https://maps.googleapis.com/maps/api/geocode/json', {
                        params: {
                            address: req.body.address,
                            key: process.env.GMAPS_KEY
                        }
                    })];
            case 3:
                data = (_a.sent()).data;
                if (!data.results.length)
                    return [2, utils.errorRes(res, 400, 'Invalid address: ' + req.body.address)];
                lat = data.results[0].geometry.location.lat;
                lng = data.results[0].geometry.location.lng;
                _a.label = 4;
            case 4:
                if (!lat)
                    return [2, utils.errorRes(res, 400, 'Invalid Latitude: ' + req.body.lat)];
                if (!lng)
                    return [2, utils.errorRes(res, 400, 'Invalid Longitude: ' + req.body.lng)];
                return [4, firebase.firestore().collection('/posts').doc()];
            case 5:
                newPostRef_1 = _a.sent();
                return [4, Promise.all(files.map(function (file) { return utils.uploadImageToStorage(file, newPostRef_1.id); }))];
            case 6:
                photoUrls = _a.sent();
                return [4, firebase.firestore().doc("/users/" + tok.uid).get()];
            case 7:
                userSnap = _a.sent();
                postBuilder = {};
                Object.assign(postBuilder, { photoUrls: photoUrls }, { title: req.body.title }, { description: req.body.description }, { tags: req.body.tags ? req.body.tags : req.body.title }, { type: req.body.type }, { state: 'PENDING' }, { postId: newPostRef_1.id }, { userId: tok.uid }, { displayName: userSnap.data().displayName }, { createdAt: new Date() }, { lastModified: new Date() }, { _geoloc: { lat: lat, lng: lng } });
                return [4, newPostRef_1.set(postBuilder)];
            case 8:
                _a.sent();
                return [2, utils.successRes(res, postBuilder)];
            case 9:
                err_2 = _a.sent();
                console.error('Error:', err_2);
                return [2, utils.errorRes(res, 400, err_2)];
            case 10: return [2];
        }
    });
}); });
//# sourceMappingURL=posts.js.map