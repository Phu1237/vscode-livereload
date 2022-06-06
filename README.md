<h1 align="center">
    <img src="https://i.imgur.com/Po1oqJ4.png" alt="A web browser page reloading plugin for the VS Code editor" />
    <br/> Live Reload for VS Code
</h1>

<p align="center">
    A web browser page reloading plugin for the VS Code editor.<br/>
	Based on <a href="https://marketplace.visualstudio.com/items?itemName=ziishaned.livereload">LiveReload for VS Code</a>
</p>

## Features

- Reloads web pages when any file is created, removed or modified.
- Applies changes without reloading when any CSS or image changed.
- Works with LiveReload extension.

## Installing

You can install the latest version of the extension via the Visual Studio Marketplace [here](https://marketplace.visualstudio.com/items?itemName=phu1237.livereload).

> Restart VS Code _(if required)_

## Usage

You can use this by either adding a snippet of code to the bottom of your HTML pages or installing the Browser Extensions.

### Browser extension

Install the LiveReload browser plugins by visiting [LiveReload Extensions](http://livereload.com/extensions/).

### Add code to the page

You can use VS Code to insert the script tag via `Ctrl+Shift+P` add type `livereload.js` and the script tag is added to your HTML document.

Or manually add the following script to your HTML document.

```html
<script>document.write('<script src="http://'
    + (location.host || 'localhost').split(':')[0]
    + ':35729/livereload.js?snipver=1"></'
    + 'script>')</script>
```

> Note: If you are using a different port other than 35729 you will need to change the above script.

## Settings

Open VS Code user setting by pressing `CTRL+,` and set the following as you need:

|Name|Type|Details|
|-|-|-|
|`debug`|`boolean`|To show debug messages in console.|
|`port`|`integer`|To specify the listening port.|
|`useHTTPS`|`object`|An optional object of options to be passed to `https.createServer` (if not provided, `http.createServer` is used instead)|
|`applyCSSLive`|`boolean`|Tells LiveReload to reload CSS files in the background instead of refreshing the page. The default for this is true.|
|`applyImageLive`|`boolean`|Tells LiveReload to reload image files in the background instead of refreshing the page. The default for this is true.|
|`delayForUpdate`|`integer`|To add a delay (in miliseconds) between when livereload detects a change to the filesystem and when it notifies the browser.|
|`exts`|`string`|To include additional extentions that you want to observe e.g. `jade,scss`.|
|`excludes`|`string`|To specify additional exclude patterns e.g. `html, images`.|
|`includes`|`array`|To specify additional include patterns e.g. `['**/*']`.|

### Example

```json
{
    "livereload.debug": false,
    "livereload.port": 35729,
    "livereload.useHTTPS": {},
    "livereload.applyCSSLive": true,
    "livereload.applyImageLive": true,
    "livereload.delayForUpdate": 0,
    "livereload.exts": "html,htm,css,js,png,gif,jpg,php,php5,py,rb,erb,coffee",
    "livereload.exclusions": ".DS_Store,.gitignore,.git,.svn,.hg",
	"livereload.includes": [
		"**/*"
	]
}
```

## Note

- The LiveReload extension only works with default port `35729`.

## License

MIT © [Phu1237](https://twitter.com/Phu1237)
MIT © [Zeeshan Ahmad](https://twitter.com/ziishaned)
