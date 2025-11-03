/**
 * Line sorting utilities with efficient Unicode-aware comparison
 * 
 * Provides advanced line sorting capabilities with support for:
 * - Unicode-aware sorting using Intl.Collator
 * - Multiple locale support
 * - Case-insensitive sorting
 * - Numeric sorting (natural sort)
 * - Descending order
 * - Preservation of original line endings
 * - Consistent diacritic handling (base letters before accented variants)
 * 
 * @module LineSorting
 */

// Pre-compiled regex patterns for better performance
const DIACRITIC_PATTERN = /[áàâäéèêëíìîïóòôöúùûüñçÁÀÂÄÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜÑÇ]/;
const LINE_SPLIT_PATTERN = /(\r?\n)/;

/**
 * Configuration options for line sorting operations
 * 
 * @property {boolean} [descending=false] - Sort in descending order (Z-A, 9-0)
 * @property {boolean} [ignoreCase=false] - Ignore case when sorting
 * @property {string|string[]} [locales='en'] - Locale(s) for Unicode-aware sorting
 * @property {boolean} [numeric=true] - Use natural numeric sorting (10 after 2)
 * @property {boolean} [baseFirst=true] - Sort base letters before accented variants (a before á)
 */
export interface SortOptions {
    descending?: boolean;
    ignoreCase?: boolean;
    locales?: string | string[];
    numeric?: boolean;
    baseFirst?: boolean;
}

// Type-safe collator options interface
interface CollatorOptions {
    sensitivity: "base" | "accent" | "case" | "variant";
    numeric: boolean;
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
export function sortLines(text: string, options: SortOptions = {}): string {
    if (typeof text !== "string") {
        throw new TypeError("Input must be a string");
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
 * Parses text into content lines and line endings in a single pass
 */
function parseLines(text: string): { contentLines: string[], lineEndings: string[] } {
    const lines = text.split(LINE_SPLIT_PATTERN);
    const contentLines: string[] = [];
    const lineEndings: string[] = [];
    
    const length = lines.length;
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            contentLines.push(lines[i]);
        } else {
            lineEndings.push(lines[i]);
        }
    }
    
    return { contentLines, lineEndings };
}

/**
 * Creates and caches collator instances for reuse
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
 * Standard locale-aware sorting
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
 * Base-first diacritic-aware sorting
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
 * Creates an array of indices [0, 1, 2, ..., length-1]
 */
function createIndices(length: number): number[] {
    const indices = new Array<number>(length);
    for (let i = 0; i < length; i++) {
        indices[i] = i;
    }
    return indices;
}

/**
 * Efficient diacritic detection with caching
 */
function hasDiacritics(str: string): boolean {
    // Quick check with pre-compiled pattern
    if (DIACRITIC_PATTERN.test(str)) {
        return true;
    }
    
    // Fallback to normalization check for less common diacritics
    const normalized = str.normalize("NFD");
    return normalized !== str;
}

/**
 * Reconstructs text from sorted indices
 */
function reconstructSortedText(
    contentLines: string[], 
    lineEndings: string[], 
    indices: number[]
): string {
    const sortedLines: string[] = [];
    const contentLength = contentLines.length;
    const endingsLength = lineEndings.length;

    for (let i = 0; i < contentLength; i++) {
        sortedLines.push(contentLines[indices[i]]);
        if (i < endingsLength) {
            sortedLines.push(lineEndings[i]);
        }
    }

    return sortedLines.join("");
}