import * as ws from 'ws';
import * as fs from 'fs';
import * as url from 'url';
import * as http from 'http';
import * as path from 'path';
import * as https from 'https';
import * as chokidar from 'chokidar';
import { EventEmitter } from 'events';

const PROTOCOL_SAVING_1 = 'http://livereload.com/protocols/saving-1';
const PROTOCOL_MONITORING_7 = 'http://livereload.com/protocols/official-7';
const PROTOCOL_CONN_CHECK_1 = 'http://livereload.com/protocols/connection-check-1';

export default class Server extends EventEmitter {
	private path: string[] = [];
	private config;
	private server?;
	private wsServer: any;
	private watcher: any;

	constructor(config: any) {
		super();

		this.config = config;

		this.debug = this.debug.bind(this);
		this.watch = this.watch.bind(this);
		this.onClose = this.onClose.bind(this);
		this.refresh = this.refresh.bind(this);
		this.onConnection = this.onConnection.bind(this);
		this.filterRefresh = this.filterRefresh.bind(this);
		this.sendAllClients = this.sendAllClients.bind(this);

		if (this.config.https === null) {
			this.server = http.createServer(this.requestHandler);
		} else {
			this.server = https.createServer(config.https, this.requestHandler);
		}
	}

	private requestHandler(req: any, res: any) {
		let content;

		switch (url.parse(req.url).pathname) {
			case '/':
				res.writeHead(200, { 'contentType': 'application/json' });
				break;
			case '/livereload.js':
			case '/xlivereload.js':
				res.writeHead(200, { 'contentType': 'text/javascript' });
				content = fs.readFileSync(__dirname + '/../ext/livereload.js');
				break;
			default:
				res.writeHead(300, { 'contentType': 'text/plain' });
				content = 'Not Found';
		}

		res.end(content);
	}

	public start() {
		this.debug('LiveReload is waiting for browser to connect.');

		this.server?.listen(this.config.port);

		this.emit('start');

		this.wsServer = new ws.Server({
			server: this.server
		});

		this.wsServer.on('connection', this.onConnection);
		this.wsServer.on('close', this.onClose);
	}

	public stop() {
		if (this.server) {
			this.server.close();
			this.server = undefined;
		}

		this.unwatch();

		this.emit('stop');
	}

	private onConnection(socket: any) {
		this.debug('Browser connected.');
		this.emit('connected');

		socket.on('message', (message: any) => {
			this.debug(`Message: ${message}`);
			let request = JSON.parse(message);
			if (request.command === 'hello') {
				this.debug("Client requested handshake...");
				let data = JSON.stringify({
					command: 'hello',
					protocols: [PROTOCOL_MONITORING_7],
					serverName: 'vscode-livereload'
				});
				return socket.send(data);
			}
		});

		socket.on('error', (err: any) => {
			return console.error(`Error in client socket: ${err}`);
		});

		socket.on('close', (message: any) => {
			this.emit('disconnected');
			return this.debug('Client closed connection');
		});
	}

	private onClose(socket: any) {
		return this.debug('Socket closed.');
	}

	public watch(path: any) {
		this.debug('Watching ' + String(path) + '...');


		this.path = path;

		this.watcher = chokidar.watch(path, {
			ignoreInitial: true,
			ignored: this.config.excludes
		});

		this.watcher
			.on('add', this.filterRefresh)
			.on('change', this.filterRefresh)
			.on('unlink', this.filterRefresh);
	}

	public unwatch() {
		if (this.watcher) {
			this.watcher.unwatch(this.path);
			this.watcher.close();
		}

		this.watcher = null;
		this.path = [];
	}

	private filterRefresh(filepath: string) {
		if (this.config.delay) {
			setTimeout(() => {
				return this.refresh(filepath);
			}, this.config.delay);
		} else {
			return this.refresh(filepath);
		}
	}

	private refresh(filepath: string) {
		if (this.wsServer.clients.size > 0) {
			this.debug(`Reloading: ${filepath}`);
			let data = JSON.stringify({
				command: 'reload',
				path: filepath,
				liveCSS: this.config.applyCSSLive,
				liveImg: this.config.applyImgLive
			});

			this.emit('refresh');

			setTimeout(() => {
				return this.sendAllClients(data);
			}, this.config.delayForUpdate);
		}
		return [];
	}

	private sendAllClients(data: any) {
		let ref = this.wsServer.clients;
		let results = [];
		this.debug(`Sending to ${ref.size} clients...`);

		for (let socket of ref) {
			results.push(socket.send(data, (() => {
				return (error: any) => {
					if (error) {
						return console.error(error);
					}
				};
			})));
		}
		return results;
	}

	private debug(text: any) {
		if (this.config.debug) {
			console.log(text);
		}
	}
}