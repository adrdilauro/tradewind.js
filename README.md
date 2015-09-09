# Welcome to tradewind.js!

<img src="https://cloud.githubusercontent.com/assets/1175837/6318836/0077e348-ba9d-11e4-9d57-3f33df352a2e.png"/>

I am proud to present you <b>tradewind.js</b>, a JavaScript plugin that implements a user-friendly interface for powerful CSS3 animations.

For a nice demonstration of this powerful plugin, please have a look at [adrdilauro.github.io](http://adrdilauro.github.io).

Already a user of <b>tradewind.js</b>? You might be interested in the [complete documentation](https://github.com/adrdilauro/tradewind.js/wiki).

Do you use Ruby? Have a look at the [ruby gem wrapper for tradewind.js](https://github.com/adrdilauro/tradewind).

## Essential features

#### 1 - Easy and human-friendly interface
At least as intuitive as jQueryUI

#### 2 - All the advantages of CSS3
Forget jQueryUI's heavy and buggy handling of jQuery objects! With jQueryUI your JavaScript does a lot of hidden work to show small animations, <b>tradewind.js</b> instead does the minimum and gets a result that users feel like magic.

#### 3 - A clean, clear, cross-browser callback after animation's end
Firefox and Chrome didn't even agree how many end events should be fired in the end of a CSS3 animation? Did you get stuck in questions like [this](http://stackoverflow.com/questions/9255279/callback-when-css3-transition-finishes)? Forget about it, <b>tradewind.js</b> simply calculates the transition times and provides you a callback using vanilla JavaScript!

#### 4 - No dependencies at all
<b>tradewind.js</b> is written in vanilla JavaScript!

#### 5 - Compatibility with IE8 and IE9
Animations won't work because they are not supported, but the overall effect is still perfectly acceptable, being analogous to a simple change of style. You don't have to give up on animations because some of your users still have old browsers!

#### 6 - Compatibility with existing default transitions
Default transitions are overwritten during the animation, and restored at its end.

#### 7 - Why tradewind.js?
CSS3 animations are smooth, light, and included in HTML5 specifications, but they are really uncomfortable to use, because:

1. they must be attached on an element <b>previously</b>, and on a whitelist of selected properties: the actual animation will take place later, when you change style of one of the those properties;
2. they are very verbose and they need prefixes;
3. they must be written inside the CSS, forcing the developer to write animation's logics in an obscure way, and outside of the JavaScript files.

Now, <b>tradewind.js</b> lets you enjoy the power of CSS3 animations without noticing these problems!

## How to use it

A very simple example:

```javascript
tradeWind.run([
  {
    elements: "#first-div",
    animations: [
      {
        property: "background-color",
        animationDetails: {
          duration: "0.5s",
          delay: "0.2s"
        },
        final: "#123456"
      },
      {
        property: "top",
        animationDetails: {
          duration: "1s"
        },
        final: "100px"
      }
    ]
  },
  {
    elements: "#second-div, #third-div",
    animations: [
      {
        property: "opacity",
        animationDetails: {
          duration: "0.7s"
        },
        final: "0.8"
      }
    ]
  }
]);
```

This call will smoothly change the background color of `#first-div`, with a delay of 0.2, and move it until a top position of `100px`. Contemporaneously, it will smoothly change the opacity of both `#second-div` and `#third-div`, until a value of 0.8.

Want to know more? For the detailed API, have a look at [the official documentation](https://github.com/adrdilauro/tradewind.js/wiki).

##### Ready? Now relax and let a smooth trade wind animate your applications for you
