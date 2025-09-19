import { http } from '@/shared/api';
import { UnderwriteRequestDTO, UnderwriteResponseDTO } from './dto';

export async function submitUnderwriting(dto: UnderwriteRequestDTO) {
  return http.post<UnderwriteResponseDTO>('/api/underwrite', dto);
}