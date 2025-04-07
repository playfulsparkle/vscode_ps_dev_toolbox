declare global {
    interface String {
        safeToLowerCase(locale?: string | string[]): string;
        safeToUppercase(locale?: string | string[]): string;
    }
}

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
export function safeToLowerCase(text: string, locale?: string | string[]): string {
    if (typeof text !== "string") {
        return text;
    }

    try {
        return text.toLocaleLowerCase(locale);
    } catch (e) {
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
export function safeToUppercase(text: string, locale?: string | string[]): string {
    if (typeof text !== "string") {
        return text;
    }

    try {
        return text.toLocaleUpperCase(locale);
    } catch (e) {
        return text.toUpperCase();
    }
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

    // Pre-build a lookup Set for fast character checking
    const controlAndInvisibleChars = new Set([
        // C0 controls (0-31)
        ...Array.from({ length: 32 }, (_, i) => i),
        // DEL and C1 controls (127-159)
        ...Array.from({ length: 33 }, (_, i) => i + 127),
        // Zero-width and special control characters
        0x200B, 0x200C, 0x200D, 0x200E, 0x200F, 0x2028, 0x2029, 0xFEFF,
        // Invisible whitespace characters
        0x00A0, 0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004,
        0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000
    ]);

    // Use a single pass with a string builder approach
    let result = "";

    const len = text.length;

    for (let i = 0; i < len; i++) {
        const char = text.charAt(i);

        const charCode = text.charCodeAt(i);

        // Fast track for common ASCII printable characters
        if (charCode >= 32 && charCode <= 126) {
            result += char;

            continue;
        }

        // Handle whitespace that we want to keep
        if (charCode === 9 || charCode === 10 || charCode === 13) {
            result += char;

            continue;
        }

        // Check Unicode characters against our lookup set
        if (charCode >= 128 && !controlAndInvisibleChars.has(charCode)) {
            result += char;
        }

        // All other characters are excluded (non-printable)
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
 * @param text - The string to slugify.
 * @returns The slugified version of the string.
 */
export function slugify(text: string, separator: string = "-"): string {
    if (typeof text !== "string") {
        return text;
    }

    // Find the last dot position
    const lastDotIndex = text.lastIndexOf(".");

    // Quick check if there might be a file extension (contains a dot)
    if (lastDotIndex === -1 || lastDotIndex === text.length - 1) {
        return slugifyHelper(text, separator);
    }

    // Check if what follows the dot looks like a valid file extension
    const possibleExt = text.substring(lastDotIndex);

    if (!possibleExt.match(/(\.[a-zA-Z0-9]{2,11})$/)) {
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
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(text);
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

/**
 * Converts a string to HTML/XML entity representation using hexadecimal code points.
 * Handles ASCII characters, Unicode characters, emojis, and composite emojis.
 *
 * @param text The string to encode.
 * @returns The encoded string with each code point represented as a hexadecimal entity (e.g., "&#x0012;").
 */
export function encodeHtmlHexEntities(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    // Process the string code point by code point, not character by character
    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            i++;

            continue;
        }

        // Format the code point as a hex entity
        result += `&#x${codePoint.toString(16).toUpperCase().padStart(4, "0")};`;

        // Move to the next code point
        // For surrogate pairs (like emojis), this will move ahead by 2
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Converts a string with HTML/XML hexadecimal or decimal entity representations back to the original string.
 *
 * @param text The string with HTML/XML entities to decode (e.g., "&#x0012;").
 * @returns The decoded string with original characters.
 */
export function decodeHtmlHexEntities(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    // Pattern to match both hex (&#x[0-9a-fA-F]+;) entities
    return text.replace(/&#x([0-9a-fA-F]+);/g, (match, hex, decimal) => {
        if (hex !== undefined) {
            // Convert hex entity to character
            return String.fromCodePoint(parseInt(hex, 16));
        } else if (decimal !== undefined) {
            // Convert decimal entity to character
            return String.fromCodePoint(parseInt(decimal, 10));
        }

        return match; // This should never happen given the regex
    });
}

/**
 * Converts a string to HTML/XML entity representation using decimal code points.
 * Handles ASCII characters, Unicode characters, emojis, and composite emojis.
 *
 * @param text The string to encode.
 * @returns The encoded string with each code point represented as a decimal entity (e.g., "&#123;").
 */
export function encodeHtmlDecimalEntities(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    // Process the string code point by code point, not character by character
    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            i++;

            continue;
        }

        // Format the code point as a decimal entity (without leading zeros)
        result += `&#${codePoint};`;

        // Move to the next code point
        // For surrogate pairs (like emojis), this will move ahead by 2
        i += codePoint > 0xFFFF ? 2 : 1;
    }

    return result;
}

/**
 * Converts a string with HTML/XML decimal entity representations back to the original string.
 * Handles decimal entities (e.g., "&#123;").
 *
 * @param text The string with HTML/XML decimal entities to decode.
 * @returns The decoded string with original characters.
 */
export function decodeHtmlDecimalEntities(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    // Pattern to match decimal entities (&#[0-9]+;)
    return text.replace(/&#([0-9]+);/g, (match, decimal) => {
        try {
            const codePoint = parseInt(decimal, 10);

            return String.fromCodePoint(codePoint);
        } catch (error) {
            // If conversion fails (invalid code point), return the original match
            return match;
        }
    });
}

/**
 * Encodes characters in a string to their Unicode escape sequences.
 * ASCII characters remain unchanged, BMP characters are encoded as "\\uXXXX" (uppercase hex),
 * and characters in supplementary planes are encoded as "\\UXXXXXXXX" (lowercase hex).
 *
 * @param text The string to encode.
 * @returns The encoded string with Unicode escape sequences.
 */
export function encodeUnicodeEscapeSequences(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    for (let i = 0; i < text.length;) {
        const codePoint = text.codePointAt(i);

        if (codePoint === undefined) {
            i++;

            continue;
        }

        if (codePoint <= 127) {
            // ASCII characters remain unchanged
            result += text[i];

            i++;
        } else if (codePoint <= 0xFFFF) {
            // BMP characters (including ZWJ and variation selectors)
            // Convert to hex and ensure uppercase for specific ranges
            const hexCode = codePoint.toString(16).padStart(4, "0");

            // Use uppercase for all non-digits in the hex string
            const formattedHex = hexCode.replace(/[a-f]/g, char => char.toUpperCase());

            result += `\\u${formattedHex}`;
            i++;
        } else {
            // Characters in supplementary planes
            const hexCode = codePoint.toString(16).padStart(8, "0");

            result += `\\U${hexCode}`; // All lowercase for supplementary planes

            // Skip the surrogate pair (2 JavaScript "characters")
            i += 2;
        }
    }

    return result;
}

/**
 * Decodes a string containing Unicode escape sequences (both "\\Uxxxxxxxx" and "\\uxxxx") back to the original characters.
 *
 * @param text The string with Unicode escape sequences.
 * @returns The decoded string with original characters.
 */
export function decodeUnicodeEscapeSequences(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    // Pattern matches both \Uxxxxxxxx and \uxxxx formats, case insensitive for hex digits
    return text.replace(/\\U([0-9a-fA-F]{8})|\\u([0-9a-fA-F]{4})/gi, (_, u8, u4) => {
        if (u8) {
            return String.fromCodePoint(parseInt(u8, 16));
        } else if (u4) {
            return String.fromCharCode(parseInt(u4, 16));
        }

        return "";
    });
}

/**
 * Converts a string with emojis and special characters to CSS Unicode escape sequences.
 * Non-ASCII characters (excluding non-breaking space) and characters outside the BMP are encoded as "\\XXXXXX " (uppercase hex).
 *
 * @param text The input string containing emojis and special characters.
 * @returns A string with CSS Unicode escape sequences.
 */
export function encodeCssUnicodeEscape(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    let result = "";

    // Process each character in the input string
    for (let i = 0; i < text.length; i++) {
        const code = text.codePointAt(i);

        if (code === undefined) { continue; }

        // Handle surrogate pairs and other special characters
        if (code > 0xFFFF) {
            // This is a character outside the BMP (Basic Multilingual Plane)
            const hex = code.toString(16).padStart(6, "0").toUpperCase();

            result += `\\${hex} `;
            // Skip the low surrogate
            i++;
        } else if (code > 127 && code !== 160) { // 160 is non-breaking space
            // This is a non-ASCII character
            const hex = code.toString(16).padStart(4, "0").toUpperCase();

            result += `\\${hex} `;
        } else {
            // Regular ASCII character or space
            result += text.charAt(i);
        }
    }

    return result; // Trim any trailing space added by the last escape
}

/**
 * Converts a string containing CSS Unicode escape sequences back to the original string with emojis and special characters.
 * Matches Unicode escape sequences in the format "\\XXXX " or "\\XXXXXX ".
 *
 * @param text The input string containing CSS Unicode escape sequences.
 * @returns A string with emojis and special characters.
 */
export function decodeCssUnicodeEscape(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    // Match Unicode escape sequences followed by an optional space
    return text.replace(/\\([0-9a-fA-F]{4,6}) ?/g, (_, hexCode) => {
        const codePoint = parseInt(hexCode, 16);

        return String.fromCodePoint(codePoint);
    });
}

/**
 * Encodes a string into a Unicode code point sequence in the format "U+XXXX".
 * Each character's code point is converted to its hexadecimal representation (uppercase, padded to 4 digits) and prefixed with "U+".
 * The resulting code points are joined by spaces.
 *
 * @param text The input string to encode.
 * @returns The Unicode code point string.
 */
export function encodeUnicodeCodePoints(text: string): string {
    if (typeof text !== "string") {
        return text;
    }

    return Array.from(text)
        .map((char) => {
            const codePoint = char.codePointAt(0);

            if (codePoint === undefined) {
                throw new Error("Invalid Unicode character");
            }

            return "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
        })
        .join(" ");
}

/**
 * Decodes a Unicode code point sequence (e.g., "U+0041 U+1F600") back to a string.
 * Each token in the sequence (separated by spaces) is expected to be in the format "U+XXXX" (4 to 6 hexadecimal digits).
 * Surrogate code points are handled as individual code units. Code points exceeding the Unicode maximum will throw an error.
 *
 * @param text The Unicode code point string to decode.
 * @returns The decoded string.
 */
export function decodeUnicodeCodePoints(text: string): string {
    if (typeof text !== "string") {
        return "";
    }

    return text.replace(
        /(U\+[0-9A-Fa-f]{4,6}(?:\s+U\+[0-9A-Fa-f]{4,6})*)/gi,
        (match) => {
            // Split code point sequence into individual tokens
            const tokens = match.split(/\s+/);
            
            const characters = tokens.map(token => {
                // Validate token format
                if (!/^U\+[0-9A-Fa-f]{4,6}$/i.test(token)) {
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
        }
    );
}