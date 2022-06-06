import config from './config';
import Server from './Server';
import { StatusBarUi } from './StatusBarUi';
import { workspace } from 'vscode';
import path = require('path');

export default class LiveReload {
	private server: any;
	private config;
	private isServerRunning: boolean;

	constructor() {
		this.config = config();
		this.isServerRunning = false;

		this.createServer = this.createServer.bind(this);
	}

	public createServer() {
		if (this.isServerRunning) {
			this.server.stop();
			this.isServerRunning = false;
			return;
		} else {
			this.server = new Server(this.config);
			let paths = this.getCurrentWorkSpaces();
			this.server.watch(paths);
			this.isServerRunning = true;
		}

		this.server.on('start', () => {
			StatusBarUi.listening();
		});

		this.server.on('stop', () => {
			StatusBarUi.stopListening();
		});

		this.server.on('refresh', () => {
			StatusBarUi.refresh();
		});

		this.server.on('connected', () => {
			StatusBarUi.connected();
		});

		this.server.on('disconnected', () => {
			StatusBarUi.disconnected();
		});

		this.server.start();
	}

	getCurrentWorkSpaces() {
		let workspaces = workspace.workspaceFolders;
		let paths: string[] = [];
		workspaces?.forEach((workspace, index) => {
			this.config.includes.forEach((include) => {
				paths.push(path.resolve(path.join(workspace.uri.fsPath, include)));
			});
		});


		return paths;
	}

	public dispose() {

	}
}