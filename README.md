# Generate docsets compatible with the dash / velocity / zeal apps from your JSDoc comments

> A JSDoc template to generate a dash-compatible docSet

The docSet can be used with [Dash](http://kapeli.com/dash). It should also work with [Velocity](https://velocity.silverlakesoftware.com/) and [Zeal](https://zealdocs.org/) applications.

It is based on JSDoc default template.

## Usage


1) Install jsdoc (version 3.4.0 or higher). Here's how to install it globally: `npm install jsdoc -g`

2) Install jsdoc-dash-template

```
npm install jsdoc-dash-template --save-dev
```

3) Run jsdoc from the command line

```
jsdoc -d path/to/output/folder -p -t node_modules/jsdoc-dash-template -r path/to/src/folder
```

If you want even more control over the final result, you can use a jsdoc configuration file to set the following options:

* the name of the docset (by default, it will be the basename of the destination folder)
* a path to custom icon (.png file, 32x32)
* enable JavaScript (used for example to prettify the source files)


```
{
  "docset" : {
    "name": "MyLibraryDocSet",
    "icon": "path/to/my/custom/icon.png",
    "enableJavascript": true
  }
}
```

You will need to point at this configuration file when running the command

```
jsdoc -c jsdoc.conf.json -d path/to/output/folder -p -t node_modules/jsdoc-dash-template -r path/to/src/folder
```

As a reminder, this configuration file can take many other options. For further information, refer to the [jsdoc website](http://usejsdoc.org/about-configuring-jsdoc.html).
