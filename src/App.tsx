import type { Component } from 'solid-js';

import { css } from '../styled-system/css';
import { flex } from '../styled-system/patterns';
import { Button } from './components/ui/button';



const App: Component = () => {
  const noteButtonHandler = (number: number) => {
    console.log(`Button ${number} clicked`);
  };

  return (
    <main class={css({ minH: '100vh', bg: 'gray.100', p: '4' })}>
      <p>TITLE</p>
      <div class={flex({
                gap: '4', 
        bg: 'white', 
        p: '2', 
        borderBottom: '1px solid',
        borderColor: 'gray.200',
        alignItems: 'center'
      })}>
        {[1, 2, 3, 4, 5, 6].map(num => (
          <Button
            variant="outline"
            onClick={() => noteButtonHandler(num)}
            class={css({ w: '10', h: '10', p: '0' })}
          >
            {num}
          </Button>
        ))}
      </div>
    </main>
  );
};

export default App;
