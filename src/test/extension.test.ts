import * as assert from "assert";
import * as utils from "../utils";

suite("Dev Toolbox Tests", () => {
	suite("String Utilities", () => {
		test("safeToLowerCase prototype method", () => {
			assert.strictEqual("TEST".safeToLowerCase(), "test");
			assert.strictEqual("İ".safeToLowerCase("tr"), "i");
		});

		test("safeToUppercase prototype method", () => {
			assert.strictEqual("test".safeToUppercase(), "TEST");
			assert.strictEqual("iß".safeToUppercase("de"), "ISS");
		});

		test("safeToLowerCase function with fallback", () => {
			assert.strictEqual(utils.safeToLowerCase("TEST"), "test");
			assert.strictEqual(utils.safeToLowerCase("İ", "invalid-locale"), "i̇");
			assert.strictEqual(utils.safeToLowerCase("İ", "tr"), "i");
		});

		test("safeToUppercase function with fallback", () => {
			assert.strictEqual(utils.safeToUppercase("test"), "TEST");
			assert.strictEqual(utils.safeToUppercase("iß", "invalid-locale"), "ISS");
		});
	});

	suite("Encoding Utilities", () => {
		test("base64Encode/base64Decode roundtrip", () => {
			const original = "Playful Sparkle 🎉";
			const encoded = utils.base64Encode(original);
			assert.strictEqual(utils.base64Decode(encoded), original);
		});

		test("base64Decode rejects invalid input", () => {
			assert.strictEqual(utils.base64Decode("Not Base64!"), "Not Base64!");
			assert.strictEqual(utils.base64Decode("Invalid==Chars_"), "Invalid==Chars_");
		});

		test("isValidBase64 detects valid/invalid strings", () => {
			assert.ok(utils.isValidBase64("SGVsbG8="));    // "Hello"
			assert.ok(!utils.isValidBase64("SGVsbG8"));     // Missing padding
			assert.ok(!utils.isValidBase64("SGVsbG8===")); // Extra padding
			assert.ok(!utils.isValidBase64("SGVsbG8$"));   // Invalid character
		});

		test("urlEncode/urlDecode roundtrip", () => {
			const original = "Search for & stuff?";
			const encoded = utils.urlEncode(original);
			assert.strictEqual(utils.urlDecode(encoded), original);
			assert.strictEqual(encoded, "Search%20for%20%26%20stuff%3F");
		});
	});

	suite("GUID Generation", () => {
		test("generateGuid produces valid format", () => {
			const guid = utils.generateGuid();
			assert.ok(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(guid));
		});

		test("generated GUIDs are unique", () => {
			const guids = new Set();
			for (let i = 0; i < 1000; i++) {
				guids.add(utils.generateGuid());
			}
			assert.strictEqual(guids.size, 1000);
		});
	});

	suite("Slugify", () => {
		test("slugify preserves file extensions", () => {
			assert.strictEqual(
				utils.slugify("Document Version 2.0.pdf"),
				"document-version-2-0.pdf"
			);
			assert.strictEqual(
				utils.slugify("Image with spaces.jpeg"),
				"image-with-spaces.jpeg"
			);
		});

		test("slugify handles special characters", () => {
			assert.strictEqual(
				utils.slugify("Modülär Ärchïtecture~!@#$%^&*().txt"),
				"modular-architecture.txt"
			);
			assert.strictEqual(
				utils.slugify("Hello   World--__--Test"),
				"hello-world-test"
			);
		});

		test("slugify removes diacritics", () => {
			assert.strictEqual(
				utils.slugify("Àççèñtéd Chäràctêrs"),
				"accented-characters"
			);
			assert.strictEqual(
				utils.slugify("Ñörmälîzätïon"),
				"normalization"
			);
		});
	});

	suite("Remove Empty Lines", () => {
		test("removes all empty lines by default", () => {
			const input = "Line 1\n\nLine 2\n\n\nLine 3";
			const expected = "Line 1\nLine 2\nLine 3";
			assert.strictEqual(utils.removeEmptyLines(input), expected);
		});

		test("removes consecutive empty lines when configured", () => {
			const input = "Line 1\n\n\nLine 2\n\nLine 3";
			const expected = "Line 1\nLine 2\nLine 3";
			const options = { removeConsecutive: true, considerWhitespaceEmpty: false };
			assert.strictEqual(utils.removeEmptyLines(input, options), expected);
		});

		test("preserves single empty lines when configured", () => {
			const input = "Line 1\n\nLine 2\n\nLine 3";
			const expected = "Line 1\n\nLine 2\n\nLine 3";
			const options = { removeConsecutive: false, considerWhitespaceEmpty: false };
			assert.strictEqual(utils.removeEmptyLines(input, options), expected);
		});

		test("considers whitespace-only lines as empty", () => {
			const input = "Line 1\n   \nLine 2\n\t\nLine 3";
			const expected = "Line 1\nLine 2\nLine 3";
			assert.strictEqual(utils.removeEmptyLines(input), expected);
		});

		test("does not consider whitespace-only lines as empty when configured", () => {
			const input = "Line 1\n   \nLine 2\n\t\nLine 3";
			const expected = "Line 1\n   \nLine 2\n\t\nLine 3";
			const options = { removeConsecutive: false, considerWhitespaceEmpty: false };
			assert.strictEqual(utils.removeEmptyLines(input, options), expected);
		});
	});

	suite("Remove Non-Printable Characters", () => {
		test("removes non-printable characters", () => {
			const input = "Hello\u0000 World\u200B!";
			const expected = "Hello World!";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});

		test("preserves printable characters", () => {
			const input = "Hello World!";
			const expected = "Hello World!";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});

		test("preserves whitespace characters", () => {
			const input = "Hello\tWorld\nNew Line\rCarriage Return";
			const expected = "Hello\tWorld\nNew Line\rCarriage Return";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});

		test("handles empty input", () => {
			const input = "";
			const expected = "";
			assert.strictEqual(utils.removeNonPrintableCharacters(input), expected);
		});
	});

	suite("Remove Leading Trailing Whitespace", () => {
		test("removes leading and trailing whitespace from each line", () => {
			const input = "  Line 1  \n\tLine 2\t\n  Line 3  ";
			const expected = "Line 1\nLine 2\nLine 3";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});

		test("preserves lines with no leading or trailing whitespace", () => {
			const input = "Line 1\nLine 2\nLine 3";
			const expected = "Line 1\nLine 2\nLine 3";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});

		test("handles empty input", () => {
			const input = "";
			const expected = "";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});

		test("handles lines with only whitespace", () => {
			const input = "  \n\t\n  ";
			const expected = "\n\n";
			assert.strictEqual(utils.removeLeadingTrailingWhitespace(input), expected);
		});
	});
});