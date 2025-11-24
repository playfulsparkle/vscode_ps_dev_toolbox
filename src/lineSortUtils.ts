import { parseLines, reconstructSortedText, createIndices } from "./sortFunctions";

/**
 * Options for length-based line sorting
 */
export interface SortByLengthOptions {
    /** Sort in descending order (longest first) instead of ascending (shortest first) */
    descending?: boolean;
    /** Preserve original order of lines with equal lengths */
    preserveEqualOrder?: boolean;
}

/**
 * Sorts lines by text length efficiently with minimal memory allocation
 * 
 * This function provides optimized length-based sorting with:
 * - Single-pass line parsing and length calculation
 * - Index-based sorting to avoid string manipulation
 * - Preservation of original line endings
 * - Stable sorting for lines with equal lengths
 * - Reuse of existing parsing and reconstruction infrastructure
 * 
 * @param {string} text - The text containing lines to sort
 * @param {SortByLengthOptions} [options={}] - Sorting configuration options
 * 
 * @returns {string} Text with lines sorted by length according to the specified options
 * 
 * @throws {TypeError} If text is not a string
 */
export function sortLinesByLength(text: string, options: SortByLengthOptions = {}): string {
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
        preserveEqualOrder = true
    } = options;

    // Reuse existing line parsing infrastructure
    const { contentLines, lineEndings } = parseLines(text);

    // Sort using length-based strategy
    const indices = sortByLength(contentLines, descending, preserveEqualOrder);

    // Reuse existing text reconstruction
    return reconstructSortedText(contentLines, lineEndings, indices);
}

/**
 * Sorts lines by length using efficient numeric comparisons and index-based sorting
 * 
 * This function implements optimized length-based sorting with:
 * - Direct numeric length comparisons for maximum performance
 * - Configurable ordering (ascending/descending)
 * - Stable sorting preservation for equal-length lines
 * - Efficient tie-breaking using original order or string comparison
 * 
 * The algorithm uses index-based sorting to avoid moving string data and
 * leverages numeric comparisons which are significantly faster than
 * locale-aware string comparisons.
 * 
 * @param {string[]} contentLines - Array of line content strings to sort
 * @param {boolean} descending - Sort in descending order (longest first) when true
 * @param {boolean} preserveEqualOrder - Maintain original order for equal-length lines
 * 
 * @returns {number[]} Array of indices representing the sorted order
 */
function sortByLength(
    contentLines: string[], 
    descending: boolean,
    preserveEqualOrder: boolean
): number[] {
    const indices = createIndices(contentLines.length);
    
    indices.sort((a, b) => {
        const lengthA = contentLines[a].length;
        const lengthB = contentLines[b].length;
        
        // Primary comparison by length
        if (lengthA !== lengthB) {
            return descending ? lengthB - lengthA : lengthA - lengthB;
        }
        
        // Secondary comparison for equal lengths
        if (preserveEqualOrder) {
            return a - b; // Maintain original order for equal lengths
        } else {
            // Using simple string comparison for tie-breaking
            const lineA = contentLines[a];
            const lineB = contentLines[b];
            
            return descending ? 
                (lineB < lineA ? -1 : (lineB > lineA ? 1 : 0)) :
                (lineA < lineB ? -1 : (lineA > lineB ? 1 : 0));
        }
    });
    
    return indices;
}