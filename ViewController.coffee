class module.exports extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.initialViewName ?= 'initialView'
		options.animationOptions ?= curve: "cubic-bezier(0.19, 1, 0.22, 1)", time: .7
		options.backgroundColor ?= "black"

		super options
		@history = []

		if options.initialView?
			@switchInstant options.initialView

		@on "change:subLayers", (changeList) ->
			view = changeList.added[0]
			view.on Events.Click, -> return # prevent click-through/bubbling
			unless view.name is options.initialViewName
				view.visible = false

	add: (view) -> view.superLayer = @

	saveCurrentToHistory: (incomingAnimation,outgoingAnimation) ->
		@history.unshift
			view: @current
			incomingAnimation: incomingAnimation
			outgoingAnimation: outgoingAnimation

	back: ->
		previous = @history[0]
		if previous.view?

			if previous.incomingAnimation.name is 'magicMove'
				@magicMove previous.view, previous.incomingAnimation.animationOptions
			else
				backIn = previous.outgoingAnimation.reverse()
				moveOut = previous.incomingAnimation.reverse()

				backIn.start()
				moveOut.start()

				@current = previous.view
				@history.shift()
				moveOut.on Events.AnimationEnd, => @current.bringToFront()

	applyAnimation: (newView, incoming, animationOptions, outgoing = {}) ->
		unless newView is @current

			newView.animateStop()
			# restore properties as they were 
			# before previous animation
			@current?.propsBeforeAnimation = @current.props
			newView.props = newView.propsBeforeAnimation

			# add as sublayer if not already in viewcontroller
			@addSubLayer newView if @subLayers.indexOf(newView) is -1
			
			# defaults
			newView.visible = true
			newView.point = {x: 0, y:0}

			# Animate the current view
			_.extend @current, outgoing.start
			outgoingAnimationObject =
				layer: @current
				properties: {}
			_.extend outgoingAnimationObject.properties, outgoing.end
			_.extend outgoingAnimationObject, animationOptions
			outgoingAnimation = new Animation(outgoingAnimationObject)
			outgoingAnimation.start()

			# Animate the new view
			_.extend newView, incoming.start
			incomingAnimationObject = 
				layer: newView
				properties: {}
			_.extend incomingAnimationObject.properties, incoming.end
			_.extend incomingAnimationObject, animationOptions
			incomingAnimation = new Animation(incomingAnimationObject)
			incomingAnimation.start()

			@saveCurrentToHistory incomingAnimation, outgoingAnimation
			@current = newView
			@current.bringToFront()

	### ANIMATIONS ###

	switchInstant: (newView) -> @fadeIn newView, time: 0

	slideIn: (newView, animationOptions = @animationOptions) -> 
		@slideInRight newView, animationOptions

	slideInLeft: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				x: -@width
			end:
				x: 0
		@applyAnimation newView, incoming, animationOptions

	slideInRight: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				x: @width
			end:
				x: 0
		@applyAnimation newView, incoming, animationOptions

	slideInDown: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				y: -@height
				x: 0
			end:
				y: 0
		@applyAnimation newView, incoming, animationOptions

	slideInUp: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				y: @height
				x: 0
			end:
				y: 0
		@applyAnimation newView, incoming, animationOptions

	fadeIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				opacity: 0
			end:
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	crossDissolve: (newView, animationOptions = @animationOptions) -> 
		@fadeIn newView, animationOptions
			
	zoomIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				scale: 0.8
				opacity: 0
			end:
				scale: 1
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	zoomedIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				scale: 1.5
				opacity: 0
			end:
				scale: 1
				opacity: 1
		@applyAnimation newView, incoming, animationOptions
		
	spinIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				rotation: 180
				scale: 0.8
				opacity: 0
			end:
				scale: 1
				opacity: 1
				rotation: 0
		@applyAnimation newView, incoming, animationOptions

	pushIn: (newView, animationOptions = @animationOptions) -> 
		@pushInRight newView, animationOptions

	pushInRight: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: 
				x: 0
			end:
				x: -(@width/5)
				brightness: 80
		incoming =
			start:
				brightness: 100
				x: @width
			end:
				x: 0
		@applyAnimation newView, incoming, animationOptions, outgoing

	pushInLeft: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: +(@width/5)
				brightness: 90
		incoming =
			start:
				x: -@width
			end:
				x: 0
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveIn: (newView, animationOptions = @animationOptions) -> 
		@moveInRight newView, animationOptions

	moveInRight: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: 
				x: 0
			end:
				x: -@width
		incoming =
			start:
				x: @width
			end:
				x: 0
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInLeft: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start:
				x: 0
			end:
				x: @width
		incoming =
			start:
				x: -@width
			end:
				x: 0
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInUp: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: 
				y: 0
			end:
				y: -@height
		incoming =
			start:
				x: 0
				y: @height
			end:
				y: 0
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInDown: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: 
				y: 0
			end:
				y: @height
		incoming =
			start:
				x: 0
				y: -@height
			end:
				y: 0
		@applyAnimation newView, incoming, animationOptions, outgoing

	magicMove: (newView, animationOptions = @animationOptions) ->

		# restore properties as they were 
		# before previous animation
		@current?.propsBeforeAnimation = @current.props
		newView.props = newView.propsBeforeAnimation

		traverseSubLayers = (layer) ->
			arr = []
			findSubLayer = (layer) ->
				for subLayer in layer.subLayers
					arr.push subLayer
					if subLayer.subLayers.length > 0
						findSubLayer subLayer
				return arr
			findSubLayer layer
		
		existingLayers = {}
		for sub in traverseSubLayers @current
			existingLayers[sub.name] = sub

		# proper switch with history support
		@addSubLayer newView if @subLayers.indexOf(newView) is -1
		newView.visible = true
		newView.point = {x:0, y:0}
		
		@saveCurrentToHistory 
			name: 'magicMove'
			animationOptions: animationOptions
		@current = newView
		@current.bringToFront()
		
		# fancy animations with magic move
		for newLayer in traverseSubLayers newView
			unless newLayer.originalFrame? then newLayer.originalFrame = newLayer.frame
			match = existingLayers[newLayer.name]
			if match?
				prevFrame = match.frame
				animationObj = 
					properties: newLayer.props
				simulatedProps = match.props
				delete simulatedProps['image']
				newLayer.props = simulatedProps
			else # fade in new layers
				newLayer.opacity = 0
				animationObj = 
					properties:
						opacity: 1
			_.extend animationObj, animationOptions
			newLayer.animate animationObj
			delete existingLayers[newLayer.name]

		# fade out unused layers
		for remainingLayer, layer of existingLayers
			tempCopy = layer.copy()
			tempCopy.superLayer = newView
			animationObj = 
					properties:
						opacity: 0
			_.extend animationObj, animationOptions
			fadeOut = tempCopy.animate animationObj
			tempCopy.on Events.AnimationEnd, -> @destroy()


	# Backwards compatibility with https://github.com/chriscamargo/framer-viewNavigationController
	transition: (newView, direction = 'right') ->
		switch direction
			when 'up' then @moveInDown newView
			when 'right' then @pushInRight newView
			when 'down' then @moveInUp newView
			when 'left' then @pushInLeft newView