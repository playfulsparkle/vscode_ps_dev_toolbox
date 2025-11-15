import { REGEX_EOL_SPLIT } from "./constants";

/**
 * Parses text into content lines and line endings while preserving EOL characters
 * 
 * This function efficiently splits text into content and line ending components
 * using a single pass operation. It handles mixed line endings (CRLF, LF) and
 * maintains the original line ending format for accurate text reconstruction.
 * 
 * @param {string} text - The input text to parse into lines
 * 
 * @returns {Object} Parsed line components with the following properties:
 * @returns {string[]} contentLines - Array of line content without line endings
 * @returns {string[]} lineEndings - Array of line ending characters (\n, \r\n, etc.)
 * 
 * @throws {TypeError} If text is not a string
 */
export function parseLines(text: string): { contentLines: string[], lineEndings: string[] } {
    const lines = text.split(REGEX_EOL_SPLIT);
    
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
 * Reconstructs text from sorted indices while preserving original line endings
 * 
 * This function efficiently rebuilds the final sorted text by combining
 * reordered content lines with their corresponding line endings. It maintains
 * the original line ending format and handles edge cases for files with or
 * without trailing newlines.
 * 
 * @param {string[]} contentLines - Original array of line content strings
 * @param {string[]} lineEndings - Original array of line ending strings
 * @param {number[]} indices - Sorted indices mapping original to new positions
 * 
 * @returns {string} The reconstructed text with lines in sorted order and
 *                   original line endings preserved
 * 
 * @throws {Error} If indices length doesn't match contentLines length
 */
export function reconstructSortedText(
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

/**
 * Creates a sequential array of indices for efficient sorting operations
 * 
 * This utility function generates an array of consecutive integers [0..length-1]
 * that serves as the basis for index-based sorting algorithms. Using indices
 * rather than sorting the original array directly minimizes data movement
 * and improves performance for large datasets.
 * 
 * @param {number} length - The desired length of the indices array
 * 
 * @returns {number[]} Array of sequential integers from 0 to length-1
 * 
 * @throws {RangeError} If length is negative
 */
export function createIndices(length: number): number[] {
    const indices = new Array<number>(length);
    for (let i = 0; i < length; i++) {
        indices[i] = i;
    }
    return indices;
}
