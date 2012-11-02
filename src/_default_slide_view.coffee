class DefaultSlideView
  constructor: (@elements, @current, @options, @container) ->
    @show @current

  nextIndex: ->
    next = @current + 1

    if next > @elements.length - 1
      next = 0

    next

  previousIndex: ->
    previous = @current - 1

    if previous < 0
      previous = @elements.length - 1

    previous

  next: (callback) ->
    @show @nextIndex(), callback

  previous: (callback) ->
    @show @previousIndex(), callback

  show: (id, callback) ->
    @elements.hide().eq(id).show()

    @current = id

    @showRegions()

    @updateActiveClasses()

    callback()

  updateActiveClasses: ->
    @elements.removeClass('next current previous')

    @elements.eq(@nextIndex()).addClass('next')
    @elements.eq(@previousIndex()).addClass('previous')
    @elements.eq(@current).addClass('current')

  showRegions: ->
    @showRegion region for region in @options.regions

  showRegion: (region) ->
    current = @elements.eq(@current)

    dest = @getJQueryObject(region.dest, @container)
    subject = @getJQueryObject(region.selector, current)

    console.info dest, subject

    dest.html subject.html()

  getJQueryObject: (element, relativeTo) ->
    if typeof element is "string"
      ( relativeTo || $() ).find(element)
    else if element instanceof jQuery
      element
    else
      jQuery element
