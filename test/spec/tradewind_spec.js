(function () {
  "use strict";

  describe("Tradewind.js", function () {
    var sample;

    var withManipulatedTime = function (assertions) {
      jasmine.clock().install();
      try {
        assertions(jasmine.clock().tick);
      } catch(err) {
        jasmine.clock().uninstall();
        throw err;
      }
      jasmine.clock().uninstall();
    };

    var resetSample = function () {
      sample = [
        {
          elements: "#sphere",
          preStyling: [
            {
              property: "display",
              value: "block"
            },
            {
              property: "height",
              value: "0px"
            }
          ],
          animations: [
            {
              property: "width",
              animationDetails: {
                duration: "0.4s",
                easing: "ease"
              },
              final: "1000px"
            },
            {
              property: "height",
              animationDetails: {
                duration: "0.5s",
                delay: "0.1s"
              },
              final: "34px"
            }
          ]
        },
        {
          elements: "#triangle, #cube",
          animations: [
            {
              property: "height",
              animationDetails: {
                duration: "0.5s",
                easing: "ease-out",
                delay: "0.1s"
              },
              final: "340px"
            }
          ]
        }
      ];
    };

    it("should provide a 'run' method", function () {
      expect(tradeWind.run).toBeDefined();
    });

    describe("parse", function () {

      beforeEach(function () {
        resetSample();
      });

      it("should be always called when the animation runs", function () {
        spyOn(tradeWind, "parse").and.returnValue([]);
        tradeWind.run([1, 2, 3]);
        expect(tradeWind.parse.calls.count()).toEqual(1);
      });

      it("should accept the sample instructions without throwing exceptions", function () {
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).not.toThrow();
      });

      it("should raise an exception if an instruction is undefined", function () {
        sample.push(undefined);
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/empty element in the array of instructions/);
      });

      it("should raise an exception if elements are undefined", function () {
        sample[0].elements = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/cannot parse an undefined selector of animated elements/);
      });

      it("should raise an exception if elements are not a selector", function () {
        sample[0].elements = 123;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/expecting a selector of animated elements, got a different object/);
        sample[0].elements = "#sphere";
        sample[1].elements = "#triangle, #cube";
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).not.toThrow();
        sample[0].elements = new String("#sphere");
        sample[1].elements = new String("#triangle, #cube");
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).not.toThrow();
      });

      it("should raise an exception if the selector of elements is empty", function () {
        sample[0].elements = "#square";
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/the selector of animated elements cannot be empty/);
      });

      it("should raise an exception if animations are undefined", function () {
        sample[0].animations = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/missing array of animations/);
      });

      it("should raise an exception if animations are not an array", function () {
        sample[0].animations = 123;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/expecting an array of animations, got a different object/);
      });

      it("should raise an exception if animations are empty", function () {
        sample[0].animations = [];
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/the array of animations cannot be empty/);
      });

      it("should raise an exception if an animation doesn't contain 'property'", function () {
        sample[0].animations[0].property = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/animation is missing the required field 'property'/);
      });

      it("shouldn't raise an exception if the user decides not to define animationDetails", function () {
        sample[0].animations[0].animationDetails = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).not.toThrow();
      });

      it("should raise an exception if an animation doesn't contain 'final'", function () {
        sample[0].animations[0].final = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/animation is missing the required field 'final'/);
      });

      it("shouldn't raise an exception if the user decides not to define prestyling", function () {
        sample[0].preStyling = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).not.toThrow();
      });

      it("should raise an exception if pre-styling are not an array", function () {
        sample[0].preStyling = 123;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/expecting an array of pre-styling, got a different object/);
      });

      it("should raise an exception if pre-styling are empty", function () {
        sample[0].preStyling = [];
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/the array of pre-styling cannot be empty/);
      });

      it("should raise an exception if a pre-style doesn't contain 'property'", function () {
        sample[0].preStyling[0].property = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/pre-style is missing the required field 'property'/);
      });

      it("should raise an exception if a pre-style doesn't contain 'value'", function () {
        sample[0].preStyling[0].value = undefined;
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/pre-style is missing the required field 'value'/);
      });

      it("should raise an exception if an animation is undefined", function () {
        sample[0].animations.push(undefined);
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/empty element in the array of animations/);
      });

      it("should raise an exception if a pre-style is undefined", function () {
        sample[0].preStyling.push(undefined);
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/empty element in the array of pre-styles/);
      });

      it("should return a correct parsed sample", function () {
        var response = tradeWind.parse(sample, {timing: 0, preStyling: false});
        expect(response.length).toEqual(3);
        // First object: "sphere"
        expect(response[0].length).toEqual(4);
        expect(response[0][0].id).toEqual("sphere");
        expect(response[0][1].length).toEqual(4);
        expect(response[0][1][0].length).toEqual(2);
        expect(response[0][1][0][0]).toEqual("property");
        expect(response[0][1][0][1]).toEqual("width, height");
        expect(response[0][1][1].length).toEqual(2);
        expect(response[0][1][1][0]).toEqual("duration");
        expect(response[0][1][1][1]).toEqual("0.4s, 0.5s");
        expect(response[0][1][2].length).toEqual(2);
        expect(response[0][1][2][0]).toEqual("easing");
        expect(response[0][1][2][1]).toEqual("ease, ease");
        expect(response[0][1][3].length).toEqual(2);
        expect(response[0][1][3][0]).toEqual("delay");
        expect(response[0][1][3][1]).toEqual("0s, 0.1s");
        expect(response[0][2].length).toEqual(2);
        expect(response[0][2][0].length).toEqual(2);
        expect(response[0][2][0][0]).toEqual("width");
        expect(response[0][2][0][1]).toEqual("1000px");
        expect(response[0][2][1].length).toEqual(2);
        expect(response[0][2][1][0]).toEqual("height");
        expect(response[0][2][1][1]).toEqual("34px");
        expect(response[0][3].length).toEqual(2);
        expect(response[0][3][0].length).toEqual(2);
        expect(response[0][3][0][0]).toEqual("display");
        expect(response[0][3][0][1]).toEqual("block");
        expect(response[0][3][1].length).toEqual(2);
        expect(response[0][3][1][0]).toEqual("height");
        expect(response[0][3][1][1]).toEqual("0px");
        // Second object: "triangle"
        expect(response[1].length).toEqual(4);
        expect(response[1][0].id).toEqual("triangle");
        expect(response[1][1].length).toEqual(4);
        expect(response[1][1][0].length).toEqual(2);
        expect(response[1][1][0][0]).toEqual("property");
        expect(response[1][1][0][1]).toEqual("height");
        expect(response[1][1][1].length).toEqual(2);
        expect(response[1][1][1][0]).toEqual("duration");
        expect(response[1][1][1][1]).toEqual("0.5s");
        expect(response[1][1][2].length).toEqual(2);
        expect(response[1][1][2][0]).toEqual("easing");
        expect(response[1][1][2][1]).toEqual("ease-out");
        expect(response[1][1][3].length).toEqual(2);
        expect(response[1][1][3][0]).toEqual("delay");
        expect(response[1][1][3][1]).toEqual("0.1s");
        expect(response[1][2].length).toEqual(1);
        expect(response[1][2][0].length).toEqual(2);
        expect(response[1][2][0][0]).toEqual("height");
        expect(response[1][2][0][1]).toEqual("340px");
        expect(response[1][3]).not.toBeDefined();
        // Third object: "cube"
        expect(response[2].length).toEqual(4);
        expect(response[2][0].id).toEqual("cube");
        expect(response[2][1].length).toEqual(4);
        expect(response[2][1][0].length).toEqual(2);
        expect(response[2][1][0][0]).toEqual("property");
        expect(response[2][1][0][1]).toEqual("height");
        expect(response[2][1][1].length).toEqual(2);
        expect(response[2][1][1][0]).toEqual("duration");
        expect(response[2][1][1][1]).toEqual("0.5s");
        expect(response[2][1][2].length).toEqual(2);
        expect(response[2][1][2][0]).toEqual("easing");
        expect(response[2][1][2][1]).toEqual("ease-out");
        expect(response[2][1][3].length).toEqual(2);
        expect(response[2][1][3][0]).toEqual("delay");
        expect(response[2][1][3][1]).toEqual("0.1s");
        expect(response[2][2].length).toEqual(1);
        expect(response[2][2][0].length).toEqual(2);
        expect(response[2][2][0][0]).toEqual("height");
        expect(response[2][2][0][1]).toEqual("340px");
        expect(response[2][3]).not.toBeDefined();
      });

      it("should return an empty array if called with an empty array", function () {
        var response = tradeWind.parse([], {timing: 0, preStyling: false});
        expect(response.length).toEqual(0);
      });

      it("should use the default values if called with undefined animationDetails", function () {
        sample[1].animations[0].animationDetails = undefined;
        var response = tradeWind.parse(sample, {timing: 0, preStyling: false});
        // Second object: "triangle"
        expect(response[1][1].length).toEqual(4);
        expect(response[1][1][1].length).toEqual(2);
        expect(response[1][1][1][0]).toEqual("duration");
        expect(response[1][1][1][1]).toEqual("0s");
        expect(response[1][1][2].length).toEqual(2);
        expect(response[1][1][2][0]).toEqual("easing");
        expect(response[1][1][2][1]).toEqual("ease");
        expect(response[1][1][3].length).toEqual(2);
        expect(response[1][1][3][0]).toEqual("delay");
        expect(response[1][1][3][1]).toEqual("0s");
        // Third object: "cube"
        expect(response[2][1].length).toEqual(4);
        expect(response[2][1][1].length).toEqual(2);
        expect(response[2][1][1][0]).toEqual("duration");
        expect(response[2][1][1][1]).toEqual("0s");
        expect(response[2][1][2].length).toEqual(2);
        expect(response[2][1][2][0]).toEqual("easing");
        expect(response[2][1][2][1]).toEqual("ease");
        expect(response[2][1][3].length).toEqual(2);
        expect(response[2][1][3][0]).toEqual("delay");
        expect(response[2][1][3][1]).toEqual("0s");
      });

      it("should raise an exception if an element is inserted twice", function () {
        sample[0].elements = "#cube";
        expect(function () {
          tradeWind.parse(sample, {timing: 0, preStyling: false});
        }).toThrowError(/you inserted twice the same object in the instructions: #cube./);
      });

      it("should calculate the exact timing during parse", function () {
        var locals = tradeWind.initialize();
        tradeWind.parse(sample, locals);
        expect(tradeWind.timing).toEqual(0.6);
      });

      it("should change the timing according to changes on the instructions", function () {
        sample[1].animations[0].animationDetails.duration = "0.2s";
        var locals = tradeWind.initialize();
        tradeWind.parse(sample, locals);
        expect(tradeWind.timing).toEqual(0.6);
        sample[0].animations[1].animationDetails.duration = "0.2s";
        locals = tradeWind.initialize();
        sample[0].elements = "#sphere";
        sample[1].elements = "#triangle, #cube";
        tradeWind.parse(sample, locals);
        expect(tradeWind.timing).toEqual(0.4);
      });

      it("shouldn't make mistakes with decimal sums", function () {
        sample[0].animations[0].animationDetails.duration = "0.1s";
        sample[0].animations[0].animationDetails.delay = "0.1s";
        sample[0].animations[1].animationDetails.duration = "0.1s";
        sample[0].animations[1].animationDetails.delay = "0.1s";
        sample[1].animations[0].animationDetails.duration = "0.2s";
        sample[1].animations[0].animationDetails.delay = "0.1s";
        var locals = tradeWind.initialize();
        tradeWind.parse(sample, locals);
        expect(tradeWind.timing).toEqual(0.3);
      });

      it("should correctly set the variable preStyling when there is a preStyling", function () {
        var locals = tradeWind.initialize();
        tradeWind.parse(sample, locals);
        expect(tradeWind.preStyling).toEqual(true);
      });

      it("should set preStyling as false if there is no prestyle", function () {
        sample[0].preStyling = undefined;
        var locals = tradeWind.initialize();
        tradeWind.parse(sample, locals);
        expect(tradeWind.preStyling).toEqual(false);
      });

    });

    describe("run", function () {

      beforeEach(function () {
        resetSample();
        $("#sphere").removeAttr("style");
        $("#triangle").removeAttr("style");
        $("#cube").removeAttr("style");
        window.Modernizr = undefined;
      });

      it("should call initialize", function () {
        withManipulatedTime(function (timeFlow) {
          spyOn(tradeWind, "initialize");
          tradeWind.run(sample);
          // pad + 600 + pad (+ 10 that I use just to have a small additional padding in the test)
          timeFlow(810);
          expect(tradeWind.initialize.calls.count()).toEqual(1);
        });
      });

      it("should correctly apply preStyles and animation styles, resets them and calls the callback", function () {
        withManipulatedTime(function (timeFlow) {
          var callback_detector = {
            called: false
          };
          var sphere = $("#sphere");
          var triangle = $("#triangle");
          var cube = $("#cube");
          tradeWind.run(sample, function () {
            callback_detector.called = true;
          });
          // Callback has not been called yet
          expect(callback_detector.called).toEqual(false);
          // Prestyles have been correctly registered, and animation properties have been normalized
          expect(sphere.attr("style")).toEqual("transition: all 0s ease 0s; display: block; height: 0px;");
          expect(triangle.attr("style")).toEqual("transition: all 0s ease 0s;");
          expect(cube.attr("style")).toEqual("transition: all 0s ease 0s;");
          // Now we pass to the next step of the animation process
          // pad +10
          timeFlow(110);
          // Callback has not been called yet
          expect(callback_detector.called).toEqual(false);
          // The final styles have been correctly registered, together with the animation styles
          expect(sphere.attr("style")).toEqual("transition: width 0.4s ease 0s, height 0.5s ease 0.1s; display: block; height: 34px; width: 1000px;");
          expect(triangle.attr("style")).toEqual("transition: height 0.5s ease-out 0.1s; height: 340px;");
          expect(cube.attr("style")).toEqual("transition: height 0.5s ease-out 0.1s; height: 340px;");
          // 600 + pad - 20, just before the callback
          timeFlow(680);
          expect(callback_detector.called).toEqual(false);
          // Now we pass to the final step of the animation process
          timeFlow(20);
          // Finally, the callback has been called
          expect(callback_detector.called).toEqual(true);
          // The animation styles have been correctly reset
          expect(sphere.attr("style")).toEqual("display: block; height: 34px; width: 1000px;");
          expect(triangle.attr("style")).toEqual("height: 340px;");
          expect(cube.attr("style")).toEqual("height: 340px;");
        });
      });

      it("should correctly apply and animation styles and callback, even if there is no preStyle", function () {
        withManipulatedTime(function (timeFlow) {
          sample[0].preStyling = undefined;
          var callback_detector = {
            called: false
          };
          var sphere = $("#sphere");
          var triangle = $("#triangle");
          var cube = $("#cube");
          tradeWind.run(sample, function () {
            callback_detector.called = true;
          });
          // Callback has not been called yet
          expect(callback_detector.called).toEqual(false);
          // The final styles have been correctly registered
          expect(sphere.attr("style")).toEqual("transition: width 0.4s ease 0s, height 0.5s ease 0.1s; width: 1000px; height: 34px;");
          expect(triangle.attr("style")).toEqual("transition: height 0.5s ease-out 0.1s; height: 340px;");
          expect(cube.attr("style")).toEqual("transition: height 0.5s ease-out 0.1s; height: 340px;");
          // 600 + pad - 10: just before the callback
          timeFlow(690);
          expect(callback_detector.called).toEqual(false);
          // Now we pass to the final step of the animation process
          timeFlow(20);
          // Finally, the callback has been called
          expect(callback_detector.called).toEqual(true);
          // The animation styles have been correctly reset
          expect(sphere.attr("style")).toEqual("width: 1000px; height: 34px;");
          expect(triangle.attr("style")).toEqual("height: 340px;");
          expect(cube.attr("style")).toEqual("height: 340px;");
        });
      });

    });

    describe("callbacks in IE", function () {

      beforeEach(function () {
        resetSample();
        window.Modernizr = {};
      });

      it("should behave normally if Modernizr.csstransitions is true", function () {
        window.Modernizr.csstransitions = true;
        withManipulatedTime(function (timeFlow) {
          var callback_detector = {
            called: false
          };
          tradeWind.run(sample, function () {
            callback_detector.called = true;
          });
          // For explanation of time flows, this refers to the above example with prestyling
          expect(callback_detector.called).toEqual(false);
          timeFlow(110);
          expect(callback_detector.called).toEqual(false);
          timeFlow(680);
          expect(callback_detector.called).toEqual(false);
          timeFlow(20);
          expect(callback_detector.called).toEqual(true);
        });
      });

      it("should fire the callback immediately if Modernizr.csstransitions is false", function () {
        window.Modernizr.csstransitions = false;
        withManipulatedTime(function (timeFlow) {
          var callback_detector = {
            called: false
          };
          tradeWind.run(sample, function () {
            callback_detector.called = true;
          });
          // See previous example, this time I just remove the timing of 600
          expect(callback_detector.called).toEqual(false);
          timeFlow(110);
          expect(callback_detector.called).toEqual(false);
          timeFlow(80);
          expect(callback_detector.called).toEqual(false);
          timeFlow(20);
          expect(callback_detector.called).toEqual(true);
        });
      });

    });

  });

}());
