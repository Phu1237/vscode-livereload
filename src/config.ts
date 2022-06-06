import * as _ from 'lodash';
import { workspace } from 'vscode';

const DEFAULT_EXTS: string[] = 'html htm css js png gif jpg php php5 py rb erb coffee twig'.split(' ');
const DEFAULT_EXCLUDES: string[] = '.DS_Store .gitignore .git .svn .hg'.split(' ');
const DEFAULT_INCLUDES: string[] = ['**/*'];

export default function () {
	let config = {
		debug: workspace.getConfiguration().get('livereload.debug') || false,

		port: workspace.getConfiguration().get('livereload.port') || 35729,

		https: workspace.getConfiguration().get('livereload.useHTTPS') ? {} : null,

		applyCSSLive: workspace.getConfiguration().get('livereload.applyCSSLive') || true,

		applyImageLive: workspace.getConfiguration().get('livereload.applyImageLive') || true,

		delayForUpdate: workspace.getConfiguration().get('livereload.delayForUpdate') || 0,

		exts: workspace.getConfiguration().get('livereloadt.exts') ? _.split(workspace.getConfiguration().get('livereloadt.exts'), ',') : '',

		excludes: workspace.getConfiguration().get('livereload.excludes') ? _.split(workspace.getConfiguration().get('livereload.excludes'), ',') : '',

		includes: workspace.getConfiguration().get('livereload.includes') ? workspace.getConfiguration().get('livereload.includes', DEFAULT_INCLUDES) : DEFAULT_INCLUDES,
	};

	config.exts = _.chain(config.exts).map(ext => ext.trim()).concat(DEFAULT_EXTS).uniq().value();

	config.excludes = _.chain(config.excludes).map(ex => ex.trim()).concat(DEFAULT_EXCLUDES).uniq().value();
	config.includes = _.indexOf(config.includes, '**/*') ? DEFAULT_INCLUDES : _.uniq(config.includes);

	return config;
}