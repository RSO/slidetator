class FadingSlideView extends DefaultSlideView
  constructor: (@elements, @current, @options, @container) ->
    @elements.css 'z-index', 1
    @elements.eq(@current).css 'z-index', 2

    @showRegions()

  show: (id) ->
    if id is @current
      return

    current = @elements.eq(@current)

    current.css 'z-index', 3

    current.siblings().css 'z-index', 1

    @elements.eq(id).css 'z-index', 2

    current.fadeOut =>
      @elements.show().css('z-index', 1).eq(id).css('z-index', 2)

    @current = id

    @showRegions()
