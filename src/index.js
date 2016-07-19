(function ($) {
  'use strict';

  var showing = false;

  $.widget('custom.blurOverlay', {

    /*
    * Default options
    */
    options: {
      // Set to true to show the overlay on init
      autoShow: false,
      // Default content to display
      content: '<h1>Hello, blur overlay!</h1>',
      // Amount of pixels to blur by
      blurAmount: '12px'
    },

    /*
    * The "constructor"
    */
    _create: function () {
      this._initWrapper();
      this._initContent();
      this._initOverlay();
      this._initEvents();
      if (this.options.autoShow) {
        this.show();
      }
    },

    /*
    * Show the overlay
    */
    show: function () {
      if (!showing) {
        this._beforeShow();
      }
      showing = true;
    },

    /*
    * Hide the overlay
    */
    hide: function () {
      if (showing) {
        this._beforeHide();
      }
      showing = false;
    },

    /*
    * Update the contents of the overlay
    */
    content: function (newContent) {
      var isFunction = typeof newContent === 'function';
      this.options.content = isFunction ? newContent() : newContent;
      this.$content.html(this.options.content);
    },

    /*
    * Return true if overlay is showing, false otherwise
    */
    isShowing: function () {
      return showing;
    },

    /*
    * Private methods
    */

    _initWrapper: function () {
      this.$wrapper = $('<div>').attr('class', 'blur-overlay-wrapper');
      this.$wrapper.css({
        '-webkit-filter': 'blur(0px)',
        filter: 'blur(0px)',
        transition: '-webkit-filter 600ms linear, filter 600ms linear'
      });
      this.element.wrapAll(this.$wrapper);
      this.$wrapper = this.element.closest('.blur-overlay-wrapper').first();
    },

    _initContent: function () {
      this.$content = $('<div>').attr('class', 'blur-overlay-content');
      this.$content.append(this.options.content);
      this.$content.hide();
    },

    _initOverlay: function () {
      this.$overlay = $('<div>').attr('class', 'blur-overlay-overlay');
      this.$overlay.css({
        'z-index': 1000,
        opacity: 0,
        transition: 'opacity 600ms linear'
      });
      this.$overlay.append(this.$content);
      this.$overlay.appendTo('body');
    },

    _initEvents: function () {
      this.$overlay.on('transitionend webkitTransitionEnd', function () {
        if (!showing) {
          this._afterHide();
        } else {
          this._afterShow();
        }
      }.bind(this));
    },

    _beforeShow: function () {
      this.element.trigger($.Event('blurOverlay.beforeShow'));
      $('body').css('overflow', 'hidden');
      this.$wrapper.css({
        '-webkit-filter': 'blur(' + this.options.blurAmount + ')',
        filter: 'blur(' + this.options.blurAmount + ')'
      });
      this.$overlay.css({
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: 1
      });
      this.$content.show();
    },

    _afterShow: function () {
      this.element.trigger($.Event('blurOverlay.show'));
    },

    _beforeHide: function () {
      this.element.trigger($.Event('blurOverlay.beforeHide'));
      $('body').css('overflow', 'auto');
      this.$wrapper.css({
        '-webkit-filter': 'blur(0px)',
        filter: 'blur(0px)'
      });
      this.$overlay.css({
        opacity: 0
      });
    },

    _afterHide: function () {
      this.$overlay.css('position', 'relative');
      this.$content.hide();
      this.element.trigger($.Event('blurOverlay.hide'));
    }

  });
}(jQuery));