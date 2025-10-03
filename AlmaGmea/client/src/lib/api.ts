import { apiRequest } from "@/lib/queryClient";
import type { SoulMateSubmission, SoulMateResult, SoulMateResultWithDate } from "@shared/schema";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function submitSoulMateData(data: SoulMateSubmission): Promise<SoulMateResult> {
  console.log('[API] Submitting soul mate data:', data);
  const response = await apiRequest('POST', `${API_BASE_URL}/api/submit`, data);
  console.log('[API] Response status:', response.status);
  const result = await response.json();
  console.log('[API] Response data:', result);
  return result;
}

export async function getSoulMateResult(token: string): Promise<SoulMateResultWithDate> {
  const response = await apiRequest('GET', `${API_BASE_URL}/api/result/${token}`);
  return response.json();
}
