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

    alert(
      "TRACKER WORKING: " +
      location.pathname
    );

  }, [location.pathname]);

  return null;
}