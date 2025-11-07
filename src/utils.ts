import { uniqueEntityNames, codePointToEntityName, entityNameToCodePoint } from "./namedentities";

/**
 * Global type extensions for String prototype
 * 
 * @global
 */
declare global {
    interface String {
        /**
         * Converts a string to lowercase safely using the specified locale
         * @param {string|string[]} [locale] - Optional locale(s) to use for the conversion
         * @returns {string} The lowercase version of the string
         */
        safeToLowerCase(locale?: string | string[]): string;

        /**
         * Converts a string to uppercase safely using the specified locale
         * @param {string|string[]} [locale] - Optional locale(s) to use for the conversion
         * @returns {string} The uppercase version of the string
         */
        safeToUppercase(locale?: string | string[]): string;
    }
}

/**
 * Regular expression patterns for various text processing operations
 * 
 * @namespace
 * @property {RegExp} fileExtension - Matches file extensions (2-11 characters after dot)
 * @property {RegExp} base64 - Validates Base64 encoded strings
 * @property {RegExp} locale - Validates locale strings (e.g., 'en-US', 'hu')
 * @property {RegExp} hexNumericEntity - Matches HTML hexadecimal numeric entities (&#xHHHH;)
 * @property {RegExp} namedEntity - Matches HTML named entities (&name;)
 * @property {RegExp} decimalEntity - Matches HTML decimal entities (&#DDDD;)
 * @property {RegExp} unicode4HexDigit - Matches 4-digit Unicode escape sequences (\uXXXX)
 * @property {RegExp} unicode8HexDigit - Matches 8-digit Unicode escape sequences (\UXXXXXXXX)
 * @property {RegExp} backslash6HexDigit - Matches 6-digit hexadecimal escape sequences (\XXXXXX)
 * @property {RegExp} uPlusCodePoint - Matches Unicode code point notation (U+XXXX)
 * @property {RegExp} unicodeBracedCodePoint - Matches ES6 Unicode code point escapes (\u{XXX})
 * @property {RegExp} unicodeBracedHexadecimal - Matches extended hexadecimal escapes (\x{XXX})
 * @property {RegExp} hexCodePoint - Matches hexadecimal code point notation (0xXXX)
 */
const re = {
    fileExtension: /(\.[a-zA-Z0-9]{2,11})$/,
    base64: /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
    locale: /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)*$/,
    hexNumericEntity: /^&#x[0-9A-F]{4,};/,            // &#xHHHH;
    namedEntity: /^&([A-Za-z][A-Za-z0-9]{1,31});/,    // &name;
    decimalEntity: /^&#[0-9]+;/,                      // &#DDDD;
    unicode4HexDigit: /^\\u[0-9A-Fa-f]{4}/,           // \uXXXX
    unicode8HexDigit: /^\\U[0-9A-Fa-f]{8}/,           // \UXXXXXXXX
    backslash6HexDigit: /^\\[0-9A-Fa-f]{6}\s?/,       // \XXXXXX
    uPlusCodePoint: /^U\+[0-9A-Fa-f]{4,6}/,           // U+XXXX, U+XXXXX or U+XXXXXX
    unicodeBracedCodePoint: /^\\u\{[0-9A-Fa-f]+\}/,   // \u{XXX}
    unicodeBracedHexadecimal: /^\\x\{[0-9A-Fa-f]+\}/, // \x{XXX}
    hexCodePoint: /^0x[0-9A-Fa-f]+/,                  // 0xXXX
};

// Common dash characters to normalize to standard hyphen (U+002D)
const dashCharacters = new Set([
    0x2010, // ‐ HYPHEN
    0x2011, // ‑ NON-BREAKING HYPHEN
    0x2012, // ‒ FIGURE DASH
    0x2013, // – EN DASH
    0x2014, // — EM DASH
    0x2015, // ― HORIZONTAL BAR
    0x2053, // ⁓ SWUNG DASH
    0x207B, // ⁻ SUPERSCRIPT MINUS
    0x208B, // ₋ SUBSCRIPT MINUS
    0x2212, // − MINUS SIGN
    0x2E3A, // ⸺ TWO-EM DASH
    0x2E3B, // ⸻ THREE-EM DASH
    0xFE58, // ﹘ SMALL EM DASH
    0xFE63, // ﹣ SMALL HYPHEN-MINUS
    0xFF0D, // － FULLWIDTH HYPHEN-MINUS
]);

// Space characters to normalize to standard space (U+0020)
const spaceCharacters = new Set([
    0x00A0, //   NO-BREAK SPACE
    0x1680, //   OGHAM SPACE MARK
    0x2000, //   EN QUAD
    0x2001, //   EM QUAD
    0x2002, //   EN SPACE
    0x2003, //   EM SPACE
    0x2004, //   THREE-PER-EM SPACE
    0x2005, //   FOUR-PER-EM SPACE
    0x2006, //   SIX-PER-EM SPACE
    0x2007, //   FIGURE SPACE
    0x2008, //   PUNCTUATION SPACE
    0x2009, //   THIN SPACE
    0x200A, //   HAIR SPACE
    0x202F, //   NARROW NO-BREAK SPACE
    0x205F, //   MEDIUM MATHEMATICAL SPACE
    0x3000, // 　 IDEOGRAPHIC SPACE
    0xFEFF, // ﻿ ZERO WIDTH NO-BREAK SPACE (BOM)
]);

// Invisible/zero-width characters to remove (not convert to space)
const invisibleCharacters = new Set([
    0x200B, // ZERO WIDTH SPACE
    0x200C, // ZERO WIDTH NON-JOINER
    // 0x200D, // ZERO WIDTH JOINER - Preserve zero width joiner
    0x2060, // WORD JOINER - Remove invisible spaces
    0xFEFF, // ZERO WIDTH NO-BREAK SPACE (when not at start)
]);

// Add safe string methods to String prototype if they don't exist
if (!String.prototype.safeToLowerCase) {
    String.prototype.safeToLowerCase = function (locale?: string | string[]): string {
        return this.toLocaleLowerCase(locale);
    };
}

if (!String.prototype.safeToUppercase) {
    String.prototype.safeToUppercase = function (locale?: string | string[]): string {
        return this.toLocaleUpperCase(locale);
    };
}

/**
 * Text transformation and encoding utilities
 * 
 * Provides comprehensive text processing capabilities including:
 * - Case conversion with locale support
 * - Text normalization and cleaning
 * - Encoding/decoding for various formats (Base64, URL, HTML entities)
 * - Unicode code point manipulation
 * - GUID generation
 * - Slugification and case formatting
 * 
 * @module TextUtils
 */

export function validateSortLocale(sortLocale: string, defaultLocale: string): string | string[] {
    try {
        return filterUserLocaleInput(defaultLocale, sortLocale);
    } catch (_) {
        return defaultLocale;
    }
}

/**
 * Converts a string to lowercase safely using the specified locale
 * Falls back to `toLowerCase` if `toLocaleLowerCase` fails
 * 
 * @param {string} text - The string to convert
 * @param {string[]} locale - Optional locale(s) to use for the conversion
 * 
 * @returns {string} The lowercase version of the string
 */
export function safeToLowerCase(text: string, locale: string[]): string {
    if (typeof text !== "string") {
        return text;
    }

    if (locale.length > 0) {
        try {
            return text.toLocaleLowerCase(locale);
        } catch (_) {
            return text.toLowerCase();
        }
    } else {
        return text.toLowerCase();
    }
}

/**
 * Converts a string to uppercase safely using the specified locale
 * Falls back to `toUpperCase` if `toLocaleUpperCase` fails
 * 
 * @param {string} text - The string to convert
 * @param {string[]} locale - Optional locale(s) to use for the conversion
 * 
 * @returns {string} The uppercase version of the string
 */
export function safeToUppercase(text: string, locale: string[]): string {
    if (typeof text !== "string") {
        return text;
    }

    if (locale.length > 0) {
        try {
            return text.toLocaleUpperCase(locale);
        } catch (_) {
            return text.toUpperCase();
        }
    } else {
        return text.toUpperCase();
    }
}

/**
 * Validates and filters user-provided locale input
 * 
 * Parses comma-separated locale strings and validates them using Intl.Locale
 * Returns unique, validated locales or throws an error if no valid locales found
 * 
 * @param {string} defaultLocale - The default locale to use as fallback
 * @param {string} userLocaleInput - User input containing comma-separated locales
 * @returns {string[]} Array of validated locale strings
 * 
 * @throws {Error} If no valid locales are found in the input
 */
export function filterUserLocaleInput(defaultLocale: string, userLocaleInput: string): string[] {
    if (defaultLocale.length === 0) {
        throw new Error("Current locale cannot be empty.");
    }

    if (userLocaleInput.length === 0) {
        throw new Error("User locale input cannot be empty.");
    }

    const newLocales = userLocaleInput.split(",")
        .map(locale => locale.trim())
        .filter(locale => {
            if (locale.length < 2) {
                return false;
            }

            try {
                // Use Intl to check if it's a valid locale
                const intlLocale = new Intl.Locale(locale);

                return intlLocale.language.length >= 2;
            } catch {
                // If Intl.Locale fails, fall back to basic pattern check
                return re.locale.test(locale);
            }
        });

    if (newLocales.length > 0) {
        return [...new Set(newLocales)];
    }

    throw new Error(`No valid locales found in input: "${userLocaleInput}".`);
}

/**
 * Removes non-printable characters from text
 * 
 * Handles control characters, invisible whitespace, invalid surrogates, and special Unicode characters
 * while preserving valid surrogate pairs and variation selectors in appropriate contexts
 * 
 * @param {string} text - The input text to clean
 * 
 * @returns {string} The text with non-printable characters removed or replaced with spaces
 */
export function cleanText(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";
    let i = 0;

    while (i < text.length) {
        const char = text[i];
        const code = text.charCodeAt(i);

        // Check for dash characters to normalize
        if (dashCharacters.has(code)) {
            result += "-"; // Normalize to standard hyphen
            i++;
            continue;
        }

        // Check for space characters to normalize
        if (spaceCharacters.has(code)) {
            result += " "; // Normalize to standard space
            i++;
            continue;
        }

        // Remove invisible characters
        if (invisibleCharacters.has(code)) {
            i++;
            continue;
        }

        // Fast path for common printable ASCII
        if (code >= 0x20 && code <= 0x7E) {
            result += char;
            i++;
            continue;
        }

        // Preserve common whitespace and line endings
        if (code === 0x09 || code === 0x0A || code === 0x0D) { // \t, \n, \r
            result += char;
            i++;
            continue;
        }

        // Handle Unicode characters and surrogate pairs
        if (code >= 0xA0 && code <= 0xD7FF) {
            result += char;
            i++;
        } else if (code >= 0xE000 && code <= 0xFFFF) {
            result += char;
            i++;
        } else if (code >= 0xD800 && code <= 0xDBFF && i + 1 < text.length) {
            // Potential surrogate pair
            const nextCode = text.charCodeAt(i + 1);
            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                // Valid surrogate pair - preserve emojis and extended chars
                result += char + text[i + 1];
                i += 2;
            } else {
                // Isolated high surrogate - remove
                i++;
            }
        } else if (code >= 0xDC00 && code <= 0xDFFF) {
            // Isolated low surrogate - remove
            i++;
        } else {
            // Remove control characters and other non-printables
            i++;
        }
    }

    return result;
}

/**
 * Removes leading and trailing whitespace from each line
 * 
 * @param {string} text - The input text to process
 * 
 * @returns {string} The text with leading and trailing whitespace removed from each line
 */
export function removeLeadingTrailingWhitespace(text: string): string {
    if (typeof text !== "string") {
        return text;
    }
    
    // Split while capturing line endings
    const parts = text.split(/(\r?\n)/);
    
    let result = "";
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "\n" || part === "\r\n" || part === "\r") {
            // Preserve line endings as-is
            result += part;
        } else {
            // Trim content lines
            result += part.trim();
        }
    }
    
    return result;
}

/**
 * Converts a string into a slugified version, suitable for URLs or file names
 * 
 * Removes diacritics, special characters, and spaces, replacing them with specified separators
 * Handles multi-line text by processing each line separately while preserving line endings
 * Preserves file extensions when detected
 * 
 * @param {string} text - The string to slugify
 * @param {string} [separator="-"] - The separator to use between words
 * 
 * @returns {string} The slugified version of the string
 */
export function slugify(text: string, separator: string = "-"): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    // Check if text contains line breaks - if so, process each line separately
    if (text.includes("\n") || text.includes("\r")) {
        // Split while capturing the delimiters
        const parts = text.split(/(\r?\n)/);

        let result = "";

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            if (part === "\n" || part === "\r\n" || part === "\r") { // If it's a line break delimiter, preserve it as-is
                result += part;
            } else if (part.length > 0) { // If it's actual content, slugify it
                result += slugifySingleLine(part, separator);
            }

            // Empty strings (from consecutive line breaks) are skipped
        }

        return result;
    }

    // Single line processing
    return slugifySingleLine(text, separator);
}

/**
 * Slugifies a single line of text, preserving file extensions if present
 * 
 * @private
 * @param {string} text - The text to slugify
 * @param {string} separator - The separator to use
 * 
 * @returns {string} The slugified text
 */
function slugifySingleLine(text: string, separator: string): string {
    // Find the last dot position
    const lastDotIndex = text.lastIndexOf(".");

    // Quick check if there might be a file extension (contains a dot)
    if (lastDotIndex === -1 || lastDotIndex === text.length - 1) {
        return slugifyHelper(text, separator);
    }

    // Check if what follows the dot looks like a valid file extension
    const possibleExt = text.substring(lastDotIndex);
    if (!possibleExt.match(re.fileExtension)) {
        return slugifyHelper(text, separator);
    }

    // Process only the base name (everything except the extension)
    const baseName = text.substring(0, lastDotIndex);

    // Apply slugify to base name and reattach extension
    return slugifyHelper(baseName, separator) + possibleExt;
}

/**
 * Helper function to apply the slugify transformations
 * 
 * @private
 * @param {string} text - The text to process
 * @param {string} separator - The separator to use
 * 
 * @returns {string} The processed text
 */
function slugifyHelper(text: string, separator: string): string {
    // Remove diacritics (accent marks) and convert to lowercase in one step
    let normalized = text.normalize("NFD");

    // Remove combining marks and special characters in one regex operation
    normalized = normalized.replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Remove non-alphanumeric characters (except spaces)
    normalized = normalized.replace(new RegExp(`[^a-z0-9\s${separator}]`, "g"), " ");
    normalized = normalized.trim();

    // Replace spaces with hyphens
    normalized = normalized.replace(/\s+/g, separator);

    // Replace multiple hyphens with a single hyphen
    normalized = normalized.replace(new RegExp(`${separator}+`, "g"), separator);

    return normalized;
}

/**
 * Helper function to normalize text by removing diacritics, converting to lowercase, trimming whitespace,
 * and splitting into an array of words based on spaces, hyphens, or underscores. Empty words are filtered out.
 * 
 * @private
 * @param {string} text - The input string to normalize and split
 * 
 * @returns {string[]} An array of normalized words
 */
function normalizeToWords(text: string): string[] {
    // Step 1: Split camel/pascal case words
    const withSplitCase = text
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")   // Split camelCase: myVariable -> my Variable
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2"); // Split PascalCase: MyClass -> My Class

    // Step 2: Normalize text
    const normalized = withSplitCase
        .normalize("NFD")                        // Normalize diacritics
        .replace(/[\u0300-\u036f]/g, "")         // Remove diacritic marks
        .toLowerCase()                           // Convert to lowercase
        .replace(/[^a-z0-9\s]/g, " ")            // Remove non-alphanumeric characters (except spaces)
        .trim();                                 // Remove leading/trailing spaces

    // Step 3: Split and filter
    return normalized.split(/[\s\-_]+/).filter(word => word.length > 0);
}

/**
 * Capitalizes the first letter of a given word
 * 
 * @private
 * @param {string} word - The input word
 * 
 * @returns {string} The word with its first letter capitalized
 */
function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Converts a string to camelCase
 * 
 * Normalizes the input text, capitalizes the first letter of subsequent words, and joins them without spaces
 * The first word remains lowercase
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in camelCase
 */
export function toCamelCase(text: string): string {
    const words = normalizeToWords(text);
    if (words.length === 0) { return ""; }
    const [first, ...rest] = words;
    return first + rest.map(capitalize).join("");
}

/**
 * Converts a string to PascalCase
 * 
 * Normalizes the input text, capitalizes the first letter of each word, and joins them without spaces
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in PascalCase
 */
export function toPascalCase(text: string): string {
    return normalizeToWords(text)
        .map(capitalize)
        .join("");
}

/**
 * Converts a string to snake_case
 * 
 * Normalizes the input text and joins the words with underscores
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in snake_case
 */
export function toSnakeCase(text: string): string {
    return normalizeToWords(text).join("_");
}

/**
 * Converts a string to SCREAMING_SNAKE_CASE
 * 
 * Normalizes the input text, converts words to uppercase, and joins them with underscores
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in SCREAMING_SNAKE_CASE
 */
export function toScreamingSnakeCase(text: string): string {
    return normalizeToWords(text)
        .map(word => word.toUpperCase())
        .join("_");
}

/**
 * Converts a string to kebab-case
 * 
 * Normalizes the input text and joins the words with hyphens
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in kebab-case
 */
export function toKebabCase(text: string): string {
    return normalizeToWords(text).join("-");
}

/**
 * Converts a string to Train-Case
 * 
 * Normalizes the input text, converts words to uppercase, and joins them with hyphens
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in TRAIN-CASE
 */
export function toTrainCase(text: string): string {
    return normalizeToWords(text)
        .map(word => word.toUpperCase())
        .join("-");
}

/**
 * Converts a string to flatcase (all lowercase, no separators)
 * 
 * Normalizes the input text and joins the words without any separators
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in flatcase
 */
export function toFlatCase(text: string): string {
    return normalizeToWords(text).join("");
}

/**
 * Converts a string to UPPERCASE (all uppercase, no separators)
 * 
 * Normalizes the input text, converts words to uppercase, and joins them without any separators
 * 
 * @param {string} text - The input string to convert
 * 
 * @returns {string} The string in UPPERCASE format
 */
export function toUpperCase(text: string): string {
    return normalizeToWords(text)
        .map(word => word.toUpperCase())
        .join("");
}

/**
 * Encodes a string into Base64 format
 * 
 * @param {string} text - The string to encode
 * 
 * @returns {string} The Base64-encoded string
 */
export function base64Encode(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    return Buffer.from(text).toString("base64");
}

/**
 * Decodes a Base64-encoded string
 * 
 * @param {string} text - The Base64-encoded string to decode
 * 
 * @returns {string} The decoded string, or original string if decoding fails
 */
export function base64Decode(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    try {
        if (!isValidBase64(text)) {
            return text;
        }

        return Buffer.from(text, "base64").toString("utf-8");
    } catch (error) {
        return text;
    }
}

/**
 * Validates if a string is properly Base64 encoded
 * 
 * @param {string} text - The string to validate
 * 
 * @returns {boolean} True if the string is valid Base64
 */
export function isValidBase64(text: string): boolean {
    return re.base64.test(text);
}

/**
 * Encodes a string for use in a URL by escaping special characters
 * 
 * @param {string} text - The string to encode
 * 
 * @returns {string} The URL-encoded string
 */
export function urlEncode(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    return encodeURIComponent(text);
}

/**
 * Decodes a URL-encoded string
 * 
 * @param {string} text - The URL-encoded string to decode
 * 
 * @returns {string} The decoded string
 */
export function urlDecode(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return decodeURIComponent(text);
}

/**
 * Generates a random GUID (Globally Unique Identifier)
 * 
 * Uses version 4 UUID format with variant 10xx as specified in RFC 4122
 * 
 * @returns {string} A string representing a GUID in the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

 * @see {@link https://tools.ietf.org/html/rfc4122 | RFC 4122}
 */
export function generateGuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
        const rand = Math.random() * 16 | 0;

        const result = char === "x" ? rand : (rand & 0x3 | 0x8);

        return result.toString(16);
    }).toUpperCase();
}

/**
 * Checks if a string contains an HTML named character entity at the given position
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the entity if found, 0 otherwise
 */
function isHTMLNamedCharacterEntity(str: string, idx: number): number {
    const s = str.slice(idx);

    // Hex numeric form: &#xHHHH;
    let m = re.hexNumericEntity.exec(s);
    if (m) {
        return m[0].length;
    }

    // Named form: &name;
    m = re.namedEntity.exec(s);
    if (m && uniqueEntityNames.has(m[1])) {
        return m[0].length;
    }

    return 0;
}

/**
 * Converts a string to HTML/XML entity representation using named HTML entities
 * 
 * Handles common named HTML entities and encodes special HTML characters (&, <, >, ", ')
 * Non-ASCII characters are encoded as hexadecimal entities if no named entity exists
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded entities
 * 
 * @returns {string} The encoded string with named HTML entities
 */
export function encodeHTMLNamedCharacterEntity(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x26) { // &
            const len = isHTMLNamedCharacterEntity(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // Encode special HTML characters
        if (codePoint === 0x26) { // &
            result += "&amp;";
            i++;
            continue;
        }

        if (codePoint === 0x3C) { // <
            result += "&lt;";
            i++;
            continue;
        }

        if (codePoint === 0x3E) { // >
            result += "&gt;";
            i++;
            continue;
        }

        if (codePoint === 0x22) { // "
            result += "&quot;";
            i++;
            continue;
        }

        if (codePoint === 0x27) { // '
            result += "&apos;";
            i++;
            continue;
        }

        // Preserve all ASCII characters (0x00-0x7F) including control characters
        if (codePoint <= 0x7F) {
            result += text[i];
            i++;
            continue;
        }

        // For non-ASCII characters (0x80 and above), try named entity first
        const entityName = codePointToEntityName[codePoint];

        if (entityName) {
            result += `&${entityName};`;
        } else {
            // Non-ASCII without named entity, encode as hex entity
            const entity = codePoint.toString(16).toUpperCase().padStart(4, "0");

            result += `&#x${entity};`;
        }

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Converts a string containing named HTML/XML entities back to the original string
 * 
 * Handles common named HTML entities and hexadecimal numeric entities
 * Invalid entities are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The string to decode
 * 
 * @returns {string} The decoded string with named HTML entities resolved
 */
export function decodeHTMLNamedCharacterEntity(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    // Remove the decimal entity capture group from regex since you don't need it
    return text.replace(/&([A-Za-z]{1,32});|&#x([0-9a-fA-F]{1,8});/g, (match, name, hex) => {
        if (name) {
            // Handle named entity
            const codePoint = entityNameToCodePoint[name];

            if (codePoint) {
                try {
                    return String.fromCodePoint(codePoint);
                } catch {
                    return String.fromCodePoint(0xFFFD); // � if conversion fails
                }
            }
        } else if (hex) {
            // Handle numeric entity hex
            const codePoint = parseInt(hex, 16);

            if (isNaN(codePoint) ||
                codePoint < 1 ||
                codePoint > 0x10FFFF ||
                (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
                codePoint === 0xFFFE ||
                codePoint === 0xFFFF) {
                return String.fromCodePoint(0xFFFD); // �
            }

            try {
                return String.fromCodePoint(codePoint);
            } catch {
                return String.fromCodePoint(0xFFFD); // �
            }
        }

        return match;
    });
}

/**
 * Checks if a string contains an HTML hexadecimal character reference at the given position
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the entity if found, 0 otherwise
 */
function isHTMLHexadecimalCharacterReference(str: string, idx: number): number {
    const s = str.slice(idx);

    // Hex numeric form: &#xHHHH;
    let m = re.hexNumericEntity.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Converts a string to HTML/XML entity representation using hexadecimal code points
 * 
 * Handles ASCII characters, Unicode characters, emojis, and composite emojis
 * Creates entities in the format &#xXXXX; where XXXX is the hexadecimal code point
 * Special HTML characters (&, <, >, ", ') are encoded as hexadecimal entities
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded entities
 * 
 * @returns {string} The encoded string with each code point represented as a hexadecimal entity
 */
export function encodeHTMLHexadecimalCharacterReference(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x26) { // &
            const len = isHTMLHexadecimalCharacterReference(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // Encode special HTML characters as hex entities
        if (codePoint === 0x26) { // &
            result += "&#x26;";
            i++;
            continue;
        }
        if (codePoint === 0x3C) { // <
            result += "&#x3C;";
            i++;
            continue;
        }
        if (codePoint === 0x3E) { // >
            result += "&#x3E;";
            i++;
            continue;
        }
        if (codePoint === 0x22) { // "
            result += "&#x22;";
            i++;
            continue;
        }
        if (codePoint === 0x27) { // '
            result += "&#x27;";
            i++;
            continue;
        }

        // Preserve all ASCII characters (0x00-0x7F) including control characters
        if (codePoint <= 0x7F) {
            result += text[i];
            i++;
            continue;
        }

        // Non-ASCII without named entity, encode as hex entity
        const entity = codePoint.toString(16).toUpperCase().padStart(4, "0");

        result += `&#x${entity};`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Converts a string with HTML/XML hexadecimal entity representations back to the original string
 * 
 * Decodes entities in the format &#xXXXX; where XXXX is the hexadecimal code point
 * Also handles decimal entities (&#123;) for compatibility
 * Invalid entities are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The string with HTML/XML entities to decode (e.g., "&#x0012;")
 * 
 * @returns {string} The decoded string with original characters
 */
export function decodeHTMLHexadecimalCharacterReference(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    return text.replace(/&#x([0-9a-fA-F]{1,8});|&#([0-9]{1,7});/g, (match, hex, decimal) => {
        if (decimal || hex) {
            const codePoint = hex ? parseInt(hex, 16) : parseInt(decimal, 10);

            // Common validation for both hex and decimal
            if (isNaN(codePoint) ||
                codePoint < 1 ||  // Reject NULL character (0)
                codePoint > 0x10FFFF ||
                (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
                codePoint === 0xFFFE ||
                codePoint === 0xFFFF) {
                return String.fromCodePoint(0xFFFD); // �
            }

            try {
                return String.fromCodePoint(codePoint);
            } catch {
                return String.fromCodePoint(0xFFFD); // �
            }
        }

        return match;
    });
}

/**
 * Checks if a string contains an HTML decimal entity at the given position
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the entity if found, 0 otherwise
 */
function isHtmlDecimalEntity(str: string, idx: number): number {
    const s = str.slice(idx);

    // Decimal numeric form: &#1234;
    let m = re.decimalEntity.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Converts a string to HTML/XML entity representation using decimal code points
 * 
 * Handles ASCII characters, Unicode characters, emojis, and composite emojis
 * Creates entities in the format &#XXX;, &#XXXXXX; where 123 is the decimal code point
 * Special HTML characters (&, <, >, ", ') are encoded as decimal entities
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded entities
 * 
 * @returns {string} The encoded string with each code point represented as a decimal entity
 */
export function encodeHtmlDecimalEntities(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x26) { // &
            const len = isHtmlDecimalEntity(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // Encode special HTML characters as decimal entities
        if (codePoint === 0x26) { // &
            result += "&#38;";
            i++;
            continue;
        }
        if (codePoint === 0x3C) { // <
            result += "&#60;";
            i++;
            continue;
        }
        if (codePoint === 0x3E) { // >
            result += "&#62;";
            i++;
            continue;
        }
        if (codePoint === 0x22) { // "
            result += "&#34;";
            i++;
            continue;
        }
        if (codePoint === 0x27) { // '
            result += "&#39;";
            i++;
            continue;
        }

        // Preserve all ASCII characters (0x00-0x7F) including control characters
        if (codePoint <= 0x7F) {
            result += text[i];
            i++;
            continue;
        }

        // Format the code point as a decimal entity (without leading zeros)
        result += `&#${codePoint};`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Converts a string with HTML/XML decimal entity representations back to the original string
 * 
 * Decodes entities in the format &#XXX;, &#XXXXXX; where 123 is the decimal code point
 * Invalid entities are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The string with HTML/XML decimal entities to decode
 * 
 * @returns {string} The decoded string with original characters
 */
export function decodeHtmlDecimalEntities(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    // Pattern to match decimal entities (&#[0-9]+;)
    return text.replace(/&#([0-9]{1,7});/g, (match, decimal) => {
        if (decimal) {
            const codePoint = parseInt(decimal, 10);

            // Common validation for both hex and decimal
            if (isNaN(codePoint) ||
                codePoint < 1 ||  // Reject NULL character (0)
                codePoint > 0x10FFFF ||
                (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
                codePoint === 0xFFFE ||
                codePoint === 0xFFFF) {
                return String.fromCodePoint(0xFFFD); // �
            }

            try {
                return String.fromCodePoint(codePoint);
            } catch {
                return String.fromCodePoint(0xFFFD); // �
            }
        }

        return match;
    });
}

/**
 * Checks if a string contains a JavaScript UTF-16 escape sequence at the given position
 * 
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the escape sequence if found, 0 otherwise
 */
function isJavaScriptUTF16EscapeSequence(str: string, idx: number): number {
    const s = str.slice(idx);

    // \uXXXX (4 hex digits)
    let m = re.unicode4HexDigit.exec(s);
    if (m) {
        return m[0].length;
    }

    // \UXXXXXXXX (8 hex digits)
    m = re.unicode8HexDigit.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Encodes characters in a string to their JavaScript Unicode escape sequences
 * 
 * - ASCII characters remain unchanged
 * - BMP characters (U+0000 to U+FFFF) are encoded as "\\uXXXX" (4 hex digits, uppercase)
 * - Supplementary plane characters (U+10000 to U+10FFFF) are encoded as "\\UXXXXXXXX" (8 hex digits, uppercase)
 * 
 * These formats are standard in JavaScript (\uXXXX) and some other languages like C# (\UXXXXXXXX)
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded sequences
 * 
 * @returns {string} The encoded string with Unicode escape sequences

 * @see decodeJavaScriptUTF16EscapeSequence
 */
export function encodeJavaScriptUTF16EscapeSequence(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i += 1;
            continue;
        }

        if (!doubleEncode && codePoint === 0x5C && i + 1 < text.length && text.codePointAt(i + 1) === 0x75) { // \uXXXX
            const len = isJavaScriptUTF16EscapeSequence(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // if (codePoint <= 0x7f) {
        //     result += String.fromCodePoint(codePoint);
        //     i += 1;
        //     continue;
        // } 

        if (codePoint <= 0xffff) {
            const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");

            result += `\\u${hex}`;

            // Move to the next code point, handling surrogate pairs
            i += codePoint > 0xFFFF ? 2 : 1;
        } else {
            const hex = codePoint.toString(16).toUpperCase().padStart(8, "0");

            result += `\\U${hex}`;

            // Move to the next code point, handling surrogate pairs
            i += codePoint > 0xFFFF ? 2 : 1;
        }
    }

    return result;
}

/**
 * Decodes a string containing JavaScript Unicode escape sequences back to the original characters
 * 
 * Handles both:
 * - "\\uXXXX" format (4 hex digits) for BMP characters (U+0000 to U+FFFF)
 * - "\\UXXXXXXXX" format (8 hex digits) for supplementary plane characters (U+10000 to U+10FFFF)
 * 
 * Invalid sequences are preserved as-is in the output
 * 
 * @param {string} text - The string with Unicode escape sequences
 * 
 * @returns {string} The decoded string with original characters
 * 
 * @see encodeJavaScriptUTF16EscapeSequence
 */
export function decodeJavaScriptUTF16EscapeSequence(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(/\\U([0-9a-fA-F]{8})|\\u([0-9a-fA-F]{4})/g, (match, u8, u4) => {
        try {
            const codePoint = parseInt(u8 || u4, 16);

            // Comprehensive validation
            if (isNaN(codePoint) ||
                codePoint < 1 ||  // Reject NULL character (0)
                codePoint > 0x10FFFF ||
                (u8 && codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates only for \U
                codePoint === 0xFFFE ||
                codePoint === 0xFFFF) {
                return match; // Return original for invalid sequences
            }

            return String.fromCodePoint(codePoint);
        } catch (_) {
            return match; // Return original on any error
        }
    });
}

/**
 * Checks if a string contains a CSS Unicode escape at the given position
 * 
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the escape sequence if found, 0 otherwise
 */
function isCssUnicodeEscape(str: string, idx: number): number {
    const s = str.slice(idx);

    // \XXXXXX (backslash + 6 hex digits)
    let m = re.backslash6HexDigit.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Converts a string to CSS Unicode escape sequences
 * 
 * Non-ASCII characters (excluding non-breaking space) and characters outside the BMP 
 * are encoded as "\\XXXXXX", "\\XXXX" (uppercase hex followed by a space)
 * ASCII characters (0x00-0x7F) are preserved as-is
 * 
 * This is the standard escape format used in CSS for representing Unicode characters
 * 
 * @param {string} text - The input string containing emojis and special characters
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded sequences
 * 
 * @returns {string} A string with CSS Unicode escape sequences
 * 
 * @see decodeCssUnicodeEscape
 */
export function encodeCssUnicodeEscape(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i += 1;
            continue;
        }

        if (!doubleEncode && codePoint === 0x5C) { // \XXXXXX
            const len = isCssUnicodeEscape(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // ASCII characters (0x00-0x7F) - pass through
        if (codePoint <= 0x7f) {
            result += String.fromCodePoint(codePoint);
            i += 1;
            continue;
        }

        // BMP characters (0x80-0xFFFF) - use 4 hex digits
        if (codePoint <= 0xffff) {
            const hex = codePoint.toString(16).toUpperCase().padStart(4, "0");

            result += `\\${hex} `;

            i += 1;
        } else {
            // Non-BMP characters (0x10000-0x10FFFF) - use 6 hex digits
            const hex = codePoint.toString(16).toUpperCase().padStart(6, "0");

            result += `\\${hex} `;

            i += 2; // Surrogate pairs take 2 positions in UTF-16
        }
    }

    return result;
}

/**
 * Converts a string containing CSS Unicode escape sequences back to the original string
 * 
 * Matches Unicode escape sequences in the format "\\XXXXXX", "\\XXXX" 
 * (hex digits followed by an optional space)
 * Invalid sequences are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The input string containing CSS Unicode escape sequences
 * 
 * @returns {string} A string with the original characters, including emojis and special characters
 * 
 * @see encodeCssUnicodeEscape
 */
export function decodeCssUnicodeEscape(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    // Match CSS unicode escape with optional trailing space
    return text.replace(/\\([0-9a-fA-F]{1,6})(?: |(?=[^0-9a-fA-F]|$))/g, (match, hexCode, space) => {
        if (hexCode.length < 1 || hexCode.length > 6) {
            return match;
        }

        const codePoint = parseInt(hexCode, 16);

        if (isNaN(codePoint) ||
            codePoint < 1 ||  // Reject NULL character (0)
            codePoint > 0x10FFFF ||
            (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
            codePoint === 0xFFFE ||
            codePoint === 0xFFFF) {
            return String.fromCodePoint(0xFFFD); // �
        }

        try {
            return String.fromCodePoint(codePoint);
        } catch {
            return String.fromCodePoint(0xFFFD); // �
        }
    });
}

/**
 * Checks if a string contains Unicode code point notation at the given position
 * 
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the notation if found, 0 otherwise
 */
function isUnicodeCodePointNotation(str: string, idx: number): number {
    const s = str.slice(idx);

    // U+XXXX, U+XXXXX or U+XXXXXX
    let m = re.uPlusCodePoint.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Encodes a string into a Unicode code point notation sequence in the format "U+XXXX, U+XXXXX"
 * 
 * Each character's code point is converted to its hexadecimal representation 
 * (uppercase, padded to 4 digits) and prefixed with "U+"
 * This is the standard format used in Unicode specifications and documentation
 * The resulting code points are joined by spaces
 * 
 * @param {string} text - The input string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded sequences
 * 
 * @returns {string} The Unicode code point notation string (e.g., "U+0041 U+1F600")
 * 
 * @see decodeUnicodeCodePointNotation
 */
export function encodeUnicodeCodePointNotation(text: string, doubleEncode: boolean = false, separate: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x55 && i + 1 < text.length && text.codePointAt(i + 1) === 0x2B) { // U+
            const len = isUnicodeCodePointNotation(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // // Preserve all ASCII characters (0x00-0x7F) including control characters
        // if (codePoint <= 0x7F) {
        //     result += text[i];
        //     i++;
        //     continue;
        // }

        // Non-ASCII without named entity, encode as hex entity
        const entity = codePoint.toString(16).toUpperCase().padStart(4, "0");

        const space = separate ? " " : "";

        result += `U+${entity}${space}`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result.trimEnd();
}

/**
 * Decodes a Unicode code point notation sequence back to a string
 * 
 * Each token in the sequence (separated by spaces) is expected to be in the 
 * format "U+XXXX, U+XXXXX" (4 to 6 hexadecimal digits)
 * This format is the standard notation used in Unicode specifications and documentation
 * Surrogate code points are handled as individual code units
 * Invalid sequences are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The Unicode code point notation string to decode (e.g., "U+0041 U+1F600")
 * 
 * @returns {string} The decoded string with the original characters
 * 
 * @see encodeUnicodeCodePointNotation
 */
export function decodeUnicodeCodePointNotation(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    // Match individual U+XXXX tokens
    return text.replace(/U\+([0-9A-Fa-f]{4,6})\s?/g, (match, hex) => {
        const codePoint = parseInt(hex, 16);

        // Comprehensive validation
        if (isNaN(codePoint) ||
            codePoint < 1 ||  // Reject NULL character (0)
            codePoint > 0x10FFFF ||
            (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
            codePoint === 0xFFFE ||
            codePoint === 0xFFFF) {
            return String.fromCodePoint(0xFFFD); // �
        }

        try {
            return String.fromCodePoint(codePoint);
        } catch {
            return String.fromCodePoint(0xFFFD); // �
        }
    });
}

/**
 * Checks if a string contains a Unicode code point escape sequence at the given position
 * 
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the escape sequence if found, 0 otherwise
 */
function isUnicodeCodePointEscapeSequence(str: string, idx: number): number {
    const s = str.slice(idx);

    // \u{XXX} (braced, variable length)
    let m = re.unicodeBracedCodePoint.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Encodes a string into ES6 Unicode code point escape sequences using \u{XXXX} format
 * 
 * This format was introduced in ES6/ES2015 and can represent any Unicode code point,
 * including those beyond the Basic Multilingual Plane (BMP)
 * All ASCII characters (0x00-0x7F) including control characters are preserved as-is
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded sequences
 * 
 * @returns {string} The encoded string with Unicode escape sequences
 * 
 * @see decodeUnicodeCodePointEscapeSequence
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#unicode_code_point_escapes | MDN: Unicode code point escapes}
 */
export function encodeUnicodeCodePointEscapeSequence(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x5C && i + 1 < text.length && text.codePointAt(i + 1) === 0x75) { // \u{XXXX}
            const len = isUnicodeCodePointEscapeSequence(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // Preserve all ASCII characters (0x00-0x7F) including control characters
        if (codePoint <= 0x7F) {
            result += text[i];
            i++;
            continue;
        }

        // Non-ASCII without named entity, encode as hex entity
        const entity = codePoint.toString(16).toUpperCase();

        result += `\\u{${entity}}`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Decodes a string containing ES6 Unicode code point escape sequences in \u{XXXX} format
 * 
 * This decodes escape sequences introduced in ES6/ES2015 that can represent
 * any Unicode code point, including those beyond the Basic Multilingual Plane
 * Invalid sequences are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The string with Unicode escape sequences to decode
 * 
 * @returns {string} The decoded string with actual Unicode characters
 * 
 * @see encodeUnicodeCodePointEscapeSequence
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#unicode_code_point_escapes | MDN: Unicode code point escapes}
 */
export function decodeUnicodeCodePointEscapeSequence(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    return text.replace(/\\u\{([0-9A-Fa-f]{1,6})\}/g, (match, hex) => {
        const codePoint = parseInt(hex, 16);

        // Comprehensive validation
        if (isNaN(codePoint) ||
            codePoint < 1 ||  // Reject NULL character (0)
            codePoint > 0x10FFFF ||
            (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
            codePoint === 0xFFFE ||
            codePoint === 0xFFFF) {
            return String.fromCodePoint(0xFFFD); // �
        }

        try {
            return String.fromCodePoint(codePoint);
        } catch {
            return String.fromCodePoint(0xFFFD); // �
        }
    });
}

/**
 * Checks if a string contains a PCRE Unicode hexadecimal escape at the given position
 * 
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the escape sequence if found, 0 otherwise
 */
function isPCREUnicodeHexadecimalEcape(str: string, idx: number): number {
    const s = str.slice(idx);

    // \x{XXX} (braced, variable length)
    let m = re.unicodeBracedHexadecimal.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Encodes a string into extended hexadecimal escape sequences using \x{XXXX} format
 * 
 * Note that this format is not standard JavaScript syntax but is common in other
 * languages like Perl and PHP. It's implemented here as a custom format.
 * All ASCII characters (0x00-0x7F) including control characters are preserved as-is
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded sequences
 * 
 * @returns {string} The encoded string with hexadecimal escape sequences
 * 
 * @see decodePCREUnicodeHexadecimalEcape
 * @see {@link https://perldoc.perl.org/perlre#Unicode-Properties | Perl: Unicode Properties}
 */
export function encodePCREUnicodeHexadecimalEcape(text: string, doubleEncode: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x5C && i + 1 < text.length && text.codePointAt(i + 1) === 0x78) { // \x{XXXX}
            const len = isPCREUnicodeHexadecimalEcape(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // Preserve all ASCII characters (0x00-0x7F) including control characters
        if (codePoint <= 0x7F) {
            result += text[i];
            i++;
            continue;
        }

        // Non-ASCII without named entity, encode as hex entity
        const entity = codePoint.toString(16).toUpperCase();

        result += `\\x{${entity}}`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Decodes a string containing extended hexadecimal escape sequences in \x{XXXX} format
 * 
 * Note that this format is not standard JavaScript syntax but is implemented here
 * as a custom format similar to what's used in languages like Perl and PHP
 * Invalid sequences are replaced with the Unicode replacement character (�)
 * 
 * @param {string} text - The string with hexadecimal escape sequences to decode
 * 
 * @returns {string} The decoded string with actual Unicode characters
 * 
 * @see encodePCREUnicodeHexadecimalEcape
 * @see {@link https://perldoc.perl.org/perlre#Unicode-Properties | Perl: Unicode Properties}
 */
export function decodePCREUnicodeHexadecimalEcape(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    return text.replace(/\\x\{([0-9A-Fa-f]{1,6})\}/g, (match, hex) => {
        const codePoint = parseInt(hex, 16);

        // Comprehensive validation
        if (isNaN(codePoint) ||
            codePoint < 1 ||  // Reject NULL character (0)
            codePoint > 0x10FFFF ||
            (codePoint >= 0xD800 && codePoint <= 0xDFFF) || // Surrogates
            codePoint === 0xFFFE ||
            codePoint === 0xFFFF) {
            return String.fromCodePoint(0xFFFD); // �
        }

        try {
            return String.fromCodePoint(codePoint);
        } catch {
            return String.fromCodePoint(0xFFFD); // �
        }
    });
}

/**
 * Checks if a string contains a hexadecimal code point at the given position
 * 
 * @private
 * @param {string} str - The string to check
 * @param {number} idx - The position to check from
 * 
 * @returns {number} The length of the code point if found, 0 otherwise
 */
function isHexCodePoint(str: string, idx: number): number {
    const s = str.slice(idx);

    // 0xXXX (hex literal)
    let m = re.hexCodePoint.exec(s);
    if (m) {
        return m[0].length;
    }

    return 0;
}

/**
 * Encodes a string into a sequence of hexadecimal representations of its Unicode code points
 * 
 * Each code point is represented as "0x[hexadecimal value]" in uppercase
 * Control characters (U+0000 to U+001F) and space (U+0020) are preserved as-is
 * The resulting code points are separated by spaces
 * 
 * @param {string} text - The string to encode
 * @param {boolean} [doubleEncode=false] - Whether to encode already encoded sequences
 * 
 * @returns {string} The encoded string with hexadecimal code point representations
 * 
 * @see decodeHexCodePoints
 */
export function encodeHexCodePoints(text: string, doubleEncode: boolean = false, separate: boolean = false): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            result += text[i];
            i++;
            continue;
        }

        if (!doubleEncode && codePoint === 0x30 && i + 1 < text.length && text.codePointAt(i + 1) === 0x78) { // 0xXX
            const len = isHexCodePoint(text, i);

            if (len) {
                result += text.slice(i, i + len);
                i += len;
                continue;
            }
        }

        // Preserve all ASCII characters (0x00-0x7F) including control characters
        // if (codePoint <= 0x7F) {
        //     result += text[i];
        //     i++;
        //     continue;
        // }

        // Non-ASCII without named entity, encode as hex entity
        const entity = codePoint.toString(16).toUpperCase();

        const space = separate ? " " : "";

        result += `0x${entity}${space}`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result.trimEnd();
}

/**
 * Decodes a string containing hexadecimal representations of Unicode code points
 * 
 * Each code point is expected to be represented as "0x[hexadecimal value]"
 * These representations can optionally be separated by spaces
 * Invalid hexadecimal values will be replaced with the Unicode replacement character (U+FFFD)
 * 
 * @param {string} text - The string to decode
 * 
 * @returns {string} The decoded string with original characters
 * 
 * @see encodeHexCodePoints
 */
export function decodeHexCodePoints(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    if (text.length === 0) {
        return "";
    }

    return text.replace(/0x([0-9A-Fa-f]+)\s*(?=0x|$)/g, (match, hex) => {
        const codePoint = parseInt(hex, 16);

        // Comprehensive validation
        if (isNaN(codePoint) ||
            codePoint < 1 ||
            codePoint > 0x10FFFF ||
            (codePoint >= 0xD800 && codePoint <= 0xDFFF) ||
            codePoint === 0xFFFE ||
            codePoint === 0xFFFF) {
            return String.fromCodePoint(0xFFFD);
        }

        try {
            return String.fromCodePoint(codePoint);
        } catch {
            return String.fromCodePoint(0xFFFD);
        }
    });
}