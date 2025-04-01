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

	// Map of commands to handlers using the factory function for text transforms
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
	};

	// Register all commands
	for (const [commandId, handler] of Object.entries(commandHandlers)) {
		const disposable = vscode.commands.registerCommand(commandId, handler);

		context.subscriptions.push(disposable);
	}
}

/** Deactivates the extension */
export function deactivate() { }