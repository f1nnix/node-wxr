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
Importer = require('wxr')

importer = new Importer()

importer.addCategory({
  id   : 1,
  slug : "perfect-category",
  title: "Perfect Category"
})

importer.addPost({
  title         : "Hello, world!",
  contentEncoded: "<p>Hey, this is my post</p><p>BTW, cats are awesome!</p>",
  excerptEncoded: "Cool preview for my post. Check it out!"
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
            <wp:term_id>1</wp:term_id>
            <wp:category_nicename>perfect-category</wp:category_nicename>
            <wp:cat_name>
                <![CDATA[Perfect Category]]>
            </wp:cat_name>
        </wp:category>
        <item>
            <title>Hello, world!</title>
            <Default description for post/>
            <wp:post_id>18612</wp:post_id>
            <wp:post_date>Wed Jul 22 2015 15:05:08 GMT+0000 (UTC)</wp:post_date>
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
        </item>
    </channel>
</rss>
```

## License

Copyright (c) 2015, Ilya Rusanen. (MIT License)

See LICENSE for more info.
