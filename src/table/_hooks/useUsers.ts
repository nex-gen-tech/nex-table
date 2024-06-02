import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';


import { QueryType } from '../../components/NexTable';
import type { UserResType } from '../_type/user.zod';



export function useUsersTable(query: QueryType) {
  const urlSearchQuery = new URLSearchParams();
  if (query.pagination) {
    urlSearchQuery.append("pageIndex", query.pagination.pageIndex.toString());
    urlSearchQuery.append("pageSize", query.pagination.pageSize.toString());
  }

  return useQuery({
    queryKey: ["users", query.pagination],
    queryFn: async () => {
      const response = await axios.get<UserResType>(`http://localhost:8080/api/v1/admin/authorization/user?${urlSearchQuery.toString()}`
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
}
