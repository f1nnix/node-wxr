###global module:false###

module.exports = (grunt) ->
  grunt.initConfig

    clean:
      options:
        force: true
      build: ["lib/", "index.js"]

    coffee:
      main:
        expand: true,
        flatten: false,
        cwd: 'src',
        src: ['*.coffee'],
        dest: '.',
        ext: '.js'

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-copy"

  grunt.registerTask "default", ["build"]
  grunt.registerTask "build", [
    "clean"
    # "coffee:main"
  ]
