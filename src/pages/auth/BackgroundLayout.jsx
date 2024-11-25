// React
import React from 'react';

// PreLogin navbar
import Particles from 'react-tsparticles';
import NavbarPreLogin from './NavbarPreLogin';

// Login/Register Router component
import LoginRegisterRouter from './routesLoginReg';
import { ParticlesConfig } from '../../configs';

// Main function component
const BackgroundLayout = ({ children, ...props }) => (
  <div
    // Return JSX
    className="body-background"
    style={{
      position: 'relative',
      minWidth: '100vw',
      minHeight: '100vh',
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}
  >
    <div style={{ maxWidth: '100vw' }}>
      <NavbarPreLogin {...props} />
      <LoginRegisterRouter {...props} />
      <Particles
        style={{
          minWidth: '100vh',
          minHeight: '100vh',
        }}
        options={ParticlesConfig}
      />
    </div>
  </div>
);
export default BackgroundLayout;
