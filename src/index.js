import component from "./component";
import "./style.css";

import "react";
import "react-dom";

import { bake } from "./shake";

bake();

document.body.appendChild(component());
