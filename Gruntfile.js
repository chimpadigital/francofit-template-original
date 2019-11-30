'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
			theme_slugname: 'revolution',
      // let us know if our JS is sound
      jshint: {
	      options: {
          "bitwise": true,
          "browser": true,
          "curly": true,
          "eqeqeq": true,
          "eqnull": true,
          "es5": true,
          "esnext": true,
          "immed": true,
          "jquery": true,
          "latedef": true,
          "newcap": true,
          "noarg": true,
          "node": true,
          "strict": false,
          "undef": true,
          "globals": {
						"jQuery": true,
						"alert": true,
						"google": true,
						"InfoBox": true,
						"themeajax": true,
						"ajaxurl": true,
						"IScroll": true,
						"smoothScroll": true,
						"TimelineLite": true,
						"TimelineMax": true,
						"TweenLite": true,
						"TweenMax": true,
						"Quart": true,
						"Back": true,
						"_": true,
						"skrollr": true,
						"Favico": true,
						"onePageScroll": true,
						"OT_UI": true,
						"option_tree": true,
						"reinvigorate": true,
						"LazyLoad": true,
						"_gaq": true,
						"ga": true,
						"ocdi": true,
						"MobileDetect": true,
						"addthis": true,
						"adsbygoogle": true,
						"FB": true,
						"BezierEasing": true,
						"buzz": true,
						"Swiper": true,
						"SplitText": true,
						"retinajs": true,
						"inView": true,
						"StickyState": true,
						"PhotoSwipe": true,
						"PhotoSwipeUI_Default": true,
						"Segmenter": true,
						"Outlayer": true,
						"Odometer": true,
						"glitch": true,
						"html2canvas": true,
						"Hammer": true,
						"vcParallaxSkroll": true,
						"portfolioajax": true,
						"Linear": true,
						"CSSRulePlugin": true,
						"vc": true,
						"ClipboardJS": true,
						"CustomMarker": true,
						"Howl": true,
						"wc_single_product_params": true,
						"Cookies": true,
            "Expo": true,
            "lazySizes": true,
            "wc_cart_fragments_params": true
          }
	      },
	      all: [
	        'Gruntfile.js',
	        'assets/js/plugins/app.js',
	        'assets/js/plugins/admin-meta.js',
	        'assets/js/plugins/admin-vc.js'
	      ]
      },

      // concatenation and minification all in one
      uglify: {
	      dist: {
	        files: {
	        	'assets/js/admin-vc.min.js': [
	        		'assets/js/plugins/admin-vc.js'
	        	],
						'assets/js/admin-meta.min.js': [
							'assets/js/plugins/admin-meta.js'
						],
						'assets/js/vendor.min.js': [
							'assets/js/vendor/*.js'
						],
						'assets/js/app.min.js': [
							'assets/js/plugins/app.js'
						]
	        }
	      }
      },

			concat: {
				options: {
					stripBanners: true
				},
				dist: {
					src: 'assets/js/vendor/*.js',
					dest: 'assets/js/vendor.min.js',
				},
			},

      // style (Sass) compilation via Compass
      compass: {
        dist: {
          options: {
            sassDir: 'assets/sass',
            cssDir: 'assets/css',
						noLineComments: true,
						outputStyle: 'compressed'
          }
        },
				dev: {
					options: {
						sassDir: 'assets/sass',
						cssDir: 'assets/css',
						noLineComments: true
					}
				}
      },

      // watch our project for changes
      watch: {
	      compass: {
          files: [
            'assets/sass/*',
            'assets/sass/*/*'
          ],
          tasks: ['compass']
	      },
	      js: {
          files: [
              '<%= jshint.all %>'
          ],
          tasks: ['uglify']
	      }
      },

      // copy folder
      copy: {
        main: {
          expand: true,
          src: '**',
          dest: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>',
        },
      },

      // clean folder
      clean: {
      	options: {
    	    'force': true
    	  },
        build: [
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/**/.git',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/**/.gitignore',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/**/.sass-cache',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/<%= theme_slugname %>-wp.esproj',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/**/.DS_Store',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/node_modules',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/assets/demo',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/admin/assets/theme-mode',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/inc/plugins/<%= theme_slugname %>-plugin',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/inc/admin/imports/one-click-demo-import/docs',
        	'/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/inc/admin/imports/one-click-demo-import/tests'
        ],
      },

      // Strip Code
      strip_code: {
	      strip_theme_switcher: {
	        options: {
	          blocks: [{
	            start_block: "<!-- start theme switcher -->",
	            end_block: "<!-- end theme switcher -->"
	          }]
	        },
	        src: ['/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/footer.php', '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/footer.php']
	      }
      },

      // Check textdomain errors.
  		checktextdomain: {
  			options:{
  				text_domain: 'revolution',
  				keywords: [
  					'__:1,2d',
  					'_e:1,2d',
  					'_x:1,2c,3d',
  					'esc_html__:1,2d',
  					'esc_html_e:1,2d',
  					'esc_html_x:1,2c,3d',
  					'esc_attr__:1,2d',
  					'esc_attr_e:1,2d',
  					'esc_attr_x:1,2c,3d',
  					'_ex:1,2c,3d',
  					'_n:1,2,4d',
  					'_nx:1,2,4c,5d',
  					'_n_noop:1,2,3d',
  					'_nx_noop:1,2,3c,4d'
  				]
  			},
  			theme: {
  				src: [
  					'**/*.php',
  					'!node_modules/**',
            '!inc/admin/plugins/class-tgm-plugin-activation.php',
            '!woocommerce/**'
  				],
  				expand: true
  			}
  		},

			// Compress
			compress: {
				plugin: {
				  options: {
				    archive: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/inc/plugins/<%= theme_slugname %>-plugin.zip'
				  },
				  files: [
				    {
				    	expand: true,
				    	cwd: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>/inc/plugins/',
				    	src: ['<%= theme_slugname %>-plugin/**/*']
				    }
				  ]
				},
			  theme: {
			    options: {
			      archive: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>.zip'
			    },
			    files: [
			      {
			      	expand: true,
			      	cwd: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/',
			      	src: ['<%= theme_slugname %>/**/*']
			      }
			    ]
			  },
			  all_files: {
			    options: {
			      archive: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/<%= theme_slugname %>-all.zip'
			    },
			    files: [
			      {
			      	expand: true,
			      	cwd: '/Users/anteksiler/Desktop/themeforest/<%= theme_slugname %>/',
			        src: [
			          '<%= theme_slugname %>.zip',
			          '<%= theme_slugname %>-child.zip',
			          'PSD.zip',
			          'Plugins.zip',
			          'Documentation.zip',
			          'icon-reference.zip'
			        ]
			      },
			    ]
			  }
			},

      // PHP Check
      phpcs: {
        application: {
          src: ['inc/admin/welcome/fuelthemes.php']
        },
        options: {
          bin: '/usr/local/Cellar/php-code-sniffer/3.4.2/bin/',
          standard: 'WordPress',
          encoding: 'utf-8',
				  showSniffCodes: true,
        }
      }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-strip-code');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-checktextdomain');
  //grunt.loadNpmTasks('grunt-phpcs');

  // register task
  grunt.registerTask('default', [
    'jshint',
    'compass:dev',
    'concat',
    'watch'
  ]);

	grunt.registerTask('release', [
    'jshint',
    'compass:dist',
    'uglify',
    'watch'
  ]);

  grunt.registerTask('pack', [
    'checktextdomain:theme',
  	'copy',
  	'strip_code',
  	'compress:plugin',
  	'clean',
  	'compress:theme',
  	'compress:all_files'
  ]);

  grunt.registerTask('phpcs', [
  	'phpcs:application'
  ]);
};