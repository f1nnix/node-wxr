M = require "./mediator"

normalizeDate = (dateString)->
  date = new Date()
  date = new Date(Date.parse(dateString)) if dateString

  "#{date.getFullYear()}-#{if date.getMonth()<9 then '0' + String(date.getMonth()+1) else date.getMonth()+1}-#{date.getDate()} #{date.getHours()}:#{date.getMinutes()}:#{date.getSeconds()}"

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

    # force add only required nodes
    # opional are missed if not specified
    # id          = item.ele "wp:post_id", {}, if post.id then post.id else Math.floor Math.random() * 100000
    title       = item.ele "title", {}, if post.title then post.title else ""
    name        = item.ele "wp:post_name", {}, if post.name then post.name else ""
    description = item.ele "description", if post.description then post.description else ""
    date        = item.ele "wp:post_date", {}, normalizeDate(post.date)
    status      = item.ele "wp:status", {}, if post.status then post.status else "publish"
    parent      = item.ele "wp:post_parent", {}, 0
    type        = item.ele "wp:post_type", {}, "post"

    # author login, string
    creator      = item.ele "dc:creator", {}, if post.author then post.author else "admin"

    # content, HTML
    contentEncoded      = item.ele "content:encoded" #, {}, if post.contentEncoded then post.contentEncoded else ""
    contentEncodedCDATA = contentEncoded.dat if post.contentEncoded then post.contentEncoded else ""

    # excerpt, HTML
    excerptEncoded      = item.ele "excerpt:encoded" #, {}, if post.contentEncoded then post.contentEncoded else ""
    excerptEncodedCDATA = excerptEncoded.dat if post.excerptEncoded then post.excerptEncoded else ""

    # add categories to post
    if post.categories?.length > 0
      for category in post.categories
        if category.slug and category.title
          cat = item.ele "category",
            domain  : "category"
            nicename: category.slug

          catCDATA = cat.dat category.title


  addAttachment: (options)=>
    # without attachmentURL it has no sense
    if options.attachmentURL
      item = @channel.ele "item"

      # <wp:post_id>301</wp:post_id>
      # id = item.ele "wp:post_id", {}, if options.id then options.id else Math.floor Math.random() * 100000

      # <wp:post_date>2015-03-05 16:21:00</wp:post_date>
      date = item.ele "wp:post_date", {}, normalizeDate(options.date)

      # <title>Picture of a cat</title>
      title = item.ele "title", {}, if options.title then options.title else "Default title for attachment"

      # <dc:creator><![CDATA[admin]]></dc:creator>
      creator      = item.ele "dc:creator", {}, if options.author then options.author else "admin"

      # <description></description>
      description = item.ele "description", if options.description then options.description else ""

      # <excerpt:encoded><![CDATA[This is a picture of a cat I found]]></excerpt:encoded>
      excerptEncoded      = item.ele "excerpt:encoded"
      excerptEncodedCDATA = excerptEncoded.dat if options.excerptEncoded then options.excerptEncoded else ""

      # <wp:status>inherit</wp:status>
      status = item.ele "wp:status", {}, if options.status then options.status else "inherit"

      # <wp:post_parent>300</wp:post_parent>
      parent = item.ele "wp:post_parent", {}, if options.parent then options.parent else 0

      # <wp:post_type>attachment</wp:post_type>
      type = item.ele "wp:post_type", {}, "attachment"

      # <wp:attachment_url>https://upload.wikimedia.org/wikipedia/commons/f/fc/Minka.jpg</wp:attachment_url>
      type = item.ele "wp:attachment_url", {}, if options.attachmentURL then options.attachmentURL else ""


  stringify: =>
    @xml.end
      pretty : true
      indent : "    "
      newline: "\n"
