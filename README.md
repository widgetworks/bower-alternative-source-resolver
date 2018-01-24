# bower-alternative-source-resolver

An extension to bower allowing alternative component repositories. This component solves issues with the `shorthand_resolver` in bower, because you can only target one resolver. This allows you to target different _owners_ and re-write the URL to avoid using the `shorthand_resolver`.

## Preparation

This repository augments [bower](https://www.npmjs.com/package/bower).

`npm install -g bower`

## Installation

In your project, install [bower-alternative-source-resolver](https://www.npmjs.com/package/bower-alternative-source-resolver) locally. It can be installed globally too.

`npm install --save-dev bower-alternative-source-resolver`

Edit a .bowerrc (which can be hosted at `/`, `~`, or in any parent directory for your project) and add the resolver.

```json
{
	"resolvers": [
	  "bower-alternative-source-resolver"
	]
}
```

## Configuration

Add alternative sources to load from by adding an `alternativeSources` key to either your .bowerrc or bower.json object. The .bowerrc takes precendence, the arrays are not merged.

```json
{
  "alternateSources": [
    {
      "owner": "my_components",
      "url": "https://internal.bitbucket.com/${owner}/${package}.git${version}"
    }
  ]
}
```

To re-write URI's you can use `rewriteSources`. There are three parts:

1. `match` to find a URI to re-write (uses `indexOf`)
2. `parse` to find parts in the URI to pull out for _re-framing_ (uses `new RegExp`)
3. `rewrite` to write the new form of the URI (uses `_.template` at v4.x.x)

> The parts you match with the RegExp map to variables `_#` in the template for `rewrite`

```json
{
  "rewriteSources": [
    {
      "match": "ssh",
      "parse": "group\\/(.*?)\\.",
      "rewrite": "group/${ _1 }"
    }
  ]
}
```

## Usage

In your bower file or when using `bower install` the `owner` keys will match the _owner_ portion of any shorthand bower URL's and re-write with the template provided in the associated `url` attribute.

```json
{
  "dependencies": {
    "button": "my_components/button#1.2.3"
  }
}
```

If you type `bower install` for your project with this configuration the request to `"my_components/button#1.2.3"` will be re-written to `"https://internal.bitbucket.com/my_components/button.git1.2.3"` because the `owner` matched.


