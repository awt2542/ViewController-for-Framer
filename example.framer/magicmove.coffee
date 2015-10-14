sketch = Framer.Importer.load "imported/project"

ViewController = require 'ViewController'

Views = new ViewController
	initialView: sketch.first
	
sketch.first.on Events.Click, -> 
	Views.magicMove sketch.second
	
sketch.second.on Events.Click, -> 
	Views.magicMove sketch.third, curve: "spring(400,25)"
	
sketch.third.on Events.Click, -> 
	Views.magicMove sketch.first