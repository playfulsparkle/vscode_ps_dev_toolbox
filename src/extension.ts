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
		RemoveEmptyLines = "ps-dev-toolbox.removeEmptyLines",
		RemoveNonPrintableChars = "ps-dev-toolbox.removeNonPrintableChars",
		RemoveLeadingTrailingWhitespace = "ps-dev-toolbox.removeLeadingTrailingWhitespace",
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

	// Create a factory function for text transformation commands
	const createTextTransformCommandPrompt = (transformFn: (text: string, localesInput: string[]) => string) => {
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

			const localesPrompt = await vscode.window.showInputBox({
				prompt: vscode.l10n.t("Enter the locales to use for the transformation (comma-separated)"),
				placeHolder: vscode.l10n.t("e.g. hu, sk, en-US"),
				value: vscode.env.language,
			});

			const localesInput = localesPrompt ? localesPrompt.split(",").map(locale => locale.trim()) : [];

			await editor.edit(editBuilder => editBuilder.replace(selection, transformFn(text, localesInput)));
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

	// Command handler for removing empty lines in the editor
	const removeEmptyLinesCommand = async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		// Get configuration from settings
		const config = vscode.workspace.getConfiguration("ps-dev-toolbox.removeEmptyLines");
		const removeConsecutive = config.get<boolean>("removeConsecutive", true);
		const considerWhitespaceEmpty = config.get<boolean>("considerWhitespaceEmpty", true);

		const options = { removeConsecutive, considerWhitespaceEmpty };

		const document = editor.document;
		const selections = editor.selections;

		// If there are no manual selections or only empty selections, process the entire document
		if (selections.length === 1 && selections[0].isEmpty) {
			const entireDocumentRange = new vscode.Range(
				0, 0,
				document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length
			);
			const text = document.getText(entireDocumentRange);

			const processedText = utils.removeEmptyLines(text, options);

			await editor.edit(editBuilder => editBuilder.replace(entireDocumentRange, processedText));

			return;
		}

		// Process each selection
		await editor.edit(editBuilder => {
			for (const selection of selections) {
				if (selection.isEmpty) {
					continue;
				}

				// Expand selection to full lines
				const startLine = document.lineAt(selection.start.line);
				const endLine = document.lineAt(selection.end.line);

				const expandedRange = new vscode.Range(startLine.range.start, endLine.range.end);

				const selectedText = document.getText(expandedRange);

				const processedText = utils.removeEmptyLines(selectedText, options);

				editBuilder.replace(expandedRange, processedText);
			}
		});
	};

	const removeLeadingTrailingWhitespaceCommand = async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		const selections = editor.selections;

		// If there are no manual selections or only empty selections, process the entire document
		if (selections.length === 1 && selections[0].isEmpty) {
			const entireDocumentRange = new vscode.Range(
				0, 0,
				document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length
			);
			const text = document.getText(entireDocumentRange);
			const processedText = utils.removeLeadingTrailingWhitespace(text);

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

				// Expand selection to full lines
				const startLine = document.lineAt(selection.start.line);
				const endLine = document.lineAt(selection.end.line);
				const expandedRange = new vscode.Range(
					startLine.range.start,
					endLine.range.end
				);

				const selectedText = document.getText(expandedRange);
				const processedText = utils.removeLeadingTrailingWhitespace(selectedText);

				editBuilder.replace(expandedRange, processedText);
			}
		});
	};

	const removeNonPrintableCharactersCommand = async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}

		const document = editor.document;
		const selections = editor.selections;

		// If there are no manual selections or only empty selections, process the entire document
		if (selections.length === 1 && selections[0].isEmpty) {
			const entireDocumentRange = new vscode.Range(
				0, 0,
				document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length
			);
			const text = document.getText(entireDocumentRange);
			const processedText = utils.removeNonPrintableCharacters(text);

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

				const selectedText = document.getText(selection);
				const processedText = utils.removeNonPrintableCharacters(selectedText);

				editBuilder.replace(selection, processedText);
			}
		});
	};

	const commandHandlers = {
		[CommandId.Slugify]: createTextTransformCommand(text => {
			const config = vscode.workspace.getConfiguration("ps-dev-toolbox");
			const separator = config.get<string>("slugifySeparator", "-");

			return utils.slugify(text, separator);
		}),
		[CommandId.MakeLowercase]: createTextTransformCommandPrompt(utils.safeToLowerCase),
		[CommandId.MakeUppercase]: createTextTransformCommandPrompt(utils.safeToUppercase),
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
		[CommandId.GenerateGuid]: createInsertAtCursorCommand(utils.generateGuid),
		[CommandId.RemoveEmptyLines]: removeEmptyLinesCommand,
		[CommandId.RemoveNonPrintableChars]: removeNonPrintableCharactersCommand,
		[CommandId.RemoveLeadingTrailingWhitespace]: removeLeadingTrailingWhitespaceCommand
	};

	// Register all commands
	for (const [commandId, handler] of Object.entries(commandHandlers)) {
		const disposable = vscode.commands.registerCommand(commandId, handler);

		context.subscriptions.push(disposable);
	}
}

/** Deactivates the extension */
export function deactivate() { }