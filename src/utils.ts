import * as namedentities from "./namedentities";

declare global {
    interface String {
        safeToLowerCase(locale?: string | string[]): string;
        safeToUppercase(locale?: string | string[]): string;
    }
}

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
 * Converts a string to lowercase safely using the specified locale.
 * Falls back to `toLowerCase` if `toLocaleLowerCase` fails.
 * @param text - The string to convert.
 * @param locale - Optional locale(s) to use for the conversion.
 * @returns The lowercase version of the string.
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
 * Converts a string to uppercase safely using the specified locale.
 * Falls back to `toUpperCase` if `toLocaleUpperCase` fails.
 * @param text - The string to convert.
 * @param locale - Optional locale(s) to use for the conversion.
 * @returns The uppercase version of the string.
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
 * @param text The input text
 * @returns The text with non-printable characters removed
 */
export function removeNonPrintableCharacters(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    // Set of control characters and invisible whitespace (including \u0000 and \u200B)
    const replaceWithSpace = new Set<number>([
        // C0 controls (0x00-0x1F) excluding tab, lf, cr
        ...Array.from({ length: 32 }, (_, i) => i).filter(c => ![9, 10, 13].includes(c)),
        // DEL and C1 controls (0x7F-0x9F)
        ...Array.from({ length: 33 }, (_, i) => i + 0x7F),
        // Special whitespace and invisible characters
        0x00A0, 0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005,
        0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x200B, 0x202F, 0x205F, 0x3000,
        0xFEFF, 0xFFFE, 0xFFFF
    ]);

    // Characters that should be preserved only when part of larger clusters
    const preserveInClusters = new Set<number>([
        0x200C, 0x200D,  // ZWJ/ZWNJ
        ...Array.from({ length: 16 }, (_, i) => 0xFE00 + i)  // Variation selectors
    ]);

    let result = "";
    let i = 0;
    const len = text.length;

    while (i < len) {
        const code = text.charCodeAt(i);

        // Handle surrogate pairs
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < len) {
            const nextCode = text.charCodeAt(i + 1);
            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                // Valid surrogate pair
                const codePoint = (code - 0xD800) * 0x400 + (nextCode - 0xDC00) + 0x10000;
                if (replaceWithSpace.has(codePoint)) {
                    result += " ";
                } else {
                    result += text[i] + text[i + 1];
                }
                i += 2;
                continue;
            }
        }

        // Handle invalid surrogates
        if ((code >= 0xDC00 && code <= 0xDFFF) ||  // Lone low surrogate
            (code >= 0xD800 && code <= 0xDBFF)) { // Lone high surrogate
            i++;
            continue;
        }

        // Handle characters that need replacement
        if (replaceWithSpace.has(code)) {
            result += " ";
            i++;
            continue;
        }

        // Handle characters that should be preserved only in clusters
        if (preserveInClusters.has(code)) {
            // Check if previous or next character forms a cluster
            const isInCluster =
                (i > 0 && !replaceWithSpace.has(text.charCodeAt(i - 1))) ||
                (i < len - 1 && !replaceWithSpace.has(text.charCodeAt(i + 1)));

            result += isInCluster ? text[i] : " ";
            i++;
            continue;
        }

        // Keep all other valid characters
        result += text[i];
        i++;
    }

    return result;
}

/**
 * Removes leading and trailing whitespace from each line
 * @param text The input text
 * @returns The text with leading and trailing whitespace removed
 */
export function removeLeadingTrailingWhitespace(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
        lines[i] = lines[i].trim();
    }

    return lines.join("\n");
}

/**
 * Converts a string into a slugified version, suitable for URLs or file names.
 * Removes diacritics, special characters, and spaces, replacing them with hyphens.
 * If the text contains multiple lines, each line is slugified separately.
 * @param text - The string to slugify.
 * @param separator - The separator to use (default: "-")
 * @returns The slugified version of the string.
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
 * Slugifies a single line of text, preserving file extensions if present.
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

// Helper function to apply the slugify transformations
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
 * @param text The input string to normalize and split.
 * @returns An array of normalized words.
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
 * Capitalizes the first letter of a given word.
 *
 * @param word The input word.
 * @returns The word with its first letter capitalized.
 */
function capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Converts a string to camelCase.
 * Normalizes the input text, capitalizes the first letter of subsequent words, and joins them without spaces.
 * The first word remains lowercase.
 *
 * @param text The input string to convert.
 * @returns The string in camelCase.
 */
export function toCamelCase(text: string): string {
    const words = normalizeToWords(text);
    if (words.length === 0) { return ""; }
    const [first, ...rest] = words;
    return first + rest.map(capitalize).join("");
}

/**
 * Converts a string to PascalCase.
 * Normalizes the input text, capitalizes the first letter of each word, and joins them without spaces.
 *
 * @param text The input string to convert.
 * @returns The string in PascalCase.
 */
export function toPascalCase(text: string): string {
    return normalizeToWords(text)
        .map(capitalize)
        .join("");
}

/**
 * Converts a string to snake_case.
 * Normalizes the input text and joins the words with underscores.
 *
 * @param text The input string to convert.
 * @returns The string in snake_case.
 */
export function toSnakeCase(text: string): string {
    return normalizeToWords(text).join("_");
}

/**
 * Converts a string to SCREAMING_SNAKE_CASE.
 * Normalizes the input text, converts words to uppercase, and joins them with underscores.
 *
 * @param text The input string to convert.
 * @returns The string in SCREAMING_SNAKE_CASE.
 */
export function toScreamingSnakeCase(text: string): string {
    return normalizeToWords(text)
        .map(word => word.toUpperCase())
        .join("_");
}

/**
 * Converts a string to kebab-case.
 * Normalizes the input text and joins the words with hyphens.
 *
 * @param text The input string to convert.
 * @returns The string in kebab-case.
 */
export function toKebabCase(text: string): string {
    return normalizeToWords(text).join("-");
}

/**
 * Converts a string to TRAIN-CASE.
 * Normalizes the input text, converts words to uppercase, and joins them with hyphens.
 *
 * @param text The input string to convert.
 * @returns The string in TRAIN-CASE.
 */
export function toTrainCase(text: string): string {
    return normalizeToWords(text)
        .map(word => word.toUpperCase())
        .join("-");
}

/**
 * Converts a string to flatcase (all lowercase, no separators).
 * Normalizes the input text and joins the words without any separators.
 *
 * @param text The input string to convert.
 * @returns The string in flatcase.
 */
export function toFlatCase(text: string): string {
    return normalizeToWords(text).join("");
}

/**
 * Converts a string to UPPERCASE (all uppercase, no separators).
 * Normalizes the input text, converts words to uppercase, and joins them without any separators.
 *
 * @param text The input string to convert.
 * @returns The string in UPPERCASE.
 */
export function toUpperCase(text: string): string {
    return normalizeToWords(text)
        .map(word => word.toUpperCase())
        .join("");
}

/**
 * Encodes a string into Base64 format.
 * @param text - The string to encode.
 * @returns The Base64-encoded string.
 */
export function base64Encode(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    return Buffer.from(text).toString("base64");
}

/**
 * Decodes a Base64-encoded string.
 * @param text - The Base64-encoded string to decode.
 * @returns The decoded string.
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

export function isValidBase64(text: string): boolean {
    return re.base64.test(text);
}

/**
 * Encodes a string for use in a URL by escaping special characters.
 * @param text - The string to encode.
 * @returns The URL-encoded string.
 */
export function urlEncode(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    return encodeURIComponent(text);
}

/**
 * Decodes a URL-encoded string.
 * @param text - The URL-encoded string to decode.
 * @returns The decoded string.
 */
export function urlDecode(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return decodeURIComponent(text);
}

/**
 * Generates a random GUID (Globally Unique Identifier).
 * @returns A string representing a GUID in the format `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.
 */
export function generateGuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
        const rand = Math.random() * 16 | 0;

        const result = char === "x" ? rand : (rand & 0x3 | 0x8);

        return result.toString(16);
    }).toUpperCase();
}

const validEntityNames = new Set(Object.values(namedentities.codePointToEntityName));

/**
 * Converts a string to HTML/XML entity representation using named HTML entities.
 * Handles common named HTML entities.
 *
 * @param text The string to encode.
 * @returns The encoded string with named HTML entities (e.g., "&amp;" for "&").
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
    if (m && validEntityNames.has(m[1])) {
        return m[0].length;
    }

    return 0;
}

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
        const entityName = namedentities.codePointToEntityName[codePoint];

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
 * Converts a string containing named HTML/XML entities back to the original string.
 * Handles common named HTML entities.
 *
 * @param text The string to decode.
 * @returns The decoded string with named HTML entities resolved.
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
            const codePoint = namedentities.entityNameToCodePoint[name];

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
 * Converts a string to HTML/XML entity representation using hexadecimal code points.
 * Handles ASCII characters, Unicode characters, emojis, and composite emojis.
 * Creates entities in the format &#xXXXX; where XXXX is the hexadecimal code point.
 *
 * @param text The string to encode.
 * @returns The encoded string with each code point represented as a hexadecimal entity (e.g., "&#x0012;").
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
 * Converts a string with HTML/XML hexadecimal entity representations back to the original string.
 * Decodes entities in the format &#xXXXX; where XXXX is the hexadecimal code point.
 *
 * @param text The string with HTML/XML entities to decode (e.g., "&#x0012;").
 * @returns The decoded string with original characters.
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
 * Converts a string to HTML/XML entity representation using decimal code points.
 * Handles ASCII characters, Unicode characters, emojis, and composite emojis.
 * Creates entities in the format &#XXX;, &#XXXXXX; where 123 is the decimal code point.
 *
 * @param text The string to encode.
 * @returns The encoded string with each code point represented as a decimal entity (e.g., "&#XXX;, &#XXXXXX;").
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
        if (codePoint === 0x3C) { // 
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
 * Converts a string with HTML/XML decimal entity representations back to the original string.
 * Decodes entities in the format &#XXX;, &#XXXXXX; where 123 is the decimal code point.
 *
 * @param text The string with HTML/XML decimal entities to decode.
 * @returns The decoded string with original characters.
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
 * Encodes characters in a string to their JavaScript Unicode escape sequences.
 * - ASCII characters remain unchanged
 * - BMP characters are encoded as "\\uXXXX" (Basic Multilingual Plane, uppercase hex)
 * - Characters in supplementary planes are encoded as "\\UXXXXXXXX" (lowercase hex)
 * 
 * These formats are standard in JavaScript (\uXXXX) and some other languages like C# (\UXXXXXXXX).
 *
 * @param text The string to encode.
 * @returns The encoded string with Unicode escape sequences.
 * @see decodeJavaScriptUTF16EscapeSequences
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
 * Decodes a string containing JavaScript Unicode escape sequences back to the original characters.
 * Handles both:
 * - "\\uXXXX" format (4 hex digits) for BMP characters
 * - "\\UXXXXXXXX" format (8 hex digits) for supplementary plane characters
 *
 * @param text The string with Unicode escape sequences.
 * @returns The decoded string with original characters.
 * @see encodeJavaScriptUTF16EscapeSequences
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
 * Converts a string to CSS Unicode escape sequences.
 * Non-ASCII characters (excluding non-breaking space) and characters outside the BMP 
 * are encoded as "\XXXXXX", "\XXXX" (uppercase hex followed by a space).
 * 
 * This is the standard escape format used in CSS for representing Unicode characters.
 *
 * @param text The input string containing emojis and special characters.
 * @returns A string with CSS Unicode escape sequences.
 * @see decodeCssUnicodeEscape
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
 * Converts a string containing CSS Unicode escape sequences back to the original string.
 * Matches Unicode escape sequences in the format "\XXXXXX", "\XXXX" 
 * (hex digits followed by an optional space).
 *
 * @param text The input string containing CSS Unicode escape sequences.
 * @returns A string with the original characters, including emojis and special characters.
 * @see encodeCssUnicodeEscape
 */
export function decodeCssUnicodeEscape(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    // Pattern matches \XXXXXX, \XXXX formats, case insensitive for hex digits
    return text.replace(/\\([0-9a-fA-F]{4,6}) ?/g, (match, hexCode) => {
        if (hexCode) {
            const codePoint = parseInt(hexCode, 16);
            // Check if it's a valid Unicode code point
            if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
                return match; // Return the original escape sequence
            }
            return String.fromCodePoint(codePoint);
        }
        return "";
    });
}

/**
 * Encodes a string into a Unicode code point notation sequence in the format "U+XXXX, U+XXXXX".
 * Each character's code point is converted to its hexadecimal representation 
 * (uppercase, padded to 4 digits) and prefixed with "U+".
 * This is the standard format used in Unicode specifications and documentation.
 * The resulting code points are joined by spaces.
 *
 * @param text The input string to encode.
 * @returns The Unicode code point notation string (e.g., "U+0041 U+1F600").
 * @see decodeUnicodeCodePointNotation
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

export function encodeUnicodeCodePointNotation(text: string, doubleEncode: boolean = false): string {
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

        result += `U+${entity}`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result.trimEnd();
}

/**
 * Decodes a Unicode code point notation sequence back to a string.
 * Each token in the sequence (separated by spaces) is expected to be in the 
 * format "U+XXXX, U+XXXXX" (4 to 6 hexadecimal digits).
 * This format is the standard notation used in Unicode specifications and documentation.
 * Surrogate code points are handled as individual code units.
 *
 * @param text The Unicode code point notation string to decode (e.g., "U+0041 U+1F600").
 * @returns The decoded string with the original characters.
 * @see encodeUnicodeCodePointNotation
 */
export function decodeUnicodeCodePointNotation(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(/(U\+[0-9A-Fa-f]{4,6}(?:\s+U\+[0-9A-Fa-f]{4,6})*)/g, match => {
        // Split code point sequence into individual tokens
        const tokens = match.split(/\s+/);

        const characters = tokens.map(token => {
            // Validate token format
            if (!/^U\+[0-9A-Fa-f]{4,6}$/.test(token)) {
                throw new Error(`Invalid Unicode token: ${token}`);
            }

            const hex = token.slice(2);

            const codePoint = parseInt(hex, 16);

            // Validate numerical range
            if (isNaN(codePoint) || codePoint < 0x0000 || codePoint > 0x10FFFF) {
                throw new Error(`Invalid code point: ${token}`);
            }

            // Handle surrogate pairs
            if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
                return String.fromCharCode(codePoint);
            }

            // Convert valid code points
            try {
                return String.fromCodePoint(codePoint);
            } catch (e) {
                throw new Error(`Invalid code point: ${token}`);
            }
        });

        return characters.join("");
    });
}

/**
 * Encodes a string into ES6 Unicode code point escape sequences using \u{XXXX} format.
 * This format was introduced in ES6/ES2015 and can represent any Unicode code point,
 * including those beyond the Basic Multilingual Plane (BMP).
 * All control characters (0x00-0x1F) and space (0x20) are preserved as-is.
 * 
 * @param {string} text - The string to encode
 * @returns {string} - The encoded string with Unicode escape sequences
 * @see decodeUnicodeCodePointEscapeSequence
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
 * Decodes a string containing ES6 Unicode code point escape sequences in \u{XXXX} format.
 * This decodes escape sequences introduced in ES6/ES2015 that can represent
 * any Unicode code point, including those beyond the Basic Multilingual Plane.
 * 
 * @param {string} text - The string with Unicode escape sequences to decode
 * @returns {string} - The decoded string with actual Unicode characters
 * @see encodeUnicodeCodePointEscapeSequence
 */
export function decodeUnicodeCodePointEscapeSequence(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(/\\u\{([0-9A-Fa-f]+)\}/g, (_, hex) => {
        const codePoint = parseInt(hex, 16);

        try {
            return String.fromCodePoint(codePoint);
        } catch (e) {
            return "";
        }
    });
}

/**
 * Encodes a string into extended hexadecimal escape sequences using \x{XXXX} format.
 * Note that this format is not standard JavaScript syntax but is common in other
 * languages like Perl and PHP. It's implemented here as a custom format.
 * All control characters (0x00-0x1F) and space (0x20) are preserved as-is.
 * 
 * @param {string} text - The string to encode
 * @returns {string} - The encoded string with hexadecimal escape sequences
 * @see decodePCREUnicodeHexadecimalEcape
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
 * Decodes a string containing extended hexadecimal escape sequences in \x{XXXX} format.
 * Note that this format is not standard JavaScript syntax but is implemented here
 * as a custom format similar to what's used in languages like Perl and PHP.
 * 
 * @param {string} text - The string with hexadecimal escape sequences to decode
 * @returns {string} - The decoded string with actual Unicode characters
 * @see encodePCREUnicodeHexadecimalEcape
 */
export function decodePCREUnicodeHexadecimalEcape(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(/\\x\{([0-9A-Fa-f]+)\}/g, (_, hex) => {
        const codePoint = parseInt(hex, 16);

        try {
            return String.fromCodePoint(codePoint);
        } catch (e) {
            return "";
        }
    });
}

/**
 * Encodes a string into a sequence of hexadecimal representations of its Unicode code points,
 * prefixed with "0xXX", "0xXXXXX". Control characters (U+0000 to U+001F) are preserved as is.
 *
 * @param {string} text The string to encode.
 * @param {boolean} [separate=false] If true, each encoded code point will be separated by a space.
 * @returns {string} The encoded string. If the input is not a string, it is returned as is.
 * @see decodeHexCodePoints
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

export function encodeHexCodePoints(text: string, doubleEncode: boolean = false): string {
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

        result += `0x${entity}`;

        // Move to the next code point, handling surrogate pairs
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result.trimEnd();
}

/**
 * Decodes a string containing hexadecimal representations of Unicode code points,
 * where each code point is represented as "0x[hexadecimal value]".
 * These representations can optionally be separated by spaces.
 * Invalid hexadecimal values will be replaced with the Unicode replacement character (U+FFFD).
 *
 * @param {string} text The string to decode.
 * @returns {string} The decoded string. If the input is not a string, an empty string is returned.
 * @see encodeHexCodePoints
 */
export function decodeHexCodePoints(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(/0x([0-9A-Fa-f]+)\s*(?=0x|$)/g, (_, hex) => {
        const codePoint = parseInt(hex, 16);

        try {
            return String.fromCodePoint(codePoint);
        } catch (e) {
            return "";
        }
    });
}