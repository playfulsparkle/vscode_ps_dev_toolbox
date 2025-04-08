![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/playful-sparkle.ps-dev-toolbox?style=flat-square)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/playful-sparkle.ps-dev-toolbox?style=flat-square)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/playful-sparkle.ps-dev-toolbox?style=flat-square)

# Playful Sparkle: Dev Toolbox

**Playful Sparkle Dev Toolbox** is your all-in-one solution within Visual Studio Code for URL slug generation, Base64/URL encoding/decoding, GUID generation, and removing empty lines, non-printable characters, and whitespace. This extension streamlines common text manipulation tasks directly in your editor, boosting your productivity without the need for external tools.

Seamlessly integrate these essential features into your coding environment to simplify text processing and generation. Whether you're optimizing URLs, handling data encoding, generating unique IDs, or cleaning up text, **Playful Sparkle Dev Toolbox** provides efficient and reliable tools at your fingertips.

---

## Features

* **Safe Locale-Aware Case Conversion:** Provides `safeToLowerCase` and `safeToUppercase` functions that attempt to use locale-specific case conversion via `toLocaleLowerCase` and `toLocaleUpperCase`. Includes a robust fallback to standard `toLowerCase` and `toUpperCase` to ensure consistent behavior across different environments. Allows for optional locale parameters to handle language-specific case conversion rules.
* **Intelligent Slugification:** Offers a `slugify` function that converts strings into URL-friendly slugs; removes diacritics, special characters, and replaces spaces with hyphens. Attempts to preserve file extensions during slugification, intelligently differentiating between file extensions and other dot-separated text.
* **Base64 Encoding/Decoding:** Implements `base64Encode` and `base64Decode` functions for seamless Base64 encoding and decoding of strings.
* **URL Encoding/Decoding:** Provides `urlEncode` and `urlDecode` functions for encoding and decoding strings for use in URLs.
* **GUID Generation:** Generates Globally Unique Identifiers (GUIDs) with the following formatting options:
    * **Raw format:** `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` (e.g., `a1b2c3d4-e5f6-7890-9abc-c1d2e3f4a5b6`)
    * **Registry format:** `{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}` (e.g., `{a1b2c3d4-e5f6-7890-9abc-c1d2e3f4a5b6}`)
    * **Square brackets format:** `[Guid("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")]` (e.g., `[Guid("a1b2c3d4-e5f6-7890-9abc-c1d2e3f4a5b6")]`)
    * **Less than sign format:** `<Guid("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")>` (e.g., `<Guid("a1b2c3d4-e5f6-7890-9abc-c1d2e3f4a5b6")>`)
* **Remove Empty Lines:** Provides functionality to remove empty lines from text with the following options:
    * When true, removes all empty lines.
    * When false, only removes consecutive empty lines, keeping single empty lines intact.
    * Considers lines with only whitespace (spaces, tabs) as empty when true.
    * Only removes completely empty lines when false.
* **Remove Non-Printable Characters:** Removes characters that are not typically intended for printing or display.
* **Remove Leading and Trailing Whitespace:** Trims whitespace (spaces, tabs, newlines) from the beginning and end of strings.
* **Named HTML Entities:** Converts applicable characters to their corresponding named HTML entity representation (e.g., `<>` to `&lt;&gt;`, `é` to `&eacute;`) and reverses the process, transforming named HTML entities back into their original character form (e.g., `&quot;` to `"`).
* **HTML Hex Entities:** Encodes characters using their hexadecimal Unicode code point representation in the HTML entity format (e.g., `!ü🔥` to `&#x21;&#xFC;&#x1F525;`) and interprets/converts HTML hexadecimal entities back to their original characters (e.g., `&#x41;` to `A`).
* **HTML Decimal Entities:** Encodes characters using their decimal Unicode code point representation in the HTML entity format (e.g., `"à👍` to `&#34;&#224;&#128077;`) and converts HTML decimal entities back to their corresponding characters (e.g., `&#97;` to `a`).
* **JavaScript Unicode Escape Sequences:** Transforms characters into their JavaScript-style Unicode escape sequence representation (e.g., `\uXXXX` or `\UXXXXXXXX`, like `$ñ✨` to `$\u00F1\u2728`) and parses/converts these escape sequences back to their original characters (e.g., `\u00E9` to `é`).
* **CSS Unicode Escape Sequences:** Encodes characters into the format used within CSS (e.g., `\XXXXXX`, like `#ô❤️` to `#\00F4 \2764 \FE0F `) and interprets/converts these escape sequences back to their original characters (e.g., `\0042` to `B`).
* **Unicode Code Points:** Represents characters using the standard Unicode code point notation (e.g., `U+XXXX`, like `%ç🤔` to `U+0025 U+00E7 U+1F914`) and converts strings in this format back to their corresponding Unicode characters (e.g., `U+0043` to `C`).
* **ES6 Unicode Code Point Escape Sequences:** Encodes characters using the ECMAScript 6 (ES6) specific format (e.g., `\u{XXXXXX}`, like `&á🚀` to `&\u{E1}\u{1F680}`) and parses/converts these escape sequences back to their original characters (e.g., `\u{61}` to `a`).
* **Extended Hex Escape Sequences:** Encodes characters using extended hexadecimal escape sequences (e.g., `\x{XXXXXX}`, like `'å😂` to `\x{E5}\x{1F602}`) and converts these escape sequences back to their corresponding characters (e.g., `\x{44}` to `D`).
* **Hex Code Points:** Represents characters using their hexadecimal code point value (e.g., `0xXXXX`, like `(è🎉` to `0x28 0xE8 0x1F389`) and converts these hexadecimal code point strings back to their corresponding characters (e.g., `0x65` to `e`).
* **Multi-Language Support**: The extension's user interface and informational messages are available in English (en), Magyar (hu), Slovenčina (sk), Čeština (cs), Deutsch (de), Français (fr), Polski (pl), Български (bg), Español (es), Italiano (it), 日本語 (ja), 한국어 (ko), Português do Brasil (pt-br), Русский (ru), Türkçe (tr), 简体中文 (zh-cn), 繁體中文 (zh-tw) languages.

---

## Requirements

This extension has no special requirements or dependencies. It works directly within Visual Studio Code.

---

## Known Issues

* **Locale-Specific Case Conversion Inconsistencies:**
    * The `safeToLowerCase` and `safeToUppercase` functions rely on `toLocaleLowerCase` and `toLocaleUpperCase`, respectively, which can exhibit inconsistencies across different JavaScript environments and operating systems. This can lead to unexpected results when converting text with locale-specific rules.
    * While a fallback to `toLowerCase` and `toUpperCase` is implemented, this fallback might not provide the desired locale-specific behavior, potentially resulting in incorrect case conversions for certain languages.
    * When using locale parameters, it is possible that some environments do not contain the locale data, causing the function to fail.

* **Slugification Limitations with Complex File Names:**
    * The `slugify` function attempts to preserve file extensions but might not handle all edge cases correctly. For instance, file names with multiple dots or unusual extension patterns could lead to unintended slugification outcomes.
    * The function's reliance on regular expressions for character removal and replacement might not cover all possible non-alphanumeric characters, potentially leaving some unwanted characters in the slugified output.

* **GUID Generation Predictability:**
    * The `generateGuid` function uses `Math.random()` for GUID generation, which is not cryptographically secure. While suitable for most general-purpose use cases, it should not be used for applications requiring high levels of security or uniqueness.
    * While the GUID generated is very unlikely to be the same, there is still a very small risk of collision.

If you encounter any of these or other issues, please report them on the [GitHub Issues page](https://github.com/playfulsparkle/vscode_ps_dev_toolbox/issues) with detailed steps to reproduce the problem.

---

## Release Notes

### 0.0.6

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

### 0.0.5

* **Enhanced Visuals:** The extension's icon color theme has been updated, providing a more polished and consistent look.
* **Improved User Understanding:** The extension description has been refined to be more clear, concise, and easier for new users to understand its features and benefits.

### 0.0.4

* **Added:**
    * Remove Empty Lines from Document
    * Remove Empty Lines from Selection

* **Removed:**
    * Remove all empty lines or only consecutive ones.

### 0.0.3

* Re-upload, package was not updated properly

### 0.0.2

* **Remove Empty Lines:**
    * Removes empty lines from the selected text.
    * Supports options to:
        * Remove all empty lines or only consecutive ones.
        * Consider lines with only whitespace as empty.
        
* **Remove Non-Printable Characters:**
    * Removes non-printable characters from the selected text.

* **Remove Leading and Trailing Whitespace:**
    * Removes whitespace (spaces, tabs, newlines) from the beginning and end of the selected text.

### 0.0.1

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

---

## Support

For any inquiries, bug reports, or feature requests related to the **Playful Sparkle: Dev Toolbox** extension, please feel free to utilize the following channels:

* **GitHub Issues**: For bug reports, feature suggestions, or technical discussions, please open a new issue on the [GitHub repository](https://github.com/playfulsparkle/vscode_ps_dev_toolbox/issues). This allows for community visibility and tracking of reported issues.
* **Email Support**: For general questions or private inquiries, you can contact the developer directly via email at `support@playfulsparkle.com`. Please allow a reasonable timeframe for a response.

We encourage users to use the GitHub Issues page for bug reports and feature requests as it helps in better organization and tracking of the extension's development.

---

## License

This extension is licensed under the [BSD-3-Clause License](https://github.com/playfulsparkle/vscode_ps_dev_toolbox/blob/main/LICENSE). See the `LICENSE` file for complete details.

---

## Author

Hi! We're the team behind Playful Sparkle, a creative agency from Slovakia. We got started way back in 2004 and have been having fun building digital solutions ever since. Whether it's crafting a brand, designing a website, developing an app, or anything in between, we're all about delivering great results with a smile. We hope you enjoy using our Visual Studio Code extension!