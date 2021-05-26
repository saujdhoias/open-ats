"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GeneralConfig_js_1 = __importDefault(require("../../../../config/GeneralConfig.js"));
var client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
var nanoid_1 = require("nanoid");
var Joi = __importStar(require("joi"));
var descriptionMaxLength = GeneralConfig_js_1.default.FUNNEL_DESCRIPTION_MAX_LENGTH;
var idLength = GeneralConfig_js_1.default.ID_GENERATION_LENGTH;
var dynamodb = new client_dynamodb_1.DynamoDB(GeneralConfig_js_1.default.DYNAMO_CONFIG);
var JoiConfig = GeneralConfig_js_1.default.JOI_CONFIG;
var createFunnel = function (funnel) { return __awaiter(void 0, void 0, void 0, function () {
    var FunnelSchema, validation, newFunnelId, _a, type, lowEnd, highEnd, currency, fixed, fixedDescription, params, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                FunnelSchema = Joi.object({
                    title: Joi.string().required(),
                    locations: Joi.array().items(Joi.string()).required(),
                    description: Joi.string().max(descriptionMaxLength).required(),
                    pay: Joi.object({
                        type: Joi.valid.apply(Joi, GeneralConfig_js_1.default.VALID_PAY_TYPES).required(),
                        lowEnd: Joi.string(),
                        highEnd: Joi.string(),
                        fixed: Joi.string(),
                        fixedDescription: Joi.string(),
                        currency: Joi.string().length(3).required(),
                    })
                        .and("currency", "type") // Both are required
                        .without("fixed", ["lowEnd", "highEnd"]) // Fixed cannot exist with lowEnd || highEnd
                        .with("lowEnd", "highEnd") // If lowEnd exists, you must include highEnd
                        .with("fixed", "fixedDescription") // If fixed exists, you must include fixedDescription
                        .without("fixedDescription", ["lowEnd", "highEnd"]), // fixedDescription cannot appear next to lowEnd || highEnd
                });
                validation = FunnelSchema.validate(funnel, JoiConfig);
                if (validation.error) {
                    return [2 /*return*/, {
                            message: "ERROR: " + validation.error.message,
                            status: 400,
                        }];
                }
                newFunnelId = nanoid_1.nanoid(idLength);
                _a = funnel.pay, type = _a.type, lowEnd = _a.lowEnd, highEnd = _a.highEnd, currency = _a.currency, fixed = _a.fixed, fixedDescription = _a.fixedDescription;
                params = {
                    Item: {
                        PK: { S: "FUNNEL#" + newFunnelId },
                        SK: { S: "FUNNEL#" + newFunnelId },
                        TYPE: { S: "Funnel" },
                        LOCATIONS: { SS: funnel.locations },
                        PAY_RANGE: {
                            M: {
                                type: { S: type },
                                lowEnd: { S: lowEnd ? lowEnd : "" },
                                highEnd: { S: highEnd ? highEnd : "" },
                                fixed: { S: fixed ? fixed : "" },
                                fixedDescription: { S: fixedDescription ? fixedDescription : "" },
                                currency: { S: currency },
                            },
                        },
                        DESCRIPTION: { S: funnel.description },
                        FUNNEL_ID: { S: newFunnelId },
                        FUNNEL_TITLE: { S: funnel.title },
                    },
                    TableName: "OpenATS", // TODO move to parameter store?
                };
                console.log(JSON.stringify(params));
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, dynamodb.putItem(params)];
            case 2:
                _b.sent();
                return [2 /*return*/, { message: "Funnel  " + funnel.title + " created!", status: 201 }];
            case 3:
                error_1 = _b.sent();
                console.error("Error occurred creating a funnel", error_1);
                return [2 /*return*/, {
                        message: "ERROR: Unable to create your funnel - " + error_1.message,
                        status: 500,
                    }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = createFunnel;