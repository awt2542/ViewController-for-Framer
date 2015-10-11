# TODO:
# Add custom animationOptions to .back()?
# Add "moveOut" animations? what's the use case? covered by back?
# If no need for moveOut, maybe we wont need consistent "In" naming scheme

class exports.ViewController extends Layer
		
	constructor: (options={}) ->
		options.width ?= Screen.width
		options.height ?= Screen.height
		options.clip ?= true
		options.initialViewName ?= 'initialView'
		options.animationOptions ?= curve: "cubic-bezier(0.19, 1, 0.22, 1)", time: .7
		options.backgroundColor ?= "black"
		options.perspective ?= 1000

		super options
		@history = []
		@on "change:subLayers", (changeList) ->
			if changeList.added[0].name is options.initialViewName
				@switchInstant changeList.added[0]
			else
				changeList.added[0].x = @width

		if options.initialView?
			@switchInstant options.initialView

	add: (view, point = {x:0, y:0}, viaInternalChangeEvent = false) ->
		if viaInternalChangeEvent
			@switchInstant view
		else
			view.superLayer = @
		view.on Events.Click, -> return # prevent click-through/bubbling
		view.originalPoint = point
		view.point = point
		view.sendToBack()
		
	saveCurrentToHistory: (incomingAnimation,outgoingAnimation) ->
		@history.unshift
			view: @current
			incomingAnimation: incomingAnimation
			outgoingAnimation: outgoingAnimation

	back: -> 
		previous = @history[0]
		if previous.view?

			if previous.incomingAnimation is 'magicMove'
				return @magicMove previous.view
			else
				backIn = previous.outgoingAnimation.reverse()
				moveOut = previous.incomingAnimation.reverse()

				# Switch which animation that should carry the delay, if any
				moveOutDelay = moveOut.options.delay
				moveOut.options.delay = backIn.options.delay
				backIn.options.delay = moveOutDelay

				backIn.start()
				moveOut.start()

				@current = previous.view
				@history.shift()
				moveOut.on Events.AnimationEnd, =>
					@current.bringToFront()

	applyAnimation: (newView, incoming, animationOptions, outgoing = {}) ->
		unless newView is @current

			# reset common properties in case they
			# were changed during last animation
			#@current.z = 0
			newView.visible = true
			newView.brightness = 100
			newView.opacity = 1
			newView.scale = 1

			@add newView if @subLayers.indexOf(newView) is -1

			# Animate the current view
			_.extend @current, outgoing.start
			outgoingAnimationObject =
				layer: @current
				properties: {}
			outgoingAnimationObject.delay = outgoing.delay
			_.extend outgoingAnimationObject.properties, outgoing.end
			_.extend outgoingAnimationObject, animationOptions
			outgoingAnimation = new Animation(outgoingAnimationObject)
			outgoingAnimation.start()

			# Animate the new view
			_.extend newView, incoming.start
			incomingAnimationObject = 
				layer: newView
				properties: {}
			incomingAnimationObject.delay = incoming.delay
			_.extend incomingAnimationObject.properties, incoming.end
			_.extend incomingAnimationObject, animationOptions
			incomingAnimation = new Animation(incomingAnimationObject)
			incomingAnimation.start()

			@saveCurrentToHistory incomingAnimation, outgoingAnimation
			@current = newView
			@current.bringToFront()

	getPoint: (view, point) -> view.originalPoint || {x:0,y:0}

	### ANIMATIONS ###

	switchInstant: (newView) -> @fadeIn newView, time: 0

	slideIn: (newView, animationOptions = @animationOptions) -> 
		@slideInRight newView, animationOptions

	slideInLeft: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				x: -@width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions

	slideInRight: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				x: @width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions

	slideInDown: (newView, animationOptions = @animationOptions) -> 
		incoming =
			start:
				y: -@height
				x: 0
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions

	slideInUp: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				y: @height
				x: 0
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions

	fadeIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: @getPoint(newView).x
				y: @getPoint(newView).y
				opacity: 0
			end:
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	crossDissolve: (newView, animationOptions = @animationOptions) ->
		@fadeIn newView, animationOptions

	fadeInBlack: (newView, animationOptions = @animationOptions) ->
		midAnimationTime = 
		outgoing =
			start:
				brightness: 100
			end:
				brightness: 0
			delay: 0
		incoming =
			start:
				brightness: 0
				opacity: 0
				x: @getPoint(newView).x
				y: @getPoint(newView).y
			end:
				brightness: 100
				opacity: 1
			delay: animationOptions.time/1.5
		@applyAnimation newView, incoming, animationOptions, outgoing
			
	zoomIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				y: 0
				scale: 0.8
				opacity: 0
			end:
				scale: 1
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	zoomedIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				y: 0
				scale: 1.5
				opacity: 0
			end:
				scale: 1
				opacity: 1
		@applyAnimation newView, incoming, animationOptions

	flipIn: (newView, animationOptions = @animationOptions) -> 
		@flipInRight newView, animationOptions

	flipInRight: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: @width/2
				z: @width
				rotationY: 100
			end:
				x: @getPoint(newView).x
				rotationY: 0
				z: 0
		@applyAnimation newView, incoming, animationOptions

	flipInLeft: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: -@width/2
				z: @width
				rotationY: -100
			end:
				x: @getPoint(newView).x
				rotationY: 0
				z: 0
		@applyAnimation newView, incoming, animationOptions

	flipInUp: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				z: @height
				y: @height
				rotationX: -100
			end:
				y: @getPoint(newView).y
				rotationX: 0
				z: 0
		@applyAnimation newView, incoming, animationOptions
		
	spinIn: (newView, animationOptions = @animationOptions) ->
		incoming =
			start:
				x: 0
				y: 0
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
			start: {}
			end:
				x: -(@width/5)
				brightness: 80
		incoming =
			start:
				brightness: 100
				x: @width
			end:
				x: @getPoint(newView).x
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
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveIn: (newView, animationOptions = @animationOptions) -> 
		@moveInRight newView, animationOptions

	moveInRight: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: -@width
		incoming =
			start:
				x: @width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInLeft: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				x: @width
		incoming =
			start:
				x: -@width
			end:
				x: @getPoint(newView).x
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInUp: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				y: -@height
		incoming =
			start:
				x: 0
				y: @height
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions, outgoing

	moveInDown: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				y: @height
		incoming =
			start:
				x: 0
				y: -@height
			end:
				y: @getPoint(newView).y
		@applyAnimation newView, incoming, animationOptions, outgoing

	modal: (newView, animationOptions = @animationOptions) ->
		outgoing =
			start: {}
			end:
				scale: 0.9
		incoming =
			start:
				x: 0
				y: @height
			end:
				y: if newView.originalPoint? then newView.originalPoint.y else @height/10
		@applyAnimation newView, incoming, animationOptions, outgoing

	magicMove: (newView, animationOptions = @animationOptions) ->

		traverseSubLayers = (layer) ->
			arr = []
			findSubLayer = (layer) ->
				for subLayer in layer.subLayers
					arr.push subLayer
					if subLayer.subLayers.length > 0
						findSubLayer subLayer
				return arr
			findSubLayer layer
		
		exisitingLayers = {}
		for sub in traverseSubLayers @current
			exisitingLayers[sub.name] = sub
		
		# proper switch with history support
		newView.x = @getPoint(newView).x
		newView.y = @getPoint(newView).y
		@add newView if @subLayers.indexOf(newView) is -1
		@saveCurrentToHistory 'magicMove'
		@current = newView
		@current.bringToFront()
		
		# fancy animations with magic move
		for sub in traverseSubLayers newView
			if exisitingLayers[sub.name]?
				match = exisitingLayers[sub.name]
				newFrame = sub.frame
				prevFrame = match.frame
				sub.frame = prevFrame
				animationObj = 
					properties:
						x: newFrame.x
						y: newFrame.y
						width: newFrame.width
						height: newFrame.height
						opacity: 1
			else # fade in new layers
				sub.opacity = 0
				animationObj = 
					properties:
						opacity: 1
			_.extend animationObj, animationOptions
			sub.animate animationObj

	# Backwards compatibility
	transition: (newView, direction = 'right') ->
		switch direction
			when 'up' then @moveInDown newView
			when 'right' then @pushInRight newView
			when 'down' then @moveInUp newView
			when 'left' then @pushInLeft newView