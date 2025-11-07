# Change Log

All notable changes to the "Playful Sparkle: Dev Toolbox" extension will be documented in this file.

## [0.0.20] - 2025-11-07

- Fixed command `removeLeadingTrailingWhitespaceDocument` not found.
- Optimized, normalized leading and trailing whitespace command.

## [0.0.19] - 2025-11-07

- Renamed `Remove Non-printable Characters` to `Clean Text (Remove Non-printable Characters & Normalize)` and enhanced the function to normalize spaces, dashes, and preserve complex Unicode characters.

## [0.0.18] - 2025-11-03

- Added Sort Lines Ascending/Descending with advanced, fast, Unicode-aware sorting for documents or selections.

## [0.0.17] - 2025-10-30

- Improved decoding across all encoders with enhanced input validation.

## [0.0.16] - 2025-10-29

- Translated Command Palette category for better internationalization.

## [0.0.15] - 2025-10-28

- Added support for encoding and decoding percent-encoded URI sequences.

## [0.0.14] - 2025-10-27

- Added "Convert to URL Slug" command to Explorer context menu for file and folder renaming
- Updated locale handling in text transformation commands

## [0.0.13] - 2025-10-26

- Fixed single block selection for URL slugify
- Added multi-line text selection support with original line ending preservation

## [0.0.12] - 2025-10-26

- URL slugify supports multi-cursor editing
- Fixed encoding/decoding across all entity types
- Improved full Unicode range handling
- Standardized function naming and expanded test coverage

## [0.0.11] - 2025-05-02

- Introduced streamlined issue reporting aligned with Microsoft Visual Studio Code extension development best practices.

## [0.0.10] - 2025-05-02

- Updated non-printable character removal to replace control characters with spaces while preserving standard whitespace and complex character sequences.

## [0.0.9] - 2025-04-26

- Added comprehensive text case conversion suite including camelCase, PascalCase, snake_case, kebab-case, and other common programming formats.

## [0.0.8] - 2025-04-26

- Enhanced non-printable character removal to neutralize hidden control characters while maintaining complex Unicode sequences and eliminating malformed surrogate pairs.

## [0.0.7] - 2025-04-08

- Improved multi-cursor support for all encoding/decoding operations including HTML entities, Unicode escapes, and code point transformations.

## [0.0.6] - 2025-04-08

- Added support for three new GUID formats
- Introduced comprehensive character encoding and decoding schemes

## [0.0.5] - 2025-04-03

- Updated extension icon theme for polished appearance
- Refined extension description for clarity and user understanding

## [0.0.4] - 2025-04-03

- Added Remove Empty Lines from Document and Selection with configurable whitespace handling.

## [0.0.3] - 2025-04-02

- Re-upload to address package update issues.

## [0.0.2] - 2025-04-02

- Remove empty lines from selected text
- Remove non-printable characters from selections
- Remove leading/trailing whitespace from text

## [0.0.1] - 2025-03-31

- Initial release with locale-aware case conversion, URL slug generation, Base64/URL encoding/decoding, and GUID generation.
