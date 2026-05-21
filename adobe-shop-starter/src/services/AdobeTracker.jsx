import {
  useEffect,
} from "react";

import {
  useLocation,
} from "react-router-dom";

export default function AdobeTracker() {
    console.log(
  "ADOBE TRACKER LOADED"
);

  const location =
    useLocation();

  useEffect(() => {

    async function trackView() {

      try {

        let viewName =
          "home";

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
          "TRACKING VIEW:",
          viewName
        );

        if (
          typeof window.alloy !==
          "function"
        ) {

          console.log(
            "Alloy missing"
          );

          return;
        }

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
          "VIEW SENT"
        );

      } catch (err) {

        console.error(
          "TRACK ERROR:",
          err
        );
      }
    }

    trackView();

  }, [location.pathname]);

  return null;
}