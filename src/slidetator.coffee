class SlideTator
  constructor: (@options) ->
    if @shouldBindButtons()
      @bindPrevAndNextButtons()

    @current = 0

    @elements = @getJQueryObject @options.slides

    @slideView = new @options.slide_view @elements, @current, @options, @getContainer()

  shouldBindButtons: ->
    "previous_button" of @options and "next_button" of @options

  bindPrevAndNextButtons: ->
    previous_button = @getJQueryObject @options.previous_button
    next_button = @getJQueryObject @options.next_button

    previous_button.on 'click', => @previous()
    next_button.on 'click', => @next()

  getContainer: ->
    if typeof @options.container is "string"
      @options.container = jQuery(@options.container)

    @options.container

  show: (id) -> @slideView.show id
  next: -> @slideView.next()
  previous: -> @slideView.previous()

  getJQueryObject: (element, relativeTo) ->
    if typeof element is "string"
      (relativeTo || @getContainer()).find(element)
    else if element instanceof jQuery
      element
    else
      jQuery element
