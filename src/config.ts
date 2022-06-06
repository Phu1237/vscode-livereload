import * as _ from 'lodash';
import { workspace } from 'vscode';

const DEFAULT_EXTS: string[] = 'html htm css js png gif jpg php php5 py rb erb coffee twig'.split(' ');
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

		exts: workspace.getConfiguration().get('live-reloadt.exts') ? _.split(workspace.getConfiguration().get('live-reloadt.exts'), ',') : '',

		excludes: workspace.getConfiguration().get('live-reload.excludes') ? _.split(workspace.getConfiguration().get('live-reload.excludes'), ',') : '',

		includes: workspace.getConfiguration().get('live-reload.includes') ? workspace.getConfiguration().get('live-reload.includes', DEFAULT_INCLUDES) : DEFAULT_INCLUDES,
	};

	config.exts = _.chain(config.exts).map(ext => ext.trim()).concat(DEFAULT_EXTS).uniq().value();

	config.excludes = _.chain(config.excludes).map(ex => ex.trim()).concat(DEFAULT_EXCLUDES).uniq().value();
	config.includes = _.indexOf(config.includes, '**/*') ? DEFAULT_INCLUDES : _.uniq(config.includes);

	return config;
}