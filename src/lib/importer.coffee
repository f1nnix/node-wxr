M = require "./mediator"

module.exports = class Importer
  xml    : null
  channel: null

  constructor: ->
    @xml = M.builder
      .create("rss")
      .att("xmlns:excerpt", "http://wordpress.org/export/1.2/excerpt/")
      .att("xmlns:content", "http://purl.org/rss/1.0/modules/content/")
      .att("xmlns:wfw", "http://wellformedweb.org/CommentAPI/")
      .att("xmlns:dc", "http://purl.org/dc/elements/1.1/")
      .att("xmlns:wp", "http://wordpress.org/export/1.2/")
      .att("version", "2.0")

    # add channel node
    @channel = @xml.ele "channel"

    # some needed WP Importer nodes
    @channel.ele "wp:wxr_version", {}, 1.2

  addCategory: (category)=>
    cat = @channel.ele "wp:category"

    termId       = cat.ele "wp:term_id", {}, if category.id then category.id else Math.floor Math.random() * 100000
    catNiceName  = cat.ele "wp:category_nicename", {}, category.slug

    catName      = cat.ele "wp:cat_name"
    catNameCDATA = catName.dat category.title

  addPost: (post)=>
    item = @channel.ele "item"

    title       = item.ele "title", {}, if post.title then post.title else "Default title for post"
    description = item.ele "description", if post.description then post.description else "Default description for post"
    id          = item.ele "wp:post_id", {}, if post.id then post.id else Math.floor Math.random() * 100000
    date        = item.ele "wp:post_date", {}, if post.date then new Date(post.date) else new Date()
    status      = item.ele "wp:status", {}, if post.status then post.status else "publish"
    parent      = item.ele "wp:post_parent", {}, 0
    type        = item.ele "wp:post_type", {}, "post"

    # author login, string
    creator      = item.ele "dc:creator"
    creatorCDATA = creator.dat if post.author then post.author else "admin"

    # content, HTML
    contentEncoded      = item.ele "content:encoded"
    contentEncodedCDATA = contentEncoded.dat if post.contentEncoded then post.contentEncoded else "<h1>Hello, world!<h1><p>This is the default content for post. Please, provide your own.</p>"

    # excerpt, HTML
    excerptEncoded      = item.ele "excerpt:encoded"
    excerptEncodedCDATA = excerptEncoded.dat if post.excerptEncoded then post.excerptEncoded else "This is the default excerpt for post. Please, provide your own."

  stringify: =>
    @xml.end
      pretty : true
      indent : "    "
      newline: "\n"
