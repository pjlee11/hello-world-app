import Document from "./app/components/Document";
import { routes, regexPath } from "./app/routes";
import { getLocalServer } from "simorgh-renderer";

const localServer = getLocalServer(routes, regexPath, Document);
