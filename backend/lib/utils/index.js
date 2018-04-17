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
var firebase = require("firebase-admin");
var googleStorage = require("@google-cloud/storage");
var serviceAccount = require('../../serviceaccount.json');
var fbConfig = require('../../fbconfig.json');
var storage = googleStorage({
    projectId: serviceAccount.project_id,
    keyFilename: './serviceaccount.json'
});
var bucket = storage.bucket(fbConfig.storageBucket);
exports.uploadImageToStorage = function (file, id) {
    return new Promise(function (resolve, reject) {
        if (!file)
            reject('No image file');
        else if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/))
            reject("File: " + file.originalname + " is an invalid image type");
        else {
            var fileUpload_1 = bucket.file("posts/" + id + "/" + file.originalname);
            var blobStream = fileUpload_1.createWriteStream({
                metadata: {
                    contentType: file.mimetype
                }
            });
            blobStream.on('error', function (error) {
                console.error(error);
                reject('Something is wrong! Unable to upload at the moment.');
            });
            blobStream.on('finish', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + fileUpload_1.name.replace(/\//g, '%2F') + "?alt=media");
                    return [2];
                });
            }); });
            blobStream.end(file.buffer);
        }
    });
};
exports.deletePostfromStorage = function (postId) {
    return bucket.deleteFiles({
        prefix: "posts/" + postId + "/"
    })
        .then(function (value) { return null; })
        .catch(function (error) { return error; });
};
exports.successRes = function (res, responseData) { return res.send({ status: 200, responseData: responseData }); };
exports.errorRes = function (res, status, error) {
    return res.status(status).send({
        status: status,
        error: error
    });
};
exports.getIDToken = function (userToken) { return __awaiter(_this, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!userToken)
                    return [2, null];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4, firebase.auth().verifyIdToken(userToken, true)];
            case 2: return [2, _a.sent()];
            case 3:
                error_1 = _a.sent();
                return [2, null];
            case 4: return [2];
        }
    });
}); };
exports.authorized = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
    var userToken, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userToken = req.headers.token;
                _a = !userToken;
                if (_a) return [3, 2];
                return [4, exports.getIDToken(userToken)];
            case 1:
                _a = !(_b.sent());
                _b.label = 2;
            case 2:
                if (_a)
                    return [2, exports.errorRes(res, 401, 'Unauthorized')];
                return [2, next()];
        }
    });
}); };
//# sourceMappingURL=index.js.map