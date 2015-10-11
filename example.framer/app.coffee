{ViewController} = require 'ViewController'

Views = new ViewController
	width: 500
	height: 500
Views.center()

view1 = new Layer 
	width: Views.width, height: Views.height, superLayer: Views
	image: "http://bit.ly/1L86dhL", name: 'initialView'
Utils.labelLayer view1, 'view1'

view2 = new Layer
	width: Views.width, height: Views.height
	image: "http://bit.ly/1UvvNCp", superLayer: Views, name: 'view2'
Utils.labelLayer view2, 'view2'

# Add views to the view controller
#Views.add view for view in [view1,view2]
# Switch view to set the initial state
#Views.switchInstant view1
# Set up transition on click
view1.on Events.Click, -> Views.moveIn view2

# Go back in history and reverse the previous animation
view2.on Events.Click, -> Views.slideIn view1

### Transitions
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