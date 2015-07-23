(function() {
  var Importer, M,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  M = require("./mediator");

  module.exports = Importer = (function() {
    Importer.prototype.xml = null;

    Importer.prototype.channel = null;

    function Importer() {
      this.stringify = bind(this.stringify, this);
      this.addPost = bind(this.addPost, this);
      this.addCategory = bind(this.addCategory, this);
      this.xml = M.builder.create("rss").att("xmlns:excerpt", "http://wordpress.org/export/1.2/excerpt/").att("xmlns:content", "http://purl.org/rss/1.0/modules/content/").att("xmlns:wfw", "http://wellformedweb.org/CommentAPI/").att("xmlns:dc", "http://purl.org/dc/elements/1.1/").att("xmlns:wp", "http://wordpress.org/export/1.2/").att("version", "2.0");
      this.channel = this.xml.ele("channel");
      this.channel.ele("wp:wxr_version", {}, 1.2);
    }

    Importer.prototype.addCategory = function(category) {
      var cat, catName, catNameCDATA, catNiceName, termId;
      cat = this.channel.ele("wp:category");
      termId = cat.ele("wp:term_id", {}, category.id ? category.id : Math.floor(Math.random() * 100000));
      catNiceName = cat.ele("wp:category_nicename", {}, category.slug);
      catName = cat.ele("wp:cat_name");
      return catNameCDATA = catName.dat(category.title);
    };

    Importer.prototype.addPost = function(post) {
      var contentEncoded, contentEncodedCDATA, creator, creatorCDATA, date, description, excerptEncoded, excerptEncodedCDATA, id, item, name, parent, status, title, type;
      item = this.channel.ele("item");
      id = item.ele("wp:post_id", {}, post.id ? post.id : Math.floor(Math.random() * 100000));
      title = item.ele("title", {}, post.title ? post.title : "Default title for post");
      name = item.ele("wp:post_name", {}, post.name ? post.name : "");
      description = item.ele("description", post.description ? post.description : "Default description for post");
      date = item.ele("wp:post_date", {}, post.date ? new Date(post.date) : new Date());
      status = item.ele("wp:status", {}, post.status ? post.status : "publish");
      parent = item.ele("wp:post_parent", {}, 0);
      type = item.ele("wp:post_type", {}, "post");
      creator = item.ele("dc:creator");
      creatorCDATA = creator.dat(post.author ? post.author : "admin");
      contentEncoded = item.ele("content:encoded");
      contentEncodedCDATA = contentEncoded.dat(post.contentEncoded ? post.contentEncoded : "<h1>Hello, world!<h1><p>This is the default content for post. Please, provide your own.</p>");
      excerptEncoded = item.ele("excerpt:encoded");
      return excerptEncodedCDATA = excerptEncoded.dat(post.excerptEncoded ? post.excerptEncoded : "This is the default excerpt for post. Please, provide your own.");
    };

    Importer.prototype.stringify = function() {
      return this.xml.end({
        pretty: true,
        indent: "    ",
        newline: "\n"
      });
    };

    return Importer;

  })();

}).call(this);
