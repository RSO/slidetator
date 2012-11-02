class SlideTator
  constructor: (@options) ->
    if @shouldBindButtons()
      @bindPrevAndNextButtons()

    @current = 0

    @elements = @getJQueryObject @options.slides

    @slideView = new @options.slide_view(@elements, @current, @options, @getContainer())

    if @options.auto_start is true
      @getContainer().on 'mouseenter', => @stop()
      @getContainer().on 'mouseleave', => @start()

      @start()

  shouldBindButtons: ->
    "previous_button" of @options and "next_button" of @options

  bindPrevAndNextButtons: ->
    previous_button = @getJQueryObject @options.previous_button
    next_button = @getJQueryObject @options.next_button

    previous_button.on 'click', =>
      @stop()
      @previous(=> @start())

    next_button.on 'click', =>
      @stop()
      @next(=> @start())

  getContainer: ->
    if typeof @options.container is "string"
      @options.container = jQuery(@options.container)

    @options.container

  show: (id) ->
    @slideView.show id
  next: (callback) ->
    @getContainer().trigger('before:show')

    @slideView.next =>
      @getContainer().trigger('after:show')
      callback()
  previous: (callback) ->
    @getContainer().trigger('before:show')

    @slideView.previous =>
      @getContainer().trigger('after:show')
      callback()

  start: ->
    @run() unless @started is true

  run: ->
    @started = true

    @_timeOut = setTimeout ( => @next( => @run() ) ), @options.delay

  stop: ->
    @started = false
    clearTimeout @_timeOut

  getJQueryObject: (element, relativeTo) ->
    if typeof element is "string"
      (relativeTo || @getContainer()).find(element)
    else if element instanceof jQuery
      element
    else
      jQuery element
