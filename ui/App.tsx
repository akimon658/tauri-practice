import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Chat } from "./pages/Chat/Chat.tsx";

const queryClient = new QueryClient()

function App() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <Chat />
      </QueryClientProvider>
    </main>
  );
}

export default App;
