import { StatusBarItem, window, StatusBarAlignment } from 'vscode';

export class StatusBarUi {
	private static _statusBarItem: StatusBarItem;
	private static isRefreshing: boolean;

	private static get statusbar() {
		if (!StatusBarUi._statusBarItem) {
			StatusBarUi._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
			StatusBarUi._statusBarItem.command = 'extension.live-reload';
			this.isRefreshing = false;
			this.statusbar.show();
		}

		return StatusBarUi._statusBarItem;
	}

	public static listening() {
		StatusBarUi.statusbar.text = 'The Live Reload plugin has been enabled.';
		StatusBarUi.clear();
	}

	public static stopListening() {
		StatusBarUi.statusbar.text = 'The Live Reload plugin has been disabled.';
		StatusBarUi.clear();
	}

	public static connected() {
		if (this.isRefreshing) {
			this.isRefreshing = false;
			StatusBarUi.statusbar.text = 'Live Reload: Done.';
			StatusBarUi.clear(4000);
			return;
		}
		StatusBarUi.statusbar.text = 'Live Reload: Client connected.';
		StatusBarUi.clear();
	}

	public static disconnected() {
		if (!this.isRefreshing) {
			StatusBarUi.statusbar.text = 'Live Reload: Client disconnected.';
			StatusBarUi.clear();
		}
	}

	public static refresh() {
		StatusBarUi.statusbar.text = 'Live Reload: Refreshing...';
		this.isRefreshing = true;
	}

	private static clear(time = 1800, callback = () => { }) {
		setTimeout(() => {
			StatusBarUi.statusbar.text = '';
		}, time);
		callback();
	}

	dispose() {
		StatusBarUi.statusbar.dispose();
	}
}