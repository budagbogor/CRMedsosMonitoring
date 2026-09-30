import { AIConfig, AIProvider } from '../types';

export const DEFAULT_AI_CONFIG: AIConfig = {
  provider: 'gemini',
  model: 'gemini-3.6-flash',
  apiKey: '',
  baseUrl: 'https://ai.sumopod.com/v1',
  useOrchestration: true,
  autoSyncPerformanceInterval: 'off',
  apiKeyScope: 'global',
};

export const PROVIDER_MODELS: Record<AIProvider, Array<{ id: string; name: string; description: string }>> = {
  gemini: [
    { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', description: 'Model Gemini flagship terbaru, cepat dengan Search Grounding.' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Reasoning tinggi untuk analisis mendalam & ekstraksi data kompleks.' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Sangat cepat & efisien untuk pemrosesan skala besar.' },
  ],
  sumopod: [
    // OpenAI Models (Sumopod)
    { id: 'gpt-5.4', name: 'GPT-5.4 (Sumopod)', description: 'Model OpenAI Next-Gen flagship.' },
    { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini (Sumopod)', description: 'Model GPT-5.4 versi cepat & hemat token.' },
    { id: 'gpt-5.4-nano', name: 'GPT-5.4 Nano (Sumopod)', description: 'Ultra-fast low-latency model.' },
    { id: 'gpt-5', name: 'GPT-5 (Sumopod)', description: 'Model Generasi 5 OpenAI.' },
    { id: 'gpt-5-mini', name: 'GPT-5 Mini (Sumopod)', description: 'Versi ringkas GPT-5.' },
    { id: 'gpt-5-nano', name: 'GPT-5 Nano (Sumopod)', description: 'Performa tinggi untuk tugas cepat.' },
    { id: 'gpt-4.1', name: 'GPT-4.1 (Sumopod)', description: 'Model GPT-4.1 perbaikan penalaran.' },
    { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini (Sumopod)', description: 'Model GPT-4.1 ringkas.' },
    { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano (Sumopod)', description: 'Super efisien token.' },
    { id: 'gpt-4o', name: 'GPT-4o (Sumopod)', description: 'Model flagship multimodal standar Sumopod.' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Sumopod)', description: 'Sangat cepat & hemat biaya.' },

    // Anthropic Claude Models (Sumopod)
    { id: 'claude-sonnet-5', name: 'Claude Sonnet 5 (Sumopod)', description: 'Pakar sintesis eksekutif & rekomendasi.' },
    { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6 (Sumopod)', description: 'Penalaran analisis bisnis tingkat tinggi.' },
    { id: 'claude-opus-4-8', name: 'Claude Opus 4.8 (Sumopod)', description: 'Model Opus tercanggih untuk pemikiran mendalam.' },
    { id: 'claude-opus-4-7', name: 'Claude Opus 4.7 (Sumopod)', description: 'Keandalan ekstrim untuk tugas strategis.' },
    { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5 (Sumopod)', description: 'Sangat cepat & tajam.' },
    { id: 'claude-fable-5', name: 'Claude Fable 5 (Sumopod)', description: 'Pemrosesan bahasa alami superior.' },

    // DeepSeek Models (Sumopod)
    { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro (Sumopod)', description: 'Model spesialis penalaran analitis & audit komplain.' },
    { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash (Sumopod)', description: 'Ekstraksi cepat & ekonomis.' },

    // Gemini Models via Sumopod
    { id: 'gemini/gemini-3.5-flash', name: 'Gemini 3.5 Flash (Sumopod)', description: 'Gemini 3.5 via endpoint Sumopod.' },
    { id: 'gemini/gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview (Sumopod)', description: 'Gemini 3.1 Pro preview via Sumopod.' },
    { id: 'gemini/gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite (Sumopod)', description: 'Gemini 3.1 Lite ultra cepat.' },
    { id: 'gemini/gemini-3-flash-preview', name: 'Gemini 3 Flash Preview (Sumopod)', description: 'Gemini 3 Flash preview.' },

    // Qwen / Alibaba Models (Sumopod)
    { id: 'qwen3.8-max', name: 'Qwen 3.8 Max (Sumopod)', description: 'Model Alibaba Qwen flagship 3.8.' },
    { id: 'qwen3.7-max', name: 'Qwen 3.7 Max (Sumopod)', description: 'Model Qwen 3.7 Max berdaya tinggi.' },
    { id: 'qwen3.7-plus', name: 'Qwen 3.7 Plus (Sumopod)', description: 'Qwen 3.7 Plus seimbang & responsif.' },
    { id: 'qwen3.7-flash-2026-07-15', name: 'Qwen 3.7 Flash (Sumopod)', description: 'Qwen 3.7 Flash versi 2026.' },
    { id: 'qwen3.6-plus', name: 'Qwen 3.6 Plus (Sumopod)', description: 'Model Qwen 3.6 Plus.' },
    { id: 'qwen3.6-flash', name: 'Qwen 3.6 Flash (Sumopod)', description: 'Qwen 3.6 Flash cepat.' },

    // Kimi / Moonshot Models (Sumopod)
    { id: 'kimi-k3', name: 'Kimi K3 (Sumopod)', description: 'Model Moonshot Kimi generasi K3.' },
    { id: 'kimi-k2.7', name: 'Kimi K2.7 (Sumopod)', description: 'Kimi K2.7 dengan konteks luas.' },
    { id: 'kimi-k2.6', name: 'Kimi K2.6 (Sumopod)', description: 'Model Kimi K2.6.' },

    // GLM / Zhipu Models (Sumopod)
    { id: 'glm-5.2', name: 'GLM 5.2 (Sumopod)', description: 'Model GLM 5.2 Zhipu AI.' },
    { id: 'glm-5.1', name: 'GLM 5.1 (Sumopod)', description: 'Model GLM 5.1.' },
    { id: 'glm-5v-turbo', name: 'GLM 5V Turbo (Sumopod)', description: 'Model GLM 5 Visual Turbo.' },
    { id: 'glm-5-turbo', name: 'GLM 5 Turbo (Sumopod)', description: 'GLM 5 Turbo cepat.' },
    { id: 'glm-5', name: 'GLM 5 (Sumopod)', description: 'Model GLM 5 standar.' },
    { id: 'z.ai', name: 'Z.AI (Sumopod)', description: 'Model Z.AI spesialis.' },

    // MiniMax Models (Sumopod)
    { id: 'MiniMax-M3', name: 'MiniMax M3 (Sumopod)', description: 'Model MiniMax M3 terbaru.' },
    { id: 'MiniMax-M2.7-highspeed', name: 'MiniMax M2.7 Highspeed (Sumopod)', description: 'MiniMax M2.7 versi kecepatan tinggi.' },

    // MiMo & Tencent Models (Sumopod)
    { id: 'mimo-v2.5-pro', name: 'MiMo V2.5 Pro (Sumopod)', description: 'Model MiMo V2.5 Pro.' },
    { id: 'mimo-v2.5', name: 'MiMo V2.5 (Sumopod)', description: 'Model MiMo V2.5.' },
    { id: 'hy3', name: 'Hunyuan 3 / HY3 (Sumopod)', description: 'Model Tencent Hunyuan 3.' },
  ],
  openai: [
    { id: 'gpt-4o', name: 'GPT-4o (Official)', description: 'Model OpenAI multimodal flagship.' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Official)', description: 'Model cepat & efisien OpenAI.' },
  ],
};

const STORAGE_KEY = 'auto_rep_ai_config_v1';

export function loadAIConfig(): AIConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_AI_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Gagal membaca AI config dari localStorage:', err);
  }
  return DEFAULT_AI_CONFIG;
}

export function saveAIConfig(config: AIConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Gagal menyimpan AI config ke localStorage:', err);
  }
}

export async function testAIConnection(config: AIConfig): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/test-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    const contentType = res.headers.get('content-type') || '';
    let data: any = {};
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      return {
        success: false,
        message: `Koneksi Vercel Serverless (HTTP ${res.status}): ${text.substring(0, 120)}`,
      };
    }
    
    if (res.ok && data.success) {
      return { success: true, message: data.message || 'Koneksi ke Engine AI berhasil!' };
    } else {
      return { success: false, message: data.error || data.message || 'Gagal terhubung ke API Provider.' };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Terjadi kesalahan jaringan saat menguji koneksi AI.',
    };
  }
}
