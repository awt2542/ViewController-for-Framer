require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewController = (function(superClass) {
  extend(ViewController, superClass);

  function ViewController(options) {
    if (options == null) {
      options = {};
    }
    if (options.width == null) {
      options.width = Screen.width;
    }
    if (options.height == null) {
      options.height = Screen.height;
    }
    if (options.clip == null) {
      options.clip = true;
    }
    if (options.initialViewName == null) {
      options.initialViewName = 'initialView';
    }
    if (options.animationOptions == null) {
      options.animationOptions = {
        curve: "cubic-bezier(0.19, 1, 0.22, 1)",
        time: .7
      };
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = "black";
    }
    if (options.perspective == null) {
      options.perspective = 1000;
    }
    ViewController.__super__.constructor.call(this, options);
    this.history = [];
    this.on("change:subLayers", function(changeList) {
      if (changeList.added[0].name === options.initialViewName) {
        return this.switchInstant(changeList.added[0]);
      } else {
        return changeList.added[0].x = this.width;
      }
    });
    if (options.initialView != null) {
      this.switchInstant(options.initialView);
    }
  }

  ViewController.prototype.add = function(view, point, viaInternalChangeEvent) {
    if (point == null) {
      point = {
        x: 0,
        y: 0
      };
    }
    if (viaInternalChangeEvent == null) {
      viaInternalChangeEvent = false;
    }
    if (viaInternalChangeEvent) {
      this.switchInstant(view);
    } else {
      view.superLayer = this;
    }
    view.on(Events.Click, function() {});
    view.originalPoint = point;
    view.point = point;
    return view.sendToBack();
  };

  ViewController.prototype.saveCurrentToHistory = function(incomingAnimation, outgoingAnimation) {
    return this.history.unshift({
      view: this.current,
      incomingAnimation: incomingAnimation,
      outgoingAnimation: outgoingAnimation
    });
  };

  ViewController.prototype.back = function() {
    var backIn, moveOut, moveOutDelay, previous;
    previous = this.history[0];
    if (previous.view != null) {
      if (previous.incomingAnimation === 'magicMove') {
        return this.magicMove(previous.view);
      } else {
        backIn = previous.outgoingAnimation.reverse();
        moveOut = previous.incomingAnimation.reverse();
        moveOutDelay = moveOut.options.delay;
        moveOut.options.delay = backIn.options.delay;
        backIn.options.delay = moveOutDelay;
        backIn.start();
        moveOut.start();
        this.current = previous.view;
        this.history.shift();
        return moveOut.on(Events.AnimationEnd, (function(_this) {
          return function() {
            return _this.current.bringToFront();
          };
        })(this));
      }
    }
  };

  ViewController.prototype.applyAnimation = function(newView, incoming, animationOptions, outgoing) {
    var incomingAnimation, incomingAnimationObject, outgoingAnimation, outgoingAnimationObject, ref;
    if (outgoing == null) {
      outgoing = {};
    }
    if (newView !== this.current) {
      newView.animateStop();
      if ((ref = this.current) != null) {
        ref.propsBeforeAnimation = this.current.props;
      }
      newView.props = newView.propsBeforeAnimation;
      if (this.subLayers.indexOf(newView) === -1) {
        this.add(newView);
      }
      _.extend(this.current, outgoing.start);
      outgoingAnimationObject = {
        layer: this.current,
        properties: {}
      };
      outgoingAnimationObject.delay = outgoing.delay;
      _.extend(outgoingAnimationObject.properties, outgoing.end);
      _.extend(outgoingAnimationObject, animationOptions);
      outgoingAnimation = new Animation(outgoingAnimationObject);
      outgoingAnimation.start();
      _.extend(newView, incoming.start);
      incomingAnimationObject = {
        layer: newView,
        properties: {}
      };
      incomingAnimationObject.delay = incoming.delay;
      _.extend(incomingAnimationObject.properties, incoming.end);
      _.extend(incomingAnimationObject, animationOptions);
      incomingAnimation = new Animation(incomingAnimationObject);
      incomingAnimation.start();
      this.saveCurrentToHistory(incomingAnimation, outgoingAnimation);
      this.current = newView;
      return this.current.bringToFront();
    }
  };

  ViewController.prototype.getPoint = function(view, point) {
    return view.originalPoint || {
      x: 0,
      y: 0
    };
  };


  /* ANIMATIONS */

  ViewController.prototype.switchInstant = function(newView) {
    return this.fadeIn(newView, {
      time: 0
    });
  };

  ViewController.prototype.slideIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.slideInRight(newView, animationOptions);
  };

  ViewController.prototype.slideInLeft = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: this.getPoint(newView).x
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.slideInRight = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: this.getPoint(newView).x
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.slideInDown = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: -this.height,
        x: 0
      },
      end: {
        y: this.getPoint(newView).y
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.slideInUp = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        y: this.height,
        x: 0
      },
      end: {
        y: this.getPoint(newView).y
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.fadeIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: this.getPoint(newView).x,
        y: this.getPoint(newView).y,
        opacity: 0
      },
      end: {
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.crossDissolve = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.fadeIn(newView, animationOptions);
  };

  ViewController.prototype.fadeInBlack = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {
        brightness: 100
      },
      end: {
        brightness: 0
      },
      delay: 0
    };
    incoming = {
      start: {
        brightness: 0
      },
      opacity: 0,
      x: this.getPoint(newView).x,
      y: this.getPoint(newView).y,
      end: {
        brightness: 100,
        opacity: 1
      },
      delay: animationOptions.time / 1.5
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.zoomIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        y: 0,
        scale: 0.8,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.zoomedIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        y: 0,
        scale: 1.5,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.spinIn = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        y: 0,
        rotation: 180,
        scale: 0.8,
        opacity: 0
      },
      end: {
        scale: 1,
        opacity: 1,
        rotation: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.pushIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.pushInRight(newView, animationOptions);
  };

  ViewController.prototype.pushInRight = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: -(this.width / 5),
        brightness: 80
      }
    };
    incoming = {
      start: {
        brightness: 100,
        x: this.width
      },
      end: {
        x: this.getPoint(newView).x
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.pushInLeft = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: +(this.width / 5),
        brightness: 90
      }
    };
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: this.getPoint(newView).x
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.moveIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.moveInRight(newView, animationOptions);
  };

  ViewController.prototype.moveInRight = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: -this.width
      }
    };
    incoming = {
      start: {
        x: this.width
      },
      end: {
        x: this.getPoint(newView).x
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.moveInLeft = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        x: this.width
      }
    };
    incoming = {
      start: {
        x: -this.width
      },
      end: {
        x: this.getPoint(newView).x
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.moveInUp = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        y: -this.height
      }
    };
    incoming = {
      start: {
        x: 0,
        y: this.height
      },
      end: {
        y: this.getPoint(newView).y
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.moveInDown = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        y: this.height
      }
    };
    incoming = {
      start: {
        x: 0,
        y: -this.height
      },
      end: {
        y: this.getPoint(newView).y
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions, outgoing);
  };

  ViewController.prototype.magicMove = function(newView, animationOptions) {
    var animationObj, exisitingLayers, i, j, len, len1, match, newFrame, prevFrame, ref, ref1, results, sub, traverseSubLayers;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    traverseSubLayers = function(layer) {
      var arr, findSubLayer;
      arr = [];
      findSubLayer = function(layer) {
        var i, len, ref, subLayer;
        ref = layer.subLayers;
        for (i = 0, len = ref.length; i < len; i++) {
          subLayer = ref[i];
          arr.push(subLayer);
          if (subLayer.subLayers.length > 0) {
            findSubLayer(subLayer);
          }
        }
        return arr;
      };
      return findSubLayer(layer);
    };
    exisitingLayers = {};
    ref = traverseSubLayers(this.current);
    for (i = 0, len = ref.length; i < len; i++) {
      sub = ref[i];
      exisitingLayers[sub.name] = sub;
    }
    newView.x = this.getPoint(newView).x;
    newView.y = this.getPoint(newView).y;
    if (this.subLayers.indexOf(newView) === -1) {
      this.add(newView);
    }
    this.saveCurrentToHistory('magicMove');
    this.current = newView;
    this.current.bringToFront();
    ref1 = traverseSubLayers(newView);
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      sub = ref1[j];
      if (exisitingLayers[sub.name] != null) {
        match = exisitingLayers[sub.name];
        newFrame = sub.frame;
        prevFrame = match.frame;
        sub.frame = prevFrame;
        animationObj = {
          properties: {
            x: newFrame.x,
            y: newFrame.y,
            width: newFrame.width,
            height: newFrame.height,
            opacity: 1
          }
        };
      } else {
        sub.opacity = 0;
        animationObj = {
          properties: {
            opacity: 1
          }
        };
      }
      _.extend(animationObj, animationOptions);
      results.push(sub.animate(animationObj));
    }
    return results;
  };

  ViewController.prototype.transition = function(newView, direction) {
    if (direction == null) {
      direction = 'right';
    }
    switch (direction) {
      case 'up':
        return this.moveInDown(newView);
      case 'right':
        return this.pushInRight(newView);
      case 'down':
        return this.moveInUp(newView);
      case 'left':
        return this.pushInLeft(newView);
    }
  };

  return ViewController;

})(Layer);


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvVmlld0NvbnRyb2xsZXItZm9yLUZyYW1lci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL1ZpZXdDb250cm9sbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0tBLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7O0VBRUEsd0JBQUMsT0FBRDs7TUFBQyxVQUFROzs7TUFDckIsT0FBTyxDQUFDLFFBQVMsTUFBTSxDQUFDOzs7TUFDeEIsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDOzs7TUFDekIsT0FBTyxDQUFDLE9BQVE7OztNQUNoQixPQUFPLENBQUMsa0JBQW1COzs7TUFDM0IsT0FBTyxDQUFDLG1CQUFvQjtRQUFBLEtBQUEsRUFBTyxnQ0FBUDtRQUF5QyxJQUFBLEVBQU0sRUFBL0M7Ozs7TUFDNUIsT0FBTyxDQUFDLGtCQUFtQjs7O01BQzNCLE9BQU8sQ0FBQyxjQUFlOztJQUV2QixnREFBTSxPQUFOO0lBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFEO01BQ3ZCLElBQUcsVUFBVSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFwQixLQUE0QixPQUFPLENBQUMsZUFBdkM7ZUFDQyxJQUFDLENBQUEsYUFBRCxDQUFlLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFoQyxFQUREO09BQUEsTUFBQTtlQUdDLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBcEIsR0FBd0IsSUFBQyxDQUFBLE1BSDFCOztJQUR1QixDQUF4QjtJQU1BLElBQUcsMkJBQUg7TUFDQyxJQUFDLENBQUEsYUFBRCxDQUFlLE9BQU8sQ0FB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TSxPQUZOO2VBRW1CLElBQUMsQ0FBQSxXQUFELENBQWEsT0FBYjtBQUZuQixXQUdNLE1BSE47ZUFHa0IsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWO0FBSGxCLFdBSU0sTUFKTjtlQUlrQixJQUFDLENBQUEsVUFBRCxDQUFZLE9BQVo7QUFKbEI7RUFEVzs7OztHQXJWd0IiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIyBUT0RPOlxuIyBBZGQgY3VzdG9tIGFuaW1hdGlvbk9wdGlvbnMgdG8gLmJhY2soKT9cbiMgQWRkIFwibW92ZU91dFwiIGFuaW1hdGlvbnM/IHdoYXQncyB0aGUgdXNlIGNhc2U/IGNvdmVyZWQgYnkgYmFjaz9cbiMgSWYgbm8gbmVlZCBmb3IgbW92ZU91dCwgbWF5YmUgd2Ugd29udCBuZWVkIGNvbnNpc3RlbnQgXCJJblwiIG5hbWluZyBzY2hlbWVcblxuY2xhc3MgZXhwb3J0cy5WaWV3Q29udHJvbGxlciBleHRlbmRzIExheWVyXG5cdFx0XG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLndpZHRoID89IFNjcmVlbi53aWR0aFxuXHRcdG9wdGlvbnMuaGVpZ2h0ID89IFNjcmVlbi5oZWlnaHRcblx0XHRvcHRpb25zLmNsaXAgPz0gdHJ1ZVxuXHRcdG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lID89ICdpbml0aWFsVmlldydcblx0XHRvcHRpb25zLmFuaW1hdGlvbk9wdGlvbnMgPz0gY3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuMTksIDEsIDAuMjIsIDEpXCIsIHRpbWU6IC43XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCJibGFja1wiXG5cdFx0b3B0aW9ucy5wZXJzcGVjdGl2ZSA/PSAxMDAwXG5cblx0XHRzdXBlciBvcHRpb25zXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBvbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRpZiBjaGFuZ2VMaXN0LmFkZGVkWzBdLm5hbWUgaXMgb3B0aW9ucy5pbml0aWFsVmlld05hbWVcblx0XHRcdFx0QHN3aXRjaEluc3RhbnQgY2hhbmdlTGlzdC5hZGRlZFswXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRjaGFuZ2VMaXN0LmFkZGVkWzBdLnggPSBAd2lkdGhcblxuXHRcdGlmIG9wdGlvbnMuaW5pdGlhbFZpZXc/XG5cdFx0XHRAc3dpdGNoSW5zdGFudCBvcHRpb25zLmluaXRpYWxWaWV3XG5cblx0YWRkOiAodmlldywgcG9pbnQgPSB7eDowLCB5OjB9LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50ID0gZmFsc2UpIC0+XG5cdFx0aWYgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0QHN3aXRjaEluc3RhbnQgdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3VwZXJMYXllciA9IEBcblx0XHR2aWV3Lm9uIEV2ZW50cy5DbGljaywgLT4gcmV0dXJuICMgcHJldmVudCBjbGljay10aHJvdWdoL2J1YmJsaW5nXG5cdFx0dmlldy5vcmlnaW5hbFBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnBvaW50ID0gcG9pbnRcblx0XHR2aWV3LnNlbmRUb0JhY2soKVxuXHRcdFxuXHRzYXZlQ3VycmVudFRvSGlzdG9yeTogKGluY29taW5nQW5pbWF0aW9uLG91dGdvaW5nQW5pbWF0aW9uKSAtPlxuXHRcdEBoaXN0b3J5LnVuc2hpZnRcblx0XHRcdHZpZXc6IEBjdXJyZW50XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbjogaW5jb21pbmdBbmltYXRpb25cblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uOiBvdXRnb2luZ0FuaW1hdGlvblxuXG5cdGJhY2s6IC0+IFxuXHRcdHByZXZpb3VzID0gQGhpc3RvcnlbMF1cblx0XHRpZiBwcmV2aW91cy52aWV3P1xuXG5cdFx0XHRpZiBwcmV2aW91cy5pbmNvbWluZ0FuaW1hdGlvbiBpcyAnbWFnaWNNb3ZlJ1xuXHRcdFx0XHRAbWFnaWNNb3ZlIHByZXZpb3VzLnZpZXdcblx0XHRcdGVsc2Vcblx0XHRcdFx0YmFja0luID0gcHJldmlvdXMub3V0Z29pbmdBbmltYXRpb24ucmV2ZXJzZSgpXG5cdFx0XHRcdG1vdmVPdXQgPSBwcmV2aW91cy5pbmNvbWluZ0FuaW1hdGlvbi5yZXZlcnNlKClcblxuXHRcdFx0XHQjIFN3aXRjaCB3aGljaCBhbmltYXRpb24gdGhhdCBzaG91bGQgY2FycnkgdGhlIGRlbGF5LCBpZiBhbnlcblx0XHRcdFx0bW92ZU91dERlbGF5ID0gbW92ZU91dC5vcHRpb25zLmRlbGF5XG5cdFx0XHRcdG1vdmVPdXQub3B0aW9ucy5kZWxheSA9IGJhY2tJbi5vcHRpb25zLmRlbGF5XG5cdFx0XHRcdGJhY2tJbi5vcHRpb25zLmRlbGF5ID0gbW92ZU91dERlbGF5XG5cblx0XHRcdFx0YmFja0luLnN0YXJ0KClcblx0XHRcdFx0bW92ZU91dC5zdGFydCgpXG5cblx0XHRcdFx0QGN1cnJlbnQgPSBwcmV2aW91cy52aWV3XG5cdFx0XHRcdEBoaXN0b3J5LnNoaWZ0KClcblx0XHRcdFx0bW92ZU91dC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0YXBwbHlBbmltYXRpb246IChuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmcgPSB7fSkgLT5cblx0XHR1bmxlc3MgbmV3VmlldyBpcyBAY3VycmVudFxuXG5cdFx0XHQjIHJlc2V0IGNvbW1vbiBwcm9wZXJ0aWVzIGluIGNhc2UgdGhleVxuXHRcdFx0IyB3ZXJlIGNoYW5nZWQgZHVyaW5nIGxhc3QgYW5pbWF0aW9uXG5cdFx0XHRuZXdWaWV3LmFuaW1hdGVTdG9wKClcblx0XHRcdEBjdXJyZW50Py5wcm9wc0JlZm9yZUFuaW1hdGlvbiA9IEBjdXJyZW50LnByb3BzXG5cdFx0XHRuZXdWaWV3LnByb3BzID0gbmV3Vmlldy5wcm9wc0JlZm9yZUFuaW1hdGlvblxuXG5cdFx0XHRAYWRkIG5ld1ZpZXcgaWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgY3VycmVudCB2aWV3XG5cdFx0XHRfLmV4dGVuZCBAY3VycmVudCwgb3V0Z29pbmcuc3RhcnRcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0ID1cblx0XHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt9XG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbk9iamVjdC5kZWxheSA9IG91dGdvaW5nLmRlbGF5XG5cdFx0XHRfLmV4dGVuZCBvdXRnb2luZ0FuaW1hdGlvbk9iamVjdC5wcm9wZXJ0aWVzLCBvdXRnb2luZy5lbmRcblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24ob3V0Z29pbmdBbmltYXRpb25PYmplY3QpXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgbmV3IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG5ld1ZpZXcsIGluY29taW5nLnN0YXJ0XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbk9iamVjdCA9IFxuXHRcdFx0XHRsYXllcjogbmV3Vmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb25PYmplY3QuZGVsYXkgPSBpbmNvbWluZy5kZWxheVxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb25PYmplY3QucHJvcGVydGllcywgaW5jb21pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbk9iamVjdCwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0aW5jb21pbmdBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uKGluY29taW5nQW5pbWF0aW9uT2JqZWN0KVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgaW5jb21pbmdBbmltYXRpb24sIG91dGdvaW5nQW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0Z2V0UG9pbnQ6ICh2aWV3LCBwb2ludCkgLT4gdmlldy5vcmlnaW5hbFBvaW50IHx8IHt4OjAseTowfVxuXG5cdCMjIyBBTklNQVRJT05TICMjI1xuXG5cdHN3aXRjaEluc3RhbnQ6IChuZXdWaWV3KSAtPiBAZmFkZUluIG5ld1ZpZXcsIHRpbWU6IDBcblxuXHRzbGlkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAc2xpZGVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0Y3Jvc3NEaXNzb2x2ZTogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QGZhZGVJbiBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluQmxhY2s6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRicmlnaHRuZXNzOiAwXG5cdFx0XHRkZWxheTogMFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdCAgXHRicmlnaHRuZXNzOiAwXG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRcdGVuZDpcblx0XHRcdFx0YnJpZ2h0bmVzczogMTAwXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdGRlbGF5OiBhbmltYXRpb25PcHRpb25zLnRpbWUvMS41XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXHRcdFx0XG5cdHpvb21JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRzY2FsZTogMS41XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFxuXHRzcGluSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRyb3RhdGlvbjogMTgwXG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRcdHJvdGF0aW9uOiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAcHVzaEluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAtKEB3aWR0aC81KVxuXHRcdFx0XHRicmlnaHRuZXNzOiA4MFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRicmlnaHRuZXNzOiAxMDBcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdHB1c2hJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6ICsoQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDkwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAbW92ZUluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdG1vdmVJblJpZ2h0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbkRvd246IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtYWdpY01vdmU6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cblx0XHR0cmF2ZXJzZVN1YkxheWVycyA9IChsYXllcikgLT5cblx0XHRcdGFyciA9IFtdXG5cdFx0XHRmaW5kU3ViTGF5ZXIgPSAobGF5ZXIpIC0+XG5cdFx0XHRcdGZvciBzdWJMYXllciBpbiBsYXllci5zdWJMYXllcnNcblx0XHRcdFx0XHRhcnIucHVzaCBzdWJMYXllclxuXHRcdFx0XHRcdGlmIHN1YkxheWVyLnN1YkxheWVycy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRmaW5kU3ViTGF5ZXIgc3ViTGF5ZXJcblx0XHRcdFx0cmV0dXJuIGFyclxuXHRcdFx0ZmluZFN1YkxheWVyIGxheWVyXG5cdFx0XG5cdFx0ZXhpc2l0aW5nTGF5ZXJzID0ge31cblx0XHRmb3Igc3ViIGluIHRyYXZlcnNlU3ViTGF5ZXJzIEBjdXJyZW50XG5cdFx0XHRleGlzaXRpbmdMYXllcnNbc3ViLm5hbWVdID0gc3ViXG5cdFx0XG5cdFx0IyBwcm9wZXIgc3dpdGNoIHdpdGggaGlzdG9yeSBzdXBwb3J0XG5cdFx0bmV3Vmlldy54ID0gQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRuZXdWaWV3LnkgPSBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhZGQgbmV3VmlldyBpZiBAc3ViTGF5ZXJzLmluZGV4T2YobmV3VmlldykgaXMgLTFcblx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgJ21hZ2ljTW92ZSdcblx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRAY3VycmVudC5icmluZ1RvRnJvbnQoKVxuXHRcdFxuXHRcdCMgZmFuY3kgYW5pbWF0aW9ucyB3aXRoIG1hZ2ljIG1vdmVcblx0XHRmb3Igc3ViIGluIHRyYXZlcnNlU3ViTGF5ZXJzIG5ld1ZpZXdcblx0XHRcdGlmIGV4aXNpdGluZ0xheWVyc1tzdWIubmFtZV0/XG5cdFx0XHRcdG1hdGNoID0gZXhpc2l0aW5nTGF5ZXJzW3N1Yi5uYW1lXVxuXHRcdFx0XHRuZXdGcmFtZSA9IHN1Yi5mcmFtZVxuXHRcdFx0XHRwcmV2RnJhbWUgPSBtYXRjaC5mcmFtZVxuXHRcdFx0XHRzdWIuZnJhbWUgPSBwcmV2RnJhbWVcblx0XHRcdFx0YW5pbWF0aW9uT2JqID0gXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdHg6IG5ld0ZyYW1lLnhcblx0XHRcdFx0XHRcdHk6IG5ld0ZyYW1lLnlcblx0XHRcdFx0XHRcdHdpZHRoOiBuZXdGcmFtZS53aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBuZXdGcmFtZS5oZWlnaHRcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdGVsc2UgIyBmYWRlIGluIG5ldyBsYXllcnNcblx0XHRcdFx0c3ViLm9wYWNpdHkgPSAwXG5cdFx0XHRcdGFuaW1hdGlvbk9iaiA9IFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRfLmV4dGVuZCBhbmltYXRpb25PYmosIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdHN1Yi5hbmltYXRlIGFuaW1hdGlvbk9ialxuXG5cdCMgQmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0dHJhbnNpdGlvbjogKG5ld1ZpZXcsIGRpcmVjdGlvbiA9ICdyaWdodCcpIC0+XG5cdFx0c3dpdGNoIGRpcmVjdGlvblxuXHRcdFx0d2hlbiAndXAnIHRoZW4gQG1vdmVJbkRvd24gbmV3Vmlld1xuXHRcdFx0d2hlbiAncmlnaHQnIHRoZW4gQHB1c2hJblJpZ2h0IG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2Rvd24nIHRoZW4gQG1vdmVJblVwIG5ld1ZpZXdcblx0XHRcdHdoZW4gJ2xlZnQnIHRoZW4gQHB1c2hJbkxlZnQgbmV3VmlldyJdfQ==
