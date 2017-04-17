## ViewController-for-Framer
The ViewController module for Framer.js helps you create multi step user flows with pre-made transitions like "fade in", "zoom in" and "slide in". It consists of a Framer module and an optional [Sketch plugin](#sketch). Check out the intro article on [Medium](https://uxdesign.cc/create-ui-flows-using-sketch-and-framer-36b6552306b5#.4j5idvu0r).

![framerdemo](http://cl.ly/0a1y073v3A0L/2016-04-30%2009_59_07.gif)

[Try the demo protoype](http://share.framerjs.com/un1di17cqs6u/)

### <a name="gettingstarted"> </a>Getting started

The ViewController module makes it easy to create larger UI flows inside Framer. To get started,  [download](https://github.com/awt2542/ViewController-for-Framer/archive/master.zip) the ViewController.coffee file and put inside your project's modules folder. Then follow these steps:

**Step 1** Create a new ViewController

```coffeescript
ViewController = require 'ViewController'
Views = new ViewController
	initialView: sketch.home
```

**Step 2** Call one of the [supported transitions](#transitions) to switch view or use the [Sketch plugin](#sketch) to generate links.

```coffeescript
sketch.home.onClick -> Views.slideInLeft(sketch.menu)
```

### <a name="transitions"> </a>Available transitions

Transitions are trigged by using one of the transition methods. Eg. `Views.fadeIn(anotherLayer)`. Each transition accepts an animationOption object as the second argument. Eg. `Views.fadeIn(anotherLayer, time: 2)`

| Transition        | Demo        
| ------------- 		|-------------| 
| .switchInstant() 	|![fadeIn](http://cl.ly/2f0S4026411g/switchInstant.gif)|
| .slideInUp() 		|![fadeIn](http://cl.ly/0d350p25132M/slideInUp.gif)|
| .slideInRight() 	|![fadeIn](http://cl.ly/3p3c2d122n1c/slideInRight.gif)|
| .slideInDown() 	|![fadeIn](http://cl.ly/0u3o2I463428/slideInDown.gif)|
| .slideInLeft() 	|![fadeIn](http://cl.ly/3O0o0e0X1R3H/slideInLeft.gif)|
| .slideOutUp() 		|![fadeIn](http://cl.ly/3S2u3P09262T/slideOutUp.gif)|
| .slideOutRight() 	|![fadeIn](http://cl.ly/1W031x3k0025/slideOutRight.gif)|
| .slideOutDown() 	|![fadeIn](http://cl.ly/2t2m2c1w2W0t/slideOutDown.gif)|
| .slideOutLeft() 	|![fadeIn](http://cl.ly/1L0u2u0J2P1o/slideOutLeft.gif)|
| .moveInRight() 	|![fadeIn](http://cl.ly/3W1H3n400E0m/moveInRight.gif)|
| .moveInLeft() 		|![fadeIn](http://cl.ly/0K0B2A0e1A1U/moveInLeft.gif)|
| .moveInUp() 	||
| .moveInDown() 	||
| .pushInRight() 	|![fadeIn](http://cl.ly/181l1T08372m/pushInRight.gif)|
| .pushInLeft() 		|![fadeIn](http://cl.ly/0a003K0e0v1t/pushInLeft.gif)|
| .pushOutRight() 	|![fadeIn](http://cl.ly/0Z3R1W2s3o1A/pushOutRight.gif)|
| .pushOutLeft() 	|![fadeIn](http://cl.ly/0n3M0C113B3p/pushOutLeft.gif)|
| .fadeIn() 			|![fadeIn](http://cl.ly/3w3X2c080X3q/fadeIn.gif)|
| .zoomIn() 			|![fadeIn](http://cl.ly/191u2B3U0X13/zoomIn.gif)|
| .zoomOut() 			|![fadeIn](http://cl.ly/2w3d3O0F121g/zoomOut.gif)|


### Properties and methods


#### .initialView

Set the initial view

```coffeescript
Views = new ViewController
	initialView: sketch.home
```

#### .initialViewName

Set the initial view based on a layer name. In the following example, the layer named "initialView" will automatically be set as the initialView. 

```coffeescript
Views = new ViewController
	initialViewName: "initialView" # default value
```

#### .currentView

Returns the current view

```coffeescript
Views = new ViewController
	initialView: sketch.home
Views.slideIn(sketch.menu)
print Views.currentView # returns sketch.menu
```

#### .previousView

Returns the previous view

```coffeescript
Views = new ViewController
	initialView: sketch.home
Views.slideIn(sketch.menu)
print Views.previousView # returns sketch.home
```

#### .history

Returns the full history of the ViewController in an array

```coffeescript
Views = new ViewController
	initialView: sketch.home
Views.slideIn(sketch.menu)
Views.slideIn(sketch.profile)
print Views.history
```

#### .back()

Go back one step in history and reverse the animation.

```coffeescript
Views = new ViewController
	initialView: sketch.home
Views.slideIn(sketch.menu)
sketch.btn.onClick -> Views.back() # animates back to sketch.home
```

#### .animationOptions

Default animation options for all transitions inside the ViewController.

```coffeescript
Views = new ViewController
	animationOptions:
		time: .8
		curve: "ease-in-out"
```

#### <a name="autolink"> </a> .autoLink

automatically create onClick-links based on layer names according to the format: transitionName\_viewName. For example, renaming the "home" layer inside Sketch to slideInRight\_menu would be equivalent to the following code: 

```coffeescript
sketch.home.onClick -> Views.slideInRight(menu)
```

To get started, just create a new ViewController and import a Sketch file with properly named layers. autoLink is "true" by default.

See [available transitions](#transitions) and the separate [sketch plugin](#sketch) that helps you with renaming your layers.

Example project: [http://share.framerjs.com/owauo3t6i7al/](http://share.framerjs.com/owauo3t6i7al/)

#### .backButtonName

Layers matching this name will automatically call .back() on click. Defaults to "backButton"

#### .scroll (experimental)

Automatically adds scroll components to each view. If a view is larger than the ViewController, it will automatically enable scrollHorizontal and/or scrollVertical. Defaults to "false".

### Events


#### change:currentView

Triggered when the currentView changes

```coffeescript
Views.onChange "currentView", (current) -> 
	print "new view is: "+current.name
```

#### change:previousView

Triggered when the previousView changes

```coffeescript
Views.onChange "previousView", (previous) -> 
	print "previous view is: "+previous.name
```

#### ViewWillSwitch

Triggered before a transition starts

```coffeescript
Views.onViewWillSwitch (oldView, newView) ->
	print oldView,newView
```

#### ViewDidSwitch

Triggered after a transition has finished

```coffeescript
Views.onViewDidSwitch (oldView, newView) ->
	print oldView,newView
```

### <a name="sketch"> </a> Sketch plugin

![sketchPlugin](http://cl.ly/0y0s0M451Q2K/ScreenFlowDemo.gif)

If you have [autoLink](#autolink) enabled in your ViewController (enabled by default) you can create links by renaming your layers according to the format: transitionName_viewName. This plugin makes renaming layers slightly more convenient.

1. Select two layers, one button and one view (eg. an artboard)
2. Run the plugin and choose one of the available transitions
3. Import the changes to Framer
4. Set up a ViewController in your project according to the [Getting Started guide](#gettingstarted)

Get the plugin here: [https://github.com/awt2542/ViewController-for-Framer/archive/master.zip](https://github.com/awt2542/ViewController-for-Framer/archive/master.zip)

### Example prototypes

- [Basic example](http://share.framerjs.com/un1di17cqs6u/)
- [autoLink example](http://share.framerjs.com/owauo3t6i7al/)


### Contact

Twitter: [@andreaswah](http://twitter.com/andreaswah)

Thanks to Chris for the [original inspiration](https://github.com/chriscamargo/framer-viewNavigationController) for this module and to Stephen, Jordan, Jason, Koen, Fran & Marc for early feedback. Also thanks to Invision for the excellent UI kit used in the examples: [Do UI kit](https://www.invisionapp.com/do)
