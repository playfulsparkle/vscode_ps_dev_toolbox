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
    if (!text) {
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
    if (!text) {
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
    return Buffer.from(text).toString("base64");
}

/**
 * Decodes a Base64-encoded string.
 * @param text - The Base64-encoded string to decode.
 * @returns The decoded string.
 */
export function base64Decode(text: string): string {
    try {
        if (!isValidBase64(text)) {
            return text;
        }

        return Buffer.from(text, "base64").toString("utf-8");
    } catch (error) {
        return text;
    }
}

export function isValidBase64(str: string): boolean {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
}

/**
 * Encodes a string for use in a URL by escaping special characters.
 * @param text - The string to encode.
 * @returns The URL-encoded string.
 */
export function urlEncode(text: string): string {
    return encodeURIComponent(text);
}

/**
 * Decodes a URL-encoded string.
 * @param text - The URL-encoded string to decode.
 * @returns The decoded string.
 */
export function urlDecode(text: string): string {
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
    });
}