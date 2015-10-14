ViewController = require 'ViewController'

Views = new ViewController
	width: 500
	height: 500
	
Views.center()

view1 = new Layer 
	width: Views.width, height: Views.height, superLayer: Views
	image: "http://bit.ly/1L86dhL", name: 'initialView'

view2 = new Layer
	width: Views.width, height: Views.height
	image: "http://bit.ly/1UvvNCp", superLayer: Views
	

view1.on Events.Click, -> Views.spinIn view2
view2.on Events.Click, -> Views.fadeIn view1

### Try applying one of the available transitions above ^^
.switchInstant
.pushIn
.pushInRight
.pushInLeft
.slideIn
.slideInDown
.slideInUp
.slideInRight
.slideInLeft
.fadeIn
.crossDissolve
.zoomIn
.zoomedIn
.spinIn
.moveIn
.moveInDown
.moveInUp
.moveInRight
.moveInLeft
.magicMove
###