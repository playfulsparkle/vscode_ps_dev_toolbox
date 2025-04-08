import * as vscode from "vscode";
import * as utils from "./utils";


/** Activates the extension
 * @param {vscode.ExtensionContext} context - The extension context
 */
export function activate(context: vscode.ExtensionContext) {
	enum CommandId {
		Slugify = "ps-dev-toolbox.slugify",
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
		EncodeExtendedHexEscape = "ps-dev-toolbox.encodeExtendedHexEscape",
		DecodeExtendedHexEscape = "ps-dev-toolbox.decodeExtendedHexEscape",
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
		let startLine = line - 1;

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
		let startLine = line + 1;

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
		const localesPrompt = await vscode.window.showInputBox({
			prompt: vscode.l10n.t("Enter the locales to use for the transformation (comma-separated)"),
			placeHolder: vscode.l10n.t("e.g. hu, sk, en-US"),
			value: vscode.env.language,
		});

		return localesPrompt ? localesPrompt.split(",").map(locale => locale.trim()) : [];
	};

	const commandHandlers = {
		[CommandId.Slugify]: createTextTransformCommand(text => {
			const config = vscode.workspace.getConfiguration("ps-dev-toolbox");
			const separator = config.get<string>("slugifySeparator", "-");

			return utils.slugify(text, separator);
		}),
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
		[CommandId.EncodeNamedHtmlEntities]: createTextTransformCommand(utils.encodeNamedHtmlEntities),
		[CommandId.DecodeNamedHtmlEntities]: createTextTransformCommand(utils.decodeNamedHtmlEntities),
		[CommandId.EncodeHtmlHexEntities]: createTextTransformCommand(utils.encodeHtmlHexEntities),
		[CommandId.DecodeHtmlHexEntities]: createTextTransformCommand(utils.decodeHtmlHexEntities),
		[CommandId.EncodeHtmlDecimalEntities]: createTextTransformCommand(utils.encodeHtmlDecimalEntities),
		[CommandId.DecodeHtmlDecimalEntities]: createTextTransformCommand(utils.decodeHtmlDecimalEntities),
		[CommandId.encodeJavaScriptUnicodeEscapes]: createTextTransformCommand(utils.encodeJavaScriptUnicodeEscapes),
		[CommandId.decodeJavaScriptUnicodeEscapes]: createTextTransformCommand(utils.decodeJavaScriptUnicodeEscapes),
		[CommandId.EncodeCssUnicodeEscape]: createTextTransformCommand(utils.encodeCssUnicodeEscape),
		[CommandId.DecodeCssUnicodeEscape]: createTextTransformCommand(utils.decodeCssUnicodeEscape),
		[CommandId.EncodeUnicodeCodePoints]: createTextTransformCommand(utils.encodeUnicodeCodePoints),
		[CommandId.DecodeUnicodeCodePoints]: createTextTransformCommand(utils.decodeUnicodeCodePoints),
		[CommandId.EncodeES6UnicodeCodePointEscape]: createTextTransformCommand(utils.encodeES6UnicodeCodePointEscape),
		[CommandId.DecodeES6UnicodeCodePointEscape]: createTextTransformCommand(utils.decodeES6UnicodeCodePointEscape),
		[CommandId.EncodeExtendedHexEscape]: createTextTransformCommand(utils.encodeExtendedHexEscape),
		[CommandId.DecodeExtendedHexEscape]: createTextTransformCommand(utils.decodeExtendedHexEscape),
		[CommandId.EncodeHexCodePoints]: createTextTransformCommand(utils.encodeHexCodePoints),
		[CommandId.DecodeHexCodePoints]: createTextTransformCommand(utils.decodeHexCodePoints)
	};

	// Register all commands
	for (const [commandId, handler] of Object.entries(commandHandlers)) {
		const disposable = vscode.commands.registerCommand(commandId, handler);

		context.subscriptions.push(disposable);
	}
}

/** Deactivates the extension */
export function deactivate() { }