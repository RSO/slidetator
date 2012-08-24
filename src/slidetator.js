/*
 * slidetator
 * https://github.com/vergil/slidetator
 *
 * Copyright (c) 2012 Remon Oldenbeuving
 * Licensed under the MIT, GPL licenses.
 */

(function($) {

  // Collection method.
  $.fn.awesome = function() {
    return this.each(function() {
      $(this).html('awesome');
    });
  };

  // Static method.
  $.awesome = function() {
    return 'awesome';
  };

  // Custom selector.
  $.expr[':'].awesome = function(elem) {
    return elem.textContent.indexOf('awesome') >= 0;
  };

}(jQuery));
