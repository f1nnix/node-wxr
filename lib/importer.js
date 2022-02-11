var Importer, M, normalizeDate,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

M = require("./mediator");

normalizeDate = function(dateString) {
  var date;
  date = new Date();
  if (dateString) {
    date = new Date(Date.parse(dateString));
  }
  return (date.getFullYear()) + "-" + (date.getMonth() < 9 ? '0' + String(date.getMonth() + 1) : date.getMonth() + 1) + "-" + (date.getDate()) + " " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds());
};

module.exports = Importer = (function() {
  Importer.prototype.xml = null;

  Importer.prototype.channel = null;

  function Importer() {
    this.stringify = bind(this.stringify, this);
    this.addAuthor = bind(this.addAuthor, this);
    this.addAttachment = bind(this.addAttachment, this);
    this.addPost = bind(this.addPost, this);
    this.addCategory = bind(this.addCategory, this);
    this.addTag = bind(this.addTag, this);
    this.xml = M.builder.create("rss").att("xmlns:excerpt", "http://wordpress.org/export/1.2/excerpt/").att("xmlns:content", "http://purl.org/rss/1.0/modules/content/").att("xmlns:wfw", "http://wellformedweb.org/CommentAPI/").att("xmlns:dc", "http://purl.org/dc/elements/1.1/").att("xmlns:wp", "http://wordpress.org/export/1.2/").att("version", "2.0");
    this.channel = this.xml.ele("channel");
    this.channel.ele("wp:wxr_version", {}, 1.2);
  }

  Importer.prototype.addAuthor = function(author) {
    var auth;
    auth = this.channel.ele("wp:author");
    auth.ele("wp:author_login", {}, author.login);
    auth.ele("wp:author_email", {}, author.email);
    auth.ele("wp:author_display_name", {}, author.display_name);
    auth.ele("wp:author_first_name", {}, author.first_name);
    auth.ele("wp:author_last_name", {}, author.last_name);
    return auth;
};

  Importer.prototype.addCategory = function(category) {
    var cat, catName, catNameCDATA, catNiceName, termId;
    cat = this.channel.ele("wp:category");
    termId = cat.ele("wp:term_idname", {}, category.id ? category.id : Math.floor(Math.random() * 100000));
    catNiceName = cat.ele("wp:category_nicename", {}, category.slug);
    catName = cat.ele("wp:cat_name");
    return catNameCDATA = catName.dat(category.title);
  };

  Importer.prototype.addTag = function(tag) {
    var tg;
    tg = this.channel.ele("wp:tag");
    tg.ele("wp:term_idname", {}, tag.id ? tag.id : Math.floor(Math.random() * 100000));
    tg.ele("wp:tag_slug", {}, tag.slug);
    tg.ele("wp:tag_name", {}, tag.title);
    return tg;
  };

  Importer.prototype.addPost = function(post) {
    var cat, catCDATA, category, contentEncoded, contentEncodedCDATA, creator, date, id, description, excerptEncoded, excerptEncodedCDATA, i, item, len, name, parent, ref, ref1, results, status, title, type, postmeta;
    item = this.channel.ele("item");
    title = item.ele("title", {}, post.title ? post.title : "");
    name = item.ele("wp:post_name", {}, post.name ? post.name : "");
    description = item.ele("description", post.description ? post.description : "");
    date = item.ele("wp:post_date", {}, normalizeDate(post.date));
    id = item.ele("wp:post_id", {}, post.id);
    status = item.ele("wp:status", {}, post.status ? post.status : "publish");
    parent = item.ele("wp:post_parent", {}, 0);
    type = item.ele("wp:post_type", {}, "post");
    creator = item.ele("dc:creator", {}, post.author ? post.author : "admin");
    contentEncoded = item.ele("content:encoded");
    contentEncodedCDATA = contentEncoded.dat(post.contentEncoded ? post.contentEncoded : "");
    excerptEncoded = item.ele("excerpt:encoded");
    excerptEncodedCDATA = excerptEncoded.dat(post.excerptEncoded ? post.excerptEncoded : "");

    if (Array.isArray(post.meta)) {
      post.meta.forEach(function (meta) {
        if (meta.length === 2) {
          postmeta = item.ele('wp:postmeta')
          postmeta.ele('wp:meta_key').dat(meta[0]);
          postmeta.ele('wp:meta_value').dat(meta[1]);
        }
      });
    }

    if (((ref = post.categories) != null ? ref.length : void 0) > 0) {
      ref1 = post.categories;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        category = ref1[i];
        if (category.slug && category.title) {
          cat = item.ele("category", {
            domain: "category",
            nicename: category.slug
          });
          results.push(catCDATA = cat.dat(category.title));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Importer.prototype.addAttachment = function(options) {
    var creator, date, description, excerptEncoded, excerptEncodedCDATA, item, parent, status, title, type;
    if (options.attachmentURL) {
      item = this.channel.ele("item");
      date = item.ele("wp:post_date", {}, normalizeDate(options.date));
      title = item.ele("title", {}, options.title ? options.title : "Default title for attachment");
      creator = item.ele("dc:creator", {}, options.author ? options.author : "admin");
      description = item.ele("description", options.description ? options.description : "");
      excerptEncoded = item.ele("excerpt:encoded");
      excerptEncodedCDATA = excerptEncoded.dat(options.excerptEncoded ? options.excerptEncoded : "");
      status = item.ele("wp:status", {}, options.status ? options.status : "inherit");
      parent = item.ele("wp:post_parent", {}, options.parent ? options.parent : 0);
      type = item.ele("wp:post_type", {}, "attachment");
      return type = item.ele("wp:attachment_url", {}, options.attachmentURL ? options.attachmentURL : "");
    }
  };

  Importer.prototype.stringify = function(options) {
    return this.xml.end(Object.assign({
      pretty: true,
      indent: "    ",
      newline: "\n"
    }, options || {}));
  };

  return Importer;

})();
