import {createRoot} from "react-dom/client";
import App from "./App";

const root = document.getElementById('root');

if (!root) {
    throw Error("Root component not found");
}

const container = createRoot(root);
container.render(<App/>);
