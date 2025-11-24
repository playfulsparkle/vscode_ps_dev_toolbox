import { createIndices, parseLines, reconstructSortedText } from "./sortFunctions";
import { DIACRITIC_PATTERN } from "./constants";

/**
 * Configuration options for text-based line sorting operations (A-Z, Z-A)
 */
export interface SortOptions {
    /** Sort in descending order (Z-A, 9-0) instead of ascending (A-Z, 0-9) */
    descending?: boolean;
    /** Ignore case when sorting (case-insensitive comparison) */
    ignoreCase?: boolean;
    /** Locale(s) for Unicode-aware sorting and language-specific rules */
    locales?: string | string[];
    /** Use natural numeric sorting (10 after 2) instead of alphabetical (10 before 2) */
    numeric?: boolean;
    /** Sort base letters before accented variants (a before á) */
    baseFirst?: boolean;
}

/**
 * Type-safe configuration for Intl.Collator instances used in text-based sorting
 */
interface CollatorOptions {
    /** Sensitivity level for string comparison (base, accent, case, or variant) */
    sensitivity: "base" | "accent" | "case" | "variant";
    /** Enable natural numeric sorting in strings */
    numeric: boolean;
    /** Case ordering preference (upper first, lower first, or false for locale default) */
    caseFirst: "upper" | "lower" | "false";
}

/**
 * Sorts lines of text efficiently using Intl.Collator for proper Unicode handling
 * 
 * This function provides advanced sorting capabilities with proper handling of:
 * - Unicode characters and diacritics
 * - Multiple languages and locales
 * - Mixed case and numeric content
 * - Different line ending formats (CRLF, LF)
 * - Consistent diacritic ordering (base letters before accented variants)
 * 
 * The algorithm preserves original line endings and uses efficient index-based
 * sorting to minimize string manipulation.
 * 
 * @param {string} text - The text containing lines to sort
 * @param {SortOptions} [options={}] - Sorting configuration options
 * 
 * @returns {string} Text with lines sorted according to the specified options
 * 
 * @throws {TypeError} If text is not a string
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator | MDN: Intl.Collator}
 */
export function sortLinesByText(text: string, options: SortOptions = {}): string {
    if (typeof text !== "string") {
        return text;
    }

    if (text.length === 0) {
        return "";
    }

    // Fast path for empty or single-line text
    if (!text || text.indexOf("\n") === -1) {
        return text;
    }

    const {
        descending = false,
        ignoreCase = false,
        locales = "en",
        numeric = true,
        baseFirst = true
    } = options;

    // Parse lines once and reuse
    const { contentLines, lineEndings } = parseLines(text);

    // Create collators once and reuse
    const collators = createCollators(locales, ignoreCase, numeric);

    // Sort using appropriate strategy
    const indices = baseFirst
        ? sortWithBaseFirst(contentLines, collators, descending)
        : sortStandard(contentLines, collators.standard, descending);

    return reconstructSortedText(contentLines, lineEndings, indices);
}

/**
 * Creates and caches collator instances for efficient Unicode-aware text comparison
 * 
 * This function initializes Intl.Collator instances with optimized settings
 * for text-based sorting. It creates two collators: one for base character
 * comparison (ignoring diacritics) and one for standard comparison, ensuring
 * consistent performance across multiple sorting operations.
 * 
 * @param {string|string[]} locales - Locale(s) to use for language-sensitive comparison
 * @param {boolean} ignoreCase - Whether to perform case-insensitive comparison
 * @param {boolean} numeric - Whether to use natural numeric sorting
 * 
 * @returns {Object} Configured collator instances with the following properties:
 * @returns {Intl.Collator} base - Collator for base character comparison (diacritic-insensitive)
 * @returns {Intl.Collator} standard - Collator for standard comparison with specified sensitivity
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator | MDN: Intl.Collator}
 */
function createCollators(
    locales: string | string[],
    ignoreCase: boolean,
    numeric: boolean
): { base: Intl.Collator; standard: Intl.Collator } {
    // Use type-safe objects with explicit sensitivity values
    const baseOptions: CollatorOptions = {
        sensitivity: "base",
        numeric,
        caseFirst: "false"
    };

    const standardOptions: CollatorOptions = {
        sensitivity: ignoreCase ? "base" : "variant",
        numeric,
        caseFirst: "false"
    };

    return {
        base: new Intl.Collator(locales, baseOptions),
        standard: new Intl.Collator(locales, standardOptions)
    };
}

/**
 * Performs standard locale-aware sorting using Intl.Collator for comparison
 * 
 * This function implements efficient text-based sorting with full Unicode
 * support, handling language-specific rules, case sensitivity, and numeric
 * sorting as configured in the collator instance.
 * 
 * @param {string[]} contentLines - Array of line content strings to sort
 * @param {Intl.Collator} collator - Configured collator instance for string comparison
 * @param {boolean} descending - Sort in descending order when true
 * 
 * @returns {number[]} Array of indices representing the sorted order
 */
function sortStandard(
    contentLines: string[],
    collator: Intl.Collator,
    descending: boolean
): number[] {
    const indices = createIndices(contentLines.length);

    indices.sort((a, b) => {
        const result = collator.compare(contentLines[a], contentLines[b]);
        return descending ? -result : result;
    });

    return indices;
}

/**
 * Performs advanced diacritic-aware sorting with base character priority
 * 
 * This function implements a two-phase sorting algorithm that first compares
 * base characters (ignoring diacritics) and then applies diacritic-aware
 * comparison as a tie-breaker. This ensures consistent ordering where base
 * letters appear before their accented variants.
 * 
 * The algorithm uses caching for diacritic detection to optimize performance
 * in large datasets and maintains stable sorting for equal elements.
 * 
 * @param {string[]} contentLines - Array of line content strings to sort
 * @param {Object} collators - Pre-configured collator instances for comparison
 * @param {Intl.Collator} collators.base - Collator for base character comparison
 * @param {Intl.Collator} collators.standard - Collator for standard comparison
 * @param {boolean} descending - Sort in descending order when true
 * 
 * @returns {number[]} Array of indices representing the sorted order
 */
function sortWithBaseFirst(
    contentLines: string[],
    collators: { base: Intl.Collator; standard: Intl.Collator },
    descending: boolean
): number[] {
    const { base: baseCollator, standard: standardCollator } = collators;

    // Precompute diacritic flags to avoid repeated calculations
    const hasDiacriticsCache = contentLines.map(hasDiacritics);
    const indices = createIndices(contentLines.length);

    indices.sort((a, b) => {
        const lineA = contentLines[a];
        const lineB = contentLines[b];

        // First compare base letters (ignoring diacritics)
        const baseResult = baseCollator.compare(lineA, lineB);

        if (baseResult !== 0) {
            return descending ? -baseResult : baseResult;
        }

        // Base letters are the same, handle diacritics
        const aHasDiacritics = hasDiacriticsCache[a];
        const bHasDiacritics = hasDiacriticsCache[b];

        if (aHasDiacritics !== bHasDiacritics) {
            // Prefer non-diacritic version
            const result = aHasDiacritics ? 1 : -1;
            return descending ? -result : result;
        }

        // Both have same diacritic status, use standard collator
        const result = standardCollator.compare(lineA, lineB);
        return descending ? -result : result;
    });

    return indices;
}

/**
 * Efficiently detects diacritic characters in strings using combined strategies
 * 
 * This function uses a two-phase approach for optimal performance:
 * 1. Quick regex pattern matching for common diacritic characters
 * 2. Unicode normalization fallback for comprehensive diacritic detection
 * 
 * The regex pattern provides fast rejection for strings without common diacritics,
 * while the normalization check ensures detection of less common accented characters.
 * 
 * @param {string} str - The string to check for diacritic characters
 * 
 * @returns {boolean} True if the string contains diacritic characters, false otherwise
 */
function hasDiacritics(str: string): boolean {
    // Quick check with pre-compiled pattern
    if (DIACRITIC_PATTERN.test(str)) {
        return true;
    }

    // Fallback to normalization check for less common diacritics
    return str.normalize("NFD") !== str;
}
