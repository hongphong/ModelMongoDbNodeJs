/*
 * @Author: Phong Pham Hong 
 * @Date: 2018-03-01 14:36:29 
 * @Last Modified by: Phong Pham Hong
 * @Last Modified time: 2018-06-13 14:14:32
 * 
 * Create some useful functions for whole projects
 */
var decode = require('urldecode')
/**
 * get current time in UTC
 */
function currentTimeUTC() {
    return new Date();
}
/**
 * get current time in UTC with timestamp format
 */
function currentTimeStampUTC() {
    return new Date().getTime();
}

/**
 * clean phone number
 */
function cleanPhoneNumber(number, removePlus) {
    if (number) {
        return (!removePlus ? "+" : "") + number.toString().replace(/\D/g, '');
    }
    return ""
}

function decodeURL(url) {
    try {
        return decode(url)
    } catch (e) {
        return url
    }
}

/**
 * validate namespace name that can be used for set categories or namespace
 * @param {*} s 
 */
function validateNameSpaceName(s) {
    try {
        var np = (s || '').replace(/^\s+|\s+$/g, '');
        if (np.match(/^[a-zA-Z_0-9]*$/)) {
            return np
        }
    } catch (e) {
    }
    return false;
}
/**
 * validate a number is int or not
 * @param {} n 
 */
function validateIsInt(n) {
    try {
        return Number(n).toString() === n.toString() && n % 1 === 0;
    } catch (e) {
        return false;
    }
}

/**
 * validate a number is float or not
 * @param {} n 
 */
function validateIsFloat(n) {
    try {
        return Number(n).toString() === n.toString() && n % 1 !== 0;
    } catch (e) {
        return false;
    }
}
/**
 * validate object is empty or not
 * @param {*} obj 
 */
function objectIsEmpty(obj) {
    return !obj || Object.keys(obj).length === 0;
}
/**
 * export functions
 */
module.exports = {
    currentTimeUTC: currentTimeUTC,
    currentTimeStampUTC: currentTimeStampUTC,
    cleanPhoneNumber: cleanPhoneNumber,
    decodeURL: decodeURL,
    validateNameSpaceName: validateNameSpaceName,
    validateIsInt: validateIsInt,
    validateIsFloat: validateIsFloat,
    objectIsEmpty: objectIsEmpty
}