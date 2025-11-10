import * as vscode from "vscode";
import * as path from "path";
import * as utils from "./utils";
import * as sortUtils from "./sortUtils";

/**
 * VS Code Extension: Playful Sparkle Developer Toolbox
 * 
 * A comprehensive developer toolbox extension that provides:
 * - Text case transformations (camelCase, snake_case, kebab-case, etc.)
 * - Slugification for text and file names
 * - Encoding/decoding utilities (Base64, URL, HTML entities, Unicode)
 * - GUID generation with multiple formats
 * - Text cleaning (empty lines, whitespace, non-printable characters)
 * - Advanced line sorting with locale support
 * - File and folder name transformations
 * 
 * @module extension
 */

/**
 * Activates the PS Developer Toolbox extension
 * 
 * This function is called by VS Code when the extension is activated.
 * It registers all commands, sets up event handlers, and initializes
 * the extension functionality.
 * 
 * @param {vscode.ExtensionContext} context - The extension context provided by VS Code
 * 
 * @see {@link https://code.visualstudio.com/api/references/vscode-api#ExtensionContext | ExtensionContext}
 */
export function activate(context: vscode.ExtensionContext) {
	/**
	 * Command identifiers for the extension
	 * @enum {string}
	 */
	enum CommandId {
		/** Opens the GitHub issues page to report problems */
		ReportIssue = "ps-dev-toolbox.reportIssue",
		/** Converts text to slug format with configurable separator */
		Slugify = "ps-dev-toolbox.slugify",
		/** Converts file or folder names to slug format */
		SlugifyFilenameOrFolder = "ps-dev-toolbox.slugifyFilenameOrFolder",
		/** Converts text to camelCase format */
		ToCamelCase = "ps-dev-toolbox.toCamelCase",
		/** Converts text to PascalCase format */
		ToPascalCase = "ps-dev-toolbox.toPascalCase",
		/** Converts text to snake_case format */
		ToSnakeCase = "ps-dev-toolbox.toSnakeCase",
		/** Converts text to SCREAMING_SNAKE_CASE format */
		ToScreamingSnakeCase = "ps-dev-toolbox.toScreamingSnakeCase",
		/** Converts text to kebab-case format */
		ToKebabCase = "ps-dev-toolbox.toKebabCase",
		/** Converts text to Train-Case format */
		ToTrainCase = "ps-dev-toolbox.toTrainCase",
		/** Converts text to flatcase format */
		ToFlatCase = "ps-dev-toolbox.toFlatCase",
		/** Converts text to UPPERCASE format */
		ToUpperCase = "ps-dev-toolbox.toUpperCase",
		/** Converts text to lowercase with locale support */
		MakeLowercase = "ps-dev-toolbox.makeLowercase",
		/** Converts text to uppercase with locale support */
		MakeUppercase = "ps-dev-toolbox.makeUppercase",
		/** Encodes text to Base64 format */
		Base64Encode = "ps-dev-toolbox.base64Encode",
		/** Decodes text from Base64 format */
		Base64Decode = "ps-dev-toolbox.base64Decode",
		/** URL-encodes text */
		UrlEncode = "ps-dev-toolbox.urlEncode",
		/** URL-decodes text */
		UrlDecode = "ps-dev-toolbox.urlDecode",
		/** Generates GUID/UUID with configurable format */
		GenerateGuid = "ps-dev-toolbox.generateGuid",
		/** Removes empty lines from entire document */
		RemoveEmptyLinesDocument = "ps-dev-toolbox.removeEmptyLinesDocument",
		/** Removes empty lines from current selection */
		RemoveEmptyLinesSelection = "ps-dev-toolbox.removeEmptyLinesSelection",
		/** Removes non-printable characters from text */
		CleanText = "ps-dev-toolbox.cleanText",
		/** Removes leading and trailing whitespace */
		TrimLineWhitespace = "ps-dev-toolbox.trimLineWhitespace",
		/** Encodes text to HTML named character entities */
		EncodeHTMLNamedCharacterEntitys = "ps-dev-toolbox.encodeHTMLNamedCharacterEntitys",
		/** Decodes text from HTML named character entities */
		DecodeHTMLNamedCharacterEntitys = "ps-dev-toolbox.decodeHTMLNamedCharacterEntitys",
		/** Encodes text to HTML hexadecimal character references */
		EncodeHTMLHexadecimalCharacterReference = "ps-dev-toolbox.encodeHTMLHexadecimalCharacterReference",
		/** Decodes text from HTML hexadecimal character references */
		DecodeHTMLHexadecimalCharacterReference = "ps-dev-toolbox.decodeHTMLHexadecimalCharacterReference",
		/** Encodes text to HTML decimal entities */
		EncodeHtmlDecimalEntities = "ps-dev-toolbox.encodeHtmlDecimalEntities",
		/** Decodes text from HTML decimal entities */
		DecodeHtmlDecimalEntities = "ps-dev-toolbox.decodeHtmlDecimalEntities",
		/** Encodes text to JavaScript UTF-16 escape sequences */
		EncodeJavaScriptUTF16EscapeSequences = "ps-dev-toolbox.encodeJavaScriptUTF16EscapeSequences",
		/** Decodes text from JavaScript UTF-16 escape sequences */
		DecodeJavaScriptUTF16EscapeSequences = "ps-dev-toolbox.decodeJavaScriptUTF16EscapeSequences",
		/** Encodes text to CSS Unicode escape sequences */
		EncodeCssUnicodeEscape = "ps-dev-toolbox.encodeCssUnicodeEscape",
		/** Decodes text from CSS Unicode escape sequences */
		DecodeCssUnicodeEscape = "ps-dev-toolbox.decodeCssUnicodeEscape",
		/** Encodes text to Unicode code point notation */
		EncodeUnicodeCodePointNotation = "ps-dev-toolbox.encodeUnicodeCodePointNotation",
		/** Decodes text from Unicode code point notation */
		DecodeUnicodeCodePointNotation = "ps-dev-toolbox.decodeUnicodeCodePointNotation",
		/** Encodes text to Unicode code point escape sequences */
		EncodeUnicodeCodePointEscapeSequence = "ps-dev-toolbox.encodeUnicodeCodePointEscapeSequence",
		/** Decodes text from Unicode code point escape sequences */
		DecodeUnicodeCodePointEscapeSequence = "ps-dev-toolbox.decodeUnicodeCodePointEscapeSequence",
		/** Encodes text to PCRE Unicode hexadecimal escape sequences */
		EncodeExtendedHexEscape = "ps-dev-toolbox.encodePCREUnicodeHexadecimalEcape",
		/** Decodes text from PCRE Unicode hexadecimal escape sequences */
		DecodeExtendedHexEscape = "ps-dev-toolbox.decodePCREUnicodeHexadecimalEcape",
		/** Encodes text to hexadecimal code points */
		EncodeHexCodePoints = "ps-dev-toolbox.encodeHexCodePoints",
		/** Decodes text from hexadecimal code points */
		DecodeHexCodePoints = "ps-dev-toolbox.decodeHexCodePoints",
		/** Sorts lines in ascending order */
		SortLinesAscending = "ps-dev-toolbox.sortLinesAscending",
		/** Sorts lines in descending order */
		SortLinesDescending = "ps-dev-toolbox.sortLinesDescending"
	}

	/**
	 * Helper function to read configuration settings from VS Code workspace
	 * @param section - The configuration section (e.g., "ps-dev-toolbox.encoding")
	 * @param key - The configuration key within the section
	 * @param defaultValue - Default value if the setting is not found
	 * @returns The configuration value or default value
	 */
	const getConfigValue = <T>(
		section: string,
		key: string,
		defaultValue: T
	): T => {
		const config = vscode.workspace.getConfiguration(section);

		return config.get<T>(key, defaultValue);
	};

	const getDefaultLocale = () => {
		return vscode.env.language || "en";
	};

	/**
	 * Processes text in the active editor with a transformation function
	 * 
	 * Handles both text selections and entire document processing with
	 * optional line expansion for better paragraph handling.
	 * 
	 * @param {function} transformFn - The transformation function to apply to text
	 * @param {boolean} [expandToFullLines=false] - Whether to expand selections to full lines
	 * @param {any} [options] - Optional parameters to pass to the transform function
	 * @returns {Promise<void>}
	 * 
	 * @throws {Error} May throw errors during editor edit operations
	 */
	const processTextInEditor = async (
		transformFn: (text: string, options?: any) => string,
		expandToFullLines: boolean = false,
		options?: any
	): Promise<void> => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		const selections = editor.selections;

		// If there are no manual selections or only empty selections, process the entire document
		if (!selections.length || selections.every(s => s.isEmpty)) {
			const entireDocumentRange = new vscode.Range(
				0, 0,
				document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length
			);
			const text = document.getText(entireDocumentRange);
			const processedText = transformFn(text, options);

			await editor.edit(editBuilder => {
				editBuilder.replace(entireDocumentRange, processedText);
			});
			return;
		}

		// Process each selection
		await editor.edit(editBuilder => {
			for (const selection of selections) {
				if (selection.isEmpty) {
					continue;
				}

				let rangeToProcess = selection;

				// Expand selection to full lines if requested
				if (expandToFullLines) {
					const startLine = document.lineAt(selection.start.line);
					const endLine = document.lineAt(selection.end.line);
					rangeToProcess = new vscode.Selection(startLine.range.start, endLine.range.end);
				}

				const selectedText = document.getText(rangeToProcess);
				const processedText = transformFn(selectedText, options);

				editBuilder.replace(rangeToProcess, processedText);
			}
		});
	};

	/**
	 * Creates a factory function for text transformation commands
	 * 
	 * @param {function} transformFn - The transformation function to apply
	 * @returns {function} Command handler function
	 */
	const createTextTransformCommand = (transformFn: (text: string) => string) => {
		return async (): Promise<void> => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				return;
			}

			const selection = editor.selection;

			const text = editor.document.getText(selection);

			if (!text) {
				return;
			}

			await editor.edit(editBuilder => editBuilder.replace(selection, transformFn(text)));
		};
	};

	/**
	 * Creates a factory function for inserting text at cursor position
	 * 
	 * @param {function} generateFn - The function to generate text to insert
	 * @returns {function} Command handler function
	 */
	const createInsertAtCursorCommand = (generateFn: () => string) => {
		return async (): Promise<void> => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				return;
			}

			const position = editor.selection.active;

			await editor.edit(editBuilder => editBuilder.insert(position, generateFn()));
		};
	};

	/**
	 * Type definition for line range tuples
	 */
	type IRange = [number, number];

	/**
	 * Removes empty lines from document or selection
	 * 
	 * @param {boolean} inSelection - Whether to process only selection or entire document
	 * @returns {Promise<void>}
	 */
	const removeEmptyLinesCommand = async (inSelection: boolean): Promise<void> => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		// Get configuration from settings
		const whiteSpaceEmpty = getConfigValue<boolean>("ps-dev-toolbox.removeEmptyLines", "whiteSpaceEmpty", true);

		const document = editor.document;
		const selections = editor.selections;

		if (inSelection) { // Process selections
			if (selections.length === 1 && selections[0].isEmpty) { // Single cursor position
				const cursorLine = document.lineAt(selections[0].start.line);

				if (!cursorLine) {
					return;
				}

				const cursorFirstNonEmptyLine = getCursorFirstNoneEmptyLine(selections[0].start.line, document);
				const cursorLastNonEmptyLine = getCursorLastNoneEmptyLine(selections[0].start.line, document);

				await removeEmptyLines(editor, document, [[cursorFirstNonEmptyLine, cursorLastNonEmptyLine]], whiteSpaceEmpty);
			} else { // Multi-cursor selections
				const rangesToProcess: IRange[] = [];

				for (const selection of selections) {
					if (!selection.isEmpty) {
						rangesToProcess.push([selection.start.line, selection.end.line]);
					}
				}

				await removeEmptyLines(editor, document, rangesToProcess, whiteSpaceEmpty);
			}
		} else { // Process entire document
			await removeEmptyLines(editor, document, [[0, document.lineCount - 1]], whiteSpaceEmpty);
		}
	};

	/**
	 * Removes empty lines from specified ranges in document
	 * 
	 * @param {vscode.TextEditor} editor - The active text editor
	 * @param {vscode.TextDocument} document - The text document
	 * @param {IRange[]} ranges - Array of line ranges to process
	 * @param {boolean} whiteSpaceEmpty - Whether to consider whitespace-only lines as empty
	 * @returns {Promise<void>}
	 */
	const removeEmptyLines = async (
		editor: vscode.TextEditor,
		document: vscode.TextDocument,
		ranges: IRange[],
		whiteSpaceEmpty: boolean
	): Promise<void> => {
		if (ranges.length === 0) {
			return;
		}

		const rangesToDelete: vscode.Range[] = [];

		for (const range of ranges) {
			for (let idx = range[0]; idx <= range[1]; idx++) {
				const line = document.lineAt(idx);

				const isEmpty = whiteSpaceEmpty
					? line.isEmptyOrWhitespace
					: line.text.length === 0;

				if (isEmpty) {
					rangesToDelete.push(line.rangeIncludingLineBreak);
				}
			}
		}

		if (rangesToDelete.length === 0) {
			return;
		}

		await editor.edit(editBuilder => {
			for (const range of rangesToDelete) {
				editBuilder.delete(range);
			}
		});
	};

	/**
	 * Searches backward from cursor position to find first non-empty line
	 * 
	 * @param {number} line - Starting line number
	 * @param {vscode.TextDocument} document - The text document
	 * @returns {number} Line number of first non-empty line
	 */
	const getCursorFirstNoneEmptyLine = (line: number, document: vscode.TextDocument): number => {
		const startLine = line - 1;

		if (startLine < 0) {
			return 0; // Default to first line if all lines before cursor are empty
		}

		for (let idx = startLine; idx >= 0; idx--) {
			if (document.lineAt(idx).isEmptyOrWhitespace) {
				continue;
			}

			return idx;
		}

		return 0; // Default to first line if all lines before cursor are empty
	};

	/**
	 * Searches forward from cursor position to find first non-empty line
	 * 
	 * @param {number} line - Starting line number
	 * @param {vscode.TextDocument} document - The text document
	 * @returns {number} Line number of first non-empty line
	 */
	const getCursorLastNoneEmptyLine = (line: number, document: vscode.TextDocument): number => {
		const startLine = line + 1;

		if (startLine >= document.lineCount) {
			return document.lineCount - 1; // Default to last line if all lines after cursor are empty
		}

		for (let idx = startLine; idx < document.lineCount; idx++) {
			if (document.lineAt(idx).isEmptyOrWhitespace) {
				continue;
			}

			return idx;
		}

		return document.lineCount - 1; // Default to last line if all lines after cursor are empty
	};

	/**
	 * Prompts user for locale input and validates it
	 * 
	 * @returns {Promise<string[]>} Array of validated locales
	 */
	const localesPrompt = async (): Promise<string[]> => {
		const defaultLocale = getDefaultLocale();

		const localesInput = await vscode.window.showInputBox({
			prompt: vscode.l10n.t("Enter the locales to use for the transformation (comma-separated)"),
			placeHolder: vscode.l10n.t("e.g. hu, sk, en-US"),
			value: defaultLocale,
		});

		if (localesInput) {
			try {
				return utils.filterUserLocaleInput(defaultLocale, localesInput);
			} catch (error) {
				vscode.window.showErrorMessage(
					vscode.l10n.t("Using default '{1}'. Invalid locales: '{0}'.", localesInput, defaultLocale)
				);

				return [defaultLocale];
			}
		}

		return [defaultLocale];
	};

	/**
	 * Renames file or folder to slugified name
	 * 
	 * @param {vscode.Uri} uri - The URI of the file or folder to rename
	 * @param {string} separator - Separator to use for slugification
	 * @returns {Promise<void>}
	 */
	const slugifyFilenameOrFolder = async (uri: vscode.Uri, separator: string): Promise<void> => {
		const oldPath = uri.fsPath;

		const itemName = path.basename(oldPath);
		const parentPath = path.dirname(oldPath);
		const slugifiedName = utils.slugify(itemName, separator);

		if (slugifiedName.trim().length === 0) {
			return;
		}

		if (itemName === slugifiedName) {
			vscode.window.showWarningMessage(
				vscode.l10n.t("'{0}' is already slugified.", itemName)
			);
			return;
		}

		const newPath = path.join(parentPath, slugifiedName);
		const newUri = vscode.Uri.file(newPath);
		let shouldOverwrite = false;

		if (await isFileExists(newUri)) {
			const overwritePrompt = await vscode.window.showWarningMessage(
				vscode.l10n.t("'{0}' already exists. Do you want to overwrite it?", slugifiedName),
				{ modal: true },
				vscode.l10n.t("Yes"),
				vscode.l10n.t("No")
			);

			if (overwritePrompt === vscode.l10n.t("Yes")) {
				shouldOverwrite = true;
			} else {
				return;
			}
		}

		try {
			await vscode.workspace.fs.rename(uri, newUri, { overwrite: shouldOverwrite });

			vscode.window.showInformationMessage(
				vscode.l10n.t("Renamed: {0} to {1}", itemName, slugifiedName)
			);
		} catch (error) {
			vscode.window.showErrorMessage(
				vscode.l10n.t("Failed to rename '{0}': {1}", itemName, (error as Error).message)
			);
		}
	};

	const isFileExists = async (uri: vscode.Uri): Promise<boolean> => {
		try {
			await vscode.workspace.fs.stat(uri);
			return true;  // File exists - stat succeeded
		} catch (error) {
			return false; // File doesn't exist - stat threw an error
		}
	};

	/**
	 * Command handlers for all extension commands
	 * 
	 * @namespace commandHandlers
	 */
	const commandHandlers = {
		/**
		 * Opens the GitHub issues page for reporting problems or suggestions
		 * 
		 * @returns {void}
		 */
		[CommandId.ReportIssue]: () => vscode.env.openExternal(vscode.Uri.parse("https://github.com/playfulsparkle/vscode_ps_dev_toolbox/issues")),

		/**
		 * Converts text to camelCase format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToCamelCase]: createTextTransformCommand(utils.toCamelCase),

		/**
		 * Converts text to PascalCase format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToPascalCase]: createTextTransformCommand(utils.toPascalCase),

		/**
		 * Converts text to snake_case format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToSnakeCase]: createTextTransformCommand(utils.toSnakeCase),

		/**
		 * Converts text to SCREAMING_SNAKE_CASE format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToScreamingSnakeCase]: createTextTransformCommand(utils.toScreamingSnakeCase),

		/**
		 * Converts text to kebab-case format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToKebabCase]: createTextTransformCommand(utils.toKebabCase),

		/**
		 * Converts text to Train-Case format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToTrainCase]: createTextTransformCommand(utils.toTrainCase),

		/**
		 * Converts text to flatcase format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToFlatCase]: createTextTransformCommand(utils.toFlatCase),

		/**
		 * Converts text to UPPERCASE format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.ToUpperCase]: createTextTransformCommand(utils.toUpperCase),

		/**
		 * Converts text to slug format with configurable separator
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.Slugify]: async (): Promise<void> => {
			const separator = getConfigValue<string>("ps-dev-toolbox.slugify", "separator", "-");

			return processTextInEditor(text => utils.slugify(text, separator));
		},

		/**
		 * Converts file or folder names to slug format
		 * 
		 * @param {vscode.Uri} uri - The primary URI from context menu
		 * @param {vscode.Uri[]} [selectedUris] - Array of all selected URIs for multi-select
		 * @returns {Promise<void>}
		 */
		[CommandId.SlugifyFilenameOrFolder]: async (uri: vscode.Uri, selectedUris?: vscode.Uri[]): Promise<void> => {
			if (!uri) {
				return;
			}

			const separator = getConfigValue<string>("ps-dev-toolbox.slugify", "separator", "-");

			// Handle multiple selection
			const urisToRename = selectedUris && selectedUris.length > 0 ? selectedUris : [uri];

			for (const currentUri of urisToRename) {
				await slugifyFilenameOrFolder(currentUri, separator);
			}

			if (urisToRename.length > 1) {
				vscode.window.showInformationMessage(
					vscode.l10n.t("{0} items slugified successfully.", urisToRename.length)
				);
			}
		},

		/**
		 * Converts text to lowercase with locale support
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.MakeLowercase]: async (): Promise<void> => {
			const localesInput = await localesPrompt();

			return processTextInEditor(text => utils.safeToLowerCase(text, localesInput));
		},

		/**
		 * Converts text to uppercase with locale support
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.MakeUppercase]: async (): Promise<void> => {
			const localesInput = await localesPrompt();

			return processTextInEditor(text => utils.safeToUppercase(text, localesInput));
		},

		/**
		 * Encodes text to Base64 format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.Base64Encode]: createTextTransformCommand(utils.base64Encode),

		/**
		 * Decodes text from Base64 format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.Base64Decode]: createTextTransformCommand((text: string): string => {
			if (!utils.isValidBase64(text)) {
				vscode.window.showErrorMessage(vscode.l10n.t("Invalid Base64 encoded string."));

				return text;
			}

			return utils.base64Decode(text);
		}),

		/**
		 * URL-encodes text
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.UrlEncode]: createTextTransformCommand(utils.urlEncode),

		/**
		 * URL-decodes text
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.UrlDecode]: createTextTransformCommand(utils.urlDecode),

		/**
		 * Generates GUID/UUID with configurable format
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.GenerateGuid]: createInsertAtCursorCommand((): string => {
			const format = getConfigValue<string>("ps-dev-toolbox.uuid", "format", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
			const generatedUuid = utils.generateGuid();

			switch (format) {
				case "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}":
					return `{${generatedUuid}}`;
				case "[Guid(\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\")]":
					return `[Guid("${generatedUuid}")]`;
				case "<Guid(\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\")>":
					return `<Guid("${generatedUuid}")>`;
				default:
					return `${generatedUuid}`;
			}
		}),

		/**
		 * Removes empty lines from entire document
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.RemoveEmptyLinesDocument]: async (): Promise<void> => removeEmptyLinesCommand(false),

		/**
		 * Removes empty lines from current selection
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.RemoveEmptyLinesSelection]: async (): Promise<void> => removeEmptyLinesCommand(true),

		/**
		 * Removes non-printable characters from text
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.CleanText]: async (): Promise<void> => {
			await processTextInEditor(
				utils.cleanText,
				false // Don't expand to full lines (process exact selection)
			);
		},

		/**
		 * Removes leading and trailing whitespace
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.TrimLineWhitespace]: async (): Promise<void> => {
			const preserveTabs = getConfigValue<boolean>("ps-dev-toolbox.trimLineWhitespace", "preserveTabs", true);

			await processTextInEditor(
				text => utils.trimLineWhitespace(text, preserveTabs),
				true // Expand to full lines
			);
		},

		/**
		 * Encodes text to HTML named character entities
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeHTMLNamedCharacterEntitys]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeHTMLNamedCharacterEntity(text, doubleEncode));
		},

		/**
		 * Decodes text from HTML named character entities
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeHTMLNamedCharacterEntitys]: async (): Promise<void> => processTextInEditor(utils.decodeHTMLNamedCharacterEntity),

		/**
		 * Encodes text to HTML hexadecimal character references
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeHTMLHexadecimalCharacterReference]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeHTMLHexadecimalCharacterReference(text, doubleEncode));
		},

		/**
		 * Decodes text from HTML hexadecimal character references
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeHTMLHexadecimalCharacterReference]: async (): Promise<void> => processTextInEditor(utils.decodeHTMLHexadecimalCharacterReference),

		/**
		 * Encodes text to HTML decimal entities
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeHtmlDecimalEntities]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeHtmlDecimalEntities(text, doubleEncode));
		},

		/**
		 * Decodes text from HTML decimal entities
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeHtmlDecimalEntities]: async (): Promise<void> => processTextInEditor(utils.decodeHtmlDecimalEntities),

		/**
		 * Encodes text to JavaScript UTF-16 escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeJavaScriptUTF16EscapeSequences]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeJavaScriptUTF16EscapeSequence(text, doubleEncode));
		},

		/**
		 * Decodes text from JavaScript UTF-16 escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeJavaScriptUTF16EscapeSequences]: async (): Promise<void> => processTextInEditor(utils.decodeJavaScriptUTF16EscapeSequence),

		/**
		 * Encodes text to CSS Unicode escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeCssUnicodeEscape]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeCssUnicodeEscape(text, doubleEncode));
		},

		/**
		 * Decodes text from CSS Unicode escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeCssUnicodeEscape]: async (): Promise<void> => processTextInEditor(utils.decodeCssUnicodeEscape),

		/**
		 * Encodes text to Unicode code point notation
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeUnicodeCodePointNotation]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeUnicodeCodePointNotation(text, doubleEncode));
		},

		/**
		 * Decodes text from Unicode code point notation
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeUnicodeCodePointNotation]: async (): Promise<void> => processTextInEditor(utils.decodeUnicodeCodePointNotation),

		/**
		 * Encodes text to Unicode code point escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeUnicodeCodePointEscapeSequence]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeUnicodeCodePointEscapeSequence(text, doubleEncode));
		},

		/**
		 * Decodes text from Unicode code point escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeUnicodeCodePointEscapeSequence]: async (): Promise<void> => processTextInEditor(utils.decodeUnicodeCodePointEscapeSequence),

		/**
		 * Encodes text to PCRE Unicode hexadecimal escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeExtendedHexEscape]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodePCREUnicodeHexadecimalEcape(text, doubleEncode));
		},

		/**
		 * Decodes text from PCRE Unicode hexadecimal escape sequences
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeExtendedHexEscape]: async (): Promise<void> => processTextInEditor(utils.decodePCREUnicodeHexadecimalEcape),

		/**
		 * Encodes text to hexadecimal code points
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.EncodeHexCodePoints]: async (): Promise<void> => {
			const doubleEncode = getConfigValue<boolean>("ps-dev-toolbox.encoding", "doubleEncode", false);

			await processTextInEditor(text => utils.encodeHexCodePoints(text, doubleEncode));
		},

		/**
		 * Decodes text from hexadecimal code points
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.DecodeHexCodePoints]: async (): Promise<void> => processTextInEditor(utils.decodeHexCodePoints),

		/**
		 * Sorts lines in ascending order
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.SortLinesAscending]: async (): Promise<void> => {
			const defaultLocale = getDefaultLocale();
			const useNumericSorting = getConfigValue<boolean>("ps-dev-toolbox.sorting", "numeric", true);
			const sortIgnoreCase = getConfigValue<boolean>("ps-dev-toolbox.sorting", "ignoreCase", true);
			const sortLocale = getConfigValue<string>("ps-dev-toolbox.sorting", "locale", defaultLocale);
			const locales = utils.validateSortLocale(sortLocale, defaultLocale);
			const sortOptions = {
				descending: false,
				locales: locales,
				ignoreCase: sortIgnoreCase,
				numeric: useNumericSorting
			};

			await processTextInEditor(text => sortUtils.sortLines(text, sortOptions));
		},

		/**
		 * Sorts lines in descending order
		 * 
		 * @returns {Promise<void>}
		 */
		[CommandId.SortLinesDescending]: async (): Promise<void> => {
			const defaultLocale = getDefaultLocale();
			const useNumericSorting = getConfigValue<boolean>("ps-dev-toolbox.sorting", "numeric", true);
			const sortIgnoreCase = getConfigValue<boolean>("ps-dev-toolbox.sorting", "ignoreCase", true);
			const sortLocale = getConfigValue<string>("ps-dev-toolbox.sorting", "locale", defaultLocale);
			const locales = utils.validateSortLocale(sortLocale, defaultLocale);
			const sortOptions = {
				descending: true,
				locales: locales,
				ignoreCase: sortIgnoreCase,
				numeric: useNumericSorting
			};

			await processTextInEditor(text => sortUtils.sortLines(text, sortOptions));
		},
	};

	// Register all commands
	for (const [commandId, handler] of Object.entries(commandHandlers)) {
		const disposable = vscode.commands.registerCommand(commandId, handler);

		context.subscriptions.push(disposable);
	}
}

/**
 * Deactivates the PS Developer Toolbox extension
 * 
 * Called by VS Code when the extension is deactivated. Currently performs
 * no cleanup as all resources are managed by VS Code's subscription system.
 * 
 * @returns {void}
 */
export function deactivate() { }