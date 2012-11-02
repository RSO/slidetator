class CrossFadingSlideView extends DefaultSlideView
  constructor: (@elements, @current, @options, @container) ->
    @elements.eq(@current).siblings().css 'display', 'none'

    @showRegions()

  show: (id, callback) ->
    if id is @current
      return

    current = @elements.eq(@current)

    current.css 'z-index', 2

    @elements.eq(id).css 'z-index': 1, 'display': 'block'

    current.fadeOut(callback)

    @current = id

    @showRegions()

    @updateActiveClasses()
