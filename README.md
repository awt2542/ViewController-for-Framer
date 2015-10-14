## ViewController-for-Framer
The ViewController module for Framer.js helps you create multi step user flows with pre-made transitions like "fade in" and "magic move".

![multistep](https://s3.amazonaws.com/f.cl.ly/items/3p1T3o1h3m433m3u0v3N/steps.png)

### Examples

- [iOS-style navigation](http://share.framerjs.com/dutzrzfvszto/)
- [Image grid with magic move](http://share.framerjs.com/odobqcb9vjoi/)

### Get started
1. Download the ViewController.coffee file to your project's modules folder and add
`
Views = require 'ViewController'
` to the top of your app.coffee file.

2. Set the initial view by writing `Views.initialView = sketch.homepage`. 

3. Switch view using one of the built-in transitions. Eg. `btn.on Event.Click, -> Views.slideIn(anotherLayer)`

If you prefer to create layers in code you can add them as subLayers to your ViewController. Set the first layer's .name property to 'initialView' to make it visible inside the controller.

### Properties and methods

The ViewController is just like a normal layer, but with a few tweaks. Here are a few properties and methods that are particularly useful:

- .width - defaults to Screen.width
- .height - defaults to Screen.height
- .animationOptions - default animation options for all transitions
- .add(<layer>) - adds a new view. short for .addSubLayer()
- .initialView - set the initial view
- .current - gives you the name of the current layer/view
- .back() - automatically reverses previous transition and takes you back 1 step in history.
- .initialViewName - subLayers with a name matching initialViewName will automatically be put as initialView. this value defaults to 'initialView'.


### Transitions

Transitions are trigged by using one of the transition methods. Eg. `Views.fadeIn(anotherLayer)`. Each transition takes an animationOption object as the second argument. Eg. `Views.fadeIn(anotherLayer, time: 2)`

- .switchInstant()
- .slideIn() / .slideInRight()
- .slideInLeft() - 
- .slideInDown()
- .slideInUp()
- .fadeIn() / .crossDissolve()
- .zoomIn()
- .zoomedIn()
- .spinIn 
- .pushIn() / .pushInRight()
- .pushInLeft()
- .moveIn() / .moveInRight()
- .moveInLeft()
- .moveInUp()
- .moveInDown() 
- .magicMove()