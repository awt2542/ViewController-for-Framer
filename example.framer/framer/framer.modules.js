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
    var backIn, moveOut, previous;
    previous = this.history[0];
    if (previous.view != null) {
      if (previous.incomingAnimation === 'magicMove') {
        return this.magicMove(previous.view);
      } else {
        backIn = previous.outgoingAnimation.reverse();
        moveOut = previous.incomingAnimation.reverse();
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
      _.extend(outgoingAnimationObject.properties, outgoing.end);
      _.extend(outgoingAnimationObject, animationOptions);
      outgoingAnimation = new Animation(outgoingAnimationObject);
      outgoingAnimation.start();
      _.extend(newView, incoming.start);
      incomingAnimationObject = {
        layer: newView,
        properties: {}
      };
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvVmlld0NvbnRyb2xsZXItZm9yLUZyYW1lci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL1ZpZXdDb250cm9sbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0tBLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7O0VBRUEsd0JBQUMsT0FBRDs7TUFBQyxVQUFROzs7TUFDckIsT0FBTyxDQUFDLFFBQVMsTUFBTSxDQUFDOzs7TUFDeEIsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDOzs7TUFDekIsT0FBTyxDQUFDLE9BQVE7OztNQUNoQixPQUFPLENBQUMsa0JBQW1COzs7TUFDM0IsT0FBTyxDQUFDLG1CQUFvQjtRQUFBLEtBQUEsRUFBTyxnQ0FBUDtRQUF5QyxJQUFBLEVBQU0sRUFBL0M7Ozs7TUFDNUIsT0FBTyxDQUFDLGtCQUFtQjs7O01BQzNCLE9BQU8sQ0FBQyxjQUFlOztJQUV2QixnREFBTSxPQUFOO0lBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFEO01BQ3ZCLElBQUcsVUFBVSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFwQixLQUE0QixPQUFPLENBQUMsZUFBdkM7ZUFDQyxJQUFDLENBQUEsYUFBRCxDQUFlLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFoQyxFQUREO09BQUEsTUFBQTtlQUdDLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBcEIsR0FBd0IsSUFBQyxDQUFBLE1BSDFCOztJQUR1QixDQUF4QjtJQU1BLElBQUcsMkJBQUg7TUFDQyxJQUFDLENBQUEsYUFBRCxDQUFlLE9BQU8sQ0FB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ekJVOzsyQkErQ1gsVUFBQSxHQUFZLFNBQUMsT0FBRCxFQUFVLFNBQVY7O01BQVUsWUFBWTs7QUFDakMsWUFBTyxTQUFQO0FBQUEsV0FDTSxJQUROO2VBQ2dCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWjtBQURoQixXQUVNLE9BRk47ZUFFbUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxPQUFiO0FBRm5CLFdBR00sTUFITjtlQUdrQixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVY7QUFIbEIsV0FJTSxNQUpOO2VBSWtCLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWjtBQUpsQjtFQURXOzs7O0dBMVR3QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIjIFRPRE86XG4jIEFkZCBjdXN0b20gYW5pbWF0aW9uT3B0aW9ucyB0byAuYmFjaygpP1xuIyBBZGQgXCJtb3ZlT3V0XCIgYW5pbWF0aW9ucz8gd2hhdCdzIHRoZSB1c2UgY2FzZT8gY292ZXJlZCBieSBiYWNrP1xuIyBJZiBubyBuZWVkIGZvciBtb3ZlT3V0LCBtYXliZSB3ZSB3b250IG5lZWQgY29uc2lzdGVudCBcIkluXCIgbmFtaW5nIHNjaGVtZVxuXG5jbGFzcyBleHBvcnRzLlZpZXdDb250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblx0XHRcblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMud2lkdGggPz0gU2NyZWVuLndpZHRoXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gU2NyZWVuLmhlaWdodFxuXHRcdG9wdGlvbnMuY2xpcCA/PSB0cnVlXG5cdFx0b3B0aW9ucy5pbml0aWFsVmlld05hbWUgPz0gJ2luaXRpYWxWaWV3J1xuXHRcdG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyA/PSBjdXJ2ZTogXCJjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSlcIiwgdGltZTogLjdcblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSBcImJsYWNrXCJcblx0XHRvcHRpb25zLnBlcnNwZWN0aXZlID89IDEwMDBcblxuXHRcdHN1cGVyIG9wdGlvbnNcblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0QG9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdGlmIGNoYW5nZUxpc3QuYWRkZWRbMF0ubmFtZSBpcyBvcHRpb25zLmluaXRpYWxWaWV3TmFtZVxuXHRcdFx0XHRAc3dpdGNoSW5zdGFudCBjaGFuZ2VMaXN0LmFkZGVkWzBdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGNoYW5nZUxpc3QuYWRkZWRbMF0ueCA9IEB3aWR0aFxuXG5cdFx0aWYgb3B0aW9ucy5pbml0aWFsVmlldz9cblx0XHRcdEBzd2l0Y2hJbnN0YW50IG9wdGlvbnMuaW5pdGlhbFZpZXdcblxuXHRhZGQ6ICh2aWV3LCBwb2ludCA9IHt4OjAsIHk6MH0sIHZpYUludGVybmFsQ2hhbmdlRXZlbnQgPSBmYWxzZSkgLT5cblx0XHRpZiB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHRAc3dpdGNoSW5zdGFudCB2aWV3XG5cdFx0ZWxzZVxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdHZpZXcub24gRXZlbnRzLkNsaWNrLCAtPiByZXR1cm4gIyBwcmV2ZW50IGNsaWNrLXRocm91Z2gvYnViYmxpbmdcblx0XHR2aWV3Lm9yaWdpbmFsUG9pbnQgPSBwb2ludFxuXHRcdHZpZXcucG9pbnQgPSBwb2ludFxuXHRcdHZpZXcuc2VuZFRvQmFjaygpXG5cdFx0XG5cdHNhdmVDdXJyZW50VG9IaXN0b3J5OiAoaW5jb21pbmdBbmltYXRpb24sb3V0Z29pbmdBbmltYXRpb24pIC0+XG5cdFx0QGhpc3RvcnkudW5zaGlmdFxuXHRcdFx0dmlldzogQGN1cnJlbnRcblx0XHRcdGluY29taW5nQW5pbWF0aW9uOiBpbmNvbWluZ0FuaW1hdGlvblxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb246IG91dGdvaW5nQW5pbWF0aW9uXG5cblx0YmFjazogLT4gXG5cdFx0cHJldmlvdXMgPSBAaGlzdG9yeVswXVxuXHRcdGlmIHByZXZpb3VzLnZpZXc/XG5cblx0XHRcdGlmIHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uIGlzICdtYWdpY01vdmUnXG5cdFx0XHRcdEBtYWdpY01vdmUgcHJldmlvdXMudmlld1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRiYWNrSW4gPSBwcmV2aW91cy5vdXRnb2luZ0FuaW1hdGlvbi5yZXZlcnNlKClcblx0XHRcdFx0bW92ZU91dCA9IHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXG5cdFx0XHRcdGJhY2tJbi5zdGFydCgpXG5cdFx0XHRcdG1vdmVPdXQuc3RhcnQoKVxuXG5cdFx0XHRcdEBjdXJyZW50ID0gcHJldmlvdXMudmlld1xuXHRcdFx0XHRAaGlzdG9yeS5zaGlmdCgpXG5cdFx0XHRcdG1vdmVPdXQub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgPT4gQGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZyA9IHt9KSAtPlxuXHRcdHVubGVzcyBuZXdWaWV3IGlzIEBjdXJyZW50XG5cblx0XHRcdCMgcmVzZXQgY29tbW9uIHByb3BlcnRpZXMgaW4gY2FzZSB0aGV5XG5cdFx0XHQjIHdlcmUgY2hhbmdlZCBkdXJpbmcgbGFzdCBhbmltYXRpb25cblx0XHRcdG5ld1ZpZXcuYW5pbWF0ZVN0b3AoKVxuXHRcdFx0QGN1cnJlbnQ/LnByb3BzQmVmb3JlQW5pbWF0aW9uID0gQGN1cnJlbnQucHJvcHNcblx0XHRcdG5ld1ZpZXcucHJvcHMgPSBuZXdWaWV3LnByb3BzQmVmb3JlQW5pbWF0aW9uXG5cblx0XHRcdEBhZGQgbmV3VmlldyBpZiBAc3ViTGF5ZXJzLmluZGV4T2YobmV3VmlldykgaXMgLTFcblxuXHRcdFx0IyBBbmltYXRlIHRoZSBjdXJyZW50IHZpZXdcblx0XHRcdF8uZXh0ZW5kIEBjdXJyZW50LCBvdXRnb2luZy5zdGFydFxuXHRcdFx0b3V0Z29pbmdBbmltYXRpb25PYmplY3QgPVxuXHRcdFx0XHRsYXllcjogQGN1cnJlbnRcblx0XHRcdFx0cHJvcGVydGllczoge31cblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0LnByb3BlcnRpZXMsIG91dGdvaW5nLmVuZFxuXHRcdFx0Xy5leHRlbmQgb3V0Z29pbmdBbmltYXRpb25PYmplY3QsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvbihvdXRnb2luZ0FuaW1hdGlvbk9iamVjdClcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uLnN0YXJ0KClcblxuXHRcdFx0IyBBbmltYXRlIHRoZSBuZXcgdmlld1xuXHRcdFx0Xy5leHRlbmQgbmV3VmlldywgaW5jb21pbmcuc3RhcnRcblx0XHRcdGluY29taW5nQW5pbWF0aW9uT2JqZWN0ID0gXG5cdFx0XHRcdGxheWVyOiBuZXdWaWV3XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt9XG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbk9iamVjdC5wcm9wZXJ0aWVzLCBpbmNvbWluZy5lbmRcblx0XHRcdF8uZXh0ZW5kIGluY29taW5nQW5pbWF0aW9uT2JqZWN0LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24oaW5jb21pbmdBbmltYXRpb25PYmplY3QpXG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSBpbmNvbWluZ0FuaW1hdGlvbiwgb3V0Z29pbmdBbmltYXRpb25cblx0XHRcdEBjdXJyZW50ID0gbmV3Vmlld1xuXHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRnZXRQb2ludDogKHZpZXcsIHBvaW50KSAtPiB2aWV3Lm9yaWdpbmFsUG9pbnQgfHwge3g6MCx5OjB9XG5cblx0IyMjIEFOSU1BVElPTlMgIyMjXG5cblx0c3dpdGNoSW5zdGFudDogKG5ld1ZpZXcpIC0+IEBmYWRlSW4gbmV3VmlldywgdGltZTogMFxuXG5cdHNsaWRlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBzbGlkZUluUmlnaHQgbmV3VmlldywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHNsaWRlSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0XHR4OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmFkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRjcm9zc0Rpc3NvbHZlOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAZmFkZUluIG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcdFxuXHR6b29tSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHpvb21lZEluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0c2NhbGU6IDEuNVxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblx0XHRcblx0c3BpbkluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFx0cm90YXRpb246IDE4MFxuXHRcdFx0XHRzY2FsZTogMC44XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRyb3RhdGlvbjogMFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdHB1c2hJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QHB1c2hJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogLShAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogODBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0YnJpZ2h0bmVzczogMTAwXG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRwdXNoSW5MZWZ0OiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiArKEB3aWR0aC81KVxuXHRcdFx0XHRicmlnaHRuZXNzOiA5MFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QG1vdmVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRtb3ZlSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW5Eb3duOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAaGVpZ2h0XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogLUBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bWFnaWNNb3ZlOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXG5cdFx0dHJhdmVyc2VTdWJMYXllcnMgPSAobGF5ZXIpIC0+XG5cdFx0XHRhcnIgPSBbXVxuXHRcdFx0ZmluZFN1YkxheWVyID0gKGxheWVyKSAtPlxuXHRcdFx0XHRmb3Igc3ViTGF5ZXIgaW4gbGF5ZXIuc3ViTGF5ZXJzXG5cdFx0XHRcdFx0YXJyLnB1c2ggc3ViTGF5ZXJcblx0XHRcdFx0XHRpZiBzdWJMYXllci5zdWJMYXllcnMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0ZmluZFN1YkxheWVyIHN1YkxheWVyXG5cdFx0XHRcdHJldHVybiBhcnJcblx0XHRcdGZpbmRTdWJMYXllciBsYXllclxuXHRcdFxuXHRcdGV4aXNpdGluZ0xheWVycyA9IHt9XG5cdFx0Zm9yIHN1YiBpbiB0cmF2ZXJzZVN1YkxheWVycyBAY3VycmVudFxuXHRcdFx0ZXhpc2l0aW5nTGF5ZXJzW3N1Yi5uYW1lXSA9IHN1YlxuXHRcdFxuXHRcdCMgcHJvcGVyIHN3aXRjaCB3aXRoIGhpc3Rvcnkgc3VwcG9ydFxuXHRcdG5ld1ZpZXcueCA9IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0bmV3Vmlldy55ID0gQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRAYWRkIG5ld1ZpZXcgaWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cdFx0QHNhdmVDdXJyZW50VG9IaXN0b3J5ICdtYWdpY01vdmUnXG5cdFx0QGN1cnJlbnQgPSBuZXdWaWV3XG5cdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblx0XHRcblx0XHQjIGZhbmN5IGFuaW1hdGlvbnMgd2l0aCBtYWdpYyBtb3ZlXG5cdFx0Zm9yIHN1YiBpbiB0cmF2ZXJzZVN1YkxheWVycyBuZXdWaWV3XG5cdFx0XHRpZiBleGlzaXRpbmdMYXllcnNbc3ViLm5hbWVdP1xuXHRcdFx0XHRtYXRjaCA9IGV4aXNpdGluZ0xheWVyc1tzdWIubmFtZV1cblx0XHRcdFx0bmV3RnJhbWUgPSBzdWIuZnJhbWVcblx0XHRcdFx0cHJldkZyYW1lID0gbWF0Y2guZnJhbWVcblx0XHRcdFx0c3ViLmZyYW1lID0gcHJldkZyYW1lXG5cdFx0XHRcdGFuaW1hdGlvbk9iaiA9IFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHR4OiBuZXdGcmFtZS54XG5cdFx0XHRcdFx0XHR5OiBuZXdGcmFtZS55XG5cdFx0XHRcdFx0XHR3aWR0aDogbmV3RnJhbWUud2lkdGhcblx0XHRcdFx0XHRcdGhlaWdodDogbmV3RnJhbWUuaGVpZ2h0XG5cdFx0XHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0XHRlbHNlICMgZmFkZSBpbiBuZXcgbGF5ZXJzXG5cdFx0XHRcdHN1Yi5vcGFjaXR5ID0gMFxuXHRcdFx0XHRhbmltYXRpb25PYmogPSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0Xy5leHRlbmQgYW5pbWF0aW9uT2JqLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRzdWIuYW5pbWF0ZSBhbmltYXRpb25PYmpcblxuXHQjIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5cdHRyYW5zaXRpb246IChuZXdWaWV3LCBkaXJlY3Rpb24gPSAncmlnaHQnKSAtPlxuXHRcdHN3aXRjaCBkaXJlY3Rpb25cblx0XHRcdHdoZW4gJ3VwJyB0aGVuIEBtb3ZlSW5Eb3duIG5ld1ZpZXdcblx0XHRcdHdoZW4gJ3JpZ2h0JyB0aGVuIEBwdXNoSW5SaWdodCBuZXdWaWV3XG5cdFx0XHR3aGVuICdkb3duJyB0aGVuIEBtb3ZlSW5VcCBuZXdWaWV3XG5cdFx0XHR3aGVuICdsZWZ0JyB0aGVuIEBwdXNoSW5MZWZ0IG5ld1ZpZXciXX0=
