import { StatusBarItem, window, StatusBarAlignment } from 'vscode';

export class StatusBarUi {
	private static _statusBarItem: StatusBarItem;

	private static get statusbar() {
		if (!StatusBarUi._statusBarItem) {
			StatusBarUi._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
			StatusBarUi._statusBarItem.command = 'extension.live-reload';
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
		StatusBarUi.statusbar.text = 'Live Reload client connected.';
		StatusBarUi.clear();
	}

	public static disconnected() {
		StatusBarUi.statusbar.text = 'Live Reload client disconnected.';
		StatusBarUi.clear();
	}

	public static refresh() {
		StatusBarUi.statusbar.text = 'Live Reload refresh from VS Code Live Reload.';
		StatusBarUi.clear();
	}

	private static clear() {
		setTimeout(() => {
			StatusBarUi.statusbar.text = '';
		}, 1800);
	}

	dispose() {
		StatusBarUi.statusbar.dispose();
	}
}