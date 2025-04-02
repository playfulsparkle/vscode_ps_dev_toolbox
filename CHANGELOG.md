# Change Log

All notable changes to the "Playful Sparkle: Dev Toolbox" extension will be documented in this file.

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
