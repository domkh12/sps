import {disableReactDevTools} from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === 'production') console.log = function () {};
if (process.env.NODE_ENV === "production") disableReactDevTools();