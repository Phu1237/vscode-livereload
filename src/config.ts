import * as _ from 'lodash';
import { workspace } from 'vscode';

const DEFAULT_EXCLUDES: string[] = '.DS_Store .gitignore .git .svn .hg'.split(' ');
const DEFAULT_INCLUDES: string[] = ['**/*'];

export default function () {
	let config = {
		debug: workspace.getConfiguration().get('live-reload.debug') || false,

		port: workspace.getConfiguration().get('live-reload.port') || 35729,

		https: workspace.getConfiguration().get('live-reload.useHTTPS') ? {} : null,

		applyCSSLive: workspace.getConfiguration().get('live-reload.applyCSSLive') || true,

		applyImageLive: workspace.getConfiguration().get('live-reload.applyImageLive') || true,

		delayForUpdate: workspace.getConfiguration().get('live-reload.delayForUpdate') || 0,

		excludes: workspace.getConfiguration().get('live-reload.excludes') ? _.split(workspace.getConfiguration().get('live-reload.excludes'), ',') : '',

		includes: workspace.getConfiguration().get('live-reload.includes') ? workspace.getConfiguration().get('live-reload.includes', DEFAULT_INCLUDES) : DEFAULT_INCLUDES,
	};

	config.excludes = _.chain(config.excludes).map(ex => ex.trim()).concat(DEFAULT_EXCLUDES).uniq().value();
	config.includes = _.indexOf(config.includes, '**/*') !== -1 ? DEFAULT_INCLUDES : _.uniq(config.includes);

	return config;
}