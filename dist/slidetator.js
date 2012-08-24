/*! SlideTator - v0.1.0 - 2012-08-24
* https://github.com/vergil/slidetator
* Copyright (c) 2012 Remon Oldenbeuving; Licensed MIT, GPL */

var DefaultSlideView;

DefaultSlideView = (function() {

  function DefaultSlideView(elements, current, options, container) {
    this.elements = elements;
    this.current = current;
    this.options = options;
    this.container = container;
    this.show(this.current);
  }

  DefaultSlideView.prototype.next = function() {
    var next;
    next = this.current + 1;
    if (next > this.elements.length - 1) {
      next = 0;
    }
    return this.show(next);
  };

  DefaultSlideView.prototype.previous = function() {
    var previous;
    previous = this.current - 1;
    if (previous < 0) {
      previous = this.elements.length - 1;
    }
    return this.show(previous);
  };

  DefaultSlideView.prototype.show = function(id) {
    this.elements.hide().eq(id).show();
    this.current = id;
    return this.showRegions();
  };

  DefaultSlideView.prototype.showRegions = function() {
    var region, _i, _len, _ref, _results;
    _ref = this.options.regions;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      region = _ref[_i];
      _results.push(this.showRegion(region));
    }
    return _results;
  };

  DefaultSlideView.prototype.showRegion = function(region) {
    var current, dest, subject;
    current = this.elements.eq(this.current);
    dest = this.getJQueryObject(region.dest, this.container);
    subject = this.getJQueryObject(region.selector, current);
    console.info(dest, subject);
    return dest.html(subject.html());
  };

  DefaultSlideView.prototype.getJQueryObject = function(element, relativeTo) {
    if (typeof element === "string") {
      return (relativeTo || $()).find(element);
    } else if (element instanceof jQuery) {
      return element;
    } else {
      return jQuery(element);
    }
  };

  return DefaultSlideView;

})();

var FadingSlideView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FadingSlideView = (function(_super) {

  __extends(FadingSlideView, _super);

  function FadingSlideView(elements, current, options, container) {
    this.elements = elements;
    this.current = current;
    this.options = options;
    this.container = container;
    this.elements.css('z-index', 1);
    this.elements.eq(this.current).css('z-index', 2);
    this.showRegions();
  }

  FadingSlideView.prototype.show = function(id) {
    var current,
      _this = this;
    if (id === this.current) {
      return;
    }
    current = this.elements.eq(this.current);
    current.css('z-index', 3);
    current.siblings().css('z-index', 1);
    this.elements.eq(id).css('z-index', 2);
    current.fadeOut(function() {
      return _this.elements.show().css('z-index', 1).eq(id).css('z-index', 2);
    });
    this.current = id;
    return this.showRegions();
  };

  return FadingSlideView;

})(DefaultSlideView);

var SlideTator;

SlideTator = (function() {

  function SlideTator(options) {
    this.options = options;
    if (this.shouldBindButtons()) {
      this.bindPrevAndNextButtons();
    }
    this.current = 0;
    this.elements = this.getJQueryObject(this.options.slides);
    this.slideView = new this.options.slide_view(this.elements, this.current, this.options, this.getContainer());
  }

  SlideTator.prototype.shouldBindButtons = function() {
    return "previous_button" in this.options && "next_button" in this.options;
  };

  SlideTator.prototype.bindPrevAndNextButtons = function() {
    var next_button, previous_button,
      _this = this;
    previous_button = this.getJQueryObject(this.options.previous_button);
    next_button = this.getJQueryObject(this.options.next_button);
    previous_button.on('click', function() {
      return _this.previous();
    });
    return next_button.on('click', function() {
      return _this.next();
    });
  };

  SlideTator.prototype.getContainer = function() {
    if (typeof this.options.container === "string") {
      this.options.container = jQuery(this.options.container);
    }
    return this.options.container;
  };

  SlideTator.prototype.show = function(id) {
    return this.slideView.show(id);
  };

  SlideTator.prototype.next = function() {
    return this.slideView.next();
  };

  SlideTator.prototype.previous = function() {
    return this.slideView.previous();
  };

  SlideTator.prototype.getJQueryObject = function(element, relativeTo) {
    if (typeof element === "string") {
      return (relativeTo || this.getContainer()).find(element);
    } else if (element instanceof jQuery) {
      return element;
    } else {
      return jQuery(element);
    }
  };

  return SlideTator;

})();
