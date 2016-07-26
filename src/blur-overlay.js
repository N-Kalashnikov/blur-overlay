(function ($) {
  'use strict';

  // For more on $.widget(), see: https://api.jqueryui.com/jquery.widget/
  $.widget('custom.blurOverlay', {

    /*
    * Default options
    */
    options: {
      // Set to true to show the overlay on init
      autoShow: false,
      // Background color of the overlay
      backgroundColor: 'rgba(255, 255, 255, 0)',
      // Amount of pixels to blur by
      blurAmount: '12px',
      // Default content to display
      content: '<h1>Hello, blur overlay!</h1>',
      // Duration of CSS transitions
      transitionDuration: '333ms',
      // Type of CSS transitions
      transitionType: 'ease-in-out',
    },

    /*
    * The "constructor"
    */
    _create() {
      this.showing = false;
      this.showDeferred = null;
      this.hideDeferred = null;
      this.transition = `${this.options.transitionDuration} ${this.options.transitionType}`;
      this._initWrapper();
      this._initContent();
      this._initOverlay();
      this._initEvents();
      if (this.options.autoShow) {
        this.show();
      }
    },

    /*
    * Destroy the plugin instance and clean up the DOM
    */
    _destroy() {
      this.element.unwrap();
      this.$overlay.remove();
      $('body').css('overflow', 'auto');
    },

    /*
    * Show the overlay
    */
    show() {
      this.showDeferred = $.Deferred();
      if (!this.showing) {
        this._beforeShow();
      }
      this.showing = true;
      return this.showDeferred.promise();
    },

    /*
    * Hide the overlay
    */
    hide() {
      this.hideDeferred = $.Deferred();
      if (this.showing) {
        this._beforeHide();
      }
      this.showing = false;
      return this.hideDeferred.promise();
    },

    /*
    * Update the contents of the overlay
    */
    content(newContent) {
      const isFunction = typeof newContent === 'function';
      this.options.content = isFunction ? newContent() : newContent;
      this.$content.html(this.options.content);
    },

    /*
    * Return true if overlay is showing, false otherwise
    */
    isShowing() {
      return this.showing;
    },

    /*
    * Private methods
    */

    _initWrapper() {
      this.$wrapper = $('<div>').attr('class', 'blur-overlay-wrapper');
      this.$wrapper.css({
        '-webkit-filter': 'blur(0px)',
        filter: 'blur(0px)',
        '-webkit-transition': `-webkit-filter ${this.transition}, filter ${this.transition}`,
        transition: `-webkit-filter ${this.transition}, filter ${this.transition}`,
      });
      this.element.wrapAll(this.$wrapper);
      this.$wrapper = this.element.closest('.blur-overlay-wrapper').first();
    },

    _initContent() {
      this.$content = $('<div>').attr('class', 'blur-overlay-content');
      this.$content.append(this.options.content);
      this.$content.hide();
    },

    _initOverlay() {
      this.$overlay = $('<div>').attr('class', 'blur-overlay-overlay');
      this.$overlay.css({
        'z-index': 1000,
        'background-color': this.options.backgroundColor,
        opacity: 0,
        '-webkit-transition': `opacity ${this.transition}`,
        transition: `opacity ${this.transition}`,
      });
      this.$overlay.appendTo('body');
      this.$overlay.append(this.$content);
    },

    _initEvents() {
      this.$overlay.on('transitionend webkitTransitionEnd', () => {
        if (!this.showing) {
          this._afterHide();
        } else {
          this._afterShow();
        }
      });
    },

    _beforeShow() {
      this.element.trigger($.Event('blurOverlay.beforeShow'));
      $('body').css('overflow', 'hidden');
      setTimeout(() => {
        this.$wrapper.css({
          '-webkit-filter': `blur(${this.options.blurAmount})`,
          filter: `blur(${this.options.blurAmount})`,
        });
        this.$overlay.css({
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          opacity: 1,
        });
        this.$content.show();
      }, 0);
    },

    _afterShow() {
      this.element.trigger($.Event('blurOverlay.show'));
      this.showDeferred.resolve(true);
    },

    _beforeHide() {
      this.element.trigger($.Event('blurOverlay.beforeHide'));
      $('body').css('overflow', 'auto');
      setTimeout(() => {
        this.$wrapper.css({
          '-webkit-filter': 'blur(0px)',
          filter: 'blur(0px)',
        });
        this.$overlay.css({
          opacity: 0,
        });
      }, 0);
    },

    _afterHide() {
      this.$overlay.css('position', 'relative');
      this.$content.hide();
      this.element.trigger($.Event('blurOverlay.hide'));
      this.hideDeferred.resolve(true);
    },

  });
}(jQuery));
