import { Search } from "./components/Search";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <Search />
      </QueryClientProvider>
    </>
  );
}

export default App;
