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
    var incomingAnimation, incomingAnimationObject, outgoingAnimation, outgoingAnimationObject;
    if (outgoing == null) {
      outgoing = {};
    }
    if (newView !== this.current) {
      newView.visible = true;
      newView.brightness = 100;
      newView.opacity = 1;
      newView.scale = 1;
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
    var incoming, midAnimationTime, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    midAnimationTime = outgoing = {
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
        brightness: 0,
        opacity: 0,
        x: this.getPoint(newView).x,
        y: this.getPoint(newView).y
      },
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

  ViewController.prototype.flipIn = function(newView, animationOptions) {
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    return this.flipInRight(newView, animationOptions);
  };

  ViewController.prototype.flipInRight = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: this.width / 2,
        z: this.width,
        rotationY: 100
      },
      end: {
        x: this.getPoint(newView).x,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.flipInLeft = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: -this.width / 2,
        z: this.width,
        rotationY: -100
      },
      end: {
        x: this.getPoint(newView).x,
        rotationY: 0,
        z: 0
      }
    };
    return this.applyAnimation(newView, incoming, animationOptions);
  };

  ViewController.prototype.flipInUp = function(newView, animationOptions) {
    var incoming;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    incoming = {
      start: {
        x: 0,
        z: this.height,
        y: this.height,
        rotationX: -100
      },
      end: {
        y: this.getPoint(newView).y,
        rotationX: 0,
        z: 0
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

  ViewController.prototype.modal = function(newView, animationOptions) {
    var incoming, outgoing;
    if (animationOptions == null) {
      animationOptions = this.animationOptions;
    }
    outgoing = {
      start: {},
      end: {
        scale: 0.9
      }
    };
    incoming = {
      start: {
        x: 0,
        y: this.height
      },
      end: {
        y: newView.originalPoint != null ? newView.originalPoint.y : this.height / 10
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYW5kcmVhcy9Ecm9wYm94L1Byb3RvdHlwZXIgRnJhbWVyIFN0dWRpby9teU1vZHVsZXMvVmlld0NvbnRyb2xsZXItZm9yLUZyYW1lci9leGFtcGxlLmZyYW1lci9tb2R1bGVzL1ZpZXdDb250cm9sbGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0tBLElBQUE7OztBQUFNLE9BQU8sQ0FBQzs7O0VBRUEsd0JBQUMsT0FBRDs7TUFBQyxVQUFROzs7TUFDckIsT0FBTyxDQUFDLFFBQVMsTUFBTSxDQUFDOzs7TUFDeEIsT0FBTyxDQUFDLFNBQVUsTUFBTSxDQUFDOzs7TUFDekIsT0FBTyxDQUFDLE9BQVE7OztNQUNoQixPQUFPLENBQUMsa0JBQW1COzs7TUFDM0IsT0FBTyxDQUFDLG1CQUFvQjtRQUFBLEtBQUEsRUFBTyxnQ0FBUDtRQUF5QyxJQUFBLEVBQU0sRUFBL0M7Ozs7TUFDNUIsT0FBTyxDQUFDLGtCQUFtQjs7O01BQzNCLE9BQU8sQ0FBQyxjQUFlOztJQUV2QixnREFBTSxPQUFOO0lBQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUNYLElBQUMsQ0FBQSxFQUFELENBQUksa0JBQUosRUFBd0IsU0FBQyxVQUFEO01BQ3ZCLElBQUcsVUFBVSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFwQixLQUE0QixPQUFPLENBQUMsZUFBdkM7ZUFDQyxJQUFDLENBQUEsYUFBRCxDQUFlLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFoQyxFQUREO09BQUEsTUFBQTtlQUdDLFVBQVUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsQ0FBcEIsR0FBd0IsSUFBQyxDQUFBLE1BSDFCOztJQUR1QixDQUF4QjtJQU1BLElBQUcsMkJBQUg7TUFDQyxJQUFDLENBQUEsYUFBRCxDQUFlLE9BQU8sQ0FB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LE1BSk47ZUFJa0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaO0FBSmxCO0VBRFc7Ozs7R0E3WXdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiMgVE9ETzpcbiMgQWRkIGN1c3RvbSBhbmltYXRpb25PcHRpb25zIHRvIC5iYWNrKCk/XG4jIEFkZCBcIm1vdmVPdXRcIiBhbmltYXRpb25zPyB3aGF0J3MgdGhlIHVzZSBjYXNlPyBjb3ZlcmVkIGJ5IGJhY2s/XG4jIElmIG5vIG5lZWQgZm9yIG1vdmVPdXQsIG1heWJlIHdlIHdvbnQgbmVlZCBjb25zaXN0ZW50IFwiSW5cIiBuYW1pbmcgc2NoZW1lXG5cbmNsYXNzIGV4cG9ydHMuVmlld0NvbnRyb2xsZXIgZXh0ZW5kcyBMYXllclxuXHRcdFxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy53aWR0aCA/PSBTY3JlZW4ud2lkdGhcblx0XHRvcHRpb25zLmhlaWdodCA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0b3B0aW9ucy5jbGlwID89IHRydWVcblx0XHRvcHRpb25zLmluaXRpYWxWaWV3TmFtZSA/PSAnaW5pdGlhbFZpZXcnXG5cdFx0b3B0aW9ucy5hbmltYXRpb25PcHRpb25zID89IGN1cnZlOiBcImN1YmljLWJlemllcigwLjE5LCAxLCAwLjIyLCAxKVwiLCB0aW1lOiAuN1xuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiYmxhY2tcIlxuXHRcdG9wdGlvbnMucGVyc3BlY3RpdmUgPz0gMTAwMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXHRcdEBoaXN0b3J5ID0gW11cblx0XHRAb24gXCJjaGFuZ2U6c3ViTGF5ZXJzXCIsIChjaGFuZ2VMaXN0KSAtPlxuXHRcdFx0aWYgY2hhbmdlTGlzdC5hZGRlZFswXS5uYW1lIGlzIG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRcdEBzd2l0Y2hJbnN0YW50IGNoYW5nZUxpc3QuYWRkZWRbMF1cblx0XHRcdGVsc2Vcblx0XHRcdFx0Y2hhbmdlTGlzdC5hZGRlZFswXS54ID0gQHdpZHRoXG5cblx0XHRpZiBvcHRpb25zLmluaXRpYWxWaWV3P1xuXHRcdFx0QHN3aXRjaEluc3RhbnQgb3B0aW9ucy5pbml0aWFsVmlld1xuXG5cdGFkZDogKHZpZXcsIHBvaW50ID0ge3g6MCwgeTowfSwgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudCA9IGZhbHNlKSAtPlxuXHRcdGlmIHZpYUludGVybmFsQ2hhbmdlRXZlbnRcblx0XHRcdEBzd2l0Y2hJbnN0YW50IHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0dmlldy5vbiBFdmVudHMuQ2xpY2ssIC0+IHJldHVybiAjIHByZXZlbnQgY2xpY2stdGhyb3VnaC9idWJibGluZ1xuXHRcdHZpZXcub3JpZ2luYWxQb2ludCA9IHBvaW50XG5cdFx0dmlldy5wb2ludCA9IHBvaW50XG5cdFx0dmlldy5zZW5kVG9CYWNrKClcblx0XHRcblx0c2F2ZUN1cnJlbnRUb0hpc3Rvcnk6IChpbmNvbWluZ0FuaW1hdGlvbixvdXRnb2luZ0FuaW1hdGlvbikgLT5cblx0XHRAaGlzdG9yeS51bnNoaWZ0XG5cdFx0XHR2aWV3OiBAY3VycmVudFxuXHRcdFx0aW5jb21pbmdBbmltYXRpb246IGluY29taW5nQW5pbWF0aW9uXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbjogb3V0Z29pbmdBbmltYXRpb25cblxuXHRiYWNrOiAtPiBcblx0XHRwcmV2aW91cyA9IEBoaXN0b3J5WzBdXG5cdFx0aWYgcHJldmlvdXMudmlldz9cblxuXHRcdFx0aWYgcHJldmlvdXMuaW5jb21pbmdBbmltYXRpb24gaXMgJ21hZ2ljTW92ZSdcblx0XHRcdFx0cmV0dXJuIEBtYWdpY01vdmUgcHJldmlvdXMudmlld1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRiYWNrSW4gPSBwcmV2aW91cy5vdXRnb2luZ0FuaW1hdGlvbi5yZXZlcnNlKClcblx0XHRcdFx0bW92ZU91dCA9IHByZXZpb3VzLmluY29taW5nQW5pbWF0aW9uLnJldmVyc2UoKVxuXG5cdFx0XHRcdCMgU3dpdGNoIHdoaWNoIGFuaW1hdGlvbiB0aGF0IHNob3VsZCBjYXJyeSB0aGUgZGVsYXksIGlmIGFueVxuXHRcdFx0XHRtb3ZlT3V0RGVsYXkgPSBtb3ZlT3V0Lm9wdGlvbnMuZGVsYXlcblx0XHRcdFx0bW92ZU91dC5vcHRpb25zLmRlbGF5ID0gYmFja0luLm9wdGlvbnMuZGVsYXlcblx0XHRcdFx0YmFja0luLm9wdGlvbnMuZGVsYXkgPSBtb3ZlT3V0RGVsYXlcblxuXHRcdFx0XHRiYWNrSW4uc3RhcnQoKVxuXHRcdFx0XHRtb3ZlT3V0LnN0YXJ0KClcblxuXHRcdFx0XHRAY3VycmVudCA9IHByZXZpb3VzLnZpZXdcblx0XHRcdFx0QGhpc3Rvcnkuc2hpZnQoKVxuXHRcdFx0XHRtb3ZlT3V0Lm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRcdFx0QGN1cnJlbnQuYnJpbmdUb0Zyb250KClcblxuXHRhcHBseUFuaW1hdGlvbjogKG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZyA9IHt9KSAtPlxuXHRcdHVubGVzcyBuZXdWaWV3IGlzIEBjdXJyZW50XG5cblx0XHRcdCMgcmVzZXQgY29tbW9uIHByb3BlcnRpZXMgaW4gY2FzZSB0aGV5XG5cdFx0XHQjIHdlcmUgY2hhbmdlZCBkdXJpbmcgbGFzdCBhbmltYXRpb25cblx0XHRcdCNAY3VycmVudC56ID0gMFxuXHRcdFx0bmV3Vmlldy52aXNpYmxlID0gdHJ1ZVxuXHRcdFx0bmV3Vmlldy5icmlnaHRuZXNzID0gMTAwXG5cdFx0XHRuZXdWaWV3Lm9wYWNpdHkgPSAxXG5cdFx0XHRuZXdWaWV3LnNjYWxlID0gMVxuXG5cdFx0XHRAYWRkIG5ld1ZpZXcgaWYgQHN1YkxheWVycy5pbmRleE9mKG5ld1ZpZXcpIGlzIC0xXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgY3VycmVudCB2aWV3XG5cdFx0XHRfLmV4dGVuZCBAY3VycmVudCwgb3V0Z29pbmcuc3RhcnRcblx0XHRcdG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0ID1cblx0XHRcdFx0bGF5ZXI6IEBjdXJyZW50XG5cdFx0XHRcdHByb3BlcnRpZXM6IHt9XG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbk9iamVjdC5kZWxheSA9IG91dGdvaW5nLmRlbGF5XG5cdFx0XHRfLmV4dGVuZCBvdXRnb2luZ0FuaW1hdGlvbk9iamVjdC5wcm9wZXJ0aWVzLCBvdXRnb2luZy5lbmRcblx0XHRcdF8uZXh0ZW5kIG91dGdvaW5nQW5pbWF0aW9uT2JqZWN0LCBhbmltYXRpb25PcHRpb25zXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbiA9IG5ldyBBbmltYXRpb24ob3V0Z29pbmdBbmltYXRpb25PYmplY3QpXG5cdFx0XHRvdXRnb2luZ0FuaW1hdGlvbi5zdGFydCgpXG5cblx0XHRcdCMgQW5pbWF0ZSB0aGUgbmV3IHZpZXdcblx0XHRcdF8uZXh0ZW5kIG5ld1ZpZXcsIGluY29taW5nLnN0YXJ0XG5cdFx0XHRpbmNvbWluZ0FuaW1hdGlvbk9iamVjdCA9IFxuXHRcdFx0XHRsYXllcjogbmV3Vmlld1xuXHRcdFx0XHRwcm9wZXJ0aWVzOiB7fVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb25PYmplY3QuZGVsYXkgPSBpbmNvbWluZy5kZWxheVxuXHRcdFx0Xy5leHRlbmQgaW5jb21pbmdBbmltYXRpb25PYmplY3QucHJvcGVydGllcywgaW5jb21pbmcuZW5kXG5cdFx0XHRfLmV4dGVuZCBpbmNvbWluZ0FuaW1hdGlvbk9iamVjdCwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0aW5jb21pbmdBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uKGluY29taW5nQW5pbWF0aW9uT2JqZWN0KVxuXHRcdFx0aW5jb21pbmdBbmltYXRpb24uc3RhcnQoKVxuXG5cdFx0XHRAc2F2ZUN1cnJlbnRUb0hpc3RvcnkgaW5jb21pbmdBbmltYXRpb24sIG91dGdvaW5nQW5pbWF0aW9uXG5cdFx0XHRAY3VycmVudCA9IG5ld1ZpZXdcblx0XHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cblx0Z2V0UG9pbnQ6ICh2aWV3LCBwb2ludCkgLT4gdmlldy5vcmlnaW5hbFBvaW50IHx8IHt4OjAseTowfVxuXG5cdCMjIyBBTklNQVRJT05TICMjI1xuXG5cdHN3aXRjaEluc3RhbnQ6IChuZXdWaWV3KSAtPiBAZmFkZUluIG5ld1ZpZXcsIHRpbWU6IDBcblxuXHRzbGlkZUluOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPiBcblx0XHRAc2xpZGVJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRcdHg6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRzbGlkZUluVXA6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0eDogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBAZ2V0UG9pbnQobmV3VmlldykueVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZhZGVJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0Y3Jvc3NEaXNzb2x2ZTogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRAZmFkZUluIG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmYWRlSW5CbGFjazogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRtaWRBbmltYXRpb25UaW1lID0gXG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRicmlnaHRuZXNzOiAwXG5cdFx0XHRkZWxheTogMFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHRicmlnaHRuZXNzOiAwXG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRcdGVuZDpcblx0XHRcdFx0YnJpZ2h0bmVzczogMTAwXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdGRlbGF5OiBhbmltYXRpb25PcHRpb25zLnRpbWUvMS41XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXHRcdFx0XG5cdHpvb21JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHNjYWxlOiAwLjhcblx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMVxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0em9vbWVkSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XHRzY2FsZTogMS41XG5cdFx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGVuZDpcblx0XHRcdFx0c2NhbGU6IDFcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9uc1xuXG5cdGZsaXBJbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT4gXG5cdFx0QGZsaXBJblJpZ2h0IG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5SaWdodDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoLzJcblx0XHRcdFx0ejogQHdpZHRoXG5cdFx0XHRcdHJvdGF0aW9uWTogMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0XHRcdHJvdGF0aW9uWTogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cblx0ZmxpcEluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aC8yXG5cdFx0XHRcdHo6IEB3aWR0aFxuXHRcdFx0XHRyb3RhdGlvblk6IC0xMDBcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRcdFx0cm90YXRpb25ZOiAwXG5cdFx0XHRcdHo6IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRmbGlwSW5VcDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR6OiBAaGVpZ2h0XG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdFx0cm90YXRpb25YOiAtMTAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0XHRcdHJvdGF0aW9uWDogMFxuXHRcdFx0XHR6OiAwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdHNwaW5JbjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiAwXG5cdFx0XHRcdHJvdGF0aW9uOiAxODBcblx0XHRcdFx0c2NhbGU6IDAuOFxuXHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHNjYWxlOiAxXG5cdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdFx0cm90YXRpb246IDBcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnNcblxuXHRwdXNoSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBwdXNoSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0cHVzaEluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC0oQHdpZHRoLzUpXG5cdFx0XHRcdGJyaWdodG5lc3M6IDgwXG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdGJyaWdodG5lc3M6IDEwMFxuXHRcdFx0XHR4OiBAd2lkdGhcblx0XHRcdGVuZDpcblx0XHRcdFx0eDogQGdldFBvaW50KG5ld1ZpZXcpLnhcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0cHVzaEluTGVmdDogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eDogKyhAd2lkdGgvNSlcblx0XHRcdFx0YnJpZ2h0bmVzczogOTBcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogLUB3aWR0aFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR4OiBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdEBhcHBseUFuaW1hdGlvbiBuZXdWaWV3LCBpbmNvbWluZywgYW5pbWF0aW9uT3B0aW9ucywgb3V0Z29pbmdcblxuXHRtb3ZlSW46IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+IFxuXHRcdEBtb3ZlSW5SaWdodCBuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zXG5cblx0bW92ZUluUmlnaHQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IC1Ad2lkdGhcblx0XHRpbmNvbWluZyA9XG5cdFx0XHRzdGFydDpcblx0XHRcdFx0eDogQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJbkxlZnQ6IChuZXdWaWV3LCBhbmltYXRpb25PcHRpb25zID0gQGFuaW1hdGlvbk9wdGlvbnMpIC0+XG5cdFx0b3V0Z29pbmcgPVxuXHRcdFx0c3RhcnQ6IHt9XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEB3aWR0aFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAtQHdpZHRoXG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHg6IEBnZXRQb2ludChuZXdWaWV3KS54XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vdmVJblVwOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiAtQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IEBoZWlnaHRcblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGdldFBvaW50KG5ld1ZpZXcpLnlcblx0XHRAYXBwbHlBbmltYXRpb24gbmV3VmlldywgaW5jb21pbmcsIGFuaW1hdGlvbk9wdGlvbnMsIG91dGdvaW5nXG5cblx0bW92ZUluRG93bjogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblx0XHRvdXRnb2luZyA9XG5cdFx0XHRzdGFydDoge31cblx0XHRcdGVuZDpcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdGluY29taW5nID1cblx0XHRcdHN0YXJ0OlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC1AaGVpZ2h0XG5cdFx0XHRlbmQ6XG5cdFx0XHRcdHk6IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1vZGFsOiAobmV3VmlldywgYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zKSAtPlxuXHRcdG91dGdvaW5nID1cblx0XHRcdHN0YXJ0OiB7fVxuXHRcdFx0ZW5kOlxuXHRcdFx0XHRzY2FsZTogMC45XG5cdFx0aW5jb21pbmcgPVxuXHRcdFx0c3RhcnQ6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogQGhlaWdodFxuXHRcdFx0ZW5kOlxuXHRcdFx0XHR5OiBpZiBuZXdWaWV3Lm9yaWdpbmFsUG9pbnQ/IHRoZW4gbmV3Vmlldy5vcmlnaW5hbFBvaW50LnkgZWxzZSBAaGVpZ2h0LzEwXG5cdFx0QGFwcGx5QW5pbWF0aW9uIG5ld1ZpZXcsIGluY29taW5nLCBhbmltYXRpb25PcHRpb25zLCBvdXRnb2luZ1xuXG5cdG1hZ2ljTW92ZTogKG5ld1ZpZXcsIGFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9ucykgLT5cblxuXHRcdHRyYXZlcnNlU3ViTGF5ZXJzID0gKGxheWVyKSAtPlxuXHRcdFx0YXJyID0gW11cblx0XHRcdGZpbmRTdWJMYXllciA9IChsYXllcikgLT5cblx0XHRcdFx0Zm9yIHN1YkxheWVyIGluIGxheWVyLnN1YkxheWVyc1xuXHRcdFx0XHRcdGFyci5wdXNoIHN1YkxheWVyXG5cdFx0XHRcdFx0aWYgc3ViTGF5ZXIuc3ViTGF5ZXJzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGZpbmRTdWJMYXllciBzdWJMYXllclxuXHRcdFx0XHRyZXR1cm4gYXJyXG5cdFx0XHRmaW5kU3ViTGF5ZXIgbGF5ZXJcblx0XHRcblx0XHRleGlzaXRpbmdMYXllcnMgPSB7fVxuXHRcdGZvciBzdWIgaW4gdHJhdmVyc2VTdWJMYXllcnMgQGN1cnJlbnRcblx0XHRcdGV4aXNpdGluZ0xheWVyc1tzdWIubmFtZV0gPSBzdWJcblx0XHRcblx0XHQjIHByb3BlciBzd2l0Y2ggd2l0aCBoaXN0b3J5IHN1cHBvcnRcblx0XHRuZXdWaWV3LnggPSBAZ2V0UG9pbnQobmV3VmlldykueFxuXHRcdG5ld1ZpZXcueSA9IEBnZXRQb2ludChuZXdWaWV3KS55XG5cdFx0QGFkZCBuZXdWaWV3IGlmIEBzdWJMYXllcnMuaW5kZXhPZihuZXdWaWV3KSBpcyAtMVxuXHRcdEBzYXZlQ3VycmVudFRvSGlzdG9yeSAnbWFnaWNNb3ZlJ1xuXHRcdEBjdXJyZW50ID0gbmV3Vmlld1xuXHRcdEBjdXJyZW50LmJyaW5nVG9Gcm9udCgpXG5cdFx0XG5cdFx0IyBmYW5jeSBhbmltYXRpb25zIHdpdGggbWFnaWMgbW92ZVxuXHRcdGZvciBzdWIgaW4gdHJhdmVyc2VTdWJMYXllcnMgbmV3Vmlld1xuXHRcdFx0aWYgZXhpc2l0aW5nTGF5ZXJzW3N1Yi5uYW1lXT9cblx0XHRcdFx0bWF0Y2ggPSBleGlzaXRpbmdMYXllcnNbc3ViLm5hbWVdXG5cdFx0XHRcdG5ld0ZyYW1lID0gc3ViLmZyYW1lXG5cdFx0XHRcdHByZXZGcmFtZSA9IG1hdGNoLmZyYW1lXG5cdFx0XHRcdHN1Yi5mcmFtZSA9IHByZXZGcmFtZVxuXHRcdFx0XHRhbmltYXRpb25PYmogPSBcblx0XHRcdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHRcdFx0eDogbmV3RnJhbWUueFxuXHRcdFx0XHRcdFx0eTogbmV3RnJhbWUueVxuXHRcdFx0XHRcdFx0d2lkdGg6IG5ld0ZyYW1lLndpZHRoXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IG5ld0ZyYW1lLmhlaWdodFxuXHRcdFx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0ZWxzZSAjIGZhZGUgaW4gbmV3IGxheWVyc1xuXHRcdFx0XHRzdWIub3BhY2l0eSA9IDBcblx0XHRcdFx0YW5pbWF0aW9uT2JqID0gXG5cdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdG9wYWNpdHk6IDFcblx0XHRcdF8uZXh0ZW5kIGFuaW1hdGlvbk9iaiwgYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFx0c3ViLmFuaW1hdGUgYW5pbWF0aW9uT2JqXG5cblx0IyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXHR0cmFuc2l0aW9uOiAobmV3VmlldywgZGlyZWN0aW9uID0gJ3JpZ2h0JykgLT5cblx0XHRzd2l0Y2ggZGlyZWN0aW9uXG5cdFx0XHR3aGVuICd1cCcgdGhlbiBAbW92ZUluRG93biBuZXdWaWV3XG5cdFx0XHR3aGVuICdyaWdodCcgdGhlbiBAcHVzaEluUmlnaHQgbmV3Vmlld1xuXHRcdFx0d2hlbiAnZG93bicgdGhlbiBAbW92ZUluVXAgbmV3Vmlld1xuXHRcdFx0d2hlbiAnbGVmdCcgdGhlbiBAcHVzaEluTGVmdCBuZXdWaWV3Il19
