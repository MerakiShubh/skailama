import { useState } from 'react';
import Container from './components/Container';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-screen h-screen overflow-scroll md:overflow-hidden flex">
        <Container />
      </div>
    </>
  );
}

export default App;
