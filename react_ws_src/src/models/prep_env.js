import superagent from "superagent";
import X2JS from "x2js";
import store, { setWSConf } from "../store";

// Changed from "/static/ws_conf.xml" to match the actual path when served
// This import statement might not be needed as we're loading via superagent
// import "/ws_conf.xml";

const prep_env = function (ca) {
  const call_after = ca;

  // Ensure window.app exists before proceeding
  if (!window.app) {
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
        // Default show_page handler
      },
      // Add event methods
      on: (eventName, callback) => {
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
        if (!eventHandlers[eventName]) return;
        eventHandlers[eventName].forEach((callback) => {
          try {
            callback(...args);
          } catch (e) {
            // Error in event handler
          }
        });
      },
    };
  }

  try {
    load_conf();
  } catch (error) {
    // Use default configuration and continue
    defaultConfig();
    prep_site();
  }

  return;

  // ---- --------------------------------------------  --------------------------------------------

  function defaultConfig() {
    const defaultWSConf = {
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
        pages: {
          p: [
            { name: "Home", u: "/", ico: "fa fa-home" },
            { name: "Info", u: "/pg/info", ico: "fa fa-info" },
          ],
        },
      },
      site: { vals: { year: new Date().getFullYear() } },
      conf: {},
      // Add minimal content for pages
      pgs: {
        home: {
          pg_name: "Home",
          txt: "<div>Welcome to X Tic Tac Toe</div>",
          btns: { b: { txt: "PLAY", u: "/ttt" } },
        },
        info: {
          pg_name: "Info",
          txt: "<section id='info'><div>This is a simple example of React.js and Node.js stack based web app</div></section>",
          btns: { b: { txt: "PLAY", u: "/ttt" } },
        },
      },
    };

    window.app.settings.ws_conf = defaultWSConf;

    // Update Redux store with default config
    store.dispatch(setWSConf(defaultWSConf));

    // Force a UI update by triggering a custom event
    try {
      const event = new Event("app_config_loaded");
      window.dispatchEvent(event);
    } catch (e) {
      // Could not trigger update event
    }
  }

  function load_conf() {
    // Make sure we use the correct path based on where we're being served from
    const baseDir = window.base_dir || "/";
    const conf_file = window.conf_file || `${baseDir}ws_conf.xml`;

    // Use a timeout promise to ensure we don't hang indefinitely
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Configuration load timeout")), 5000)
    );

    const loadPromise = new Promise((resolve, reject) => {
      superagent.get(conf_file).end(function (err, res) {
        if (err || !res.ok) {
          reject(err || new Error("Failed to load configuration"));
          return;
        }

        try {
          const x2js = new X2JS({ attributePrefix: "" });
          const conf_json = x2js.xml2js(res.text);

          if (!conf_json || !conf_json.data) {
            reject(new Error("Invalid configuration format"));
            return;
          }

          window.app.settings.ws_conf = conf_json.data;

          // Update Redux store with loaded config
          store.dispatch(setWSConf(conf_json.data));

          // Force a UI update by triggering a custom event
          try {
            const event = new Event("app_config_loaded");
            window.dispatchEvent(event);
          } catch (e) {
            // Could not trigger update event
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });

    // Race between the load and timeout promises
    Promise.race([loadPromise, timeoutPromise])
      .then(() => {
        set_settings();
        prep_site();
      })
      .catch((error) => {
        // Provide fallback configuration
        defaultConfig();
        set_settings();
        prep_site();
      });
  }

  // ---- --------------------------------------------  --------------------------------------------

  function set_settings() {
    // Detect Flash (though it's deprecated now)
    try {
      if ("ActiveXObject" in window) {
        // IE only
        try {
          window.app.settings.hasFlash = !!new ActiveXObject(
            "ShockwaveFlash.ShockwaveFlash"
          );
        } catch (e) {
          window.app.settings.hasFlash = false;
        }
      } else {
        // W3C, better support in legacy browser
        window.app.settings.hasFlash =
          !!navigator.mimeTypes["application/x-shockwave-flash"];
      }
    } catch (e) {
      window.app.settings.hasFlash = false;
    }

    // Detect mobile devices
    try {
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
    } catch (e) {
      window.app.settings.is_mobile = false;
      window.app.settings.mobile_type = null;
    }

    // Log device settings for debugging
    window.app.settings.device_settings = {
      is_mobile: window.app.settings.is_mobile,
      mobile_type: window.app.settings.mobile_type,
      can_app: window.app.settings.can_app,
    };
  }

  // ---- --------------------------------------------  --------------------------------------------

  function prep_site() {
    // Call the after function if one was provided
    if (typeof call_after === "function") {
      try {
        call_after();
      } catch (e) {
        // Error in callback
      }
    }
  }
};

export default prep_env;
