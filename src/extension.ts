'use strict';

import { ExtensionContext, commands, workspace } from 'vscode';
import LiveReload from './LiveReload';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	let livereload = new LiveReload();

	let autoStart = workspace.getConfiguration().get('live-reload.autoStart') || false;
	if (autoStart) {
		livereload.createServer();
	}

	context.subscriptions.push(commands.registerCommand('extension.live-reload', () => {
		livereload.createServer();
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
