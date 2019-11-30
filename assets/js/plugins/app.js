window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

(function ($, window) {
	'use strict';

	var $doc = $(document),
			win = $(window),
			body = $('body'),
			adminbar = $('#wpadminbar'),
			cc = $('.click-capture'),
			header = $('.header'),
			wrapper = $('#wrapper'),
			subheader = $('.subheader'),
      thb_borders = $('.thb-borders'),
			mobile_toggle = $('.mobile-toggle-holder'),
			thb_css_ease = 'cubic-bezier(0.35, 0.3, 0.2, 0.85)',
			thb_ease = new BezierEasing(0.35, 0.3, 0.2, 0.85),
			thb_md = new MobileDetect(window.navigator.userAgent);

	var SITE = SITE || {};

	TweenMax.defaultEase = thb_ease;
	TimelineMax.defaultEase = thb_ease;

	SITE = {
		activeSlider: false,
		menuscroll: $('#menu-scroll'),
		h_offset: 0,
		init: function() {
			var self = this,
					obj;

			win.on('resize.thb-init', function() {
				var to_header = $('body:not(.header-padding-off) .header-spacer-force').length ? $('.header-spacer-force') : $('body:not(.header-padding-off):not(.error404) .header-spacer'),
						to_offset = $('.header:not(.fixed)').outerHeight() + ( ( body.hasClass('page') || ( body.hasClass('single') && body.hasClass('thb-article-style1') ) ) ? 0 : ( win.outerHeight() / 10 ) );

						to_offset = $('.blog-header-style2').length ? 0 : to_offset;

						to_offset = $('.header-spacer-ignore').length ? 0 : to_offset;

				SITE.h_offset = $('.header:not(.fixed)').length ? to_offset : SITE.h_offset;

        if ($('.header:not(.fixed)').length) {
  				SITE.h_offset = ( subheader.length && win.width() > 640 ) ? SITE.h_offset + $('.subheader').outerHeight() : SITE.h_offset;
  				to_header.css({
  					'height': SITE.h_offset
  				});
        }
			}).trigger('resize.thb-init');

			SITE.headroom.light = header.data('header-color') === 'light-header' ? true : false;

			function initFunctions() {
				for (obj in self) {
					if ( self.hasOwnProperty(obj)) {
						var _method =  self[obj];
						if ( _method.selector !== undefined && _method.init !== undefined ) {
							if ( $(_method.selector).length > 0 ) {
								_method.init();
							}
						}
					}
				}
			}
			function thb_immediate() {
				if ($('.thb-page-preloader').length) {
					TweenMax.to($('.thb-page-preloader'), 0.5, { autoAlpha: 0 });
				}
				$('.post-gallery.parallax .parallax_bg').addClass('animate-scale-in');

				if ($('.close-label', header).length && $('.close-label', header).outerWidth() > $('.menu-label', header).outerWidth()) {
					$('.mobile-toggle-holder strong', header).width(function() {
						return $('.close-label', header).outerWidth() + 'px';
					});
				}
        if (thb_borders.length) {
          var borders_to = thb_borders.data('width');
          TweenMax.to(thb_borders, 0.4, { borderWidth: borders_to });
        }
			}

			if (themeajax.settings.page_transition === 'on' && !body.hasClass('compose-mode') && !body.hasClass('elementor-editor-active')) {
				var overlay = $.inArray(themeajax.settings.page_transition_style, ['thb-swipe-left']) > -1 ? true : false;
				$('.thb-page-transition-on')
					.animsition({
						inClass : themeajax.settings.page_transition_style +'-in',
						outClass : themeajax.settings.page_transition_style +'-out',
						inDuration : parseInt(themeajax.settings.page_transition_in_speed,10),
						outDuration : parseInt(themeajax.settings.page_transition_out_speed,10),
						touchSupport: false,
						overlay: overlay,
						overlayClass : 'thb-page-transition-overlay',
						linkElement: '.animsition-link,a[href]:not([target=" _blank"]):not([target="_blank"]):not([href^="'+themeajax.settings.current_url+'#"]):not([href^="#"]):not([href*="javascript"]):not([href*=".rar"]):not([href*=".zip"]):not([href*=".jpg"]):not([href*=".jpeg"]):not([href*=".gif"]):not([href*=".png"]):not([href*=".mov"]):not([href*=".swf"]):not([href*=".mp4"]):not([href*=".flv"]):not([href*=".avi"]):not([href*=".mp3"]):not([href^="tel:"]):not([href^="mailto:"]):not([class="no-animation"]):not(.ajax_add_to_cart):not([class*="ftg-lightbox"]):not(.wpcf7-submit):not(.comment-reply-link):not(.mfp-image):not(.mfp-video):not([id*="cancel-comment-reply-link"]):not(.do-not-animate):not(.mfp-inline):not(.remove):not([href^="'+location.protocol+'//'+location.host+location.pathname+'#"]):not([href="#"])'
					})
					.on('animsition.inStart', function() {
						SITE.header_style10.run();
						_.delay(function() {
							initFunctions();
							thb_immediate();
						}, (parseInt(themeajax.settings.page_transition_in_speed, 10) / 0.8) );

					})
          .on('animsition.outStart', function() {
            if (thb_borders.length) {
              TweenMax.to(thb_borders, 0.4, { borderWidth: 0 });
            }
					});
			} else {
				initFunctions();
				thb_immediate();
				SITE.header_style10.run();
			}

		},
		headroom: {
			selector: '.fixed-header-on .header:not(.style8)',
			light: false,
			init: function() {
				var base = this;

				if (themeajax.settings.fixed_header_scroll === 'on') {
					header.headroom({
						offset: thb_md.mobile() ? 150 : 600
					});
				}
				win.on('scroll.fixed-header', _.debounce(base.scroll, 10) ).trigger('scroll.fixed-header');

			},
			scroll: function() {
				var wOffset = win.scrollTop(),
						fixed_class = header.data('fixed-header-color'),
						stick = 'fixed',
						offset = 10 + ( subheader.length ? subheader.outerHeight() : 0 );

				if ( !( body.hasClass('header-style1-open') || wrapper.hasClass('open-search') ) ) {
					if (wOffset > offset) {
						if (SITE.headroom.light && fixed_class !== 'light-header') {
							header.removeClass('light-header');
							header.addClass('dark-header');
						} else if (fixed_class === 'light-header') {
							header.removeClass('dark-header');
							header.addClass('light-header');
						}
						if (!header.hasClass(stick)) {
							header.addClass(stick);
							header.data('fixed', true);
						}
					} else {
						if (SITE.headroom.light) {
							header.removeClass('dark-header');
							header.addClass('light-header');
						} else {
							header.removeClass('light-header');
							header.addClass('dark-header');
						}

						if (header.hasClass(stick)) {
							header.removeClass(stick);
							header.data('fixed', false);
              _.delay(function() {
                win.trigger('resize.thb-init');
              }, 270);

						}
					}
				}
			}
		},
		subheader: {
  		selector: '.fixed-header-on .subheader',
  		init: function() {
  			var base = this,
  					container = $(base.selector);

  			win.on('scroll.thb-subheader', function() {
  				var negative_offset = win.scrollTop() < container.outerHeight() ? win.scrollTop() : container.outerHeight();
  				TweenMax.set(header, { marginTop: -1 * negative_offset, immediateRender: true });
  			}).trigger('scroll.thb-subheader');
  		}
		},
		search_toggle: {
			selector: '.thb-search-holder',
			searchTl: false,
			init: function() {
				var base = this,
						container = $(base.selector);

        container.each(function() {
          var _this = $(this),
              close = $('span', _this),
              target = $('.thb-search-popup'),
              fieldset = $('fieldset', target),
              bar = $('.searchform-bar', target);

          base.searchTl = new TimelineMax({
  					paused: true,
  					reversed: true,
  					onComplete: function() {
  						setTimeout(function(){ target.find('.s').get(0).focus();}, 0);
  					},
  					onStart: function() {
  						TweenMax.set( header, { className: '-=fixed' });
  					},
  					onReverseComplete: function() {
  						if ( $('.header').data('fixed') ) {
  							TweenMax.set( header, { className: '+=fixed' });
  						} else {
  							TweenMax.set( header, { className: '-=fixed' });
  						}
  					}
  				});

  				base.searchTl
  					.set(wrapper, {className: '+=open-search'})
  					.set($('.search-header-spacer', target), {height: header.height()})
  					.set(header, {className: '+=light-header'})
  					.set(header, {className: '+=hide-header-items'})
  					.to(target, 0.5, { yPercent: '+=100' }, 'start' )
  					.to(close.eq(0), 0.25, { scaleX: 1, rotationZ: '45deg' }, 'start+=0.25')
  					.to(close.eq(1), 0.25, { scaleX: 1, rotationZ: '-45deg' }, 'start+=0.35')
  					.to(fieldset, 0.5, { opacity: 1 }, 'start+=0.25' )
  					.to(bar, 0.5, { scaleX: 1, opacity: '0.2' } );


  				_this.on('click',function() {
  					if ( base.searchTl.reversed() ) { base.searchTl.timeScale(1).play(); } else { base.searchTl.timeScale(1.2).reverse(); }
  					return false;
  				});
  				$doc.keyup(function(e) {
  				  if (e.keyCode === 27) {
  				    if ( base.searchTl.progress() > 0 ) { base.searchTl.reverse(); }
  				  }
  				});
  				cc.on('click', function() {
  					if ( base.searchTl.progress() > 0 ) { base.searchTl.reverse(); }
  					return false;
  				});
        });

			}
		},
		mobile_toggle: {
			selector: '.mobile-toggle-holder',
			target: $('#mobile-menu'),
			mobileTl: new TimelineMax({ paused: true, reversed: true }),
			init: function() {
				var base = this,
						close = $('.thb-mobile-close', base.target),
						mainTl = new TimelineMax({ paused: true, reversed: true }),
						toggleAnimation = base.getMobileToggleAni();

				if ( header.hasClass('style1') || header.hasClass('style3') ) {
					mainTl
						.add(base.getHeaderAni().play(), "main-middle");
				}
				mainTl
					.add(base.getMobileToggleAni().play(), "main-middle");

				base.mobileTl
					.add(base.getMobileToggleAni().play(), "mobile-middle")
					.add(base.getMobileAni().play(), "mobile-middle");

				mobile_toggle.on('click', function() {
					if (thb_md.mobile() || $(window).width() < themeajax.settings.mobile_menu_breakpoint || header.is('.style6, .style7, .style8, .style9') ) {
						if ( mainTl.progress() > 0) { mainTl.timeScale(1.2).reverse(); }
						if ( base.mobileTl.reversed() ) { base.mobileTl.timeScale(1).play(); } else { base.mobileTl.timeScale(1.2).reverse(); }
					} else {
						if ( base.mobileTl.progress() > 0) { base.mobileTl.timeScale(1.2).reverse(); }
						if ( mainTl.reversed() ) { mainTl.timeScale(1).play(); } else { mainTl.timeScale(1.4).reverse(); }
					}
					return false;
				});

				$doc.keyup(function(e) {
				  if (e.keyCode === 27) {
				    if ( base.mobileTl.progress() > 0) { base.mobileTl.reverse(); }
				    if ( mainTl.progress() > 0) { mainTl.timeScale(1.2).reverse(); }
				  }
				});
				cc.add(close).on('click', function() {
					if ( base.mobileTl.progress() > 0) { base.mobileTl.reverse(); }
					return false;
				});
			},
			getHeaderAni: function() {
				if ( header.hasClass('style1') ) {
					return SITE.header_style1.animation();
				} else if ( header.hasClass('style3') ) {
					return SITE.header_style3.animation();
				} else {
					return false;
				}
			},
			getMobileAni: function() {
				var tl = new TimelineMax({ paused:true, onComplete: function() {
							SITE.menuscroll.perfectScrollbar('update');
						}, onReverseComplete: function() {
							wrapper.removeClass('open-menu');
						}}),
						logo = $('.logo-holder', this.target),
						style8content = $('.header-style-8-content .widget', this.target),
						items = $('.thb-mobile-menu>li', this.target),
						bar = $('.thb-secondary-bar', this.target),
						secondary_items = $('.thb-secondary-menu>li', this.target),
						mobile_footer = $('.menu-footer>*', this.target),
						icons = $('.socials>a', this.target),
						close = $('.thb-mobile-close', this.target);

				if (header.hasClass('style8')) {
					tl
						.set(this.target, {
							marginTop: function() {
								if ( $(window).width() < 641 ) {
									return header.outerHeight();
								} else {
									return 0;
								}
							}
						})
						.set(wrapper, {className: '+=open-menu'})
						.to(this.target, 0.7, { scaleY: 1 })
						.from(logo, 0.3, { autoAlpha: 0 }, "start")
						.staggerFrom(style8content, 0.3, { autoAlpha: 0 }, 0.1, "start+=0.2")
						.staggerFrom(mobile_footer.add(icons), 0.3, { autoAlpha: 0 }, 0.1, "start+=0.4");
				} else if (SITE.mobile_toggle.target.hasClass('style1')) {
					tl
						.set(wrapper, {className: '+=open-menu'})
						.to(this.target, 0.3, { x: '0' }, "start")
						.to(close, 0.3, { scale:1 }, "start+=0.2")
						.staggerFrom(items, 0.4, { autoAlpha: 0 }, 0.1, "start+=0.2")
						.to(bar, 0.3, { scaleX: 1, opacity: '0.2' }, "start+=0.2" )
						.staggerFrom(secondary_items.add(mobile_footer).add(icons), 0.3, { autoAlpha: 0 }, 0.1, "start+=0.2");
				}	else if (SITE.mobile_toggle.target.hasClass('style2')) {
					tl
						.set(wrapper, {className: '+=open-menu'})
						.to(this.target, 0.3, { display: 'flex', autoAlpha: 1, scale:1 }, "start")
						.to(close, 0.3, { scale:1 }, "start+=0.2")
						.staggerFrom(items, 0.4, { autoAlpha: 0 }, 0.1, "start+=0.2")
						.staggerFrom(secondary_items.add(mobile_footer).add(icons), 0.3, { autoAlpha: 0 }, 0.1, "start+=0.2");
				} else if (SITE.mobile_toggle.target.hasClass('style3')) {
					tl
						.set(wrapper, {className: '+=open-menu'})
						.to(this.target.find('.menubg-placeholder'), 0.5, { x: '0' }, "start")
						.to(this.target, 0.5, { x: '0' }, "start")
						.to(close, 0.3, { scale:1 }, "start+=0.2")
						.staggerFrom(items, 0.4, { autoAlpha: 0 }, 0.1, "start+=0.2")
						.to(bar, 0.3, { scaleX: 1, opacity: '0.2' }, "start+=0.2" )
						.staggerFrom(secondary_items.add(mobile_footer).add(icons), 0.3, { autoAlpha: 0 }, 0.1, "start+=0.2");
				}
				return tl;
			},
			getMobileToggleAni: function() {
				var span = $('.mobile-toggle>span', mobile_toggle),
						labels = $('strong>span', mobile_toggle),
						tl = new TimelineMax({ paused: true, onReverseComplete: function(){
					  	TweenLite.set(span, { clearProps:'all' } );
					  }});

				tl
					.set(mobile_toggle, { className: '+=active' });

				if (mobile_toggle.hasClass('style1')) {
					tl
						.to(span.eq(1), 0.3, { autoAlpha: 0 }, "mobile-start")
						.to(span.eq(0), 0.3, { rotationZ: 45 }, "mobile-start")
						.to(span.eq(2), 0.3, { rotationZ: -45, y: 1 }, "mobile-start");
				} else if (mobile_toggle.hasClass('style2')) {
					tl
						.to(span.eq(1), 0.1, { autoAlpha: 0 }, "mobile-start")
						.to(span.eq(0), 0.3, { rotationZ: 45, width: '20px' }, "mobile-start")
						.to(span.eq(2), 0.3, { rotationZ: -45, width: '20px', y: 1 }, "mobile-start");
				}

				if (labels.length) {
					tl
						.to(labels, 0.3, { y: '-=100%' }, "mobile-start");
				}
				return tl;
			}
		},
		header_style1: {
			selector: '.header.style1',
			animation: function() {
				var header_overlay_menu = $('.header_overlay_menu', header),
						bar = $('.thb-secondary-line', header_overlay_menu),
						baseTL = new TimelineMax({ paused: true, onStart: function() {
							TweenMax.set( header, { className: '-=fixed' });
						}, onReverseComplete: function() {
							if ( $('.header').data('fixed') ) {
								TweenMax.set( header, { className: '+=fixed' });
							} else {
								TweenMax.set( header, { className: '-=fixed' });
							}
						}});
				baseTL
					.set( body, { className: '+=header-style1-open' })
					.set( $('.header_overlay_padding', header), { marginTop: $('.logolink', header).outerHeight() })
					.set( header, { className: '+=hide-secondary-items'})
					.to( header_overlay_menu, 0.5, { y: 0 }, "header-first")
					.set( header, { className: '+=light-header' }, "header-first")
					.staggerFromTo( $('.thb-header-menu>li>a', header), 0.5, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.1, "header-start")
					.to( bar, 0.5, { scaleX: 1, opacity: '0.2' }, "header-start" )
					.staggerFromTo( $('.thb-secondary-menu-container a', header), 0.5, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.1, "header-start" );

				return baseTL;
			}
		},
		header_style3: {
			selector: '.header.style3',
			animation: function() {
				var hidden_menu_items = $('.thb-full-menu>li', header),
						menuTl = new TimelineMax({ paused: true });

				menuTl
					.set($('#full-menu'), { autoAlpha: 1 })
					.staggerTo(hidden_menu_items.get().reverse(), 0.75, { autoAlpha: 1 }, 0.1);

				return menuTl;
			}
		},
		header_style10: {
			selector: '.header.style10',
			run: function() {
				var base = this,
						container = $(base.selector),
						full_menu = $('.full-menu', container),
						logo = $('.logo-holder', full_menu),
						old_diff;

				var center_full_menu = _.debounce(function() {
					TweenMax.set(full_menu, { x: '0px' });

					var logo_left = logo.offset().left + ( logo.width() / 2),
							diff = (win.width() / 2) - logo_left;


					if ( diff < win.width() / 2 ) {
						TweenMax.set(full_menu, { x: diff + 'px' });
						old_diff = diff;
					}
				},5);
				if (container.length) {
					win.on('resize.center_full_menu', center_full_menu).trigger('resize.center_full_menu');
				}
			}
		},
		mobileMenu: {
			selector: '#mobile-menu',
			init: function() {
				var base = this,
						container = $(base.selector),
						behaviour = container.data('behaviour'),
						arrow = behaviour === 'thb-submenu' ? container.find('.thb-mobile-menu li.menu-item-has-children>a') : container.find('.thb-mobile-menu li.menu-item-has-children>a .thb-arrow');

				arrow.on('click', function(e){
					var that = $(this),
							parent = that.parents('a').length ? that.parents('a') : that,
							menu = parent.next('.sub-menu');

					if (parent.hasClass('active')) {
						parent.removeClass('active');
						menu.slideUp('200');
					} else {
						parent.addClass('active');
						menu.slideDown('200');
					}
					e.stopPropagation();
					e.preventDefault();
				});
			}
		},
		mmBgFill: {
			selector: 'a[data-menubg]',
			init: function() {
				var base = this,
						links = $(base.selector, '#mobile-menu'),
						ph = $('.menubg-placeholder', '#mobile-menu'),
						style3 = $('#mobile-menu').hasClass('style3');

				links.each(function() {
					if ($(this).data('menubg') !=='') {
						var image = new Image();
						image.src = $(this).data('menubg');
					}
				});
				links.hoverIntent(
					function() {
						ph.css({
							'background-image': 'url('+$(this).data('menubg')+')',
							'opacity': style3 ? '1' : '0.2'
						});
					},
					function() {
						if (!style3) {
  						ph.css({
  							'background-image': '',
  							'opacity': '0'
  						});
						}
					}
				);
				if (style3 && links.eq(0).data('menubg') !=='') {
  				ph.css({
  					'background-image': 'url('+links.eq(0).data('menubg')+')',
  					'opacity': style3 ? 1 : 0.2
  				});
				}
			}
		},
		retinaJS: {
			selector: 'img.retina_size:not(.retina_active)',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					$(this).attr('width', function() {
						var w = $(this).attr('width') / 2;
						return w;
					}).addClass('retina_active');
				});
			}
		},
		fullMenu: {
			selector: '.thb-full-menu, .thb-header-menu',
			init: function() {
				var base = this,
					container = $(base.selector),
					li_org = container.find('a'),
          is_style2 = body.hasClass('thb-header-style-style2'),
          is_style3 = body.hasClass('thb-header-style-style3'),
					children = container.find('li.menu-item-has-children:not(.menu-item-mega-parent)'),
					mega_menu = container.find('li.menu-item-has-children.menu-item-mega-parent');

				children.each(function() {
					var _this = $(this),
							menu = _this.find('>.sub-menu'),
							li = menu.find('>li>a'),
							tl = new TimelineMax({paused: true}),
							is_right = false;

					if ( _this.hasClass('thb-full-menu') ) {
  					if ( (menu.offset().left + menu.outerWidth()) > win.outerWidth() ) {
  						menu.addClass('is_right');
  					}
					}
					tl
						.to(menu, 0.5, {autoAlpha: 1 }, "start")
						.staggerTo(li, 0.1, {opacity: 1, y: 0 }, 0.03, "start");

					_this.hoverIntent(
						function() {
							_this.addClass('sfHover');
							tl.timeScale(1).restart();
						},
						function() {
							_this.removeClass('sfHover');
							tl.timeScale(1.5).reverse();
						}
					);
				});
				mega_menu.each(function() {
					var _this = $(this),
							menu = _this.find('>.sub-menu'),
							li = menu.find('>li'),
							tl = new TimelineMax({paused: true});

					tl
						.fromTo(menu, 0.5, {autoAlpha: 0, display: 'none' }, {autoAlpha: 1, display: 'flex' }, "start")
						.staggerTo(li, 0.1, {opacity: 1, x: 0 }, 0.02, "start");

					li.each(function(i) {
						$(this).css( 'zIndex', 50 - i );
					});
					_this.hoverIntent(
						function() {
							_this.addClass('sfHover');
							tl.timeScale(1).restart();
						},
						function() {
							_this.removeClass('sfHover');
							tl.timeScale(1.5).reverse();
						}
					);
				});
        var resizeMegaMenu = _.debounce(function(){
          mega_menu.find('>.sub-menu').each(function() {
            var that = $(this),
                return_val;

            that.css('display', 'flex');
            if ( that.offset().left <= 0 ) {
              return_val = (-1 * that.offset().left) + 30;
            } else if ( (that.offset().left + that.outerWidth()) > $(window).outerWidth() ) {
              return_val =  -1 * Math.round( that.offset().left + that.outerWidth() - $(window).outerWidth() + 30);
            }

            that.hide();
            that.css({
              'marginLeft': return_val + 'px'
            });
          });
        }, 30);
        win.on('resize.resizeMegaMenu', resizeMegaMenu).trigger('resize.resizeMegaMenu');
			}
		},
		hashLinks: {
			selector: 'a[href*=#]',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.on('click', function(e){
					var _this = $(this),
						url = _this.attr('href'),
						hash,
						pos;

					if (url) {
						hash = url.indexOf("#") !== -1 ? url.substring(url.indexOf("#")+1) : '';
						pos = hash && $('#'+hash).length ? $('#'+hash).offset().top - $('#wpadminbar').outerHeight() : 0;
					}
          if ($('.fixed-header-on').length && themeajax.settings.fixed_header_scroll !== 'on') {
            var fixed_height = $('.header>.row').outerHeight() + parseInt(themeajax.settings.fixed_header_padding.top, 10) + parseInt(themeajax.settings.fixed_header_padding.bottom, 10);
            if (fixed_height) {
              pos -= fixed_height;
            }
          }
					if (hash && pos && $('#'+hash).length) {
						pos = (hash === 'footer') ? "max" : pos;

						if (_this.parents('.thb-mobile-menu').length) {
							SITE.mobile_toggle.mobileTl.reverse();
						}
						if ( !$('#'+hash).hasClass('vc_tta-panel') ) {
							TweenMax.to(win, 1, { scrollTo: { y:pos, autoKill:false } });
						}
						e.preventDefault();
					}
				});
			}
		},
		cookieBar: {
			selector: '.thb-cookie-bar',
			init: function() {
				var base = this,
						container = $(base.selector),
						button = $('.button-accept', container);

				if (Cookies.get('thb-revolution-cookiebar') !== 'hide') {
					TweenMax.to(container, 0.5, { opacity: '1', y: '0%' });
				}
				button.on('click', function() {
				  Cookies.set('thb-revolution-cookiebar', 'hide', { expires: 30 });
				  TweenMax.to(container, 0.5, { opacity: '0', y: '100%' });
					return false;
				});
			}
		},
		postNavStyle1: {
			selector: '.thb_post_nav.style1',
			init: function() {
				var base = this,
						container = $(base.selector),
						scroll_top = $('#scroll_to_top');

				win.on('scroll',function() {
					var animationOffset = thb_md.mobile() ? 150 : 600,
							wOffset = win.scrollTop(),
							active = 'active';

					if (wOffset > animationOffset) {
						container.addClass(active);

						if (scroll_top) {
							scroll_top.addClass('nav_active');
						}
					} else {
						container.removeClass(active);

						if (scroll_top) {
							scroll_top.removeClass('nav_active');
						}
					}
				});
			}
		},
		portfolioNavStyle3: {
			selector: '.thb_portfolio_nav.style3',
			init: function() {
				var base = this,
						container = $(base.selector),
						images = $('.inner', container),
						links = $('a', container),
            hide = container.data('hide') === 'on';

				function animateOver(i, el) {
				  var tl = new TimelineMax();
				  if (!images.eq(i).is(':visible')) {
				  	tl
				  		.to(images.filter(':visible'), 0.5, {opacity: 0, scale: 1.05, display: 'none'})
				  		.fromTo(images.eq(i), 0.5, {opacity: 0, scale: 1.05, display: 'none'}, {opacity: 0.8, scale: 1, display: 'block'},"-=0.25");
				  }

				  el.animation = tl;
				  return tl;
				}
				links.hoverIntent(function() {
					var i = $(this).parents('li').index();

					animateOver(i, this);
				}, function() {
          if (hide) {
            TweenMax
              .to(images, 0.5, {opacity: 0, scale: 1, display: 'none'});
          }
        });
			}
		},
		shareArticleDetail: {
			selector: '.share-post-link',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
							target = $('.share_container'),
							cc = target.find('.spacer'),
							el = target.find('h4, .boxed-icon, form'),
							value = target.find('.copy-value'),
							copy = target.find('.btn'),
							org_text = copy.text(),
							clipboard = new ClipboardJS(copy[0], {
							  target: function() {
							  	return value[0];
							  }
							}),
							shareMain = new TimelineLite({ paused: true, onStart: function() { target.css('display', 'flex'); }, onReverseComplete: function() { target.css('display', 'none'); copy.text(org_text); } });
							clipboard.on('success', function(e) {
							  copy.text(themeajax.l10n.copied);
							});


					shareMain
						.add(TweenLite.to(target, 0.5, {autoAlpha:1}))
						.staggerFrom(el, 0.2, { y: "50", opacity:0}, 0.05, "-=0.25");

					_this.on('click',function() {
						shareMain.timeScale(1).restart();
						return false;
					});

					cc.on('click', function() {
						shareMain.timeScale(1.6).reverse();
					});

				});

			}
		},
		social_popup: {
			selector: '.social:not(.menu-social)',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.on('click', function() {
					var left = (screen.width/2)-(640/2),
							top = (screen.height/2)-(440/2)-100;
					window.open($(this).attr('href'), 'mywin', 'left='+left+',top='+top+',width=640,height=440,toolbar=0');
					return false;
				});
			}
		},
		custom_scroll: {
			selector: '.custom_scroll, #side-cart .woocommerce-mini-cart',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this);

					_this.perfectScrollbar({
						suppressScrollX: true
					});
				});

			}
		},
		postShortcodeLoadmore: {
			selector: '.posts-pagination-style2',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
              security = _this.data('security'),
					    load_more = $(_this.data('loadmore')),
					    thb_loading = false,
					    page = 2;

					load_more.on('click', function(){
						var loadmore = $(this),
								id = loadmore.data('posts-id'),
								text = loadmore.text(),
								pajax = ('thb_postsajax_'+ id),
								count = window[pajax].count,
								loop = window[pajax].loop,
								style = window[pajax].style,
								columns = window[pajax].columns,
								thb_i = window[pajax].thb_i,
								thb_date = window[pajax].thb_date,
								thb_cat = window[pajax].thb_cat,
								thb_excerpt = window[pajax].thb_excerpt,
								thb_animation = window[pajax].thb_animation;

						if(thb_loading === false) {
							loadmore.prop('title', themeajax.l10n.loading);
							loadmore.text(themeajax.l10n.loading).addClass('loading');
							thb_loading = true;
							$.ajax( themeajax.url, {
								method : 'POST',
								data : {
									action: 'thb_posts_ajax',
                  security: security,
									page: page++,
									loop: loop,
									columns: columns,
									style: style,

									thb_i: thb_i,
									thb_date: thb_date,
									thb_cat: thb_cat,
									thb_excerpt: thb_excerpt,
									thb_animation: thb_animation
								},
								beforeSend: function() {
									thb_loading = true;
								},
								success : function(data) {
									var d = $.parseHTML($.trim(data)),
											l = d ? d.length : 0;

									if ( data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
										loadmore.html(themeajax.l10n.nomore).removeClass('loading').off('click');
									} else {

										$(d).appendTo(_this).hide().imagesLoaded(function() {
											if (_this.data('isotope')) {
												_this.isotope('appended', $(d));
											}
											$(d).show();
											var animate = $(d).find('.animation').length ? $(d).find('.animation') : $(d);
											TweenMax.staggerTo(animate, 0.5, { autoAlpha: 1, x: 0, y: 0, z:0, rotationZ: '0deg', rotationX: '0deg', rotationY: '0deg', onComplete: function() { thb_loading = false; } }, 0.15);

											SITE.toggleBlog.init($(d));
										});

										if (l < count){
											loadmore.html(themeajax.l10n.nomore).removeClass('loading');
										} else {
											loadmore.html(text).removeClass('loading');
										}
									}
								}
							});
						}
						return false;
					});
				});
			}
		},
		paginationStyle2: {
			selector: '.pagination-style2',
			init: function() {
				var base = this,
						container = $(base.selector),
            security = container.data('security'),
						load_more = $('.thb_load_more'),
						thb_loading = false,
						count = container.data('count'),
						page = 2;

				load_more.on('click', function(){
					var _this = $(this),
							text = _this.text();

					if(thb_loading === false) {
						_this.html(themeajax.l10n.loading).addClass('loading');

						$.ajax( themeajax.url, {
							method : 'POST',
							data : {
								action: 'thb_blog_ajax',
                security: security,
								page: page++
							},
							beforeSend: function() {
								thb_loading = true;
							},
							success : function(data) {
								var d = $.parseHTML($.trim(data)),
										l = d ? d.length : 0;

								if( data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
									_this.html(themeajax.l10n.nomore).removeClass('loading').off('click');
								} else {

									$(d).appendTo(container).hide().imagesLoaded(function() {
										if (container.data('isotope')) {
											container.isotope('appended', $(d));
										}
										$(d).show();
										var animate = $(d).find('.animation').length ? $(d).find('.animation') : $(d);
										TweenMax.staggerTo(animate, 0.5, { autoAlpha: 1, x: 0, y: 0, z:0, rotationZ: '0deg', rotationX: '0deg', rotationY: '0deg', onComplete: function() { thb_loading = false; } }, 0.15);

										SITE.toggleBlog.init($(d));
									});

									if (l < count){
										_this.html(themeajax.l10n.nomore).removeClass('loading');
									} else {
										_this.html(text).removeClass('loading');
									}
								}
							}
						});
					}
					return false;
				});
			}
		},
		paginationStyle3: {
			selector: '.pagination-style3',
			init: function() {
				var base = this,
						container = $(base.selector),
            security = container.data('security'),
						page = 2,
						thb_loading = false,
						count = container.data('count'),
						preloader = container.parents('.blog-container').find('.thb-content-preloader');

				var scrollFunction = _.debounce(function(){
					if ( (thb_loading === false ) && ( (win.scrollTop() + win.height() + 150) >= (container.offset().top + container.outerHeight()) ) ) {
						if (preloader.length) {
							TweenMax.set(preloader, {autoAlpha: 1});
						}
						$.ajax( themeajax.url, {
							method : 'POST',
							data : {
								action: 'thb_blog_ajax',
                security: security,
								page : page++
							},
							beforeSend: function() {
								thb_loading = true;
							},
							success : function(data) {
								var d = $.parseHTML($.trim(data)),
										l = d ? d.length : 0;
								if (preloader.length) {
									TweenMax.to(preloader, 0.25, {autoAlpha: 0});
								}
								if( data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {
									win.off('scroll', scrollFunction);
								} else {
									$(d).appendTo(container).hide().imagesLoaded(function() {
										if (container.data('isotope')) {
											container.isotope('appended', $(d));
										}
										$(d).show();
										var animate = $(d).find('.animation').length ? $(d).find('.animation') : $(d);
										TweenMax.staggerTo(animate, 0.5, { autoAlpha: 1, x: 0, y: 0, z:0, rotationZ: '0deg', rotationX: '0deg', rotationY: '0deg', onComplete: function() { thb_loading = false; } }, 0.15);

										SITE.toggleBlog.init($(d));
									});

									if (l >= count) {
										win.on('scroll', scrollFunction);
									}
								}
							}
						});
					}
				}, 30);

				win.scroll(scrollFunction);
			}
		},
		magnificInline: {
			selector: '.mfp-inline',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.magnificPopup({
          tClose: themeajax.l10n.lightbox_close,
					type:'inline',
					fixedContentPos: themeajax.settings.lightbox_fixedcontent,
          tLoading: themeajax.l10n.lightbox_loading,
					mainClass: 'mfp-zoom-in',
					removalDelay: 400,
					closeBtnInside: false,
					callbacks: {
						imageLoadComplete: function()  {
							var _this = this;
							_.delay( function() { _this.wrap.addClass('mfp-image-loaded'); }, 10);
						},
						beforeOpen: function() {
							this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
					  },
            close: function() {
              if (container.hasClass('newsletter-popup')) {
                Cookies.set('newsletter_popup', '1', { expires: parseInt(themeajax.settings.newsletter_length,10) });
              }
            }
					}
				});
			}
		},
		magnificGallery: {
			selector: '.mfp-gallery, .post-content .gallery',
			init: function(el) {
				var base = this,
						container = el ? el : $(base.selector);

				container.each(function() {
          var _this = $(this),
              delegate = _this.hasClass('thb-portfolio') ? '.thb-portfolio-link.mfp-image, .thb-portfolio-link.mfp-video' : 'a';

          $(this).magnificPopup({
            tClose: themeajax.l10n.lightbox_close,
  					delegate: delegate,
            tLoading: themeajax.l10n.lightbox_loading,
  					mainClass: 'mfp-zoom-in',
  					removalDelay: 400,
  					fixedContentPos: themeajax.settings.lightbox_fixedcontent,
  					gallery: {
  						enabled: true,
  						arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mfp-prevent-close thb-animated-arrow circular">'+ themeajax.svg.prev_arrow +'</button>',
              tPrev: themeajax.l10n.prev_arrow_key,
              tNext: themeajax.l10n.next_arrow_key,
              tCounter: '<span class="mfp-counter">'+ themeajax.l10n.of +'</span>'
  					},
  					image: {
  						verticalFit: true,
  						titleSrc: function(item) {
  							return item.img.attr('alt');
  						}
  					},
  					callbacks: {
              elementParse: function (item) {
      					item.type = item.el.hasClass('mfp-video') ? 'iframe' : 'image';
      				},
  						imageLoadComplete: function()  {
  							var _this = this;
  							_.delay( function() { _this.wrap.addClass('mfp-image-loaded'); }, 10);
  						},
  						beforeOpen: function() {
  					    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
  					  },
  					  open: function() {
  					  	$.magnificPopup.instance.next = function() {
  					  		var _this = this;
  								_this.wrap.removeClass('mfp-image-loaded');

  								setTimeout( function() { $.magnificPopup.proto.next.call(_this); }, 125);
  							};

  							$.magnificPopup.instance.prev = function() {
  								var _this = this;
  								this.wrap.removeClass('mfp-image-loaded');

  								setTimeout( function() { $.magnificPopup.proto.prev.call(_this); }, 125);
  							};
  					  }
  					}
  				});
        });
			}
		},
		magnificImage: {
			selector: '.mfp-image:not(.thb-portfolio-link)',
			init: function() {
				var base = this,
						container = $(base.selector),
            groups = [],
            groupNames = [],
            args = {
              tClose: themeajax.l10n.lightbox_close,
              type: 'image',
    					mainClass: 'mfp-zoom-in',
              tLoading: themeajax.l10n.lightbox_loading,
    					removalDelay: 400,
    					fixedContentPos: themeajax.settings.lightbox_fixedcontent,
    					callbacks: {
    						imageLoadComplete: function()  {
    							var _this = this;
    							_.delay( function() { _this.wrap.addClass('mfp-image-loaded'); }, 10);
    						},
    						beforeOpen: function() {
    							this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
    					  }
    					}
            },
            gallery_args = {
              tClose: themeajax.l10n.lightbox_close,
    					type: 'image',
              tLoading: themeajax.l10n.lightbox_loading,
    					mainClass: 'mfp-zoom-in',
    					removalDelay: 400,
    					fixedContentPos: themeajax.settings.lightbox_fixedcontent,
    					gallery: {
    						enabled: true,
    						arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir% mfp-prevent-close thb-animated-arrow circular">'+ themeajax.svg.prev_arrow +'</button>',
                tPrev: themeajax.l10n.prev_arrow_key,
                tNext: themeajax.l10n.next_arrow_key,
                tCounter: '<span class="mfp-counter">'+ themeajax.l10n.of +'</span>'
    					},
    					image: {
    						verticalFit: true,
    						titleSrc: function(item) {
    							return item.img.attr('alt');
    						}
    					},
    					callbacks: {
    						imageLoadComplete: function()  {
    							var _this = this;
    							_.delay( function() { _this.wrap.addClass('mfp-image-loaded'); }, 10);
    						},
    						beforeOpen: function() {
    					    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
    					  },
    					  open: function() {
    					  	$.magnificPopup.instance.next = function() {
    					  		var _this = this;
    								_this.wrap.removeClass('mfp-image-loaded');

    								setTimeout( function() { $.magnificPopup.proto.next.call(_this); }, 125);
    							};

    							$.magnificPopup.instance.prev = function() {
    								var _this = this;
    								this.wrap.removeClass('mfp-image-loaded');

    								setTimeout( function() { $.magnificPopup.proto.prev.call(_this); }, 125);
    							};
    					  }
    					}
    				};
        container.each(function() {
          var _this = $(this),
              groupID = _this.data('thb-group');

          if (groupID && groupID !== '') {
            groupNames.push(groupID);
          } else {
            container.magnificPopup(args);
          }
        });
        var uniq_groups = _.uniq(groupNames);
        $.each(uniq_groups, function(key, value) {
          groups.push($('.mfp-image[data-thb-group="'+value+'"]'));
        });
        if (uniq_groups.length) {
          $.each(groups,function(key, value) {
            var _gallery = value;
            _gallery.magnificPopup(gallery_args);
          });
        }

			}
		},
		magnificVideo: {
			selector: '.mfp-video:not(.thb-portfolio-link)',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.magnificPopup({
          tClose: themeajax.l10n.lightbox_close,
					type: 'iframe',
          tLoading: themeajax.l10n.lightbox_loading,
					mainClass: 'mfp-zoom-in',
					removalDelay: 400,
					fixedContentPos: themeajax.settings.lightbox_fixedcontent
				});

			}
		},
    newsletterPopup: {
			selector: '.newsletter-popup',
			init: function() {
				var base = this,
						container = $(base.selector);

				if ( Cookies.get('newsletter_popup') !== '1' ) {

          if ( themeajax.settings.newsletter === 'off' ) {
            return;
          }
          _.delay(function() {
            $.magnificPopup.open({
  						type:'inline',
  						items: {
  							src: '#newsletter-popup',
  							type: 'inline'
  						},
              tClose: themeajax.l10n.lightbox_close,
  						mainClass: 'newsletter-popup mfp-zoom-in',
              tLoading: themeajax.l10n.lightbox_loading,
    					removalDelay: 400,
              fixedBgPos: true,
              fixedContentPos: true,
  						callbacks: {
  							close: function() {
  								Cookies.set('newsletter_popup', '1', { expires: parseInt(themeajax.settings.newsletter_length,10) });
  							}
  						}
  					});
          }, ( parseInt(themeajax.settings.newsletter_delay, 10) * 1000 ) );

				}
			}
		},
		accordion: {
			selector: '.thb-accordion',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
							accordion = _this.hasClass('has-accordion'),
							index = 0,
							sections = _this.find('.vc_tta-panel'),
              scrolling = _this.data('scroll'),
							active = sections.eq(index);

					if (accordion) {
						active.addClass('active').find('.vc_tta-panel-body').show();
					}
					_this.on('click', '.vc_tta-panel-heading a', function() {
						var that = $(this),
								parent = that.parents('.vc_tta-panel');

						if (accordion) {
							sections.removeClass('active');
							sections.not(parent).find('.vc_tta-panel-body').slideUp('400');
						}
						$(this).parents('.vc_tta-panel').toggleClass('active');

						parent.find('.vc_tta-panel-body').slideToggle('400', function() {
              var _panel = $(this);
							if (accordion) {
								var offset = that.parents('.vc_tta-panel-heading').offset().top - $('#wpadminbar').outerHeight();

                if (scrolling) {
                  if (themeajax.settings.fixed_header_scroll === 'off') {
                    offset = offset - $('.header').outerHeight();
                  }
  								TweenMax.to(win, 1, { scrollTo: { y: offset, autoKill:false }, onComplete: function(){
                    if (themeajax.settings.fixed_header_scroll === 'on') {
                      header.addClass('headroom--unpinned');
                    }
                  } });
                }
							}
              if (_panel.find('.masonry')) {
                _panel.find('.masonry').isotope('layout');
                win.trigger('resize');
              }
							_.delay(function() {
								win.trigger('scroll.thb-animation');
							}, 400);
						});

						return false;
					});

				});
			}
		},
		tabs: {
			selector: '.thb-tabs',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
							accordion = _this.hasClass('has-accordion'),
              animation = _this.data('animation'),
							active_section = _this.data('active-section') ? _this.data('active-section') : 1,
							index = 0,
							sections = _this.find('.vc_tta-panel'),
							active = sections.eq(index),
							menu = $('<div class="thb-tab-menu" />').prependTo(_this);

					sections.each(function() {
						$(this).find('.vc_tta-panel-heading').appendTo(menu);

					});
					$('.vc_tta-panel-heading', menu).eq(0).find('a').addClass('active');
					sections.eq(0).addClass('visible');


          function resizeTabHeight() {
            var h = sections.filter(':visible').height() + menu.outerHeight(true);

            _this.css('height', h);
          }

          win.on('resize.tabs', resizeTabHeight).trigger('resize.tabs');
					$(this).on('click', '.vc_tta-panel-heading a', function(e) {
						var that = $(this),
						    set_speed = animation ? '300' : 0,
						    speed_delay = parseInt(set_speed) > 0 ? set_speed : '0',
								index = that.parents('.vc_tta-panel-heading').index(),
								this_active = sections.eq(index);

						sections.not(this_active).fadeOut(set_speed, function() {
              var curListHeight = _this.height(),
                  newHeight = this_active.height() + menu.outerHeight(true);

              this_active.fadeIn(set_speed, function() {
                win.trigger('scroll.thb-animation');

                if (this_active.find('.thb-carousel')) {
                   this_active.find('.thb-carousel').slick('setPosition');
                }
                if (this_active.find('.masonry')) {
                  this_active.find('.masonry').isotope('layout');
                  win.trigger('resize');
                }
              });

              _this.css({
                height: newHeight
              });
						});
						_this.find('.vc_tta-panel-heading a').removeClass('active');

						that.addClass('active');

						return false;
					});
					if (active_section > 1 ) {
						_this.find('.vc_tta-panel-heading a').removeClass('active');
						_this.find('.vc_tta-panel-heading').eq(active_section-1).find('a').addClass('active');
						_this.find('.vc_tta-panel').removeClass('visible');
						_this.find('.vc_tta-panel').eq(active_section-1).addClass('visible');
					}
          _this.find('.vc_tta-panel.visible').imagesLoaded(function() {
            win.trigger('resize.tabs');
          });
				});
			}
		},
		freeScroll: {
			selector: '.thb-freescroll',
			init: function() {
				var base = this,
						container = $(base.selector);


				container.each(function() {
					var _this = $(this),
              direction = _this.data('direction'),
              pause_on_hover = _this.data('pause'),
							args = {
								prevNextButtons: false,
								wrapAround: true,
								pageDots: false,
								freeScroll: true,
								adaptiveHeight: true,
								imagesLoaded: true
							};
					_this.flickity(args);

					var flkty = _this.data('flickity');

					flkty.paused = true;

					function loop() {
            if (direction === 'thb-left-to-right') {
              flkty.x++;
            } else {
              flkty.x--;
            }


						flkty.integratePhysics();
						flkty.settle(flkty.x);

						if (!flkty.paused) {
							flkty.raf = window.requestAnimationFrame(loop);
						}
					}
					function pause() {
						if (!thb_md.mobile() && !thb_md.tablet()) {
							flkty.paused = true;
						}
					}
					function play() {
						if (!thb_md.mobile() && !thb_md.tablet()) {
							flkty.paused = false;
							loop();
						}
					}
          if (pause_on_hover) {
  					_this.on('mouseenter', function() {
  						pause();
  					}).on('mouseleave', function() {
  						play();
  					});
          }

					win.on('scroll.flkty', function(e) {
						if (_this.is( ':in-viewport' )) {
							if (flkty.paused) {
								flkty.paused = false;
								loop(flkty);
							}
						} else {
							flkty.paused = true;
						}
					}).trigger('scroll.flkty');
          _this.find('img').on('lazyloaded', function() {
            _this.flickity('resize');
  				});
          body.on('jetpack-lazy-images-load', function() {
            if (_this.find('.jetpack-lazy-image')) {
              _this.flickity('resize');
            }
          });
          _this.find('img').on('imagesLoaded', function() {
            _this.flickity('resize');
  				});
				});

			}
		},
		countdown: {
			selector: '.thb-countdown',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
							date = _this.data('date'),
					    offset = _this.attr('offset');

	        _this.downCount({
	          date: date,
	          offset: offset
	        });

				});
			}
		},
		select2: {
			selector: '.thb-select2',
			init: function() {
				var base = this,
						container = $(base.selector),
						color = container.parents('.thb-portfolio-filter.style2').data('style2-color');

				container.select2({
					minimumResultsForSearch: Infinity,
					dropdownParent: container.parent(),
					templateResult: function(result, container) {
		        // fix Fastclick
		        if (!result.id) {
		          return result.text;
		        }

		        return $('<span>' + result.text + '</span>');
			    }
				}).on('select2:open', function(evt) {

          var dropdown = $('.select2-dropdown');

          dropdown.removeClass('select2-dropdown--above').addClass('select2-dropdown--below');

          var selectDropdown = dropdown.find('.select2-results__options');

          _.defer(function () {
              var tl = new TimelineMax({ paused: true });

              var listItems = selectDropdown.find('.select2-results__option');

              if (color === 'dark' && !header.hasClass('light-header')) {
              	tl.set( header, { className: '+=light-header changed-color-dropdown' });
              }
              tl
              	.staggerTo(listItems, 0.8, {
                  opacity: 1,
                  x: '0'
              }, 0.08);

              tl.restart();
          });
      	}).on('select2:close', function(evt) {
      		if (color === 'dark' && header.hasClass('changed-color-dropdown')) {
      			TweenMax.set( header, { className: '-=light-header changed-color-dropdown' });
      		}
      	});
			}
		},
		isotope: {
			selector: '.masonry',
			init: function() {
				var base = this,
						container = $(base.selector);

				Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
				  if ( measure === undefined ) {
				    return;
				  }
				  var elemSize = this.size;
				  // add padding and border width if border box
				  if ( elemSize.isBorderBox ) {
				    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
				      elemSize.borderLeftWidth + elemSize.borderRightWidth :
				      elemSize.paddingBottom + elemSize.paddingTop +
				      elemSize.borderTopWidth + elemSize.borderBottomWidth;
				  }

				  measure = Math.max( measure, 0 );
				  measure = Math.floor( measure );
				  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
				};

				container.each(function(index) {
					var _this = $(this),
              security = _this.data('security'),
							layoutMode = _this.data('layoutmode') ? _this.data('layoutmode') : 'masonry',
							variable_height = _this.hasClass('variable-height'),
							true_aspect = _this.hasClass('thb-true-aspect-true'),
							el = _this.find('.columns'),
							animation = _this.data('thb-animation'),
							animationspeed = 0.5,
							loadmore = $(_this.data('loadmore')),
							page = 2,
							args = {
								layoutMode: layoutMode,
								percentPosition: true,
								itemSelector: '.columns',
								transitionDuration : 0,
								originLeft: !body.hasClass('rtl'),
								hiddenStyle: { },
							  visibleStyle: { },
							},
							org,
							items,
							filters = $('#'+_this.data('filter')+''),
							args_in,
							args_out,
							in_speed = animationspeed,
							out_speed = in_speed / 2,
							stagger_speed = in_speed / 5,
							grid_type = _this.data('grid_type'),
							large_items = $('.masonry-large', _this),
							tall_items = $('.masonry-tall', _this),
							small_items = $('.masonry-small', _this),
							wide_items = $('.masonry-wide', _this),
							thb_loading = false;

					/* Animation Args */
					if (animation === 'thb-fade') {
						args_in = {
							opacity:1
						};
						args_out = {
							opacity:0
						};
					} else if (animation === 'thb-scale') {
						args_in = {
							opacity:1,
							scale:1
						};
						args_out = {
							opacity:0,
							scale:0
						};
					} else if (animation === 'thb-none') {
						in_speed = out_speed = 0;
						stagger_speed = 0;
						args_in = {
							opacity: 1
						};
						args_out = {
							opacity: 0
						};
					} else if (animation === 'thb-vertical-flip') {
						args_in = {
							opacity: 1,
							y: 0,
							rotationX: '0deg'
						};
						args_out = {
							opacity: 0,
							y: 350,
							rotationX: '25deg'
						};
					} else if (animation === 'thb-reveal-left') {
						in_speed = 1;
						out_speed = 0.5;
						stagger_speed = 0.3;
						args_in = {
							opacity: 1,
							className: '+=reveal-in'
						};
						args_out = {
							opacity: 1,
							className: '-=reveal-in'
						};
					} else {
						args_in = {
							y: 0, opacity: 1
						};
						args_out = {
							y: 30, opacity: 0
						};
					}
					/* Load More */
					loadmore.on('click', function(){
						var portfolio_id = loadmore.data('portfolio-id'),
								text = loadmore.text(),
								pajax = ('thb_portfolioajax_'+ portfolio_id),
								aspect = window[pajax].aspect,
								columns = window[pajax].columns,
								style = window[pajax].style,
								masonry = window[pajax].masonry,
								count = window[pajax].count,
								grid_type = window[pajax].grid_type,
								loop = window[pajax].loop;

						if (thb_loading === false) {
							loadmore.prop('title', themeajax.l10n.loading);
							loadmore.text(themeajax.l10n.loading).addClass('loading');
							thb_loading = true;
							$.post( themeajax.url, {
								action: 'thb_ajax',
                security: security,
								loop: loop,
                aspect: aspect,
								columns: columns,
								masonry: masonry,
								style: style,
								page: page,
								grid_type: grid_type
							}, function(data){
								page++;
								var d = $.parseHTML($.trim(data)),
										l = d ? d.length : 0;

								if( data === '' || data === 'undefined' || data === 'No More Posts' || data === 'No $args array created') {

									loadmore.prop('title',themeajax.l10n.nomore);
									loadmore.text(themeajax.l10n.nomore).removeClass('loading').off('click');
								} else {
									var added = $(d);
									added.imagesLoaded(function() {
										added.appendTo(_this).hide();

										/* Set masonry size cache */
										large_items = $('.masonry-large', _this);
										tall_items = $('.masonry-tall', _this);
										small_items = $('.masonry-small', _this);
										wide_items = $('.masonry-wide', _this);
										win.trigger('resize.variables');


										_this.isotope( 'appended', added );

										added.show();

										SITE.thb_3dImg.init(added);
										SITE.thb_panr.init(added);
                    SITE.portfolio_video.init(added);

										if (l < count){
											loadmore.prop('title', themeajax.l10n.nomore);
											loadmore.text(themeajax.l10n.nomore).removeClass('loading');
										} else {
											loadmore.prop('title', text);
											loadmore.text(text).removeClass('loading');
										}
									});
								}

							});
						}
						return false;
					}); // end Load More

					/* Variable Heights */
					function getGutter() {
						var ml = parseInt(_this.css('marginLeft'), 10);
						return Math.abs(ml);
					}
					function resizeVariables() {
						var gutter = getGutter(),
								imgselector = '.wp-post-image:not(.thb_3dimage)';


						if (large_items.length) {
              large_items.eq(0).imagesLoaded(function() {
                large_items.find( imgselector ).height(function() {
  								var height = parseInt(large_items.eq(0).outerHeight(), 10);
  								return height + 'px';
  							});

  							if (tall_items.length) {
  								tall_items.find( imgselector ).height(function() {
  									var height = large_items.eq(0).outerHeight();
  									return height + 'px';
  								});
  							}
  							if (small_items.length) {
  								small_items.find( imgselector ).height(function() {
  									var height = ( large_items.eq(0).outerHeight() / 2 ) - gutter;
  									return height + 'px';
  								});
  							}
  							if (wide_items.length) {
  								wide_items.find( imgselector ).height(function() {
  									var height = ( large_items.eq(0).outerHeight() / 2 ) - gutter;
  									return height + 'px';
  								});
  							}
              });
						} else if (tall_items.length) {
              tall_items.eq(0).imagesLoaded(function() {
  							tall_items.find( imgselector ).height(function() {
  								var height = parseInt(tall_items.eq(0).outerHeight(), 10);
  								return height + 'px';
  							});
  							if (small_items.length) {
  								small_items.find( imgselector ).height(function() {
  									var height = ( tall_items.eq(0).outerHeight() / 2 ) - gutter;
  									return height + 'px';
  								});
  							}
  							if (wide_items.length) {
  								wide_items.find( imgselector ).height(function() {
  									var height = ( tall_items.eq(0).outerHeight() / 2 ) - gutter;
  									return height + 'px';
  								});
  							}
              });
						} else if (wide_items.length) {
              small_items.eq(0).imagesLoaded(function() {
  							if (wide_items.length) {
  								wide_items.find( imgselector ).height(function() {
  									var height = small_items.eq(0).outerHeight();
  									return height + 'px';
  								});
  							}
              });
						}
					}

					/* True Aspect */
					function resizeTrueAspect() {
						var imgselector = '.wp-post-image:not(.thb_3dimage)',
								images = $(imgselector, _this);

						images.each(function() {
							$(this).height(function() {
								if ($(this).outerHeight() > 0) {
									return Math.round($(this).outerHeight(), 10)+'px';
								}
							});
						});
					}

					/* Images Loaded */
					_this.addClass('thb-loaded');

					if (variable_height) {
						resizeVariables();
						win.on('resize.variables', function(){
							resizeVariables();
						});
						$doc.on('lazyloaded', function(e){
						  win.trigger('resize.variables');
						});
					}
					if (true_aspect) {
						resizeTrueAspect();
						win.on('resize.true-aspect', function(){
							resizeTrueAspect();
							_this.isotope( 'layout' );
						});
						$doc.on('lazyloaded', function(e){
						  win.trigger('resize.true-aspect');
						});
					}
				  _this.on( 'layoutComplete', function( e, addeditems ) {
				  	var elms = _.map(addeditems, 'element');

				  	if (variable_height) {
				  		resizeVariables();
				  	}

				  	/* Scroll Animation */
				  	win.on('scroll.masonry-animation', _.debounce(function(){
				  		items = $(elms).filter(':in-viewport').filter(function() {
				  		    return $(this).data('thb-in-viewport') === undefined;
				  		});
				  		if (items) {
				  			var added = items;
				  			items.data('thb-in-viewport', true);
				  			TweenMax.staggerTo(items.find('.portfolio-holder'), in_speed, args_in, stagger_speed, function() {
				  				added.addClass('thb-added');
				  				added.data('thb-in-viewport', true);
				  				thb_loading = false;
				  			});
				  		}
				  	}, 20)).trigger('scroll.masonry-animation');
						_this.trigger('resize.variables resize.true-aspect');
				  }).isotope(args).isotope( 'layout' ); // end layoutComplete

				  /* Filters */
				  if (filters.length) {
				  	var selector,
				  			filter_function = function() {
						  		_this.on( 'layoutComplete', function(e,items) {
                    _this.trigger('resize.variables resize.true-aspect');
						  			var new_items = _.map(items, 'element');
						  			TweenMax.staggerTo($(new_items).find('.portfolio-holder'), in_speed, args_in, stagger_speed);
						  		});
						  		_this.isotope({ filter: selector });
						  	};

				  	if (filters.hasClass('style1') || filters.hasClass('style3') ) { // Full Filters
					  	var a = filters.find('a');

					  	a.on('click', function(){
					  		var _that = $(this),
					  				items_out = $(_this.isotope('getFilteredItemElements')).find('.portfolio-holder');

						  	selector = _that.data('filter');

				  			a.not(_that).removeClass('active');

				  			if (!_that.hasClass('active')) {
				  				_that.addClass('active');
				  			} else {
				  				_that.removeClass('active');
				  				selector = '*';
				  				a.filter('[data-filter="*"]').addClass('active');
				  			}
				  			if (items_out.length) {
				  				items_out.removeClass('thb-added');
				  				TweenMax.staggerTo(items_out, out_speed, args_out, stagger_speed, filter_function);
				  			} else {
				  				filter_function();
				  			}

					  		return false;

					  	});
				  	} else if (filters.hasClass('style2')) { // Select Button
				  		var select = filters.find('select');

				  		select.on('change', function() {
				  			var items_out = $(_this.isotope('getFilteredItemElements')).find('.portfolio-holder');

				  			selector = this.value;
				  			if (items_out.length) {
				  				items_out.removeClass('thb-added');
				  				TweenMax.staggerTo(items_out, out_speed, args_out, stagger_speed, filter_function);
				  			} else {
				  				filter_function();
				  			}
				  		});
				  	}
				  } // end filters

				  /* Images Loaded */
				  _this.imagesLoaded(function() {
				  	_this.isotope( 'layout' );
				  });
				});
			}
		},
    videoPlayButton: {
			selector: '.thb_video_play_button_enabled',
			init: function() {
				var base = this,
					container = $(base.selector);

				container.each(function() {
					var _this = $(this),
							button = _this.find('.thb_video_play'),
							icon = $('svg', button),
							instance = _this.data("vide");

						if (instance) {
							var video = instance.getVideoObject();


							if (button) {
						 		button.on('click', function() {
						 			if (video) {
						 				if (video.paused) {
											_this.addClass('thb_video_active');
						 					video.play();
						 					icon.addClass('playing');
						 				} else {
											_this.removeClass('thb_video_active');
						 				  video.pause();
						 					icon.removeClass('playing');
						 				}
						 			}
						 			return false;
						 		});
							}
						}
				});
			}
		},
    thb_3dImg: {
			selector: '.thb_3dimg',
			init: function(el) {
				var base = this,
						container = $(base.selector),
						target = el ? el.find(base.selector) : container;

				target.thb_3dImg();
			}
		},
		portfolio_video: {
			selector: '.thb-video-item',
			init: function(el) {
				var base = this,
					  container = el ? el : $(base.selector),
            ajax = el ? true : false;


				container.each(function() {
				  var _this = $(this),
				      video = _this.find('.thb-portfolio-video').data('vide');

          if (ajax) {

            var options = _this.find('.thb-portfolio-video').data('vide-options');
            var path = _this.find('.thb-portfolio-video').data('vide-bg');

            _this.find('.thb-portfolio-video').vide(path, options);

            video = _this.find('.thb-portfolio-video').data('vide');
          }
          if (video) {
            video = video.getVideoObject();
            if (!isNaN(video.duration)) {
              video.currentTime = 0.15;
            }
          }
          _this.hoverIntent(
            function() {
              if (video) {
                video.currentTime = 0.15;
                video.play();
              }
            },
            function() {
              if (video) {
                video.pause();
                video.currentTime = 0.15;
              }
            }
          );
				});
			}
		},
		slick: {
			selector: '.thb-carousel',
			init: function(el) {
				var base = this,
					container = el ? el : $(base.selector);

				container.each(function() {
					var _this = $(this),
						data_columns = _this.data('columns'),
						thb_columns = data_columns.length > 2 ? parseInt( data_columns.substr(data_columns.length - 1) ) : data_columns,
						children = _this.find('.columns'),
						columns = data_columns.length > 2 ? (thb_columns === 5 ? 5 : ( 12 / thb_columns )) : data_columns,
						fade = (_this.data('fade') ? true : false),
						navigation = (_this.data('navigation') === true ? true : false),
						autoplay = (_this.data('autoplay') === true ? true : false),
						pagination = (_this.data('pagination') === true ? true : false),
						center = (_this.data('center') ? (( (children.length > columns) && (columns % 2)) ? _this.data('center') : false) : false),
						infinite = (_this.data('infinite') === false ? false : true),
						autoplay_speed = _this.data('autoplay-speed') ? _this.data('autoplay-speed') : 4000,
						disablepadding = (_this.data('disablepadding') ? _this.data('disablepadding') : false),
						vertical = (_this.data('vertical') === true ? true : false),
						asNavFor = _this.data('asnavfor'),
						adaptiveHeight = _this.data('adaptive') === true ? true : false,
						rtl = body.hasClass('rtl'),
						prev_text = '',
						next_text = '';

          if ( !_this.hasClass('thb-testimonial-style1') && pagination && !_this.hasClass('thb-arrows-style2') && !_this.hasClass('thb-portfolio-slider-style7')) {
						_this.append('<div class="slick-dots-wrapper"></div>');
					} else if (_this.hasClass('thb-portfolio-slider-style7')) {
            _this.append('<div class="portfolio-style7-dots-wrapper"><div class="row max_width"><div class="small-12 columns"></div></div></div>');
					} else if ( _this.hasClass('thb-arrows-style2') ) {
						prev_text = themeajax.l10n.prev;
						next_text = themeajax.l10n.next;
						_this.append('<div class="slick-style2-arrows"><div class="slick-dots-wrapper"></div></div>');
					}
					var args = {
						dots: pagination,
						arrows: navigation,
						infinite: infinite,
						speed: 1000,
						fade: fade,
						centerPadding: '10%',
						centerMode: center,
						slidesToShow: columns,
						adaptiveHeight: adaptiveHeight,
						slidesToScroll: 1,
						rtl: rtl,
						cssEase: thb_css_ease,
						autoplay: autoplay,
						autoplaySpeed: autoplay_speed,
            touchThreshold: themeajax.settings.touch_threshold,
						slide: ':not(.slick-dots-wrapper):not(.slick-style2-arrows):not(.portfolio-style7-dots-wrapper)',
						pauseOnHover: true,
						accessibility: themeajax.settings.accessibility,
						focusOnSelect: true,
						prevArrow: '<button type="button" class="slick-nav slick-prev thb-animated-arrow circular">'+ themeajax.svg.prev_arrow + prev_text + '</button>',
						nextArrow: '<button type="button" class="slick-nav slick-next thb-animated-arrow circular">'+ next_text + themeajax.svg.next_arrow +'</button>',
						responsive: [
							{
								breakpoint: 1441,
								settings: {
									slidesToShow: (columns < 6 ? columns : (vertical ? columns-1 :6)),
									centerPadding: (disablepadding ? 0 : '40px')
								}
							},
							{
								breakpoint: 1201,
								settings: {
									slidesToShow: (columns < 4 ? columns : (vertical ? columns-1 :4)),
									centerPadding: (disablepadding ? 0 : '40px')
								}
							},
							{
								breakpoint: 1025,
								settings: {
									slidesToShow: (columns < 3 ? columns : (vertical ? columns-1 :3)),
									centerPadding: (disablepadding ? 0 : '40px')
								}
							},
							{
								breakpoint: 641,
								settings: {
									slidesToShow: 1,
								}
							}
						]
					};
					if (!_this.hasClass('thb-testimonial-style1') && !_this.hasClass('thb-arrows-style2')) {
						args.appendDots = _this.find('.slick-dots-wrapper');
					}
          if (!_this.hasClass('thb-testimonial-style1') && _this.hasClass('thb-arrows-style2')) {
						args.appendArrows = _this.find('.slick-style2-arrows');
						args.appendDots = _this.find('.slick-style2-arrows>.slick-dots-wrapper');
          }
					if (_this.hasClass('thb-portfolio-slider-style7')) {
						args.appendDots = _this.find('.portfolio-style7-dots-wrapper .columns');
					}
					if (asNavFor && $(asNavFor).is(':visible')) {
						args.asNavFor = asNavFor;
					}
					if (_this.data('fade')) {
						args.fade = true;
					}
          // Products
					if (_this.hasClass('product-images')) {

						// Zoom Support
						if ( typeof wc_single_product_params !== 'undefined' ) {
  						if (window.wc_single_product_params.zoom_enabled && $.fn.zoom) {
  							_this.on('afterChange', function(event, slick, currentSlide){
  								var zoomTarget = slick.$slides.eq(currentSlide),
  										galleryWidth = zoomTarget.width(),
  										zoomEnabled  = false,
  										image = zoomTarget.find( 'img' );

  								if ( image.data( 'large_image_width' ) > galleryWidth ) {
  									zoomEnabled = true;
  								}
  								if ( zoomEnabled ) {
  									var zoom_options = $.extend( {
  										touch: false
  									}, window.wc_single_product_params.zoom_options );

  									if ( 'ontouchstart' in window ) {
  										zoom_options.on = 'click';
  									}

  									zoomTarget.trigger( 'zoom.destroy' );
  									zoomTarget.zoom( zoom_options );
  									zoomTarget.trigger( 'mouseenter.zoom' );
  								}

  							});
  						}
						}
					}
					if (_this.hasClass('product-thumbnails')) {
						args.vertical = true;
						args.responsive[2].settings.vertical = false;
						args.responsive[2].settings.slidesToShow = 4;
						args.responsive[3].settings.vertical = false;
						args.responsive[3].settings.slidesToShow = 4;
					}
					if (_this.hasClass('products')) {
						args.responsive[3].settings.slidesToShow = 2;
					}
					_this.on('init', function() {
						win.trigger('resize.position_arrows');
					});
					if (center) {
						_this.on('init', function() {
							_this.addClass('centered');
						});
					}

					_this.on('breakpoint', function(event, slick, breakpoint){
						slick.$slides.data('thb-animated', false);
						win.trigger('scroll.thb-animation');
					});
					_this.on('afterChange', function(event, slick, currentSlide){
						if (slick.$slides) {
					  	win.trigger('scroll.thb-animation');
						}
					});
					if (_this.hasClass('thb-testimonial-style1')) {
						args.customPaging = function(slider, i) {
							var portrait = $(slider.$slides[i]).find('.author_image').attr('src'),
									title = $(slider.$slides[i]).find('.title').text();

							return '<a class="portrait_bullet" title="'+title+'" style="background-image:url('+portrait+');"></a>';
						};
					} else if (_this.hasClass('thb-portfolio-slider-style7')) {
						args.customPaging = function(slider, i) {
							var categories = $(slider.$slides[i]).data('categories');

							return '<div class="thb-portfolio-slider-style7-bullets"><span>'+categories+'</span></div>';
						};
					} else if (pagination) {
						_this.on('init breakpoint', function() {
							if (_this.hasClass('thb-arrows-style2')) {
								_this.find('.slick-style2-arrows').appendTo(_this);
							} else {
								_this.find('.slick-dots-wrapper').appendTo(_this);
							}
							if (!_this.find('.select').length) {
								_this.find('.slick-dots').append('<div class="select"></div>');
							}
							win.trigger('scroll.thb-animation');
						});
						_this.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
							var dots = _this.find('.slick-dots'),
									bullets = $('li', dots);

							if (bullets.length > 1) {
								var	active = bullets.eq(currentSlide),
										next = bullets.eq(nextSlide),
										select  = $('.select', dots),
										active_x = active.position().left,
										next_x = next.position().left,
										diff = 0,
										args,
										tl = new TimelineMax();

									if (active_x < next_x) {
										diff = next_x - active_x + 6;
										args = {
											right: 'auto',
											left: next_x,
											width: 6
										};
										tl
											.to(select, 0.2, { width: diff })
											.to(select, 0.2, args);

									} else {
										diff = active_x - next_x + 6;
										args =	{
											left: next_x,
											width: diff
										};

										tl
											.to(select, 0.2, args)
											.to(select, 0.2, { width: 6 });
									}
								}
						});
					}
					if (_this.hasClass('thb-portfolio-slider') ) {
						win.on('resize.position_arrows', function() {
							if (_this.hasClass('position-arrows') ) {
  							var container = $('h1, h2', _this.find('.slick-current')),
  									left = container.length ? container.offset().left - _this.offset().left : 0;

  							if ( left > 0 ) {
  								$('.slick-prev', _this).css('left', function() {
  									return left + 'px';
  								});
  								$('.slick-next', _this).css('left', function() {
  									return left + 55 + 'px';
  								});
  							}
							}
						});
						_this.on('beforeChange', function(event, slick, currentSlide, nextSlide){
						  var currentSlideVideo = slick.$slides.eq(currentSlide).find('.thb-portfolio-video'),
						      nextSlideVideo = slick.$slides.eq(nextSlide).find('.thb-portfolio-video');

						  if (currentSlideVideo.length) {
						  	var videocurrent = currentSlideVideo.data('vide').getVideoObject();
                if (!isNaN(videocurrent.duration)) {
                  videocurrent.currentTime = 0;
                }
				  	    videocurrent.pause();
						  }
						  if (nextSlideVideo.length) {
						  	var videonext = nextSlideVideo.data('vide').getVideoObject();
						    videonext.play();
						  }
						});
						_this.on('init', function(event, slick) {
              var currentSlideVideo = slick.$slides.eq(0).find('.thb-portfolio-video');

              if (currentSlideVideo.length) {
                var video = currentSlideVideo.data('vide').getVideoObject();

                currentSlideVideo.data('vide').resize();
                video.play();
              }
              if (_this.find('.mfp-image')) {
                SITE.magnificImage.init();
              }
						});
					}
          if (_this.hasClass('thb-image-slider') ) {
            _this.on('init', function(event, slick) {
              $doc.on('lazyloaded', function(e){
                _this.slick('setPosition');
              });
              if (window.lazySizes) {
                lazySizes.autoSizer.checkElems();
              }
            });
          }
          _this.slick(args);
				});
			}
		},
		thb_panr: {
			selector: '.thb_panr',
			init: function(el) {
				var base = this,
					container = $(base.selector),
					target = el ? el.find(base.selector) : container;

				target.each(function() {
					var _this = $(this),
							move_target = _this.parents('.portfolio-holder').length ? _this.parents('.portfolio-holder') : _this,
							img = _this.find('img');

					img.panr({ moveTarget: move_target, scaleDuration: 1, sensitivity: 10, scaleTo: 1.07, panDuration: 2 });
				});
			}
		},
    widget_nav_menu: {
			selector: '.widget_nav_menu, .widget_pages',
			init: function() {
				var base = this,
						container = $(base.selector),
            items = container.find('.menu-item-has-children, .page_item_has_children' );

        items.each( function() {
          var _this = $(this),
              link = $('>a', _this );

    			link.append( '<div class="thb-arrow"><i class="fa fa-angle-down"></i></div>' );

    			$( '.thb-arrow', _this ).on('click', function(e) {
  					var that = $(this),
                parent = that.parents('a'),
  							menu = parent.next('.sub-menu, .children');

  					if (parent.hasClass('active')) {
  						parent.removeClass('active');
  						menu.slideUp('200');
  					} else {
  						parent.addClass('active');
  						menu.slideDown('200');
  					}
  					e.stopPropagation();
  					e.preventDefault();
    			});
    			if ( link.attr( 'href' ) === '#' ) {
    				link.on('click', function( e ) {
              var that = $(this),
                  menu = that.next('.sub-menu');
              if (that.hasClass('active')) {
    						that.removeClass('active');
    						menu.slideUp('200');
    					} else {
    						that.addClass('active');
    						menu.slideDown('200');
    					}
    					e.preventDefault();
    				});
    			}
    		});
      }
    },
		pricingStyle2: {
			selector: '.thb-pricing-table.style2',
			init: function(el) {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
					    columns = $('.pricing-container', _this),
					    highlight = $('.pricing-style2-highlight', _this),
					    highlight_init = highlight.parents('.pricing-container');

          if (!highlight.length) {
            return;
          }
					function moveHighlight(el) {
						var hover = el;

						TweenMax.set( highlight, {
							'left': hover.position().left,
							'width': hover.outerWidth(),
							'height': hover.parents('.thb-pricing-column').outerHeight(),
							'top': hover.position().top,
						});
					}

					columns.on('mouseenter',function() {
						moveHighlight($(this));
					}).on('mouseleave', function() {
						moveHighlight(highlight_init);
					});

					win.on('resize.move_highlight', function() {
						moveHighlight(highlight_init);
					}).trigger('resize.move_highlight');
					_this.addClass('active');
				});

			}
		},
		toTop: {
			selector: '#scroll_to_top',
			init: function() {
				var base = this,
					container = $(base.selector);

				container.on('click', function(){
					TweenMax.to(win, 1, { scrollTo: { y:0, autoKill:false } });
					return false;
				});
				win.scroll(_.debounce(function(){
					base.control();
				}, 20));
			},
			control: function() {
				var base = this,
						container = $(base.selector);

				if (win.scrollTop() > 100) {
					container.addClass('active');
				} else {
					container.removeClass('active');
				}
			}
		},
		toBottom: {
			selector: '.scroll-bottom',
			init: function() {
				var base = this,
						container = $(base.selector);

				var fixed_height = $('.header>.row').outerHeight() + parseInt(themeajax.settings.fixed_header_padding.top, 10) + parseInt(themeajax.settings.fixed_header_padding.bottom, 10);

				container.each(function() {
					var _this = $(this);

					_this.on('click', function(){
						var p = _this.parents('.post-gallery').length ? _this.parents('.post-gallery') : _this.closest('.row'),
								h = p.outerHeight(),
								ah = $('#wpadminbar').outerHeight(),
								finalScroll = p.offset().top + h;

						if ($('.fixed-header-on').length && themeajax.settings.fixed_header_scroll !== 'on') {
							if ( !header.hasClass('style8') ) {
								finalScroll -= $('.header.fixed').outerHeight();
							}
						}
						finalScroll -= ah;

						TweenMax.to(win, 1, {scrollTo: { y: finalScroll, autoKill: false } });
						return false;
					});
				});
			}
		},
		bg_list: {
			selector: '.thb-bg-list-parent',
			init: function() {
				var base = this,
						container = $(base.selector);


				container.each(function() {
					var _this = $(this),
							zoom = _this.data('zoom-effect'),
							content = _this.find('.thb-bg-list'),
							images = _this.find('.thb-bg-list-bg');

					function animateOver(i, el) {
					  var tl = new TimelineMax();
					  if (!images.eq(i).is(':visible')) {
					  	tl
					  		.to(images.filter(':visible'), 0.5, {autoAlpha: 0, scale: 1, display: 'none'}, 0)
					  		.to(images.eq(i), 0.5, {autoAlpha: 1, display: 'block'}, 0);
					  }

					  if (zoom) {
						  tl
						  	.add(TweenMax.to(images.eq(i), 5, {scale: 1.05}));
					  }
					  el.animation = tl;
					  return tl;
					}
					content.hoverIntent(function() {
							var i = content.index(this);
							animateOver(i, this);
					});
					animateOver(0, content.eq(0));
				});
			}
		},
		animation: {
			selector: '.animation, .thb-counter, .thb-iconbox, .portfolio-title:not(.not-activated), .thb-fadetype, .thb-slidetype, .thb-progressbar, .thb-autotype',
			init: function() {
				var base = this,
						container = $(base.selector);

				$('.animation.bottom-to-top-3d, .animation.top-to-bottom-3d, .animation.bottom-to-top-3d-small, .animation.top-to-bottom-3d-small').parent(':not(.slick-track)').addClass('perspective-wrap');

				win.on('scroll.thb-animation', function(){
					base.control(container, true);
				}).trigger('scroll.thb-animation');
			},
			container: function(container) {
				var base = this,
						element = $(base.selector, container);

				base.control(element, false);
			},
			control: function(element, filter) {
				var t = 0,
				    speed = 0.5,
						delay = 0.15,
						el = filter ? element.filter(':in-viewport') : element;

				el.each(function() {
					var _this = $(this),
					    params = { autoAlpha: 1, x: 0, y: 0, z:0, rotationZ: '0deg', rotationX: '0deg', rotationY: '0deg', delay: t*delay };

					if ( _this.hasClass('thb-client') || _this.hasClass('thb-counter') || _this.hasClass('thb-iconlist-li')) {
						speed = 0.2;
						delay = 0.05;
					} else if ( _this.hasClass('thb-team-member') ) {
						speed = 0.4;
						delay = 0.1;
					} else {
					  speed = 0.5;
					  delay = 0.15;
					}
          if (_this.data('thb-animated') !== true ) {
            _this.data('thb-animated', true);
  					if (_this.hasClass('thb-iconbox')) {
  						SITE.iconbox.control(_this, t*delay);
  					} else if (_this.hasClass('thb-counter')) {
  						SITE.counter.control(_this, t*delay);
  					} else if (_this.hasClass('portfolio-title')) {
  						SITE.portfolioTitle.control(_this, t*delay);
  					} else if (_this.hasClass('thb-autotype')) {
  						SITE.autoType.control(_this, t*delay);
  					} else if (_this.hasClass('thb-fadetype')) {
  						SITE.fadeType.control(_this, t*delay);
  					} else if (_this.hasClass('thb-slidetype')) {
  						SITE.slideType.control(_this, t*delay);
  					} else if (_this.hasClass('thb-progressbar')) {
  						SITE.progressBar.control(_this, t*delay);
  					} else {
  						if (_this.hasClass('scale')) {
  							params.scale = 1;
  						}
  						TweenMax.to(_this, speed, params);
  					}
					  t++;
          }
				});
			}
		},
		perspective: {
			selector: '.perspective-enabled',
			init: function() {
				var base = this,
						container = $(base.selector),
						lastScroll = win.scrollTop();

				function thb_setPerspective() {
					var scrollTop = win.scrollTop(),
							perspective = ( scrollTop + ( win.height() ) ) + 'px';

					if (lastScroll !== scrollTop) {

						TweenMax.set(container, { 'perspective-origin': '50% ' + perspective });
						lastScroll = scrollTop;
					}
					requestAnimationFrame(thb_setPerspective);
				}

				requestAnimationFrame(thb_setPerspective);

			}
		},
		fixedMe: {
			selector: '.thb-fixed, .thb-product-style2 .summary, .thb-product-style4 .summary, .thb-product-style5 .summary',
			init: function(el) {
				var base = this,
						container = el ? el : $(base.selector),
						header_offset = ( $('.header').hasClass('style7') || $('.header').hasClass('style8') ) ? 30 : $('.header').outerHeight(),
						offset = adminbar.outerHeight() + header_offset;

				if (!thb_md.mobile()) {
					container.each(function() {
						var _this = $(this);

						_this.stick_in_parent({
							offset_top: offset || 0,
							spacer: '.sticky-content-spacer',
							recalc_every: 30
						});
					});

					$('.post-content, .products, .product-images').imagesLoaded(function() {
						$(document.body).trigger("sticky_kit:recalc");
					});
					win.on('resize', _.debounce(function(){
						$(document.body).trigger("sticky_kit:recalc");
					}, 30));
				}
			}
		},
		autoType: {
			selector: '.thb-autotype',
			control: function(container, delay, skip) {
				if ( ( container.data('thb-in-viewport') === undefined ) || skip) {
					container.data('thb-in-viewport', true);

					var _this = container,
							entry = _this.find('.thb-autotype-entry'),
							strings = entry.data('strings'),
							speed = entry.data('speed') ? entry.data('speed') : 50,
							loop = entry.data('thb-loop') === 1 ? true : false,
							cursor = entry.data('thb-cursor') === 1 ? true : false;

					entry.typed({
						strings: strings,
						loop: loop,
						showCursor: cursor,
						cursorChar: '|',
						contentType: 'html',
						typeSpeed: speed,
						backDelay: 1000,
					});
				}
			}
		},
		fadeType: {
			selector: '.thb-fadetype',
			control: function(container, delay, skip) {
				if( ( container.data('thb-in-viewport') === undefined ) || skip) {
					container.data('thb-in-viewport', true);
					var split = new SplitText(container.find('.thb-fadetype-entry')),
							tl = new TimelineMax(),
              args = {};

          tl
						.set(container, {visibility:"visible"});
          if (container.hasClass('thb-fadetype-style1')) {
            args = {
						  autoAlpha: 0,
						  y: 10,
						  rotationX: '-90deg',
						  delay: delay
						};
            tl.staggerFrom(split.chars, 0.25, args, 0.05, '+=0', function() {
							split.revert();
						});
          } else if (container.hasClass('thb-fadetype-style2')) {
            for (var t = split.chars.length, n = 0; n < t; n++) {
             var i = split.chars[n],
                 r = 0.5 * Math.random();
             tl
              .from(i, 2, { opacity: 0, ease: Linear.easeNone }, r)
              .from(i, 2, { yPercent: -50, ease: Expo.easeOut }, r);
            }
          }
				}
			}
		},
		progressBar: {
			selector: '.thb-progressbar',
			control: function(container, delay, skip) {
				if( ( container.data('thb-in-viewport') === undefined ) || skip) {
					var progress = container.find('.thb-progress'),
							value = progress.data('progress');

					var tl = new TimelineMax();

					tl
						.to(container, 0.6, { autoAlpha: 1, delay: delay })
						.to(progress.find('span'), 1, { scaleX: value/100 });

				}
			}
		},
		slideType: {
			selector: '.thb-slidetype',
			control: function(container, delay, skip) {
				if( ( container.data('thb-in-viewport') === undefined ) || skip) {
					container.data('thb-in-viewport', true);
					var style = container.data('style'),
							tl = new TimelineMax(),
							split,
							animated_split,
							dur = 0.25,
							stagger = 0.05;

					if (style === 'style1') {
						animated_split = container.find('.thb-slidetype-entry .lines');
						dur = 0.65;
						stagger = 0.15;
					} else if (style === 'style2') {
						split = new SplitText(container.find('.thb-slidetype-entry'), { type: 'words' });
						animated_split = split.words;
						dur = 0.65;
						stagger = 0.15;
					} else if (style === 'style3') {
						split = new SplitText(container.find('.thb-slidetype-entry'));
						animated_split = split.chars;
					}

					tl
						.set(container, {visibility:"visible"})
						.staggerFrom(animated_split, dur, {
						  y: '200%',
						  delay: delay
						}, stagger, '+=0', function() {
							if (style !== 'style1') {
								split.revert();
							}
						});

				}
			}
		},
		keyNavigation: {
			selector: '.thb_portfolio_nav, .thb_post_nav.blog_nav_keyboard-on',
			init: function() {
				var base = this,
						container = $(base.selector);

				var thb_nav_click = function(e) {
					if (e.keyCode === 78) { // Next
						if (container.find('.post_nav_link.next').length) {
							container.find('.post_nav_link.next')[0].click();
						}
					}
					if (e.keyCode === 80) { // Prev
						if (container.find('.post_nav_link.prev').length) {
							container.find('.post_nav_link.prev')[0].click();
						}
					}
				};
				$doc.bind('keyup', thb_nav_click);

				$('input, textarea').on('focus', function() {
						$doc.unbind('keyup', thb_nav_click);
				});
				$('input, textarea').on('blur', function() {
						$doc.bind('keyup', thb_nav_click);
				});
			}
		},
		counter: {
			selector: '.thb-counter',
			control: function(container, delay) {
				if( container.data('thb-in-viewport') === undefined ) {
					container.data('thb-in-viewport', true);

					var _this = container,
							el = _this.find('.h1:not(.counter-text), .counter:not(.counter-text)').eq(0),
							counter = el[0],
							count = el.data('count'),
							speed = el.data('speed'),
							svg = _this.find('svg'),
							separator = _this.data('separator'),
							svg_el = svg.find('path, circle, rect, ellipse'),
							params = {
								el: counter,
								value: 0,
								duration: speed,
								theme: 'minimal'
							},
							tl = new TimelineMax({
								paused: true
							});

					if (!separator || separator === '') {
						params.format = '';
					}
					var od = new Odometer(params);
						tl
							.set(_this, { visibility: 'visible' })
							.set(svg, { display: 'block' })
							.staggerFrom(svg_el, (speed/2000), { drawSVG: "0%"}, (speed/10000));
						setTimeout(function(){
							tl.play();
							od.update(count);
						}, delay);
				}
			}
		},
		like: {
			selector: '.thb-like-button',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var _this = $(this),
							counter = _this.find('.counter'),
							count = counter.data('count'),
							icon = _this.find('.fa');

					var od = new Odometer({
						el: counter[0],
						value: 0,
						duration: 500,
						theme: 'minimal'
					});
					od.update(count);

					if (!_this.hasClass('loading')) {
						_this.on('click', function() {

							$.ajax( themeajax.url, {
								method: 'POST',
								data: {
									action: 'thb_update_likes',
									id: _this.data('id')
								},
								beforeSend: function() {
									_this.addClass('loading');
								},
								success : function(data) {
									_this.removeClass('loading');

									var json = JSON.parse(data),
											count = json.count;
									if (json.like) {
										_this.addClass('active');
									} else {
										_this.removeClass('active');
									}
									od.update(count);
								}
							});
							return false;
						});
					}
				});
			}
		},
		toggleBlog: {
			selector: '.thb-toggle-blog',
			init: function(el) {
				var base = this,
						container = el ? el : $(base.selector),
						toggles = $('.post.style9', container);

				toggles.each(function() {
					var _this = $(this),
					    toggle = $('.style9-arrow', _this);

					toggle.on('click', function() {
						_this.toggleClass('active');
						return false;
					});
				});
			}
		},
		iconbox: {
			selector: '.thb-iconbox',
			control: function(container, delay) {
				if( container.data('thb-in-viewport') === undefined && !container.hasClass('animation-off')) {
					container.data('thb-in-viewport', true);

					var _this = container,
							animation_speed = _this.data('animation_speed') !== '' ? _this.data('animation_speed') : '1.5',
							svg = _this.find('svg'),
							img = _this.find('img:not(.thb_image_hover)'),
							el = svg.find('path, circle, rect, ellipse'),
							h = _this.find('h5'),
							p = _this.find('p'),
							line = _this.find('.thb-iconbox-line'),
							dot = _this.find('.thb-iconbox-line em'),
							tl = new TimelineMax({
								delay: delay,
								paused: true,
								clearProps: 'all'
							}),
							all = h.add(p).add(img);

							if ( !( _this.hasClass('left') || _this.hasClass('right') ) ) {
								all.add(_this.find('.thb-read-more'));
							}

					tl
						.set(_this, { visibility: 'visible' })
						.set(svg, { visibility: 'visible' })
						.from(el, animation_speed, { drawSVG: "0%"}, 0.2, "s")
						.staggerFromTo(all, (animation_speed / 2), { autoAlpha: 0, y: '20px'}, { autoAlpha: 1, y: '0px'}, 0.1, "s-="+ (animation_speed / 2) );

					if (dot.length) {
						tl
							.to(dot, (animation_speed / 2), { scale: '1' }, "s-="+ (animation_speed / 1.5 ));
					}

					if (line.length) {
						tl
							.to(line, (animation_speed / 2), { scaleX: '1' }, "s-="+ (animation_speed / 1.5 ));
					}

					tl.play();
				}
			}
		},
		officeLocations: {
			selector: '.thb_office_location:not(.disabled)',
			init: function() {
				var base = this,
					   container = $(base.selector);


				container.each(function() {
					var _this = $(this),
              style = _this.data('style') || 'style1',
  						office_btn = _this.prev('.thb_location_container').find('.thb_location'),
  						mapzoom = _this.data('map-zoom'),
  						mapstyle = _this.data('map-style'),
  						mapType = _this.data('map-type'),
  						panControl = _this.data('pan-control'),
  						zoomControl = _this.data('zoom-control'),
  						mapTypeControl = _this.data('maptype-control'),
  						scaleControl = _this.data('scale-control'),
  						streetViewControl = _this.data('streetview-control'),
  						locations = _this.find('.thb-location'),
              panheight = 0,
  						once;

					var bounds = new google.maps.LatLngBounds();

					var mapOptions = {
						styles: mapstyle,
						zoom: mapzoom,
						scrollwheel: false,
						panControl: panControl,
						zoomControl: zoomControl,
						mapTypeControl: mapTypeControl,
						scaleControl: scaleControl,
						streetViewControl: streetViewControl,
						fullscreenControl: false,
						mapTypeId: mapType,
            gestureHandling: 'cooperative'
					};

					// Render Map
					var map = new google.maps.Map(_this[0], mapOptions);

					// Render Marker
					function thb_renderMarker(i, location) {
						var options = location.data('option'),
								lat = options.latitude,
								long = options.longitude,
								latlng = new google.maps.LatLng(lat, long),
								marker = options.marker_image,
								marker_size = options.marker_size,
								retina = options.retina_marker,
								title = options.marker_title,
								desc = options.marker_description,
								pinimageLoad = new Image();

						bounds.extend(latlng);

						pinimageLoad.src = marker;

						location.data('rendered', true);

						$(pinimageLoad).on('load', function(){
							SITE.contactMap.setMarkers(i, map, latlng, marker, marker_size, title, desc, retina);
						});
					}


					// On Tiles Loaded
					google.maps.event.addListenerOnce(map,'tilesloaded', function() {

						// Office Button Click
						office_btn.on('click', function() {
							var _that = $(this),
									i = style === 'style1' ? _that.parents('.columns').index() : _that.parents('.thb_location_container').children('.thb_location').index(_that),
									location = locations.eq(i),
									options = location.data('option'),
									lat = options.latitude,
									long = options.longitude,
									latlng = new google.maps.LatLng(lat, long);

							if (!location.data('rendered')) {
								once = true;
								thb_renderMarker(i, location);
							}
							office_btn.removeClass('active');
							_that.addClass('active');


					    map.panTo(latlng);
              if (style === 'style2') {
                panheight = -1 * _this.prev('.thb_location_container').outerHeight() / 2;
                map.panBy(0, panheight);
              }

						});
						office_btn.eq(0).trigger('click');

						if ( mapzoom > 0 ) {
							map.setCenter(bounds.getCenter());
							map.setZoom(mapzoom);
						} else {
							map.setCenter(bounds.getCenter());
							map.fitBounds(bounds);
						}

            if (style === 'style2') {
              panheight = -1 * _this.prev('.thb_location_container').outerHeight() / 2;
              map.panBy(0, panheight);
            }
					});
					win.on('resize.google_map', _.debounce(function(){
						map.setCenter(bounds.getCenter());
            if (style === 'style2') {
              panheight = -1 * _this.prev('.thb_location_container').outerHeight() / 2;
              map.panBy(0, panheight);
            }
					}, 50) ).trigger('resize.google_map');

				});
			},
		},
		contactMap: {
			selector: '.contact_map:not(.disabled)',
			init: function() {
				var base = this,
					container = $(base.selector);


				container.each(function() {
					var _this = $(this),
  						mapzoom = _this.data('map-zoom'),
  						mapstyle = _this.data('map-style'),
  						mapType = _this.data('map-type'),
  						panControl = _this.data('pan-control'),
  						zoomControl = _this.data('zoom-control'),
  						mapTypeControl = _this.data('maptype-control'),
  						scaleControl = _this.data('scale-control'),
  						streetViewControl = _this.data('streetview-control'),
  						locations = _this.find('.thb-location'),
  						expand = _this.next('.expand'),
  						tw = _this.width(),
  						once,
  						map;

					var bounds = new google.maps.LatLngBounds();

					var mapOptions = {
						styles: mapstyle,
						zoom: mapzoom,
						scrollwheel: false,
						panControl: panControl,
						zoomControl: zoomControl,
						mapTypeControl: mapTypeControl,
						scaleControl: scaleControl,
						streetViewControl: streetViewControl,
						fullscreenControl: false,
						mapTypeId: mapType,
            gestureHandling: 'cooperative'
					};

					if (expand) {
						expand.toggle(function() {
							var w = _this.parents('.row').width();

							_this.parents('.contact_map_parent').css('overflow', 'visible');
							TweenMax.to(_this, 1, { width: w, onUpdate: function() {
									google.maps.event.trigger(map, 'resize');
									map.setCenter(bounds.getCenter());
								}
							});
							return false;
						},function() {
							TweenMax.to(_this, 1, { width: tw, onUpdate: function() {
									google.maps.event.trigger(map, 'resize');
									map.setCenter(bounds.getCenter());
								}, onComplete: function() {
									_this.parents('.contact_map_parent').css('overflow', 'hidden');
								}
							});
							return false;
						});
					}
					// Render Map
					map = new google.maps.Map(_this[0], mapOptions);

					// Render Marker
					function thb_renderMarker(i, location) {
						var options = location.data('option'),
								lat = options.latitude,
								long = options.longitude,
								latlng = new google.maps.LatLng(lat, long),
								marker = options.marker_image,
								marker_size = options.marker_size,
								retina = options.retina_marker,
								title = options.marker_title,
								desc = options.marker_description,
								pinimageLoad = new Image();

						bounds.extend(latlng);

						pinimageLoad.src = marker;

						location.data('rendered', true);

						$(pinimageLoad).on('load', function(){
							base.setMarkers(i, map, latlng, marker, marker_size, title, desc, retina);
						});
					}

					locations.each(function(i) {
						var location = $(this);
						thb_renderMarker(i, location);
					});


					// On Tiles Loaded
					google.maps.event.addListenerOnce(map,'tilesloaded', function() {

						if( mapzoom > 0 ) {
							map.setCenter(bounds.getCenter());
							map.setZoom(mapzoom);
						} else {
							map.setCenter(bounds.getCenter());
							map.fitBounds(bounds);
						}

					});
					win.on('resize.google_map', _.debounce(function(){
						map.setCenter(bounds.getCenter());
					}, 50) ).trigger('resize.google_map');

				});
			},
			setMarkers: function(i, map, latlng, marker, marker_size, title, desc, retina) {
				// info windows
				var contentString = '<h3>'+title+'</h3>'+'<div>'+desc+'</div>',
						infowindow = new google.maps.InfoWindow({
							content: contentString
						});

				if ( retina ) {
					marker_size[0] = marker_size[0]/2;
					marker_size[1] = marker_size[1]/2;
				}

				function CustomMarker(latlng,  map) {
				  this.latlng = latlng;
				  this.setMap(map);
				}

				CustomMarker.prototype = new google.maps.OverlayView();

				CustomMarker.prototype.draw = function() {
				    var self = this;
				    var div = this.div_;
				    if (!div) {
							div = this.div_ = $('' +
							    '<div class="thb_pin">' +
							    	'<div class="pulse"></div>' +
							    	'<div class="shadow"></div>' +
							    	'<div class="pin-wrap"><img src="'+marker+'" width="'+marker_size[0]+'" height="'+marker_size[1]+'"/></div>' +
							    '</div>' +
							    '');
							this.pinShadow = this.div_.find('.shadow');
							this.pulse = this.div_.find('.pulse');
							this.div_[0].style.position = 'absolute';
							this.div_[0].style.cursor = 'pointer';

							var panes = this.getPanes();
							panes.overlayImage.appendChild(this.div_[0]);

							google.maps.event.addDomListener(div[0], "click", function(event) {
								infowindow.setPosition(latlng);
								infowindow.open(map);
							});

				    }

				    var point = this.getProjection().fromLatLngToDivPixel(latlng);

				    if (point) {
				    	var shadow_offset = ((marker_size[0] - 40) / 2);

			        this.div_[0].style.left = point.x - (marker_size[0] / 2) + 'px';
			        this.div_[0].style.top = point.y - (marker_size[1] / 2) + 'px';
			        this.div_[0].style.width = marker_size[0] + 'px';
			        this.div_[0].style.height = marker_size[1] + 'px';
			        this.pinShadow[0].style.marginLeft = shadow_offset + 'px';
			        this.pulse[0].style.marginLeft = shadow_offset + 'px';
				    }


				};
				CustomMarker.prototype.remove = function() {
					if (this.div_) {
						this.div_.parentNode.removeChild(this.div_);
						this.div_ = null;
					}
				};

				CustomMarker.prototype.getPosition = function() {
					return this.latlng;
				};

				var g_marker = new CustomMarker(latlng, map);
			}
		},
		ajaxAddToCart: {
			selector: '.ajax_add_to_cart',
			init: function() {
				var base = this,
						container = $(base.selector);

				body.on('added_to_cart', function(e, fragments, cart_hash, $button) {
					$button.find('.thb_button_icon').html(themeajax.l10n.added_svg);
					$button.find('span').text(themeajax.l10n.added);
				});
			}
		},
		loginForm: {
			selector: '.thb-overflow-container',
			init: function() {
				var base = this,
						container = $(base.selector),
						ul = $('ul', container),
						links = $('a', ul);

				links.on('click', function() {
					var _this = $(this);
					if (!_this.hasClass('active')) {
						links.removeClass('active');
						_this.addClass('active');

						$('.thb-form-container', container).toggleClass('register-active');
					}
					return false;
				});
			}
		},
    productAjaxAddtoCart: {
			selector: '.thb-single-product-ajax-on.single-product .product-type-variable form.cart, .thb-single-product-ajax-on.single-product .product-type-simple form.cart',
			init: function() {
				var base = this,
						container = $(base.selector),
						btn = $('.single_add_to_cart_button', container);

				$doc.on('submit', 'body.single-product form.cart', function(e){
					e.preventDefault();
					var _this = $(this),
							btn_text = btn.text();

					if (btn.is('.disabled') || btn.is('.wc-variation-selection-needed')) {
						return;
					}

					var	data = {
						product_id:	_this.find("[name*='add-to-cart']").val(),
						product_variation_data: _this.serialize()
					};

					$.ajax({
						method: 'POST',
						data: data.product_variation_data,
						dataType: 'html',
						url: wc_cart_fragments_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'add-to-cart=' + data.product_id + '&thb-ajax-add-to-cart=1' ),
						cache: false,
						headers: {'cache-control': 'no-cache'},
						beforeSend: function() {
							body.trigger( 'adding_to_cart' );
							btn.addClass('disabled').text(themeajax.l10n.adding_to_cart);
						},
						success: function( data ) {
							var parsed_data = $.parseHTML(data);

							var thb_fragments = {
								'.float_count': $(parsed_data).find('.float_count').html(),
								'.thb_prod_ajax_to_cart_notices': $(parsed_data).find('.thb_prod_ajax_to_cart_notices').html(),
								'.widget_shopping_cart_content': $(parsed_data).find('.widget_shopping_cart_content').html()
							};

							$.each( thb_fragments, function( key, value ) {
								$( key ).html(value);
							});
							body.trigger( 'wc_fragments_refreshed' );
							btn.removeClass('disabled').text(btn_text);
						},
						error: function( response ) {
							body.trigger( 'wc_fragments_ajax_error' );
							btn.removeClass('disabled').text(btn_text);
						}
					});
				});

			}
		},
		variations: {
			selector: 'form.variations_form',
			init: function() {
				var base = this,
					container = $(base.selector),
					slider = $('#product-images'),
					thumbnails = $('#product-thumbnails'),
					org_image_wrapper = $('.first', slider ),
					org_image = $('img', org_image_wrapper),
					org_link = $('a', org_image_wrapper),
					org_image_link = org_link.attr('href'),
					org_image_src = org_image.attr('src'),
					org_thumb = $('.first img', thumbnails),
					org_thumb_src = org_thumb.attr('src'),
					price_container = $('p.price', '.product-information').eq(0),
					org_price = price_container.html();

				container.on("show_variation", function(e, variation) {

          if (variation.price_html) {
						price_container.html(variation.price_html);
					} else {
						price_container.html(org_price);
					}

					if (variation.hasOwnProperty("image") && variation.image.src) {
						org_image.attr("src", variation.image.src).attr("srcset", "");
						org_thumb.attr("src", variation.image.thumb_src).attr("srcset", "");
						org_link.attr("href", variation.image.full_src);

						if (slider.hasClass('slick-initialized')) {
							slider.slick('slickGoTo', 0);
						}
						if ( typeof wc_single_product_params !== 'undefined' ) {
							if (wc_single_product_params.zoom_enabled === '1') {
								  org_image.attr("data-src", variation.image.full_src);
							}
						}
					}
				}).on('reset_image', function () {
					price_container.html(org_price);
					org_image.attr("src", org_image_src).attr("srcset", "");
					org_thumb.attr("src", org_thumb_src).attr("srcset", "");
					org_link.attr("href", org_image_link);

					if ( typeof wc_single_product_params !== 'undefined' ) {
						if (wc_single_product_params.zoom_enabled === '1') {
							org_image.attr("data-src", org_image_src);
						}
					}
				});
			}
		},
    quantity: {
			selector: '.quantity:not(.hidden)',
			init: function() {
				var base = this,
						container = $(base.selector);

				base.initialize();
				body.on( 'updated_cart_totals', function(){
					base.initialize();
				});
			},
			initialize: function() {
				// Quantity buttons
				$( 'div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)' ).addClass( 'buttons_added' ).append( '<input type="button" value="+" class="plus" />' ).prepend( '<input type="button" value="-" class="minus" />' ).end().find('input[type="number"]').attr('type', 'text');
				$('.plus, .minus').on('click', function() {
					// Get values
					var $qty		= $( this ).closest( '.quantity' ).find( '.qty' ),
						currentVal	= parseFloat( $qty.val() ),
						max			= parseFloat( $qty.attr( 'max' ) ),
						min			= parseFloat( $qty.attr( 'min' ) ),
						step		= $qty.attr( 'step' );

					// Format values
					if ( ! currentVal || currentVal === '' || currentVal === 'NaN' ) { currentVal = 0; }
					if ( max === '' || max === 'NaN' ) { max = ''; }
					if ( min === '' || min === 'NaN' ) { min = 0; }
					if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) { step = 1; }

					// Change the value
					if ( $( this ).is( '.plus' ) ) {

						if ( max && ( max === currentVal || currentVal > max ) ) {
							$qty.val( max );
						} else {
							$qty.val( currentVal + parseFloat( step ) );
						}

					} else {

						if ( min && ( min === currentVal || currentVal < min ) ) {
							$qty.val( min );
						} else if ( currentVal > 0 ) {
							$qty.val( currentVal - parseFloat( step ) );
						}

					}

					// Trigger change event
					$qty.trigger( 'change' );
					return false;
				});
			}
		},
		sounds: {
			selector: '#wrapper',
			init: function() {
			  var music_toggle = $('.music_toggle');

			  /* Background Music */
			  if ( themeajax.sounds.music_sound === 'on' && ( themeajax.sounds.music_sound_toggle_home === 'on' ? body.hasClass('home') : true ) ) {

			  	if (themeajax.sounds.music_disable_mobile === 'on' && (thb_md.mobile() || thb_md.tablet()) ) {
			  		return;
			  	}
			  	var bg_music = new Howl({
			  		src: [ themeajax.sounds.music_sound_file ],
			  		preload: true,
			  		loop: true,
			  		volume: 0.5
			  	}).on('load', function() {
			  		bg_music.play();
			  		/* There is toggle */
			  		if (music_toggle.length) {
			  			music_toggle.data('state', 'on').addClass('on');
			  			music_toggle.on('click', function() {
			  				music_toggle.toggleClass('on');
			  				if (music_toggle.data('state') === 'on') {
			  					bg_music.pause();
			  					music_toggle.data('state', 'off');
			  				} else {
			  					bg_music.play();
			  					music_toggle.data('state', 'on');
			  				}
			  				return false;
			  			});
			  		}
			  	});
			  }

			  /* Hover Sound */
			  if ( themeajax.sounds.link_hover_sound === 'on' ) {
		  	  var hover_sound = new Howl({
	  				src: [themeajax.sounds.link_hover_sound_file ],
	  				preload: true,
	  				volume: 0.5
	  			});
		  	  $('a').hoverIntent(function() {
		  	  	hover_sound.play();
		  	  }, function() {
		  	  });
			  }

			  /* Click Sound */
			  if ( themeajax.sounds.click_sound === 'on' ) {
			    var click_sound = new Howl({
			  		src: [themeajax.sounds.click_sound_file ],
			  		preload: true,
			  		volume: 0.3
			  	});
			    $(document).on('click',function() {
			    	click_sound.play();
			    });
			  }
			}
		},
		footerUnfold: {
			selector: '.footer-effect-on .fixed-footer-container',
			init: function() {
				var base = this,
						container = $(base.selector);

				base.run(container);

				win.on('resize', _.debounce(function(){
						base.run(container);
				}, 50) );
			},
			run: function(container) {
				var h;
				container.imagesLoaded( function() {
					h = win.outerWidth() >= 1024 ? container.outerHeight() : 0;
					body.css('padding-bottom', h);
				});
			}
		},
		responsiveNav: {
			selector: '#wrapper',
			init: function() {
				var base = this,
					container = $(base.selector),
					filters = $('#side-filters'),
					cart = $('#side-cart'),
					featured_portfolio = $('#thb-featured-portfolio'),
					cc_close = $('.thb-mobile-close'),
					tlCartNav = new TimelineLite({ paused: true, onStart: function() { container.addClass('open-cart'); }, onReverseComplete: function() {container.removeClass('open-cart'); } }),
					tlFilterNav = new TimelineLite({ paused: true, onStart: function() { container.addClass('open-filters'); }, onReverseComplete: function() {container.removeClass('open-filters'); } }),
					tlFeaturedNav = new TimelineLite({ paused: true, onStart: function() { container.addClass('open-featured'); }, onReverseComplete: function() {container.removeClass('open-featured'); } });


				tlCartNav
					.staggerFrom($('#side-cart').find('.item'), 0.25, { delay: 0.25, x: "30", opacity:0 }, 0.05, "start")
					.to($('.thb-mobile-close', cart), 0.3, { scale:1 }, "start+=0.2");

				tlFilterNav
					.staggerFrom(filters.find('.widget'), 0.25, { delay: 0.25, x: "-30", opacity:0 }, 0.05, "start")
					.to($('.thb-mobile-close', filters), 0.3, { scale:1 }, "start+=0.2");

				tlFeaturedNav
					.staggerTo(featured_portfolio.find('.portfolio'), 0.25, { autoAlpha: 1, x: 0, y: 0, z:0, rotationZ: '0deg', rotationX: '0deg', rotationY: '0deg' }, 0.05, "start")
					.to($('.thb-mobile-close', featured_portfolio), 0.3, { scale:1 }, "start+=0.2");

				$('.header').on('click', '#quick_cart', function() {
					if (themeajax.settings.is_cart || themeajax.settings.is_checkout) {
						window.location = themeajax.settings.cart_url;
					} else {
						tlCartNav.play();
						SITE.custom_scroll.init();
					}
					return false;
				});
				$('.featured-portfolio').on('click', function() {
					tlFeaturedNav.play();
					return false;
				});
				container.on('click', '#thb-shop-filters', function() {
					tlFilterNav.play();
					return false;
				});
				$doc.keyup(function(e) {
				  if (e.keyCode === 27) {
				    tlCartNav.reverse();
				    tlFilterNav.reverse();
				    tlFeaturedNav.reverse();
				  }
				});
				cc.add(cc_close).on('click', function() {
					tlCartNav.reverse();
					tlFilterNav.reverse();
					tlFeaturedNav.reverse();
					return false;
				});
				body.on('wc_fragments_refreshed added_to_cart', function() {
					$('.thb-close').on('click', function() {
						tlCartNav.reverse();
						tlFilterNav.reverse();
						return false;
					});
				});

			}
		},
		updateCart: {
			selector: '#quick_cart',
			init: function() {
				var base = this,
					container = $(base.selector);
				body.bind('wc_fragments_refreshed added_to_cart', SITE.updateCart.update_cart_dropdown);
			},
			update_cart_dropdown: function(event) {
				if (event.type === 'added_to_cart') {
					$('#quick_cart').trigger('click');
				}
			}
		},
		shopSidebar: {
			selector: '#side-filters .widget',
			init: function() {
				var base = this,
						container = $(base.selector);

				container.each(function() {
					var that = $(this),
							t = that.find('>h6');

					t.append($('<span/>')).on('click', function() {
						t.toggleClass('active');
						t.next().animate({
							height: "toggle",
							opacity: "toggle"
						}, 300);
					});
				});

				$('.widget_layered_nav span.count, .widget_product_categories span.count, .widget_tag_cloud .tag-link-count').each(function(){
					var count = $.trim($(this).html());
					count = count.substring(1, count.length-1);
					$(this).html(count);
				});
			}
		},
		shopLoading: {
			selector: '.post-type-archive-product ul.products.thb-main-products, .tax-product_cat ul.products.thb-main-products',
			thb_loading: false,
			scrollInfinite: false,
			href: false,
			init: function() {
				var base = this,
						container = $(base.selector),
						type = themeajax.settings.shop_product_listing_pagination;

				if ($('.woocommerce-pagination').length && body.hasClass('post-type-archive-product')) {
					if (type === 'style2') {
					 	base.loadButton(container);
					} else if (type === 'style3') {
					 	base.loadInfinite(container);
					}
				}
			},
			loadButton: function(container) {
				var base = this;

				$('.woocommerce-pagination').before('<div class="thb_load_more_container pagination-space text-center"><a class="thb_load_more button">'+themeajax.l10n.loadmore+'</a></div>');

				if ($('.woocommerce-pagination a.next').length === 0) {
					$('.thb_load_more_container').addClass('is-hidden');
				}
				$('.woocommerce-pagination').hide();

				body.on('click', '.thb_load_more:not(.no-ajax)', function(e) {
					var _this = $(this);
					base.href = $('.woocommerce-pagination a.next').attr('href');


					if (base.thb_loading === false) {
						_this.html(themeajax.l10n.loading).addClass('loading');

						base.loadProducts(_this, container);
					}
					return false;
				});
			},
			loadInfinite: function(container) {
				var base = this;

				if ($('.woocommerce-pagination a.next').length === 0) {
					$('.thb_load_more_container').addClass('is-hidden');
				}
				$('.woocommerce-pagination').hide();

				base.scrollInfinite = _.debounce(function(){
					if ( (base.thb_loading === false ) && ( (win.scrollTop() + win.height() + 150) >= (container.offset().top + container.outerHeight()) ) ) {

						base.href = $('.woocommerce-pagination a.next').attr('href');
						base.loadProducts(false, container, true);
					}
				}, 30);

				win.on('scroll', base.scrollInfinite);
			},
			loadProducts: function(button, container, infinite) {
				var base = this;
				$.ajax( base.href, {
					method: 'GET',
					beforeSend: function() {
						base.thb_loading = true;

						if (infinite) {
							win.off('scroll', base.scrollInfinite);
						}
					},
					success: function(response) {
						var resp = $(response),
								products = resp.find('ul.products.thb-main-products li');

						$('.woocommerce-pagination').html(resp.find('.woocommerce-pagination').html());

						if (button) {
						 	if( !resp.find('.woocommerce-pagination .next').length ) {
						 		button.html(themeajax.l10n.nomore_products).removeClass('loading').addClass('no-ajax');
						 	} else {
						 		button.html(themeajax.l10n.loadmore).removeClass('loading');
						 	}
						} else if (infinite) {
							if( resp.find('.woocommerce-pagination .next').length ) {
								win.on('scroll', base.scrollInfinite);
							}
						}
						if (products.length) {
							products.addClass('will-animate').appendTo(container);
							TweenMax.set(products, {opacity: 0, y:30});
							TweenMax.staggerTo(products, 0.3, { y: 0, opacity: 1 }, 0.15);
						}
						base.thb_loading = false;
					}
				});
			}
		},
		right_click: {
			selector: '.right-click-on',
			init: function() {
				var target = $('#right_click_content'),
						clickMain = new TimelineMax({ paused: true, onStart: function() { target.css('display', 'flex'); }, onReverseComplete: function() { target.css('display', 'none'); } }),
						el = target.find('.columns>*');


				clickMain
					.to(target, 0.25, { opacity:1 }, "start")
					.staggerFrom(el, 0.5, { y: 20, opacity: 0 }, 0.1);

				win.on("contextmenu", function(e) {
		      if (e.which === 3) {
		        clickMain.play();
		        return false;
		      }
		    });
		    $doc.keyup(function(e) {
		      if (e.keyCode === 27) {
		        clickMain.reverse();
		      }
		    });
		    target.on('click', function() {
		    	clickMain.reverse();
		    });
			}
		},
	};

	$doc.ready(function() {
		if ($('#vc_inline-anchor').length) {
			win.on('vc_reload', function() {
				SITE.init();
			});
		} else {
			SITE.init();
		}
	});
})(jQuery, this);
