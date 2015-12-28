# node-wxr

![Docman GitHub issues](https://img.shields.io/github/issues/f1nnix/node-wxr.svg)
![Docman GitHub forks](https://img.shields.io/github/forks/f1nnix/node-wxr.svg)
![Docman GitHub stars](https://img.shields.io/github/stars/f1nnix/node-wxr.svg)
![Docman GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

XML (WXR) file generator for official [Wordpress Import Plugin](https://wordpress.org/plugins/wordpress-importer/). Add categories and posts in clean readable way, and then serialize it into Wordpress Import XML file.

## Install

    npm install wxr

## Usage

```js
var Importer = require('wxr')
var importer = new Importer()

importer.addCategory({
  slug : "perfect-category",
  title: "Perfect Category"
})

importer.addPost({
  title         : "Hello, world!",
  contentEncoded: "<p>Hey, this is my post</p><p>BTW, cats are awesome!</p>",
  excerptEncoded: "Cool preview for my post. Check it out!",
  categories    : [
    {
      slug : "perfect-category",
      title: "Perfect Category"
    }
  ]
})

importer.addAttachment({
  id            : 15,
  date          : "2015-10-05 00:27:25",
  title         : "Fig. 1. Cats and puppies",
  author        : "admin",
  description   : "Fig. 1. Cats and puppies",
  excerptEncoded: "Fig. 1. Cats and puppies",
  status        : "inherit",
  parent        : 0,
  attachmentURL : "https://upload.wikimedia.org/wikipedia/commons/f/fc/Minka.jpg"
})

console.log(importer.stringify());
```

Outputs:

```xml
<?xml version="1.0"?>
<rss xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:wfw="http://wellformedweb.org/CommentAPI/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:wp="http://wordpress.org/export/1.2/" version="2.0">
    <channel>
        <wp:wxr_version>1.2</wp:wxr_version>
        <wp:category>
            <wp:term_id>72583</wp:term_id>
            <wp:category_nicename>perfect-category</wp:category_nicename>
            <wp:cat_name>
                <![CDATA[Perfect Category]]>
            </wp:cat_name>
        </wp:category>
        <item>
            <wp:post_id>14455</wp:post_id>
            <title>Hello, world!</title>
            <wp:post_name/>
            <description>Default description for post</description>
            <wp:post_date>Thu Jul 23 2015 13:57:10 GMT+0000 (UTC)</wp:post_date>
            <wp:status>publish</wp:status>
            <wp:post_parent>0</wp:post_parent>
            <wp:post_type>post</wp:post_type>
            <dc:creator>
                <![CDATA[admin]]>
            </dc:creator>
            <content:encoded>
                <![CDATA[<p>Hey, this is my post</p><p>BTW, cats are awesome!</p>]]>
            </content:encoded>
            <excerpt:encoded>
                <![CDATA[Cool preview for my post. Check it out!]]>
            </excerpt:encoded>
            <category domain="category" nicename="perfect-category">
                <![CDATA[Perfect Category]]>
            </category>
            <category domain="category" nicename="bad-category">
                <![CDATA[Bad Category]]>
            </category>
        </item>
        <item>
            <wp:post_id>15</wp:post_id>
            <wp:post_date>Thu Jul 23 2015 13:57:10 GMT+0000 (UTC)</wp:post_date>
            <title>Fig. 1. Cats and puppies</title>
            <dc:creator>
                <![CDATA[admin]]>
            </dc:creator>
            <description>Fig. 1. Cats and puppies</description>
            <excerpt:encoded>
                <![CDATA[Fig. 1. Cats and puppies]]>
            </excerpt:encoded>
            <wp:status>inherit</wp:status>
            <wp:post_parent>0</wp:post_parent>
            <wp:post_type>attachment</wp:post_type>
            <wp:attachment_url>https://upload.wikimedia.org/wikipedia/commons/f/fc/Minka.jpg</wp:attachment_url>
        </item>
    </channel>
</rss>
```

## API

### new Importer()

Returns a new instance of Importer.

#### Example

```js
var Importer = require('wxr');
var importer = new Importer();

// importer.addPost(...)
```

### addCategory(options)

Adds new category for Importer object.

* **options** *json*:
    * **id** *integer*: category ID. If not provided, random ID will be generated. E.g. 5
    * **slug** *string*: category slug. Used in URLS, e. g. "js-rocks"
    * **title** *string*: category title, ex. "Everything about JS"

#### Example

```js
importer.addCategory({
  id: 5,
  title: "Everything about JS",
  slug: "js-rocks"
})
```

### addPost(options)

Adds new post for Importer object.

* **options** *json*:
    * **id** *integer*: post ID. If not provided, random ID will be generated. E.g. 10
    * **title** *string*: post title, ex. "Why JS is so awesome"
    * **name** *string*: post name (slug). Used in URLS, e. g. "why-js-is-so-awesome"
    * **description** *string*: post description, e.g. "Quick tips about JS"
    * **date** *date string*: post date, e.g. "2015-10-05 00:27:25"
    * **status** *string*: post status, e.g. "publish"
    * **author** *string*: post aurhor, username. Will be created during import or assigned to existing user. E.g. "admin"
    * **contentEncoded** *string*: post content HTML, e.g. `<p>Hey, this is my post\</p><p>BTW, cats are awesome!</p>`
    * **excerptEncoded** *string*: post excerpt, e.g. "Cool preview for my post. Check it out!"
    * **categories** *array*: post catgories array, where each object is JSON object with:
        * **slug** *string*: category slug. Used in URLS, e. g. "js-rocks"
        * **title** *string*: category title, ex. "Everything about JS"

#### Example

```js
importer.addPost({
  id            : 10,
  title         : "Why JS is so awesome",
  name          : "why-js-is-so-awesome",
  description   : "Quick tips about JS",
  date          : "2015-10-05 00:27:25",
  status        : "publish",
  author        : "admin",
  contentEncoded: "<p>Hey, this is my post</p><p>BTW, cats are awesome!</p>",
  excerptEncoded: "Cool preview for my post. Check it out!",
  categories    : [
    {
      title: "Everything about JS",
      slug: "js-rocks"
    }
  ]
})
```

### addAttachment(options)

Adds new attachment (image) for Importer instance.

* **options** *json*:
    * **id** *integer*: attachment ID. If not provided, random ID will be generated. E.g. 15
    * **date** *date string*: attachment date, e.g. "2015-10-05 00:27:25"
    * **title** *string*: attachment caption, ex. "Fig. 1. Cats and puppies"
    * **author** *string*: attachment author (username). Will be created during import or assigned to existing user. E.g. "admin"
    * **description** *string*: attachment description, e.g. "Fig. 1. Cats and puppies"
    * **excerptEncoded** *string*: attachment excerpt, e.g. "Fig. 1. Cats and puppies"
    * **status** *string*: attachment status, e.g. "inherit"
    * **parent** *integer*: parent post ID. If not provided, will be 0
    * **attachmentURL** *string*: attachment URL, e.g. `https://upload.wikimedia.org/wikipedia/commons/f/fc/Minka.jpg`

#### Example

```js
importer.addAttachment({
  id            : 5,
  dat           : "2015-10-05 00:27:25",
  title         : "Fig. 1. Cats and puppies",
  author        : "admin",
  description   : "Fig. 1. Cats and puppies",
  excerptEncoded: "Fig. 1. Cats and puppies",
  status        : "inherit",
  parent        : 0,
  attachmentURL : "https://upload.wikimedia.org/wikipedia/commons/f/fc/Minka.jpg"
})
```

### stringify()

Generates result XML (WXR) string for importing to Wordpress.

#### Example

```js
var importer = new Importer();

// importer.addPost(...)

var xmlString = importer.stringify();
require("fs").writeFile("export.xml", xmlString, function(err) {
  if (err) {
    console.log(err);
  }

  console.log("File was saved! Now it's time to import.")
});
```

## License

Copyright (c) 2015, Ilya Rusanen. (MIT License)

See LICENSE for more info.
