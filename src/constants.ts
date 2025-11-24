
export const BASE_64_MAX_LENGTH = 10000;

export const REGEX_FILE_EXTENSION = /(\.[a-zA-Z0-9]{2,11})$/;

export const REGEX_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

export const REGEX_LOCALE = /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]+)*$/;

export const REGEX_HEX_NUMERIC_ENTITY = /^&#x[0-9A-F]{4,};/;            // &#xHHHH;

export const REGEX_NAMED_ENTITY = /^&([A-Za-z][A-Za-z0-9]{1,31});/;    // &name;

export const REGEX_DECIMAL_ENTITY = /^&#[0-9]+;/;                      // &#DDDD;

export const REGEX_UNICODE4_HEX_DIGIT = /^\\u[0-9A-Fa-f]{4}/;           // \uXXXX

export const REGEX_UNICODE8_HEX_DIGIT = /^\\U[0-9A-Fa-f]{8}/;           // \UXXXXXXXX

export const REGEX_BACKSLASH6_HEX_DIGIT = /^\\[0-9A-Fa-f]{6}\s?/;       // \XXXXXX

export const REGEX_U_PLUS_CODE_POINT = /^U\+[0-9A-Fa-f]{4,6}/;           // U+XXXX, U+XXXXX or U+XXXXXX

export const REGEX_UNICODE_BRACED_CODE_POINT = /^\\u\{[0-9A-Fa-f]+\}/;   // \u{XXX}

export const REGEX_UNICODE_BRACED_HEXADECIMAL = /^\\x\{[0-9A-Fa-f]+\}/; // \x{XXX}

export const REGEX_HEX_CODE_POINT = /^0x[0-9A-Fa-f]+/;                  // 0xXXX

export const REGEX_EOL_SPLIT = /(\r?\n|\r)/;

/**
 * Comprehensive regex pattern for detecting diacritic characters using Unicode properties
 * 
 * This pattern uses Unicode property escapes to match:
 * - \p{Mn}: Non-spacing marks (combining diacritics like accents, umlauts, tildes)
 * - \p{Mc}: Spacing combining marks (used in some Indic scripts)
 * - \p{Me}: Enclosing marks (circle, square, diamond around characters)
 * 
 * Covers diacritics across all scripts including Latin, Greek, Cyrillic, Arabic, Devanagari, etc.
 */
export const DIACRITIC_PATTERN = /[\p{Mn}\p{Mc}\p{Me}]/u;

/*
 * Common dash characters to normalise to standard hyphen (U+002D).
 * U+2212 (MINUS SIGN) has been removed because it is semantically
 * distinct from a hyphen and should be preserved where used.
 */
export const DASH_CHARACTERS = new Set([
    0x2010, // ‐ HYPHEN
    0x2011, // ‑ NON-BREAKING HYPHEN
    0x2012, // ‒ FIGURE DASH
    0x2013, // – EN DASH
    0x2014, // — EM DASH
    0x2015, // ― HORIZONTAL BAR
    0x2053, // ⁓ SWUNG DASH
    0x207B, // ⁻ SUPERSCRIPT MINUS
    0x208B, // ₋ SUBSCRIPT MINUS
    // 0x2212, // − MINUS SIGN – removed to preserve minus sign semantics
    0x2E3A, // ⸺ TWO-EM DASH
    0x2E3B, // ⸻ THREE-EM DASH
    0xFE58, // ﹘ SMALL EM DASH
    0xFE63, // ﹣ SMALL HYPHEN-MINUS
    0xFF0D, // － FULLWIDTH HYPHEN-MINUS
]);

/**
 * Space characters to normalise to standard space (U+0020).
 */
export const SPACE_CHARACTERS = new Set([
    // 0x0020, //   SPACE
    0x00A0, //   NO-BREAK SPACE
    0x1680, //   OGHAM SPACE MARK
    0x2000, //   EN QUAD
    0x2001, //   EM QUAD
    0x2002, //   EN SPACE
    0x2003, //   EM SPACE
    0x2004, //   THREE-PER-EM SPACE
    0x2005, //   FOUR-PER-EM SPACE
    0x2006, //   SIX-PER-EM SPACE
    0x2007, //   FIGURE SPACE
    0x2008, //   PUNCTUATION SPACE
    0x2009, //   THIN SPACE
    0x200A, //   HAIR SPACE
    0x202F, //   NARROW NO-BREAK SPACE
    0x205F, //   MEDIUM MATHEMATICAL SPACE
    0x3000, // 　 IDEOGRAPHIC SPACE
]);

/**
 * Invisible/zero-width characters to remove.  ZWNJ (U+200C) and word
 * joiner (U+2060) have been removed from this list so that scripts
 * relying on them (e.g. Persian and Mongolian) are not broken【664356427969447†L132-L141】
 *【184745591003778†L120-L129】.
 */
export const INVISIBLE_CHARACTERS = new Set([
    0x200B, // ZERO WIDTH SPACE
    // 0x200C, // ZERO WIDTH NON-JOINER – preserved
    // 0x2060, // WORD JOINER – preserved to avoid breaking words
    0xFEFF, // ZERO WIDTH NO-BREAK SPACE (BOM) – remove, don't convert to space
    // 0x180E, // MONGOLIAN VOWEL SEPARATOR – preserved for Mongolian scripts
]);

/**
 * C0 and C1 control characters to remove (except preserved whitespace).
 */
export const CONTROL_CHARACTERS = new Set([
    // C0 controls (0x00-0x1F) - excluding tab, newline, carriage return
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, // 0x09 is tab
    0x0B, 0x0C, // 0x0A is newline, 0x0D is carriage return
    0x0E, 0x0F, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17,
    0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E, 0x1F,
    // C1 controls (0x80-0x9F)
    0x7F, // DELETE
    0x80, 0x81, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
    0x8A, 0x8B, 0x8C, 0x8D, 0x8E, 0x8F, 0x90, 0x91, 0x92, 0x93,
    0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0x9B, 0x9C, 0x9D,
    0x9E, 0x9F,
]);

/**
 * Soft hyphen marks to remove.  Directional marks have been removed
 * from this set so they remain in the output.  See
 * https://unicode.org/faq/bidi_characters.html for guidance on their usage.
 */
export const SOFT_HYPHEN_MARKS = new Set([
    0x00AD, // SOFT HYPHEN
    // 0x200E, // LEFT-TO-RIGHT MARK – preserved to maintain punctuation order【797210211607106†L142-L159】
    // 0x200F, // RIGHT-TO-LEFT MARK – preserved to maintain punctuation order【797210211607106†L142-L159】
]);

/**
 * Special Unicode characters to remove for security/safety.
 */
export const SPECIAL_REMOVE_CHARACTERS = new Set([
    0x2028, // LINE SEPARATOR
    0x2029, // PARAGRAPH SEPARATOR
    0xFFF9, // INTERLINEAR ANNOTATION ANCHOR
    0xFFFA, // INTERLINEAR ANNOTATION SEPARATOR
    0xFFFB, // INTERLINEAR ANNOTATION TERMINATOR
    0xFFFC, // OBJECT REPLACEMENT CHARACTER
    // 0xFFFD, // REPLACEMENT CHARACTER – preserved to mark encoding errors
]);

/**
 * Bidirectional override characters that should be removed to mitigate
 * Trojan Source attacks.  These characters can reorder the visual
 * presentation of code【797156008172150†L149-L166】.
 */
export const BIDI_OVERRIDE_CHARACTERS = new Set([
    0x202A, // LEFT-TO-RIGHT EMBEDDING
    0x202B, // RIGHT-TO-LEFT EMBEDDING
    0x202C, // POP DIRECTIONAL FORMATTING
    0x202D, // LEFT-TO-RIGHT OVERRIDE
    0x202E, // RIGHT-TO-LEFT OVERRIDE
]);