import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import "../node_modules/bootstrap-icons/font/bootstrap-icons.min.css";
import "./global.css"


import { Landing } from './pages/landing/Landing.jsx';
import { Login } from './pages/login/Login.jsx';
import { SessionProvider } from './providers/session.provider.jsx';
import { AppLayout } from './components/organisms/layout/layout.jsx';

import { RoleRouter } from './pages/principalView/principalView.jsx';


import { EventoDetalle } from './pages/app/Evento.jsx';
import { ClienteDetalle } from './pages/app/Cliente.jsx';
import { ListEventos } from './pages/app/ListEventos.jsx';
import { ListClientes } from './pages/app/ListClientes.jsx';
import { ListStaff } from './pages/app/ListStaff.jsx';


const App = () => (
  <React.StrictMode>
    <SessionProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />

          <Route path="app" element={<AppLayout />}>
            <Route index element={<RoleRouter />} />
            <Route path='eventos' element={<ListEventos />} />
            <Route path='evento/:eventId' element={<EventoDetalle />} />
            <Route path='customers' element={<ListClientes />} />
            <Route path='customers/:clienteId' element={<ClienteDetalle />} />
            <Route path='staff' element={<ListStaff />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </SessionProvider>
  </React.StrictMode>
);


ReactDOM.createRoot(document.getElementById('root')).render(<App />);
