import { queryClient } from './queryClient';

export const clearAllCache = () => {
  queryClient.clear();
  queryClient.invalidateQueries();
};