import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as utils from "./utils";


/** Activates the extension
 * @param {vscode.ExtensionContext} context - The extension context
 */
export function activate(context: vscode.ExtensionContext) {
	enum CommandId {
		ReportIssue = "ps-dev-toolbox.reportIssue",
		Slugify = "ps-dev-toolbox.slugify",
		SlugifyFilename = "ps-dev-toolbox.slugifyFileOrFolder",
		ToCamelCase = "ps-dev-toolbox.toCamelCase",
		ToPascalCase = "ps-dev-toolbox.toPascalCase",
		ToSnakeCase = "ps-dev-toolbox.toSnakeCase",
		ToScreamingSnakeCase = "ps-dev-toolbox.toScreamingSnakeCase",
		ToKebabCase = "ps-dev-toolbox.toKebabCase",
		ToTrainCase = "ps-dev-toolbox.toTrainCase",
		ToFlatCase = "ps-dev-toolbox.toFlatCase",
		ToUpperCase = "ps-dev-toolbox.toUpperCase",
		MakeLowercase = "ps-dev-toolbox.makeLowercase",
		MakeUppercase = "ps-dev-toolbox.makeUppercase",
		Base64Encode = "ps-dev-toolbox.base64Encode",
		Base64Decode = "ps-dev-toolbox.base64Decode",
		UrlEncode = "ps-dev-toolbox.urlEncode",
		UrlDecode = "ps-dev-toolbox.urlDecode",
		GenerateGuid = "ps-dev-toolbox.generateGuid",
		RemoveEmptyLinesDocument = "ps-dev-toolbox.removeEmptyLinesDocument",
		RemoveEmptyLinesSelection = "ps-dev-toolbox.removeEmptyLinesSelection",
		RemoveNonPrintableChars = "ps-dev-toolbox.removeNonPrintableChars",
		RemoveLeadingTrailingWhitespace = "ps-dev-toolbox.removeLeadingTrailingWhitespace",
		EncodeNamedHtmlEntities = "ps-dev-toolbox.encodeNamedHtmlEntities",
		DecodeNamedHtmlEntities = "ps-dev-toolbox.decodeNamedHtmlEntities",
		EncodeHtmlHexEntities = "ps-dev-toolbox.encodeHtmlHexEntities",
		DecodeHtmlHexEntities = "ps-dev-toolbox.decodeHtmlHexEntities",
		EncodeHtmlDecimalEntities = "ps-dev-toolbox.encodeHtmlDecimalEntities",
		DecodeHtmlDecimalEntities = "ps-dev-toolbox.decodeHtmlDecimalEntities",
		encodeJavaScriptUnicodeEscapes = "ps-dev-toolbox.encodeJavaScriptUnicodeEscapes",
		decodeJavaScriptUnicodeEscapes = "ps-dev-toolbox.decodeJavaScriptUnicodeEscapes",
		EncodeCssUnicodeEscape = "ps-dev-toolbox.encodeCssUnicodeEscape",
		DecodeCssUnicodeEscape = "ps-dev-toolbox.decodeCssUnicodeEscape",
		EncodeUnicodeCodePoints = "ps-dev-toolbox.encodeUnicodeCodePoints",
		DecodeUnicodeCodePoints = "ps-dev-toolbox.decodeUnicodeCodePoints",
		EncodeES6UnicodeCodePointEscape = "ps-dev-toolbox.encodeES6UnicodeCodePointEscape",
		DecodeES6UnicodeCodePointEscape = "ps-dev-toolbox.decodeES6UnicodeCodePointEscape",
		EncodeExtendedHexEscape = "ps-dev-toolbox.encodeHexEntities",
		DecodeExtendedHexEscape = "ps-dev-toolbox.decodeHexEntities",
		EncodeHexCodePoints = "ps-dev-toolbox.encodeHexCodePoints",
		DecodeHexCodePoints = "ps-dev-toolbox.decodeHexCodePoints"
	}

	// Create a factory function for text transformation commands
	const createTextTransformCommand = (transformFn: (text: string) => string) => {
		return async () => {
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

	// Create a factory function for inserting text at cursor position
	const createInsertAtCursorCommand = (generateFn: () => string) => {
		return async () => {
			const editor = vscode.window.activeTextEditor;

			if (!editor) {
				return;
			}

			const position = editor.selection.active;

			await editor.edit(editBuilder => editBuilder.insert(position, generateFn()));
		};
	};

	/**
	 * Processes text in the editor with a transformation function
	 * @param editor The active text editor
	 * @param transformFn The function to transform the text
	 * @param expandToFullLines Whether to expand selections to full lines
	 * @param options Optional parameters to pass to the transform function
	 */
	const processTextInEditor = async (
		transformFn: (text: string, options?: any) => string,
		expandToFullLines: boolean = false,
		options?: any
	) => {
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

	type IRange = [number, number];

	// Command handler for removing empty lines in the editor
	const removeEmptyLinesCommand = async (inSelection: boolean) => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		// Get configuration from settings
		const config = vscode.workspace.getConfiguration("ps-dev-toolbox.removeEmptyLines");
		const considerWhitespaceEmpty = config.get<boolean>("considerWhitespaceEmpty", true);

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

				removeEmptyLines(editor, document, [[cursorFirstNonEmptyLine, cursorLastNonEmptyLine]], considerWhitespaceEmpty);
			} else { // Multi-cursor selections
				const rangesToProcess: IRange[] = [];

				for (const selection of selections) {
					if (!selection.isEmpty) {
						rangesToProcess.push([selection.start.line, selection.end.line]);
					}
				}

				removeEmptyLines(editor, document, rangesToProcess, considerWhitespaceEmpty);
			}
		} else { // Process entire document
			removeEmptyLines(editor, document, [[0, document.lineCount - 1]], considerWhitespaceEmpty);
		}
	};

	const removeEmptyLines = async (
		editor: vscode.TextEditor,
		document: vscode.TextDocument,
		ranges: IRange[],
		considerWhitespaceEmpty: boolean
	) => {
		if (ranges.length === 0) {
			return;
		}

		const rangesToDelete: vscode.Range[] = [];

		for (const range of ranges) {
			for (let idx = range[0]; idx <= range[1]; idx++) {
				const line = document.lineAt(idx);

				const isEmpty = considerWhitespaceEmpty
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

	// Search backward from cursor position to find first non-empty line
	const getCursorFirstNoneEmptyLine = (line: number, document: vscode.TextDocument) => {
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

	// Search forward from cursor position to find first non-empty line
	const getCursorLastNoneEmptyLine = (line: number, document: vscode.TextDocument) => {
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

	const removeLeadingTrailingWhitespaceCommand = async () => {
		await processTextInEditor(
			utils.removeLeadingTrailingWhitespace,
			true // Expand to full lines
		);
	};

	const removeNonPrintableCharactersCommand = async () => {
		await processTextInEditor(
			utils.removeNonPrintableCharacters,
			false // Don't expand to full lines (process exact selection)
		);
	};

	const localesPrompt = async () => {
		const defaultLocale = vscode.env.language || "en";

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

	const renameToSlug = async (uri: vscode.Uri, separator: string) => {
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

		// Check existence using VS Code API (avoids race condition)
		try {
			await vscode.workspace.fs.stat(newUri);

			// File exists - prompt user
			const overwritePrompt = await vscode.window.showWarningMessage(
				vscode.l10n.t("'{0}' already exists. Do you want to overwrite it?", slugifiedName),
				{ modal: true },
				vscode.l10n.t("Yes"),
				vscode.l10n.t("No")
			);

			if (overwritePrompt === vscode.l10n.t("Yes")) {
				shouldOverwrite = true;
			} else if (overwritePrompt === vscode.l10n.t("No")) {
				return; // User chose not to overwrite
			}
		} catch (_) {
			// File doesn't exist - this is fine, continue
		}

		try {
			await vscode.workspace.fs.rename(uri, vscode.Uri.file(newPath), { overwrite: shouldOverwrite });

			vscode.window.showInformationMessage(
				vscode.l10n.t("Renamed: {0} to {1}", itemName, slugifiedName)
			);
		} catch (error) {
			vscode.window.showErrorMessage(
				vscode.l10n.t("Failed to rename '{0}': {1}", itemName, (error as Error).message)
			);
		}
	};

	const commandHandlers = {
		[CommandId.ReportIssue]: () => vscode.env.openExternal(vscode.Uri.parse("https://github.com/playfulsparkle/vscode_ps_dev_toolbox/issues")),
		[CommandId.ToCamelCase]: createTextTransformCommand(utils.toCamelCase),
		[CommandId.ToPascalCase]: createTextTransformCommand(utils.toPascalCase),
		[CommandId.ToSnakeCase]: createTextTransformCommand(utils.toSnakeCase),
		[CommandId.ToScreamingSnakeCase]: createTextTransformCommand(utils.toScreamingSnakeCase),
		[CommandId.ToKebabCase]: createTextTransformCommand(utils.toKebabCase),
		[CommandId.ToTrainCase]: createTextTransformCommand(utils.toTrainCase),
		[CommandId.ToFlatCase]: createTextTransformCommand(utils.toFlatCase),
		[CommandId.ToUpperCase]: createTextTransformCommand(utils.toUpperCase),
		[CommandId.Slugify]: async () => {
			const config = vscode.workspace.getConfiguration("ps-dev-toolbox");
			const separator = config.get<string>("slugifySeparator", "-");

			return processTextInEditor(text => utils.slugify(text, separator));
		},
		[CommandId.SlugifyFilename]: async (uri: vscode.Uri, selectedUris?: vscode.Uri[]) => {
			if (!uri) {
				return;
			}

			const config = vscode.workspace.getConfiguration("ps-dev-toolbox");
			const separator = config.get<string>("slugifySeparator", "-");

			// Handle multiple selection
			const urisToRename = selectedUris && selectedUris.length > 0 ? selectedUris : [uri];

			for (const currentUri of urisToRename) {
				await renameToSlug(currentUri, separator);
			}

			if (urisToRename.length > 1) {
				vscode.window.showInformationMessage(
					vscode.l10n.t("{0} items slugified successfully.", urisToRename.length)
				);
			}
		},
		[CommandId.MakeLowercase]: async () => {
			const localesInput = await localesPrompt();

			return processTextInEditor(text => utils.safeToLowerCase(text, localesInput));
		},
		[CommandId.MakeUppercase]: async () => {
			const localesInput = await localesPrompt();

			return processTextInEditor(text => utils.safeToUppercase(text, localesInput));
		},
		[CommandId.Base64Encode]: createTextTransformCommand(utils.base64Encode),
		[CommandId.Base64Decode]: createTextTransformCommand(text => {
			if (!utils.isValidBase64(text)) {
				vscode.window.showErrorMessage(vscode.l10n.t("Invalid Base64 encoded string."));

				return text;
			}

			return utils.base64Decode(text);
		}),
		[CommandId.UrlEncode]: createTextTransformCommand(utils.urlEncode),
		[CommandId.UrlDecode]: createTextTransformCommand(utils.urlDecode),
		[CommandId.GenerateGuid]: createInsertAtCursorCommand(() => {
			const config = vscode.workspace.getConfiguration("ps-dev-toolbox");
			const uuidFormat = config.get<string>("uuidFormat", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
			const generatedUuid = utils.generateGuid();

			switch (uuidFormat) {
				default:
					return `${generatedUuid}`;
				case "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}":
					return `{${generatedUuid}}`;
				case "[Guid(\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\")]":
					return `[Guid("${generatedUuid}")]`;
				case "<Guid(\"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\")>":
					return `<Guid("${generatedUuid}")>`;
			}
		}),
		[CommandId.RemoveEmptyLinesDocument]: async () => removeEmptyLinesCommand(false),
		[CommandId.RemoveEmptyLinesSelection]: async () => removeEmptyLinesCommand(true),
		[CommandId.RemoveNonPrintableChars]: removeNonPrintableCharactersCommand,
		[CommandId.RemoveLeadingTrailingWhitespace]: removeLeadingTrailingWhitespaceCommand,
		[CommandId.EncodeNamedHtmlEntities]: async () => processTextInEditor(utils.encodeNamedHtmlEntities),
		[CommandId.DecodeNamedHtmlEntities]: async () => processTextInEditor(utils.decodeNamedHtmlEntities),
		[CommandId.EncodeHtmlHexEntities]: async () => processTextInEditor(utils.encodeHtmlHexEntities),
		[CommandId.DecodeHtmlHexEntities]: async () => processTextInEditor(utils.decodeHtmlHexEntities),
		[CommandId.EncodeHtmlDecimalEntities]: async () => processTextInEditor(utils.encodeHtmlDecimalEntities),
		[CommandId.DecodeHtmlDecimalEntities]: async () => processTextInEditor(utils.decodeHtmlDecimalEntities),
		[CommandId.encodeJavaScriptUnicodeEscapes]: async () => processTextInEditor(utils.encodeJavaScriptUnicodeEscapes),
		[CommandId.decodeJavaScriptUnicodeEscapes]: async () => processTextInEditor(utils.decodeJavaScriptUnicodeEscapes),
		[CommandId.EncodeCssUnicodeEscape]: async () => processTextInEditor(utils.encodeCssUnicodeEscape),
		[CommandId.DecodeCssUnicodeEscape]: async () => processTextInEditor(utils.decodeCssUnicodeEscape),
		[CommandId.EncodeUnicodeCodePoints]: async () => processTextInEditor(utils.encodeUnicodeCodePoints),
		[CommandId.DecodeUnicodeCodePoints]: async () => processTextInEditor(utils.decodeUnicodeCodePoints),
		[CommandId.EncodeES6UnicodeCodePointEscape]: async () => processTextInEditor(utils.encodeES6UnicodeCodePointEscape),
		[CommandId.DecodeES6UnicodeCodePointEscape]: async () => processTextInEditor(utils.decodeES6UnicodeCodePointEscape),
		[CommandId.EncodeExtendedHexEscape]: async () => processTextInEditor(utils.encodeHexEntities),
		[CommandId.DecodeExtendedHexEscape]: async () => processTextInEditor(utils.decodeHexEntities),
		[CommandId.EncodeHexCodePoints]: async () => processTextInEditor(utils.encodeHexCodePoints),
		[CommandId.DecodeHexCodePoints]: async () => processTextInEditor(utils.decodeHexCodePoints)
	};

	// Register all commands
	for (const [commandId, handler] of Object.entries(commandHandlers)) {
		const disposable = vscode.commands.registerCommand(commandId, handler);

		context.subscriptions.push(disposable);
	}
}

/** Deactivates the extension */
export function deactivate() { }