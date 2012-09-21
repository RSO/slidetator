class FadingSlideView extends CrossFadingSlideView
  show: (id, callback) ->
    if id is @current
      return

    current = @elements.eq(@current)

    current.fadeOut @options.fade_out_time, =>
      @elements.eq(id).fadeIn @options.fade_in_time, callback

    @current = id

    @showRegions()
