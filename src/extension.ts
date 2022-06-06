'use strict';

import { ExtensionContext, commands } from 'vscode';
import LiveReload from './LiveReload';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	const livereload = new LiveReload();

	context.subscriptions.push(commands.registerCommand('extension.live-reload', () => {
		livereload.createServer();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
