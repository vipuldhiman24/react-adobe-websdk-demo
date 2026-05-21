import {
  useEffect,
} from "react";

import {
  useLocation,
} from "react-router-dom";

export default function AdobeTracker() {

  const location =
    useLocation();

  useEffect(() => {

    async function trackView() {

      let retries = 0;

      while (
        typeof window.alloy !==
          "function" &&
        retries < 40
      ) {

        console.log(
          "Waiting for Alloy..."
        );

        await new Promise(
          (resolve) =>
            setTimeout(resolve, 250)
        );

        retries++;
      }

      if (
        typeof window.alloy !==
        "function"
      ) {

        console.error(
          "Alloy never loaded"
        );

        return;
      }

      let viewName = "home";

      if (
        location.pathname.includes(
          "/product"
        )
      ) {

        viewName =
          "product-details";
      }

      if (
        location.pathname.includes(
          "/cart"
        )
      ) {

        viewName = "cart";
      }

      console.log(
        "SENDING VIEW:",
        viewName
      );

      try {

        const result =
          await window.alloy(
            "sendEvent",
            {
              renderDecisions: true,

              xdm: {
                web: {
                  webPageDetails: {
                    viewName
                  }
                }
              }
            }
          );

        console.log(
          "VIEW SENT:",
          result
        );

      } catch (err) {

        console.error(
          "SEND EVENT ERROR:",
          err
        );
      }
    }

    trackView();

  }, [location.pathname]);

  return null;
}