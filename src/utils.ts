import * as path from "path";
import { uniqueEntityNames, codePointToEntityName, entityNameToCodePoint } from "./namedentities";
import {
    CONTROL_CHARACTERS, DASH_CHARACTERS, SPACE_CHARACTERS, INVISIBLE_CHARACTERS, SPECIAL_REMOVE_CHARACTERS, SOFT_HYPHEN_MARKS,
    BASE_64_MAX_LENGTH, REGEX_BASE64, REGEX_LOCALE, REGEX_HEX_NUMERIC_ENTITY, REGEX_NAMED_ENTITY, REGEX_DECIMAL_ENTITY,
    REGEX_UNICODE4_HEX_DIGIT, REGEX_UNICODE8_HEX_DIGIT, REGEX_BACKSLASH6_HEX_DIGIT, REGEX_U_PLUS_CODE_POINT,
    REGEX_UNICODE_BRACED_CODE_POINT, REGEX_UNICODE_BRACED_HEXADECIMAL, REGEX_HEX_CODE_POINT, REGEX_EOL_SPLIT
} from "./constants";

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

    if (text.length === 0) {
        return "";
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

    if (text.length === 0) {
        return "";
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
                return REGEX_LOCALE.test(locale);
            }
        });

    if (newLocales.length > 0) {
        return [...new Set(newLocales)];
    }

    throw new Error(`No valid locales found in input: "${userLocaleInput}".`);
}

// Normalise invalid surrogate pairs to well-formed sequences.  If
// this changes the string length, we recompute the length below.
function normalizeText(text: string): string {
    if (typeof (text as any).toWellFormed === "function") {
        return (text as any).toWellFormed();
    }

    return text;
}

/**
 * Removes non-printable characters from text while preserving
 * visible characters needed for proper rendering in various
 * languages.  Direction marks and joining characters are kept,
 * bidirectional override characters are stripped, and valid
 * surrogate pairs are preserved.
 *
 * @param text The input text to clean.
 * @returns The text with non-printable characters removed or
 *          replaced with spaces.
 */
export function cleanText(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    text = normalizeText(text);

    const len = text.length;

    if (len === 0) {
        return "";
    }

    let result = "";
    let i = 0;

    while (i < len) {
        const code = text.charCodeAt(i);

        // Fast path for common printable ASCII (U+0020..U+007E)
        if (code >= 0x20 && code <= 0x7E) {
            result += text[i];
            i++;
            continue;
        }

        // Preserve essential whitespace (tab, newline, carriage return)
        if (code === 0x09 || code === 0x0A || code === 0x0D) {
            result += text[i];
            i++;
            continue;
        }

        // Remove unsafe bidi override characters
        // if (BIDI_OVERRIDE_CHARACTERS.has(code)) {
        //     i++;
        //     continue;
        // }

        // Remove C0/C1 control characters
        if (CONTROL_CHARACTERS.has(code)) {
            i++;
        } else if (DASH_CHARACTERS.has(code)) {
            // Normalise dashes to ASCII hyphen
            result += "-";
            i++;
        } else if (SPACE_CHARACTERS.has(code)) {
            // Normalise unusual spaces to standard space
            result += " ";
            i++;
        } else if (INVISIBLE_CHARACTERS.has(code)) {
            // Remove invisible characters
            i++;
        } else if (SPECIAL_REMOVE_CHARACTERS.has(code)) {
            // Remove problematic specials
            i++;
        } else if (SOFT_HYPHEN_MARKS.has(code)) {
            // Remove discretionary hyphen
            i++;
        } else if (code === 0x200D) {
            // Preserve Zero Width Joiner for emoji and scripts
            result += text[i];
            i++;
        } else if (code >= 0xD800 && code <= 0xDBFF) {
            // High surrogate; ensure it is paired with a low surrogate
            if (i + 1 < len) {
                const nextCode = text.charCodeAt(i + 1);
                if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                    // Preserve valid surrogate pair
                    result += text[i] + text[i + 1];
                    i += 2;
                } else {
                    // Skip unmatched high surrogate
                    i++;
                }
            } else {
                // Skip high surrogate at end of string
                i++;
            }
        } else if (code >= 0xDC00 && code <= 0xDFFF) {
            // Skip unpaired low surrogate
            i++;
        } else if (code >= 0xA0 && code <= 0xD7FF) {
            // Preserve BMP characters (Latin-1 Supplement through Hangul)
            result += text[i];
            i++;
        } else if (code >= 0xE000 && code <= 0xF8FF) {
            // Preserve Private Use Area
            result += text[i];
            i++;
        } else if (code >= 0xF900 && code <= 0xFFFD) {
            // Preserve CJK Compatibility and Specials (includes VS1-VS16)
            result += text[i];
            i++;
        } else if (code === 0xFFFE || code === 0xFFFF) {
            // Skip non-characters
            i++;
        } else {
            // Default: preserve other characters
            result += text[i];
            i++;
        }
    }
    return result;
}

/**
 * Removes leading and trailing whitespace from each line
 * 
 * @param {string} text - The input text to process
 * @param {boolean} preserveTabs - If true, only removes spaces (not tabs)
 * 
 * @returns {string} The text with leading and trailing whitespace removed from each line
 */
export function trimLineWhitespace(
    text: string,
    preserveTabs: boolean = false
): string {
    if (typeof text !== "string") {
        return text;
    }

    text = normalizeText(text);

    const len = text.length;

    if (len === 0) {
        return "";
    }

    /**
     * Helper function to check if a codepoint is whitespace
     * Includes all Unicode whitespace characters that should be trimmed
     */
    const isWhitespace = (code: number): boolean => {
        return code === 0x0020 || // Space
            code === 0x0009 || // Tab
            code === 0x000C || // Form feed
            code === 0x000B || // Vertical tab
            code === 0x00A0 || // Non-breaking space
            code === 0x1680 || // Ogham space mark
            code === 0x2000 || // En quad
            code === 0x2001 || // Em quad
            code === 0x2002 || // En space
            code === 0x2003 || // Em space
            code === 0x2004 || // Three-per-em space
            code === 0x2005 || // Four-per-em space
            code === 0x2006 || // Six-per-em space
            code === 0x2007 || // Figure space
            code === 0x2008 || // Punctuation space
            code === 0x2009 || // Thin space
            code === 0x200A || // Hair space
            code === 0x2028 || // Line separator
            code === 0x2029 || // Paragraph separator
            code === 0x202F || // Narrow no-break space
            code === 0x205F || // Medium mathematical space
            code === 0x3000 || // Ideographic space
            code === 0xFEFF;   // Zero-width no-break space (BOM)
    };

    // Use a single string builder approach for better performance
    let result = "";
    let lineStart = 0;

    for (let i = 0; i <= len; i++) {
        const code = i < len ? text.charCodeAt(i) : -1;
        const isEOL = code === 0x000A || code === 0x000D || i === len;

        if (isEOL) {
            // Determine line ending type
            let eol = "";
            let skipNext = false;

            if (i < len) {
                if (code === 0x000D && i + 1 < len && text.charCodeAt(i + 1) === 0x000A) {
                    eol = "\r\n";

                    skipNext = true; // Skip the \n in next iteration
                } else if (code === 0x000A) {
                    eol = "\n";
                } else if (code === 0x000D) {
                    eol = "\r";
                }
            }

            // Find first non-whitespace character from start
            let start = lineStart;

            while (start < i) {
                const c = text.charCodeAt(start);
                const shouldBreak = preserveTabs ?
                    (c === 0x0009 || !isWhitespace(c)) :
                    !isWhitespace(c);

                if (shouldBreak) {
                    break;
                }

                start++;
            }

            // Find last non-whitespace character from end
            let end = i - 1;

            while (end >= start) {
                const c = text.charCodeAt(end);
                const shouldBreak = preserveTabs ?
                    (c === 0x0009 || !isWhitespace(c)) :
                    !isWhitespace(c);

                if (shouldBreak) {
                    break;
                }

                end--;
            }

            // Build result string directly
            if (end >= start) {
                result += text.substring(start, end + 1);
            }

            result += eol;

            // Update lineStart for next iteration
            if (skipNext) {
                i++; // Skip the \n in \r\n
            }

            lineStart = i + 1;
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
        return text;
    }

    text = normalizeText(text);

    if (text.length === 0) {
        return "";
    }

    // Check if text contains line breaks - if so, process each line separately
    if (text.includes("\n") || text.includes("\r")) {
        const parts = text.split(REGEX_EOL_SPLIT);
        let result = "";

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];

            // If it's a line break delimiter, preserve it as-is
            if (part === "\n" || part === "\r\n" || part === "\r") {
                result += part;
            } else if (part.length > 0) {
                // If it's actual content, slugify it
                result += slugifySingleLine(part, separator);
            }
            // Empty strings (from consecutive line breaks) are skipped
        }

        return result;
    }

    // Single line processing
    return slugifySingleLine(text, separator);
}

function extractFileNameExt(str: string): string[] {
    const doubleExts = [
        ".tar.gz", ".tar.br", ".tar.bz2", ".tar.xz", ".tar.zst",
        ".tar.lz", ".tar.lzma", ".tar.lzo", ".tar.z", ".svg.gz",
    ];

    const lower = str.toLowerCase();

    for (const ext of doubleExts) {
        if (lower.endsWith(ext)) {
            return [str.slice(0, -ext.length), str.slice(str.length - ext.length)];
        }
    }

    if (str.startsWith("..")) {
        return [str.replace(/\.+/g, "."), ""];
    }

    if (str.startsWith(".")) {
        return ["", str];
    }

    const ext = path.extname(str);

    return [path.basename(str, ext), ext];
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
    const dotPrefix = text.startsWith(".") ? "." : "";

    // Use path.extname to detect file extensions
    const [baseName, ext] = extractFileNameExt(text);

    if (!baseName && ext) {
        return ext;
    }

    // Normal case: has both base name and extension
    if (baseName && ext) {
        return dotPrefix + slugifyHelper(baseName, separator) + ext.toLowerCase();
    }

    // No extension found
    return dotPrefix + slugifyHelper(text, separator);
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
    // Escape separator for regex use
    const escapedSeparator = separator.replace(/[-.*+?^${}()|[\]\\]/g, "\\$&");

    // Remove diacritics (accent marks) by normalizing to NFD
    let normalized = text.normalize("NFD");

    // Remove combining marks (the separated accent characters)
    normalized = normalized.replace(/[\u0300-\u036f]/g, "");

    // Convert to lowercase
    normalized = normalized.toLowerCase();

    // Keep alphanumeric, Unicode letters (CJK, Arabic, etc.), spaces, and the separator
    // This preserves non-Latin characters while removing most special characters
    normalized = normalized.replace(new RegExp(`[^a-z0-9\\s${escapedSeparator}\\p{L}]`, "gu"), " ");

    // Trim leading/trailing whitespace
    normalized = normalized.trim();

    // Replace one or more spaces with single separator
    normalized = normalized.replace(/\s+/g, separator);

    // Replace multiple consecutive separators with a single separator
    normalized = normalized.replace(new RegExp(`${escapedSeparator}{2,}`, "g"), separator);

    // Remove leading/trailing separators
    normalized = normalized.replace(new RegExp(`^${escapedSeparator}+|${escapedSeparator}+$`, "g"), "");

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

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

    if (text.length === 0) {
        return "";
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
    if (typeof text !== "string") {
        return false;
    }

    if (text.length > BASE_64_MAX_LENGTH) {
        return false;
    }

    return REGEX_BASE64.test(text);
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

    text = normalizeText(text);

    if (text.length === 0) {
        return "";
    }

    return encodeURI(text);
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
        return text;
    }

    text = normalizeText(text);

    if (text.length === 0) {
        return "";
    }

    return decodeURI(text);
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
    let m = REGEX_HEX_NUMERIC_ENTITY.exec(s);

    if (m) {
        return m[0].length;
    }

    // Named form: &name;
    m = REGEX_NAMED_ENTITY.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_HEX_NUMERIC_ENTITY.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_DECIMAL_ENTITY.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_UNICODE4_HEX_DIGIT.exec(s);

    if (m) {
        return m[0].length;
    }

    // \UXXXXXXXX (8 hex digits)
    m = REGEX_UNICODE8_HEX_DIGIT.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
    }

    if (text.length === 0) {
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
    let m = REGEX_BACKSLASH6_HEX_DIGIT.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_U_PLUS_CODE_POINT.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_UNICODE_BRACED_CODE_POINT.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_UNICODE_BRACED_HEXADECIMAL.exec(s);

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

    if (text.length === 0) {
        return "";
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
        return text;
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
    let m = REGEX_HEX_CODE_POINT.exec(s);
    
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

    if (text.length === 0) {
        return "";
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
        return text;
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