(function () {
  "use strict";

  window.tradeWind = {
    padding: 100,
    property: {
      unspecified: "all",
      prefixes: [
        "-webkit-transition-property",
        "-moz-transition-property",
        "-o-transition-property",
        "transition-property"
      ]
    },
    duration: {
      unspecified: "0s",
      prefixes: [
        "-webkit-transition-duration",
        "-moz-transition-duration",
        "-o-transition-duration",
        "transition-duration"
      ]
    },
    easing: {
      unspecified: "ease",
      prefixes: [
        "-webkit-transition-timing-function",
        "-moz-transition-timing-function",
        "-o-transition-timing-function",
        "transition-timing-function"
      ]
    },
    delay: {
      unspecified: "0s",
      prefixes: [
        "-webkit-transition-delay",
        "-moz-transition-delay",
        "-o-transition-delay",
        "transition-delay"
      ]
    }
  };

  var temporary_animation, temporary_final, temporary_prestyles;

  function DoubleElementError (element) {
    this.message = "TradeWind - you inserted twice the same object in the instructions: " + element;
  };
  DoubleElementError.prototype = new Error;

  function EmptyArrayError (type) {
    this.message = "TradeWind - the array of " + type + " cannot be empty";
  };
  EmptyArrayError.prototype = new Error;

  function EmptySelectorError () {
    this.message = "TradeWind - the selector of animated elements cannot be empty";
  };
  EmptySelectorError.prototype = new Error;

  function MissingFieldError (type, field) {
    this.message = "TradeWind - " + type + " is missing the required field '" + field + "'";
  };
  MissingFieldError.prototype = new Error;

  function UndefinedAnimationsError () {
    this.message = "TradeWind - an instruction is missing array of animations";
  };
  UndefinedAnimationsError.prototype = new Error;

  function UndefinedError (type) {
    this.message = "TradeWind - Found an empty element in the array of " + type + "s, probably due to an unnecessary comma which is not accepted by IE";
  };
  UndefinedError.prototype = new Error;

  function UnexpectedObjectArrayError (type) {
    this.message = "TradeWind - expecting an array of " + type + ", got a different object";
  };
  UnexpectedObjectArrayError.prototype = new Error;

  function UnexpectedObjectSelectorError () {
    this.message = "TradeWind - expecting a selector of animated elements, got a different object";
  };
  UnexpectedObjectSelectorError.prototype = new Error;

  function UndefinedSelectorError () {
    this.message = "TradeWind - cannot parse an undefined selector of animated elements";
  };
  UndefinedSelectorError.prototype = new Error;

  function addNewElementToParsedInstructions (instructions, index, element) {
    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i][0] === element) throw new DoubleElementError(stringifyElement(element));
    }
    instructions[index] = [element];
  };

  function applyAnimationCss (instructions) {
    var response = [];
    var counter = 0;
    for (var i = 0; i < instructions.length; i++) {
      for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
          applyCss(instructions[i][0], window.tradeWind[instructions[i][1][j][0]].prefixes[k], instructions[i][1][j][1]);
        }
      }
      response[counter] = [instructions[i][0], instructions[i][2]];
      counter += 1;
    }
    return response;
  };

  function applyCss (element, property, content) {
    element.style[property] = content;
  };

  function applyFinalCss (instructions) {
    for (var i = 0; i < instructions.length; i++) {
      for (var j = 0; j < instructions[i][1].length; j++) {
        applyCss(instructions[i][0], instructions[i][1][j][0], instructions[i][1][j][1]);
      }
    }
  };

  function applyPreStylingCss (instructions) {
    setNeutralAnimation(instructions);
    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i][3]) {
        for (var j = 0; j < instructions[i][3].length; j++) {
          applyCss(instructions[i][0], instructions[i][3][j][0], instructions[i][3][j][1]);
        }
      }
    }
  };

  function applyUniformAnimationCss (instructions, css_applier) {
    var properties = ["property", "duration", "easing", "delay"];
    var current;
    for (var i = 0; i < instructions.length; i++) {
      for (var j = 0; j < 4; j++) {
        current = window.tradeWind[properties[j]];
        for (var k = 0; k < 4; k++) {
          applyCss(instructions[i][0], current.prefixes[k], css_applier(properties[j]));
        }
      }
    }
  };

  function checkIfPreliminaryStyles (instruction, locals) {
    if (instruction.preStyling) {
      // Exception for pre-styling
      handleExceptionForPreStyling(instruction.preStyling);
      /////////
      locals.preStyling = true;
      var resp = [];
      for (var i = 0; i < instruction.preStyling.length; i++) {
        // Exception for pre-style
        handleExceptionForUndefined(instruction.preStyling[i], "pre-style");
        handleExceptionForSinglePreStyle(instruction.preStyling[i]);
        /////////
        resp[i] = [instruction.preStyling[i].property, instruction.preStyling[i].value]
      }
      return resp;
    } else {
      return undefined;
    }
  };

  function compareAndUpdateTiming (duration, delay, locals) {
    var new_timing = (parseInt(parseFloat(duration) * 100) + parseInt(parseFloat(delay) * 100)) / 100;
    if (new_timing > locals.timing) locals.timing = new_timing;
  };

  function extractRule (property, rule) {
    if (!rule) {
      return window.tradeWind[property].unspecified;
    } else {
      return rule;
    }
  };

  function handleExceptionForAnimations (animations) {
    if (!animations) throw new UndefinedAnimationsError();
    if (!(animations instanceof Array)) throw new UnexpectedObjectArrayError("animations");
    if (animations.length === 0) throw new EmptyArrayError("animations");
  };

  function handleExceptionForNodeList (items) {
    if (items.length === 0) throw new EmptySelectorError();
  };

  function handleExceptionForPreStyling (prestyles) {
    if (!(prestyles instanceof Array)) throw new UnexpectedObjectArrayError("pre-styling");
    if (prestyles.length === 0) throw new EmptyArrayError("pre-styling");
  };

  function handleExceptionForSelector (selector) {
    if (!selector) throw new UndefinedSelectorError();
    if (!(typeof(selector) === "string" || (selector instanceof String))) throw new UnexpectedObjectSelectorError();
  };

  function handleExceptionForSingleAnimation (animation) {
    if (!animation.property) throw new MissingFieldError("animation", "property");
    if (!animation.final) throw new MissingFieldError("animation", "final");
  };

  function handleExceptionForSinglePreStyle (prestyle) {
    if (!prestyle.property) throw new MissingFieldError("pre-style", "property");
    if (!prestyle.value) throw new MissingFieldError("pre-style", "value");
  };

  function handleExceptionForUndefined (instruction, type) {
    if (!instruction) throw new UndefinedError(type);
  };

  function parseAnimation (animations, locals) {
    var parsed = [["property", ""], ["duration", ""], ["easing", ""], ["delay", ""]];
    for (var j = 0; j < animations.length; j++) {
      // Exception for animation
      handleExceptionForUndefined(animations[j], "animation");
      handleExceptionForSingleAnimation(animations[j]);
      /////////
      if (!animations[j].animationDetails) animations[j].animationDetails = {};
      parsed[0][1] += animations[j].property + ", ";
      parsed[1][1] += extractRule(
        "duration",
        animations[j].animationDetails.duration
      ) + ", ";
      parsed[2][1] += extractRule(
        "easing",
        animations[j].animationDetails.easing
      ) + ", ";
      parsed[3][1] += extractRule(
        "delay",
        animations[j].animationDetails.delay
      ) + ", ";
      compareAndUpdateTiming(
        extractRule("duration", animations[j].animationDetails.duration),
        extractRule("delay", animations[j].animationDetails.delay),
        locals
      );
      temporary_final.push([
        animations[j].property,
        animations[j].final
      ]);
    }
    parsed[0][1] = trimCss(parsed[0][1]);
    parsed[1][1] = trimCss(parsed[1][1]);
    parsed[2][1] = trimCss(parsed[2][1]);
    parsed[3][1] = trimCss(parsed[3][1]);
    temporary_animation = parsed;
  }

  function parseElement (element, instruction, response, index, locals) {
    addNewElementToParsedInstructions(response, index, element);
    if (!temporary_animation) {
      // Exception for animations
      handleExceptionForAnimations(instruction.animations);
      /////////
      temporary_final = [];
      temporary_prestyles = checkIfPreliminaryStyles(instruction, locals);
      parseAnimation(instruction.animations, locals);
    }
    response[index][1] = temporary_animation;
    response[index][2] = temporary_final;
    response[index][3] = temporary_prestyles;
  };

  function resetAnimation (instructions) {
    applyUniformAnimationCss(instructions, function (property) {
      return "";
    });
  };

  function setNeutralAnimation (instructions) {
    applyUniformAnimationCss(instructions, function (property) {
      return extractRule(property);
    });
  };

  function stringifyElement (element) {
    return "#" + element.id + "." + String(element.className).replace(" ", ".");
  };

  function trimCss (css) {
    if (css === "") return "";
    return css.substring(0, css.length - 2);
  };

  // Public function, initializes the variables
  window.tradeWind.initialize = function () {
    return {
      timing: 0,
      preStyling: false
    };
  };

  // PUblic method, parses the human-friendly instructions and converts them into an appliable array
  window.tradeWind.parse = function (instructions, locals) {
    var response = [], curr_index = 0;
    for (var i = 0; i < instructions.length; i++) {
      // Exception for instruction
      handleExceptionForUndefined(instructions[i], "instruction");
      /////////
      temporary_animation = undefined;
      temporary_final = undefined;
      temporary_prestyles = undefined;
      // Exception for selector
      handleExceptionForSelector(instructions[i].elements);
      /////////
      instructions[i].elements = document.querySelectorAll(instructions[i].elements);
      // Exception for elements
      handleExceptionForNodeList(instructions[i].elements);
      /////////
      for (var j = 0; j < instructions[i].elements.length; j++) {
        parseElement(instructions[i].elements[j], instructions[i], response, curr_index, locals);
        curr_index += 1;
      }
    }
    return response;
  };

  // Public method, applies the CSS; used differently in case of pre-styling
  window.tradeWind.apply = function (instructions, callback, locals) {
    var final_padding, new_vals = applyAnimationCss(instructions);
    applyFinalCss(new_vals);
    final_padding = locals.timing * 1000 + window.tradeWind.padding;
    if (window.Modernizr && !Modernizr.csstransitions) final_padding = window.tradeWind.padding;
    setTimeout(function () {
      resetAnimation(new_vals);
      if (callback !== undefined) callback();
    }, final_padding);
  };

  // Public method, runs the animation; for a sample of configuration see the spec
  window.tradeWind.run = function (instructions, callback) {
    var locals = window.tradeWind.initialize();
    var instructions = window.tradeWind.parse(instructions, locals);
    if (locals.preStyling) {
      applyPreStylingCss(instructions);
      setTimeout(function () {
        window.tradeWind.apply(instructions, callback, locals);
      }, window.tradeWind.padding);
    } else {
      window.tradeWind.apply(instructions, callback, locals);
    }
  };

}());
