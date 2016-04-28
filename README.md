## ViewController-for-Framer
The ViewController module for Framer.js helps you create multi step user flows with pre-made transitions like "fade in", "zoom in" and "slide in". It consists of a Framer module and an optional [Sketch plugin](#sketch).

![framerdemo](http://cl.ly/0L2H2M1Q0t2R/viewcontrollerdemo.gif)

[Try the demo protoype](http://share.framerjs.com/9a7jker13tm7/)


The ViewController module makes it easy to create larger UI flows inside Framer. To get started, download the ViewController.coffee file and put inside your project's modules folder. Then follow these steps:

**Step 1** Create a new ViewController

```coffeescript
ViewController = require 'ViewController'
Views = new ViewController
	initialView: sketch.home
```

**Step 2** Call one of the [supported transitions](#transitions) to switch view

```coffeescript
ViewController = require 'ViewController'
Views = new ViewController
	initialView: sketch.home
sketch.home.onClick -> Views.slideInLeft(sketch.menu)
```


### <a name="transitions"> </a>Available transitions

Transitions are trigged by using one of the transition methods. Eg. `Views.fadeIn(anotherLayer)`. Each transition accepts an animationOption object as the second argument. Eg. `Views.fadeIn(anotherLayer, time: 2)`

| Transition        | Demo        
| ------------- 		|-------------| 
| .fadeIn()			|![fadeIn](http://cl.ly/3w3X2c080X3q/fadeIn.gif)|
| .switchInstant() 	|![fadeIn](http://cl.ly/2f0S4026411g/switchInstant.gif)|
| .slideInUp() 		|![fadeIn](http://cl.ly/0d350p25132M/slideInUp.gif)|
| .slideInRight() 	|![fadeIn](http://cl.ly/3p3c2d122n1c/slideInRight.gif)|
| .slideInDown() 	|![fadeIn](http://cl.ly/0u3o2I463428/slideInDown.gif)|
| .slideInLeft() 	|![fadeIn](http://cl.ly/3O0o0e0X1R3H/slideInLeft.gif)|
| .slideOutUp() 		|![fadeIn](http://cl.ly/3S2u3P09262T/slideOutUp.gif)|
| .slideOutRight() 	|![fadeIn](http://cl.ly/1W031x3k0025/slideOutRight.gif)|
| .slideOutDown() 	|![fadeIn](http://cl.ly/2t2m2c1w2W0t/slideOutDown.gif)|
| .slideOutLeft() 	|![fadeIn](http://cl.ly/1L0u2u0J2P1o/slideOutLeft.gif)|
| .fadeIn() 			|![fadeIn](http://cl.ly/3w3X2c080X3q/fadeIn.gif)|
| .fadeOut() 			|![fadeIn](http://cl.ly/1K3Q0F3h1k2Y/fadeOut.gif)|
| .zoomIn() 			|![fadeIn](http://cl.ly/191u2B3U0X13/zoomIn.gif)|
| .zoomOut() 			|![fadeIn](http://cl.ly/2w3d3O0F121g/zoomOut.gif)|


### Properties and methods


####.initialView

Set the initial view

```coffeescript
Views = new ViewController
	initialView: sketch.home
```

####.initialViewName

Set the initial view based on a layer name. In the following example, the layer named "initialView" will automatically be set as the initialView. 

```coffeescript
Views = new ViewController
	initialViewName: "initialView" # default value
```

####.currentView

Returns the current view

```coffeescript
Views = new ViewController
	initialView: sketch.home
Views.slideIn(sketch.menu)
print Views.currentView # returns sketch.menu
```

####.back()

Go back one step in history and reverse the animation.

```coffeescript
Views = new ViewController
	initialView: sketch.home
Views.slideIn(sketch.menu)
sketch.btn.onClick -> Views.back() # animates back to sketch.home
```

####.animationOptions

Default animation options for all transitions inside the ViewController.

```coffeescript
Views = new ViewController
	animationOptions:
		time: .8
		curve: "ease-in-out"
```

#### <a name="autolink"> </a> .autoLink

automatically create links based on layer names according to the format: transitionName\_viewName. For example, renaming the "home" layer inside Sketch to slideInRight\_menu would be equivalent to the following code: 

```coffeescript
sketch.home.onClick -> Views.slideInRight(menu)
```

See [available transitions](#transitions) and the separate [sketch plugin](#sketch) that helps you with renaming your layers.

Example project: [http://share.framerjs.com/qzxwtystb9vb/](http://share.framerjs.com/qzxwtystb9vb/)

####.backButtonName

Layers matching this name will automatically call .back() on click. Defaults to "backButton"

####.scroll (experimental)

Automatically adds scroll components to each view. If a view is larger than the ViewController, it will automatically enable scrollHorizontal and/or scrollVertical. Defaults to "false".

### <a name="sketch"> </a> Sketch plugin

![sketchPlugin](http://cl.ly/0y0s0M451Q2K/ScreenFlowDemo.gif)

If you have [autoLink](#autolink) enabled in your ViewController (enabled by default) you can create links by renaming your layers according to the format: transitionName_viewName. This plugin makes renaming layers slightly more convenient.

1. Select two layers, one button and one view (eg. an artboard)
2. Run the plugin and choose one of the available transitions
3. Done! Your button layer has been renamed. Now re-import the changes to Framer


### Example prototypes

- [Basic example](http://share.framerjs.com/9a7jker13tm7/)
- [autoLink example](http://share.framerjs.com/qzxwtystb9vb/)


###Contact

Twitter: [@andreaswah](http://twitter.com/andreaswah)
