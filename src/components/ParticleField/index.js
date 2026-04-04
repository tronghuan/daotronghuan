import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function ParticleField() {
  return (
    <BrowserOnly fallback={<div style={{ position: 'fixed', inset: 0, backgroundColor: '#1a1a1a', zIndex: 0 }} />}>
      {() => {
        const Particles = require('@tsparticles/react').default;
        const { initParticlesEngine } = require('@tsparticles/react');
        const { loadSlim } = require('@tsparticles/slim');

        const ParticleComponent = () => {
          const [init, setInit] = React.useState(false);

          React.useEffect(() => {
            initParticlesEngine(async (engine) => {
              await loadSlim(engine);
            }).then(() => setInit(true));
          }, []);

          const options = {
            background: { color: '#1a1a1a' },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: true, mode: 'push' },
                onHover: { enable: true, mode: 'grab' },
              },
              modes: {
                push: { quantity: 4 },
                grab: { distance: 150, links: { opacity: 0.8 } },
              },
            },
            particles: {
              color: { value: '#ffffff' },
              links: { color: '#ffffff', distance: 120, enable: true, opacity: 0.3, width: 1 },
              collisions: { enable: false },
              move: { enable: true, speed: 1.2 },
              number: { density: { enable: true, area: 800 }, value: 90 },
              opacity: { value: 0.5 },
              shape: { type: 'circle' },
              size: { value: { min: 2, max: 4 } },
            },
            detectRetina: true,
          };

          if (!init) return null;
          return (
            <Particles
              id="tsparticles"
              options={options}
              style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
            />
          );
        };

        return <ParticleComponent />;
      }}
    </BrowserOnly>
  );
}
