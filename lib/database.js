"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.deleteAllUsers = exports.updateUser = exports.deleteUser = exports.createSpecialtiesTable = exports.initializeDatabase = void 0;
// src/utils/database.ts
var SQLite = require("expo-sqlite");
// Initialize the database and create the necessary tables if they don't exist
var initializeDatabase = function () { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, SQLite.openDatabaseAsync("app.db")];
            case 1:
                db = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                // Execute multiple SQL statements asynchronously
                return [4 /*yield*/, db.execAsync("\n      CREATE TABLE IF NOT EXISTS users (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        firstName TEXT,\n        lastName TEXT,\n        email TEXT UNIQUE,\n        phone TEXT,\n        password TEXT\n      );\n      CREATE TABLE IF NOT EXISTS specialties (\n        id TEXT PRIMARY KEY,\n        name TEXT,\n        icon TEXT,\n        description TEXT,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n      CREATE TABLE IF NOT EXISTS doctors (\n        id TEXT PRIMARY KEY,\n        first_name TEXT,\n        last_name TEXT,\n        title TEXT,\n        bio TEXT,\n        avatar_url TEXT,\n        specialty_id TEXT REFERENCES specialties(id),\n        rating NUMERIC,\n        reviews_count INTEGER,\n        is_available BOOLEAN,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
            case 3:
                // Execute multiple SQL statements asynchronously
                _a.sent();
                console.log("Database initialized with users, specialties, and doctors tables.");
                return [2 /*return*/, true];
            case 4:
                error_1 = _a.sent();
                console.error("Error initializing database:", error_1);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.initializeDatabase = initializeDatabase;
var createSpecialtiesTable = function () { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, SQLite.openDatabaseAsync("app.db")];
            case 1:
                db = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.execAsync("\n      CREATE TABLE IF NOT EXISTS specialties (\n        id TEXT PRIMARY KEY,\n        name TEXT,\n        icon TEXT,\n        description TEXT,\n        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n      );\n    ")];
            case 3:
                _a.sent();
                console.log("Specialties table created");
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error("Error creating specialties table:", error_2);
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createSpecialtiesTable = createSpecialtiesTable;
// // Call these functions to create the tables when initializing the database
// (async () => {
//   await createDoctorsTable();
//   await createSpecialtiesTable();
// })();
var deleteUser = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, SQLite.openDatabaseAsync("app.db")];
            case 1:
                db = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.runAsync("DELETE FROM users WHERE id = ?", [id])];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error("Error deleting user:", error_3);
                throw error_3; // Rethrow the error after logging it
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteUser = deleteUser;
var updateUser = function (id, firstName, lastName, email, phone, password) { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, SQLite.openDatabaseAsync("app.db")];
            case 1:
                db = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.runAsync("UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, password = ? WHERE id = ?", [firstName, lastName, email, phone, password, id])];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                console.error("Error updating user:", error_4);
                throw error_4; // Rethrow the error after logging it
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
var deleteAllUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, SQLite.openDatabaseAsync("app.db")];
            case 1:
                db = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.runAsync("DELETE FROM users")];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error("Error deleting all users:", error_5);
                throw error_5; // Rethrow the error after logging it
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteAllUsers = deleteAllUsers;
var addUser = function (firstName, lastName, email, phone, password) { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, SQLite.openDatabaseAsync("app.db")];
            case 1:
                db = _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.runAsync("INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?);", [firstName, lastName, email, phone, password])];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Error adding user:", error_6);
                throw error_6; // Rethrow the error after logging it
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.addUser = addUser;
