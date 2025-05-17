import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { API_URL } from 'src/env/env.config'
import { ApiResponse } from 'src/types/api.type'

const mockUrl = '/api/categories'
const url = `${API_URL}/categories`

export type CategoryEntity = {
  id: string
  name: string
}

type SubcategoryResponse = {
  id: number
  name: string
  // category_id: number
  created_at: string
  updated_at: string
}

export type CategoryResponse = {
  id: number
  name: string
  img?: string
  subcategories?: SubcategoryResponse[]
  created_at?: string
  updated_at?: string
}

const fetchCategoriesList = async () => {
  const response = await axios.get<ApiResponse<CategoryResponse[]>>(mockUrl)
  return response.data.data
}

const useCategories = () => {
  return useQuery<CategoryResponse[]>({
    queryKey: ['categories'],
    queryFn: fetchCategoriesList,
    retry: 3, // thử lại tối đa 3 lần nếu lỗi
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000) // exponential backoff
  })
}

export default useCategories
