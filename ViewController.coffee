class module.exports extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.initialViewName ?= 'initialView'
		options.backButtonName ?= 'backButton'
		options.animationOptions ?= curve: "cubic-bezier(0.19, 1, 0.22, 1)", time: .7
		options.backgroundColor ?= "black"
		options.scroll ?= false
		options.autoLink ?= true

		super options
		@history = []

		@onChange "subLayers", (changeList) =>
			view = changeList.added[0]
			if view?
				# default behaviors for views
				view.clip = true
				view.on Events.Click, -> return # prevent click-through/bubbling
				# add scrollcomponent
				if @scroll
					children = view.children
					scrollComponent = new ScrollComponent
						name: "scrollComponent"
						width: @width
						height: @height
						parent: view
					scrollComponent.content.backgroundColor = ""
					if view.width <= @width
						scrollComponent.scrollHorizontal = false
					if view.height <= @height
						scrollComponent.scrollVertical = false
					for c in children
						c.parent = scrollComponent.content
					view.scrollComponent = scrollComponent # make it accessible as a property
				# reset size since content moved to scrollComponent. prevents scroll bug when dragging outside.
				view.size = {width: @width, height: @height}

		transitions =
			switchInstant:
				newView:
					to: {x: 0, y: 0}
			fadeIn:
				newView:
					from: {opacity: 0}
					to: {opacity: 1}
			slideInUp:
				newView:
					from: {y: @height}
					to: {y: 0}
			slideInRight:
				newView:
					from: {x: @width}
					to: {x: 0}
			slideInDown:
				newView:
					from: {maxY: 0}
					to: {y: 0}
			slideInLeft:
				newView:
					from: {maxX: 0}
					to: {maxX: @width}
			slideOutUp:
				oldView:
					to: {maxY: 0}
			slideOutRight:
				oldView:
					to: {maxX: 0}
			slideOutDown:
				oldView:
					to: {y: @height}
			slideOutLeft:
				oldView:
					to: {x: @width}

		# shortcuts
		transitions.slideIn = transitions.slideInRight

		_.each transitions, (animProps, name) =>

			if options.autoLink
				layers = Framer.CurrentContext.getLayers()
				for btn in layers
					if _.contains btn.name, name
						viewController = @
						btn.onClick ->
							anim = @name.split('_')[0]
							linkName = @name.replace(anim+'_','')
							viewController[anim] _.find(layers, (l) -> l.name is linkName)

			@[name] = (newView, animationOptions = @animationOptions) =>

				if newView is @current then return

				unless @current? then @current = newView # quick fix

				# reset before animation
				newView.point = {x:0,y: 0}
				newView.opacity = 1

				# oldView
				@current.props = animProps.oldView?.from
				outgoing = @current.animate _.extend animationOptions, {properties: animProps.oldView?.to}

				# newView
				newView.props = animProps.newView?.from
				incoming = newView.animate _.extend animationOptions, {properties: animProps.newView?.to}

				# layer order
				newView.parent = @
				if animProps.newView?
					newView.placeBefore(@current)
				else
					newView.placeBehind(@current)
				
				@saveCurrentToHistory outgoing, incoming
				@current = newView
				@emit("change:current", @current)

		if options.initialViewName?
			autoInitial = _.find Framer.CurrentContext.getLayers(), (l) -> l.name is options.initialViewName
			if autoInitial? then @switchInstant autoInitial

		if options.initialView?
			@switchInstant options.initialView

		if options.backButtonName?
			backButtons = _.filter Framer.CurrentContext.getLayers(), (l) -> _.contains l.name, options.backButtonName
			for btn in backButtons
				btn.onClick => @back()

	saveCurrentToHistory: (outgoingAnimation,incomingAnimation) ->
		@history.unshift
			view: @current
			incomingAnimation: incomingAnimation
			outgoingAnimation: outgoingAnimation

	back: ->
		previous = @history[0]
		if previous.view?

			backIn = previous.outgoingAnimation.reverse()
			moveOut = previous.incomingAnimation.reverse()

			backIn.start()
			moveOut.start()

			@current = previous.view
			@history.shift()
			moveOut.on Events.AnimationEnd, => @current.bringToFront()
