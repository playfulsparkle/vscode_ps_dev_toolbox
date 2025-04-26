# Change Log

All notable changes to the "Playful Sparkle: Dev Toolbox" extension will be documented in this file.

## [0.0.9] - 2025-04-26

* **Added:** Introduced a suite of commands to easily convert selected text to various common programming case formats.
    * Added function to convert to `camelCase` (e.g., `myVariableName`)
    * Added function to convert to `PascalCase` (e.g., `MyClassName`)
    * Added function to convert to `snake_case` (e.g., `my_variable_name`)
    * Added function to convert to `SCREAMING_SNAKE_CASE` (e.g., `MY_CONSTANT_NAME`)
    * Added function to convert to `kebab-case` (e.g., `my-variable-name`)
    * Added function to convert to `TRAIN-CASE` (e.g., `MY-VARIABLE-NAME`)
    * Added function to convert to `flatcase` (e.g., `myvariablename`)
    * Added function to convert to `UPPERCASE` (e.g., `MYVARIABLENAME`)

## [0.0.8] - 2025-04-26

* **Update:** For remove non printable characters:
    * **Sanitized Text Output:** Neutralizes hidden control characters (e.g., `null bytes`, `zero-width spaces`) by converting them to standard spaces, ensuring consistent rendering across all platforms
    * **Grapheme Integrity:** Maintains complex character sequences (`emojis`, `diacritics`, `joined scripts`) while stripping `broken`/`invalid Unicode artifacts`
    * **Security Hardening:** Eliminates potential injection vectors from malformed surrogate pairs and invisible formatting characters
    * **Strict Unicode Compliance:** Guarantees output contains only standardized, renderable characters per Unicode 15.0 specifications

## [0.0.7] - 2025-04-08

* **Update:** encode/decode named HTML entity, encode/decode HTML hex entity, encode/decode decimal entity, encode/decode JavaScript unicode escape, encode/decode CSS unicode escape, encode/decode code point, encode ES6 unicode code point escape, encode/decode extended hex escape and encode/decode hex code point now work using multi cursor.

## [0.0.6] - 2025-04-08

* **GUID Generation Enhancements:** Added support for three new GUID formats:
    * Registry format: `{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}`
    * Square brackets format: `[Guid("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")]`
    * Less than sign format: `<Guid("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")>`
* **New Encoding/Decoding Features:** Introduced support for the following character encoding and decoding schemes:
    * Named HTML Entities (e.g., `<>` to `&lt;&gt;`)
    * HTML Hex Entities (e.g., `!` to `&#x21;`)
    * HTML Decimal Entities (e.g., `"` to `&#34;`)
    * JavaScript Unicode Escape Sequences (e.g., `$` to `\u0024`)
    * CSS Unicode Escape Sequences (e.g., `#` to `\0023`)
    * Unicode Code Points (e.g., `%` to `U+0025`)
    * ES6 Unicode Code Point Escape Sequences (e.g., `&` to `\u{26}`)
    * Extended Hex Escape Sequences (e.g., `'` to `\x{27}`)
    * Hex Code Points (e.g., `(` to `0x28`)

## [0.0.5] - 2025-04-03

* **Enhanced Visuals:** The extension's icon color theme has been updated, providing a more polished and consistent look.
* **Improved User Understanding:** The extension description has been refined to be more clear, concise, and easier for new users to understand its features and benefits.

## [0.0.4] - 2025-04-03

* **Added:**
    * Remove Empty Lines from Document
    * Remove Empty Lines from Selection

* **Removed:**
    * Remove all empty lines or only consecutive ones.

## [0.0.3] - 2025-04-02

* Re-upload, package was not updated properly

## [0.0.2] - 2025-04-02

* **Remove Empty Lines:**
    * Removes empty lines from the selected text.
    * Supports options to:
        * Remove all empty lines or only consecutive ones.
        * Consider lines with only whitespace as empty.
        
* **Remove Non-Printable Characters:**
    * Removes non-printable characters from the selected text.

* **Remove Leading and Trailing Whitespace:**
    * Removes whitespace (spaces, tabs, newlines) from the beginning and end of the selected text.

## [0.0.1] - 2025-03-31

* **Locale-Aware Case Conversion:**
    * Converts selected text to lowercase or uppercase, respecting language-specific rules.
    * Prompts for a locale to use for conversion, allowing for accurate handling of different languages.

* **URL-Friendly Slug Generation:**
    * Transforms selected text into a URL-safe slug.
    * Removes diacritics (accents), special characters, and replaces spaces with hyphens.
    * Intelligently preserves file extensions when present.

* **Base64 Encoding/Decoding:**
    * Encodes the selected text into a Base64 string.
    * Decodes a Base64 string back to its original form.

* **URL Encoding/Decoding:**
    * Encodes the selected text for use in URLs, escaping special characters.
    * Decodes URL-encoded text back to its original form.
    * Ensures compatibility with URL standards.

* **GUID Generation:**
    * Generates a new Globally Unique Identifier (GUID) in the standard format.
    * Inserts the generated GUID at the cursor's current position.
    * Provides a quick way to create unique identifiers within the editor.
