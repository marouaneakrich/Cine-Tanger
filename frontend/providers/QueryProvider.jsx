import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QueryProvider = ({ children }) => {
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
