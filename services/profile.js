const GraphAPi = require("./graph-api"),
  config = require("./config");

module.exports = class Profile {
  setWebhook() {
    GraphAPi.callSubscriptionsAPI();
    GraphAPi.callSubscribedApps();
  }

  setPageFeedWebhook() {
    GraphAPi.callSubscriptionsAPI("feed");
    GraphAPi.callSubscribedApps("feed");
  }

  setThread() {
    let profilePayload = {
      ...this.getGetStarted(),
      ...this.getGreeting(),
      ...this.getPersistentMenu(),
    };

    GraphAPi.callMessengerProfileAPI(profilePayload);
  }

  setPersonas() {
    let newPersonas = config.newPersonas;

    GraphAPi.getPersonaAPI()
      .then((personas) => {
        for (let persona of personas) {
          config.pushPersona({
            name: persona.name,
            id: persona.id,
          });
        }
        return config.personas;
      })
      .then((existingPersonas) => {
        for (let persona of newPersonas) {
          if (!(persona.name in existingPersonas)) {
            GraphAPi.postPersonaAPI(persona.name, persona.picture)
              .then((personaId) => {
                config.pushPersona({
                  name: persona.name,
                  id: personaId,
                });
              })
              .catch((error) => {
                console.log("Creation failed:", error);
              });
          } else {
            console.log("Persona already exists for name:", persona.name);
          }
        }
      })
      .catch((error) => {
        console.log("Creation failed:", error);
      });
  }

  setGetStarted() {
    let getStartedPayload = this.getGetStarted();
    GraphAPi.callMessengerProfileAPI(getStartedPayload);
  }

  setGreeting() {
    let greetingPayload = this.getGreeting();
    GraphAPi.callMessengerProfileAPI(greetingPayload);
  }

  setPersistentMenu() {
    let menuPayload = this.getPersistentMenu();
    GraphAPi.callMessengerProfileAPI(menuPayload);
  }

  setWhitelistedDomains() {
    let domainPayload = this.getWhitelistedDomains();
    GraphAPi.callMessengerProfileAPI(domainPayload);
  }

  getGetStarted() {
    return {
      get_started: {
        payload: "GET_STARTED",
      },
    };
  }

  getGreeting() {
    return {
      greeting: [""],
    };
  }

  getPersistentMenu() {
    return {
      persistent_menu: [],
    };
  }

  getWhitelistedDomains() {
    return {
      whitelisted_domains: config.whitelistedDomains,
    };
  }
};
