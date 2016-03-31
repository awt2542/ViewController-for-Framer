## ViewController-for-Framer
The ViewController module for Framer.js helps you create multi step user flows with pre-made transitions like "fade in", "slide in" and "magic move".

![multistep](https://s3.amazonaws.com/f.cl.ly/items/3p1T3o1h3m433m3u0v3N/steps.png)

### Examples

- [iOS-style navigation](http://share.framerjs.com/dutzrzfvszto/)
- [Image grid with magic move](http://share.framerjs.com/odobqcb9vjoi/)
- [Medium article: Prototype User Flows](https://blog.prototypr.io/prototype-user-flows-in-framer-studio-dc87f5211a47#.ticqxm8r7)

### Get started
1. Download the ViewController.coffee file to your project's modules folder and add
`
ViewController = require 'ViewController'
` to the top of your app.coffee file.

2. Set the initial view by writing 
`Views = new ViewController
    initialView: sketch.homepage`. 

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
- .backgroundColor - defaults to 'black'
- .scroll - automatically adds scroll components to each view. defaults to 'false'
- .autoLink - automatically adds links from layers containing the name of an animation. eg. a layer named "slideIn_app" will slide in the layer "app" when clicked. defaults to 'true'


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
- .magicMove() - *make sure layer names are kept consistent across screens*

###Contact

Twitter: [@andreaswah](http://twitter.com/andreaswah)
