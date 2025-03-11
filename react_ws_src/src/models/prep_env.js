import superagent from "superagent";
import X2JS from "x2js";

// Changed from "/static/ws_conf.xml" to match the actual path when served
// This import statement might not be needed as we're loading via superagent
// import "/ws_conf.xml";

const prep_env = function (ca) {
  // console.log("prep_env with : ", data_js, card_type, team, pos, sort);

  const call_after = ca;

  // Ensure window.app exists before proceeding
  if (!window.app) {
    console.error("window.app not initialized in prep_env");

    // Create event handlers collection
    const eventHandlers = {};

    window.app = {
      settings: {
        is_mobile: false,
        mobile_type: null,
        can_app: false,
        ws_conf: null,
        curr_user: null,
        user_ready: false,
        user_types: [],
        basket_type: null,
        basket_total: 0,
      },
      events: {
        show_message: "show_message",
        show_page: "show_page",
      },
      show_page: (u) => {
        console.log("Default show_page handler from prep_env", u);
      },
      // Add event methods
      on: (eventName, callback) => {
        console.log(`Registering handler for ${eventName} from prep_env`);
        if (!eventHandlers[eventName]) {
          eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(callback);
      },
      off: (eventName, callback) => {
        if (!eventHandlers[eventName]) return;
        if (!callback) {
          delete eventHandlers[eventName];
        } else {
          eventHandlers[eventName] = eventHandlers[eventName].filter(
            (cb) => cb !== callback
          );
        }
      },
      trigger: (eventName, ...args) => {
        console.log(`Triggering event ${eventName} from prep_env`, args);
        if (!eventHandlers[eventName]) return;
        eventHandlers[eventName].forEach((callback) => {
          try {
            callback(...args);
          } catch (e) {
            console.error(`Error in event handler for ${eventName}:`, e);
          }
        });
      },
    };
  }

  load_conf();

  return;

  // ---- --------------------------------------------  --------------------------------------------

  function load_conf() {
    // console.log("conf_file", conf_file)

    const conf_file = "/ws_conf.xml";

    superagent.get(conf_file).end(function (err, res) {
      if (err || !res.ok) {
        console.error("Can't load site configuration", err);

        // Provide fallback configuration for critical UI elements
        window.app.settings.ws_conf = {
          header: {
            head_l_logo: { i: "/images/react_sha.png", u: "/" },
            site_title: { txt: "X Tic Tac Toe", u: "/" },
          },
          footer: {
            items: { i: [{ tp: "txt", txt: "© 2023 X TTT" }] },
            foot_msg: { txt: "Created with React" },
            foot_r_logo: { i: "", u: "#", t: "_blank" },
          },
          main_menu: {
            pages: { p: [{ name: "Home", u: "/", ico: "fa-home" }] },
          },
          site: { vals: { year: new Date().getFullYear() } },
          conf: {},
        };

        // Continue app initialization even with the fallback config
        prep_site();
        return;
      }

      try {
        const x2js = new X2JS({ attributePrefix: "" });
        const conf_json = x2js.xml2js(res.text);

        window.app.settings.ws_conf = conf_json.data;
        // console.log('loaded site configuration', window.app.settings.ws_conf)
        console.log(
          "loaded site configuration",
          window.app.settings.ws_conf.site.vals.year
        );

        // Force a UI update by triggering a custom event
        try {
          const event = new Event("app_config_loaded");
          window.dispatchEvent(event);
          console.log("Triggered app_config_loaded event");
        } catch (e) {
          console.error("Could not trigger update event:", e);
        }

        prep_site();
      } catch (error) {
        console.error("Error parsing configuration XML:", error);

        // Provide fallback configuration
        window.app.settings.ws_conf = {
          header: {
            head_l_logo: { i: "/images/react_sha.png", u: "/" },
            site_title: { txt: "X Tic Tac Toe", u: "/" },
          },
          footer: {
            items: { i: [{ tp: "txt", txt: "© 2023 X TTT" }] },
            foot_msg: { txt: "Created with React" },
            foot_r_logo: { i: "", u: "#", t: "_blank" },
          },
          main_menu: {
            pages: { p: [{ name: "Home", u: "/", ico: "fa-home" }] },
          },
          site: { vals: { year: new Date().getFullYear() } },
          conf: {},
        };

        prep_site();
      }
    });

    set_settings();
  }

  // ---- --------------------------------------------  --------------------------------------------

  function set_settings() {
    //	http://stackoverflow.com/questions/998245/how-can-i-detect-if-flash-is-installed-and-if-not-display-a-hidden-div-that-inf
    // https://forums.adobe.com/thread/1899487?start=0&tstart=0
    if ("ActiveXObject" in window) {
      // IE only
      try {
        window.app.settings.hasFlash = !!new ActiveXObject(
          "ShockwaveFlash.ShockwaveFlash"
        );
      } catch (e) {}
    } else {
      // W3C, better support in legacy browser
      window.app.settings.hasFlash =
        !!navigator.mimeTypes["application/x-shockwave-flash"];
    }

    // try{
    // 	if(new ActiveXObject('ShockwaveFlash.ShockwaveFlash')){		//IE only
    // 		window.app.settings.hasFlash = true;
    // 	}
    // }catch(e){
    // 	if(navigator.mimeTypes ['application/x-shockwave-flash'] !== undefined){	//W3C, better support in legacy browser
    // 		window.app.settings.hasFlash = true;
    // 	}
    // }

    window.app.settings.is_mobile = !!(
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPad|iPhone|iPod/i) ||
      navigator.userAgent.match(
        /webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile|windows mobile/i
      )
    );

    if (window.app.settings.is_mobile)
      window.app.settings.mobile_type = navigator.userAgent.match(/Android/i)
        ? "Android"
        : navigator.userAgent.match(/iPad|iPhone|iPod/i)
        ? "iOS"
        : null;

    // window.app.settings.is_mobile = true

    window.app.settings.can_app = !!window.app.settings.mobile_type;
    window.app.settings.couldHaveFlash = !window.app.settings.is_mobile;

    // console.log("window.app.settings: ", window.app.settings)
  }

  // ---- --------------------------------------------  --------------------------------------------

  function prep_site() {
    call_after();
  }

  // ---- --------------------------------------------  --------------------------------------------
};

export default prep_env;
