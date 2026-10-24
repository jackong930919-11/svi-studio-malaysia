import { getSmartFallback } from '../../src/services/chatFallback';

interface Env {
  GEMINI_API_KEY?: string;
}

interface ChatHistoryEntry {
  sender: 'user' | 'bot';
  text: string;
}

const SYSTEM_PROMPT = `You are SviBot, the customer support and sales advisor for Svi Studio Malaysia.
Official products and prices: Svicloud 9P RM699, 10S RM549, 10P RM699, 15P RM749, Soundbar 10 RM1399.
Official TV box specifications:
- 9P: Android 12.0; Amlogic S905Y4 quad-core Cortex-A35; 4GB RAM + 64GB ROM; 2.4G / 5.0G dual-band Wi-Fi (2T2R); Bluetooth 5.0; 8K / 4K video; AV1, Dolby Vision, Dolby Audio, HDR10+; Bluetooth voice remote. Supports Google Play, Netflix, YouTube, Disney+, Yogurt Kids, Cherry TV, Happy Family Karaoke, global live channels and VOD with no monthly subscription.
- 10S: Android 12.0; Amlogic S905Y4 quad-core Cortex-A35; ARM G31 MP2 GPU; 2GB DDR3 + 32GB eMMC; dual-band 2.4GHz / 5GHz Wi-Fi (2T2R, 802.11 a/b/g/n/ac); Bluetooth 5.0; up to 4K@60fps; AV1, VP9 Profile 2, H.265 Main10, H.264, AVS2, HDR10 / 4K HDR; HDMI 2.1, 2x USB 2.0 Type-A, USB-C 5V/2A, optical audio, RJ45 10M/100M; AI voice-search remote with HDMI-CEC. Supports live channels, VOD apps such as Yogurt TV, and app installation through Google Play.
- 10P: Android 12.0; Amlogic S905Y4 64-bit quad-core ARM Cortex-A35; ARM Mali-G31 MP2 GPU; 4GB DDR3 + 64GB eMMC; dual-band 2.4GHz / 5.0GHz Wi-Fi (2T2R); Bluetooth 5.0; RJ45 up to 1000M; HDMI 2.1 with up to 4K / 8K output depending on display and decoding; 2x USB 2.0, optical audio, Dolby Audio and Type-C power input.
- 15P: Android 14; Amlogic S905Y5 Cortex-A55 quad-core; 4GB RAM + 64GB ROM; Wi-Fi 6 dual-band 2.4GHz + 5GHz (2T2R); Bluetooth 5.4; up to 4K@60fps; HDR10, HDR10+, HLG, AV1 hardware decoding, Dolby Audio; HDMI 2.1, RJ45 LAN, Type-C power port and AI Voice Air Mouse Remote.
Use these as the authoritative specifications; do not substitute specs from another model or invent features.
All TV boxes are genuine Malaysia units with SIRIM and MCMC certification. Warranty is 1-year 1-to-1 replacement.
Shipping is free: West Malaysia 1-2 working days, Sabah and Sarawak 4-5 working days.
No monthly subscription is required for the factory cloud apps. Recommended internet speed is 100Mbps or higher.
Official WhatsApp support: +60186663311. Do not provide a physical store address or invent policies or product claims.`;

const jsonResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const onRequestPost = async ({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Request body must be valid JSON' }, 400);
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return jsonResponse({ error: 'Request body must be a JSON object' }, 400);
  }

  const payload = body as Record<string, unknown>;
  if (typeof payload.message !== 'string' || !payload.message.trim()) {
    return jsonResponse({ error: 'Message is required' }, 400);
  }
  if (payload.message.length > 2000) {
    return jsonResponse({ error: 'Message must be 2000 characters or fewer' }, 400);
  }

  const lang = payload.lang ?? 'zh';
  if (lang !== 'zh' && lang !== 'en' && lang !== 'ms') {
    return jsonResponse({ error: 'Language must be zh, en, or ms' }, 400);
  }

  const fallback = getSmartFallback(payload.message, lang);
  if (!env.GEMINI_API_KEY) {
    return jsonResponse({ reply: fallback, source: 'knowledge_base' });
  }

  const history: ChatHistoryEntry[] = Array.isArray(payload.history)
    ? payload.history
        .slice(-6)
        .filter(
          (entry): entry is { sender: 'user' | 'bot'; text: string } =>
            !!entry &&
            typeof entry === 'object' &&
            ((entry as Record<string, unknown>).sender === 'user' ||
              (entry as Record<string, unknown>).sender === 'bot') &&
            typeof (entry as Record<string, unknown>).text === 'string',
        )
        .map(({ sender, text }) => ({ sender, text: text.slice(0, 2000) }))
    : [];

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\nRespond in ${
                  lang === 'zh' ? 'Simplified Chinese' : lang === 'ms' ? 'Bahasa Melayu' : 'English'
                }. Keep your answer friendly, concise, and under 150 words.`,
              },
            ],
          },
          contents: [
            ...history.map(({ sender, text }) => ({
              role: sender === 'user' ? 'user' : 'model',
              parts: [{ text }],
            })),
            { role: 'user', parts: [{ text: payload.message }] },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
        }),
      },
    );

    if (!response.ok) {
      console.warn(`Gemini API returned HTTP ${response.status}; using local chat fallback.`);
      return jsonResponse({ reply: fallback, source: 'fallback' });
    }

    const result: unknown = await response.json();
    if (result && typeof result === 'object' && 'candidates' in result) {
      const candidates = result.candidates;
      if (Array.isArray(candidates) && candidates[0]?.content?.parts) {
        const reply = candidates[0].content.parts
          .map((part: { text?: unknown }) => (typeof part.text === 'string' ? part.text : ''))
          .join('')
          .trim();
        if (reply) {
          return jsonResponse({ reply, source: 'gemini' });
        }
      }
    }
    console.warn('Gemini API returned no text; using local chat fallback.');
  } catch (error) {
    console.warn('Gemini API request failed; using local chat fallback.', error);
  }

  return jsonResponse({ reply: fallback, source: 'fallback' });
};
