import { FC } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routers from "./routers/Routers";

const App: FC = () => {
  return (
    <div className='App'>
      <RouterProvider
        router={createBrowserRouter(routers)}
      />
    </div>
  );
};

export default App;
