/*! SlideTator - v0.2.0 - 2012-11-02
* https://github.com/vergil/slidetator
* Copyright (c) 2012 Remon Oldenbeuving, Mark Haasjes; Licensed MIT, GPL */

var DefaultSlideView;

DefaultSlideView = (function() {

  function DefaultSlideView(elements, current, options, container) {
    this.elements = elements;
    this.current = current;
    this.options = options;
    this.container = container;
    this.show(this.current);
  }

  DefaultSlideView.prototype.nextIndex = function() {
    var next;
    next = this.current + 1;
    if (next > this.elements.length - 1) {
      next = 0;
    }
    return next;
  };

  DefaultSlideView.prototype.previousIndex = function() {
    var previous;
    previous = this.current - 1;
    if (previous < 0) {
      previous = this.elements.length - 1;
    }
    return previous;
  };

  DefaultSlideView.prototype.next = function(callback) {
    return this.show(this.nextIndex(), callback);
  };

  DefaultSlideView.prototype.previous = function(callback) {
    return this.show(this.previousIndex(), callback);
  };

  DefaultSlideView.prototype.show = function(id, callback) {
    this.elements.hide().eq(id).show();
    this.current = id;
    this.showRegions();
    this.updateActiveClasses();
    return callback();
  };

  DefaultSlideView.prototype.updateActiveClasses = function() {
    this.elements.removeClass('next current previous');
    this.elements.eq(this.nextIndex()).addClass('next');
    this.elements.eq(this.previousIndex()).addClass('previous');
    return this.elements.eq(this.current).addClass('current');
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

var CrossFadingSlideView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

CrossFadingSlideView = (function(_super) {

  __extends(CrossFadingSlideView, _super);

  function CrossFadingSlideView(elements, current, options, container) {
    this.elements = elements;
    this.current = current;
    this.options = options;
    this.container = container;
    this.elements.eq(this.current).siblings().css('display', 'none');
    this.showRegions();
  }

  CrossFadingSlideView.prototype.show = function(id, callback) {
    var current;
    if (id === this.current) {
      return;
    }
    current = this.elements.eq(this.current);
    current.css('z-index', 2);
    this.elements.eq(id).css({
      'z-index': 1,
      'display': 'block'
    });
    current.fadeOut(this.options.fade_out_time, callback);
    this.current = id;
    this.showRegions();
    return this.updateActiveClasses();
  };

  return CrossFadingSlideView;

})(DefaultSlideView);

var FadingSlideView,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

FadingSlideView = (function(_super) {

  __extends(FadingSlideView, _super);

  function FadingSlideView() {
    return FadingSlideView.__super__.constructor.apply(this, arguments);
  }

  FadingSlideView.prototype.show = function(id, callback) {
    var current,
      _this = this;
    if (id === this.current) {
      return;
    }
    current = this.elements.eq(this.current);
    current.fadeOut(this.options.fade_out_time, function() {
      return _this.elements.eq(id).fadeIn(_this.options.fade_in_time, callback);
    });
    this.current = id;
    this.showRegions();
    return this.updateActiveClasses();
  };

  return FadingSlideView;

})(CrossFadingSlideView);

var SlideTator;

SlideTator = (function() {

  function SlideTator(options) {
    var _this = this;
    this.options = options;
    if (this.shouldBindButtons()) {
      this.bindPrevAndNextButtons();
    }
    this.current = 0;
    this.elements = this.getJQueryObject(this.options.slides);
    this.slideView = new this.options.slide_view(this.elements, this.current, this.options, this.getContainer());
    if (this.options.auto_start === true) {
      this.getContainer().on('mouseenter', function() {
        return _this.stop();
      });
      this.getContainer().on('mouseleave', function() {
        return _this.start();
      });
      this.start();
    }
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
      _this.stop();
      return _this.previous(function() {
        return _this.start();
      });
    });
    return next_button.on('click', function() {
      _this.stop();
      return _this.next(function() {
        return _this.start();
      });
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

  SlideTator.prototype.next = function(callback) {
    var _this = this;
    this.getContainer().trigger('before:show', 'next');
    return this.slideView.next(function() {
      _this.getContainer().trigger('after:show', 'next');
      return callback();
    });
  };

  SlideTator.prototype.previous = function(callback) {
    var _this = this;
    this.getContainer().trigger('before:show', 'previous');
    return this.slideView.previous(function() {
      _this.getContainer().trigger('after:show', 'previous');
      return callback();
    });
  };

  SlideTator.prototype.start = function() {
    if (this.started !== true) {
      return this.run();
    }
  };

  SlideTator.prototype.run = function() {
    var _this = this;
    this.started = true;
    return this._timeOut = setTimeout((function() {
      return _this.next(function() {
        return _this.run();
      });
    }), this.options.delay);
  };

  SlideTator.prototype.stop = function() {
    this.started = false;
    return clearTimeout(this._timeOut);
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
