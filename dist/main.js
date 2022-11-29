import { p as phaser, s as styleInject } from './vendor-39c8e163.js';

const preload = () => console.log("scene preload");

const create = () => console.log("scene create");

const config = {
  type: phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    // update: update,
  },
};

function setup() {
  return new Promise((resolve, reject) => {
    try {
      // TODO: clan code
      const game = new phaser.Game(config);
      return resolve(game);
    } catch (exc) {
      reject(exc);
    }
  });
}

var css_248z$2 = "/* http://meyerweb.com/eric/tools/css/reset/ \r\n   v2.0 | 20110126\r\n   License: none (public domain)\r\n*/\r\n\r\nhtml,\r\nbody,\r\ndiv,\r\nspan,\r\napplet,\r\nobject,\r\niframe,\r\nh1,\r\nh2,\r\nh3,\r\nh4,\r\nh5,\r\nh6,\r\np,\r\nblockquote,\r\npre,\r\na,\r\nabbr,\r\nacronym,\r\naddress,\r\nbig,\r\ncite,\r\ncode,\r\ndel,\r\ndfn,\r\nem,\r\nimg,\r\nins,\r\nkbd,\r\nq,\r\ns,\r\nsamp,\r\nsmall,\r\nstrike,\r\nstrong,\r\nsub,\r\nsup,\r\ntt,\r\nvar,\r\nb,\r\nu,\r\ni,\r\ncenter,\r\ndl,\r\ndt,\r\ndd,\r\nol,\r\nul,\r\nli,\r\nfieldset,\r\nform,\r\nlabel,\r\nlegend,\r\ntable,\r\ncaption,\r\ntbody,\r\ntfoot,\r\nthead,\r\ntr,\r\nth,\r\ntd,\r\narticle,\r\naside,\r\ncanvas,\r\ndetails,\r\nembed,\r\nfigure,\r\nfigcaption,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmenu,\r\nnav,\r\noutput,\r\nruby,\r\nsection,\r\nsummary,\r\ntime,\r\nmark,\r\naudio,\r\nvideo {\r\n  margin: 0;\r\n  padding: 0;\r\n  border: 0;\r\n  font-size: 100%;\r\n  font: inherit;\r\n  vertical-align: baseline;\r\n}\r\n/* HTML5 display-role reset for older browsers */\r\narticle,\r\naside,\r\ndetails,\r\nfigcaption,\r\nfigure,\r\nfooter,\r\nheader,\r\nhgroup,\r\nmenu,\r\nnav,\r\nsection {\r\n  display: block;\r\n}\r\nbody {\r\n  line-height: 1;\r\n}\r\nol,\r\nul {\r\n  list-style: none;\r\n}\r\nblockquote,\r\nq {\r\n  quotes: none;\r\n}\r\nblockquote:before,\r\nblockquote:after,\r\nq:before,\r\nq:after {\r\n  content: \"\";\r\n  content: none;\r\n}\r\ntable {\r\n  border-collapse: collapse;\r\n  border-spacing: 0;\r\n}\r\n";
styleInject(css_248z$2);

var css_248z$1 = "body {\r\n  display: flex;\r\n  flex-direction: row;\r\n  width: 100vw;\r\n  min-height: 100vh;\r\n  background-color: var(--body-bg-color);\r\n  font-family: \"Lora\", serif;\r\n  font-family: \"Open Sans\", sans-serif;\r\n}\r\n\r\n.hidden {\r\n  opacity: 0;\r\n}\r\n";
styleInject(css_248z$1);

var css_248z = "@keyframes spin {\r\n  100% {\r\n    transform: rotate(360deg);\r\n    filter: hue-rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin1 {\r\n  20% {\r\n    transform: rotate(150deg);\r\n  }\r\n  40% {\r\n    transform: rotate(300deg);\r\n  }\r\n  80% {\r\n    transform: rotate(300deg);\r\n  }\r\n  100% {\r\n    transform: rotate(360deg);\r\n  }\r\n}\r\n\r\n@keyframes spin2 {\r\n  0% {\r\n    transform: rotate(-30deg);\r\n  }\r\n  20% {\r\n    transform: rotate(-30deg);\r\n    border-color: transparent transparent #aaa #aaa;\r\n  }\r\n  21% {\r\n    border-color: orange orange transparent transparent;\r\n  }\r\n  40% {\r\n    transform: rotate(-30deg);\r\n  }\r\n  60% {\r\n    transform: rotate(120deg);\r\n    border-color: orange orange transparent transparent;\r\n  }\r\n  61% {\r\n    border-color: transparent transparent #aaa #aaa;\r\n  }\r\n  80% {\r\n    transform: rotate(270deg);\r\n  }\r\n  100% {\r\n    transform: rotate(330deg);\r\n  }\r\n}\r\n\r\n.loader-container {\r\n  width: 100%;\r\n  height: 100%;\r\n  z-index: 1000;\r\n  display: flex;\r\n  align-items: center;\r\n  justify-content: center;\r\n  background-color: #cfd3d51c;\r\n  top: 0;\r\n  position: absolute;\r\n}\r\n\r\n.loader-container.partial {\r\n  position: relative;\r\n  display: flex;\r\n}\r\n\r\n.loader,\r\n.loader:before,\r\n.loader:after {\r\n  top: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  right: 0;\r\n  content: \"\";\r\n  position: absolute;\r\n  border-radius: 50%;\r\n}\r\n\r\n.loader {\r\n  position: fixed;\r\n  width: 100px;\r\n  height: 100px;\r\n  margin: auto;\r\n  animation: spin 4s linear infinite;\r\n}\r\n\r\n.loader:before {\r\n  border: 5px solid #aaa;\r\n  border-bottom: 5px solid orange;\r\n  border-left: 5px solid orange;\r\n  animation: spin1 1s linear infinite;\r\n}\r\n\r\n.loader:after {\r\n  border: 5px solid #aaa;\r\n  border-top: 5px solid transparent;\r\n  border-right: 5px solid transparent;\r\n  animation: spin2 1s linear infinite;\r\n}\r\n\r\n.loader-container.partial .loader {\r\n  position: relative;\r\n  width: 30px;\r\n  height: 30px;\r\n}\r\n";
styleInject(css_248z);

// even though Rollup is bundling all your files together, errors and
// logs will still point to your original source modules
console.log(
  "if you have sourcemaps enabled in your devtools, click on main.js:5 -->"
);

setup()
  .then((game) => {
    document.querySelector(".loader-container").remove();
    console.log("%cgame init done!!", "color:green; font-size:30px;");
    console.log(game);
  })
  .catch((exc) => console.error("game init failed", exc.message));
//# sourceMappingURL=main.js.map
