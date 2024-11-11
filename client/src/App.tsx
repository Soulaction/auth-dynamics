import React from 'react';
import {router} from "./routes";
import {RouterProvider} from "react-router-dom";
import * as s from "./App.module.css";

const App = () => {
    return (
        <div className={s.page}>
            <RouterProvider router={router} basename="/auth"/>
        </div>
    );
};

export default App;
