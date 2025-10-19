import { useState } from 'react';
import Container from './components/Container';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="w-screen h-screen overflow-scroll md:overflow-hidden flex">
        <QueryClientProvider client={queryClient}>
          <Container />
          <Toaster position="bottom-right" />
        </QueryClientProvider>
      </div>
    </>
  );
}

export default App;
