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
    // Default options
    const {
        descending = false,
        ignoreCase = false,
        locales = "en",
        numeric = true,
        baseFirst = true  // Default to base letters first for consistent behavior
    } = options;

    // Split into lines while preserving line endings
    const lines = text.split(/(\r?\n)/);
    
    // Separate actual content lines from line endings
    const contentLines: string[] = [];
    const lineEndings: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (i % 2 === 0) {
            contentLines.push(lines[i]); // Content line
        } else {
            lineEndings.push(lines[i]); // Line ending
        }
    }

    // For base-first sorting, we need a custom comparison function
    if (baseFirst) {
        return sortLinesWithBaseFirst(contentLines, lineEndings, {
            descending, ignoreCase, locales, numeric
        });
    } else {
        // Use standard Intl.Collator sorting
        return sortLinesStandard(contentLines, lineEndings, {
            descending, ignoreCase, locales, numeric
        });
    }
}

/**
 * Sorts lines using standard Intl.Collator (locale-specific diacritic order)
 */
function sortLinesStandard(
    contentLines: string[], 
    lineEndings: string[], 
    options: Omit<SortOptions, "baseFirst">
): string {
    const { descending, ignoreCase, locales, numeric } = options;

    const collator = new Intl.Collator(locales, {
        sensitivity: ignoreCase ? "base" : "variant",
        numeric: numeric,
        caseFirst: "false"
    });

    const indices = contentLines.map((_, i) => i);
    
    indices.sort((a, b) => {
        const lineA = contentLines[a];
        const lineB = contentLines[b];
        const result = collator.compare(lineA, lineB);
        return descending ? -result : result;
    });

    return reconstructSortedText(contentLines, lineEndings, indices);
}

/**
 * Sorts lines ensuring base letters come before accented variants
 */
function sortLinesWithBaseFirst(
    contentLines: string[], 
    lineEndings: string[], 
    options: Omit<SortOptions, "baseFirst">
): string {
    const { descending, ignoreCase, locales, numeric } = options;

    // Create collator for primary comparison
    const collator = new Intl.Collator(locales, {
        sensitivity: ignoreCase ? "base" : "variant",
        numeric: numeric,
        caseFirst: "false"
    });

    const indices = contentLines.map((_, i) => i);
    
    indices.sort((a, b) => {
        const lineA = contentLines[a];
        const lineB = contentLines[b];
        
        // First, compare using base sensitivity (ignores diacritics)
        const baseCollator = new Intl.Collator(locales, {
            sensitivity: "base",
            numeric: numeric,
            caseFirst: "false"
        });
        
        const baseResult = baseCollator.compare(lineA, lineB);
        
        if (baseResult !== 0) {
            // If base letters are different, use that result
            return descending ? -baseResult : baseResult;
        }
        
        // Base letters are the same, now consider diacritics
        // For base-first sorting, words without diacritics come first
        const aHasDiacritics = hasDiacritics(lineA);
        const bHasDiacritics = hasDiacritics(lineB);
        
        if (aHasDiacritics && !bHasDiacritics) {
            // A has diacritics, B doesn't - B comes first
            return descending ? -1 : 1;
        } else if (!aHasDiacritics && bHasDiacritics) {
            // A doesn't have diacritics, B does - A comes first
            return descending ? 1 : -1;
        } else {
            // Both have diacritics or both don't, use normal collator
            const result = collator.compare(lineA, lineB);
            return descending ? -result : result;
        }
    });

    return reconstructSortedText(contentLines, lineEndings, indices);
}

/**
 * Checks if a string contains diacritic characters
 */
function hasDiacritics(str: string): boolean {
    // Normalize to NFD form (separates base characters from diacritics)
    const normalized = str.normalize("NFD");
    
    // If the normalized string is different from the original,
    // it means there were combining characters (diacritics)
    if (normalized !== str) {
        return true;
    }
    
    // Additional check for common precomposed characters that might not normalize differently
    const diacriticPattern = /[áàâäéèêëíìîïóòôöúùûüñçÁÀÂÄÉÈÊËÍÌÎÏÓÒÔÖÚÙÛÜÑÇ]/;
    return diacriticPattern.test(str);
}

/**
 * Reconstructs the final sorted text from sorted indices
 */
function reconstructSortedText(
    contentLines: string[], 
    lineEndings: string[], 
    indices: number[]
): string {
    const sortedLines: string[] = [];

    for (let i = 0; i < indices.length; i++) {
        const idx = indices[i];
        sortedLines.push(contentLines[idx]);
        
        if (i < lineEndings.length) {
            sortedLines.push(lineEndings[i]);
        }
    }

    return sortedLines.join("");
}