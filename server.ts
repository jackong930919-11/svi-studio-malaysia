import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI Client server-side
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Product Knowledge & System Prompt for AI Customer Support
const SYSTEM_PROMPT = `You are "SviBot", the 24/7 Senior AI Technical Consultant & Sales Advisor for "Svi Studio Malaysia" (小云马来西亚官方旗舰店).
You represent the leading authorized distributor of genuine Svicloud products and Smart TV Boxes in Malaysia.

Your exact product lineup and prices:
1. Svicloud 9P (小云盒子 9P 经典旗舰版) - RM699: 4GB RAM + 64GB Storage, Android 12, 8K Ultra HD, Dual-band WiFi 6, AI Voice Remote, 1000+ Live Channels (Astro, Taiwan, Hong Kong, Sports HD), 100k+ VOD, Dolby Audio, SIRIM & MCMC Certified.
2. Svicloud 10S (小云盒子 10S 简易智选版) - RM549: 2GB RAM + 32GB Storage, 4K HDR10, optimal for elderly & family living rooms, simplified large-tile UI, auto-boot to Live TV, parental controls, high cost-performance.
3. Svicloud 10P (小云盒子 10P 新一代旗舰版) - RM699: 4GB RAM + 64GB Storage, Next-gen 8K AV1 hardware decoder, WiFi 6, Bluetooth 5.2, Smart Voice Remote + Karaoke K-song app support.
4. Svicloud 15P (小云盒子 15P 极致性能巅峰版) - RM749: 8GB RAM + 128GB Storage, Next-Gen Amlogic S928X processor, Android 13, WiFi 6E + Gigabit LAN, 4K 120Hz, dedicated live sports zero-lag stream engine, 1-Year 1-to-1 Warranty.
5. Svicloud Soundbar 10 (小云 Soundbar 10 杜比全景声影院音响系统) - RM1399: 300W peak power, True Dolby Atmos 3D spatial surround sound, 6.5-inch wireless deep bass subwoofer, HDMI eARC single-cable sync with Svicloud TV box, ClearVoice speech enhancement.

Key Policies & Localized Details:
- 100% Genuine Original with official Malaysia Warranty (只有 1年内原厂 1对1 换新质保, SIRIM & MCMC认证).
- Free Shipping across Malaysia: West Malaysia (1-2 working days via J&T Express / Ninja Van). East Malaysia (Sabah & Sarawak: 4-5 working days via air courier).
- Payment Gateways: 仅支持 Online Transfer / TNG eWallet / QuitNow QR / Visa Master / FPX (仅此5大官方支付方式，无任何分期付款).
- Customer Service: 官方客服 WhatsApp: +60186663311. 不展示任何实体店地址.
- Plug & Play: No monthly subscription required for factory lifetime cloud apps; minimum internet speed recommended is 100Mbps以上 (Unifi 100M/300M/500M, Time, Maxis Home Fibre, CelcomDigi).
- Troubleshooting: 如果遇到卡顿，重启Wi-Fi 和 电视盒，再进行尝试！如果还是卡顿，请联系我们客服询问！
- Languages: Answer naturally in the customer's language (English, Chinese 华语, or Bahasa Melayu).
- Be polite, professional, concise, reassuring, and always quote the exact official price (Svicloud 9P RM699, 10S RM549, 10P RM699, 15P RM749, Soundbar 10 RM1399).`;

// Smart Fallback Responses when API key is unavailable or during network hiccup
function getSmartFallback(message: string, lang: 'zh' | 'en' | 'ms' = 'zh'): string {
  const q = message.toLowerCase();
  if (lang === 'zh' || /小云|电视|频道|发货|保修|直播|几钱|多少钱|网速|astro|soundbar|音响|卡/.test(q)) {
    if (q.includes('卡顿') || q.includes('卡') || q.includes('转圈') || q.includes('缓冲')) {
      return '重启Wi-Fi 和 电视盒，再进行尝试！如果还是卡顿，请联系我们客服询问！';
    }
    if (q.includes('音响') || q.includes('soundbar') || q.includes('声音') || q.includes('低音')) {
      return '您好！【Svicloud Soundbar 10 杜比全景声影院音响 RM1399】具备 300W 强劲峰值功率与 6.5 寸无线独立重低音炮，支持杜比全景声 3D 空间环绕，一条 HDMI eARC 线即可与小云电视盒一键联动开关机，让客厅秒变豪华影院！';
    }
    if (q.includes('网速') || q.includes('wifi') || q.includes('网络') || q.includes('mbps')) {
      return '观看高清直播与 4K 点播，建议宽带速度在 100Mbps 以上（如 Unifi 100M/300M/500M、Time 宽带、Maxis Home Fibre、CelcomDigi）。小云电视盒在大马本地部署有专属 CDN 高速节点，高峰期也能极速流畅秒开。';
    }
    if (q.includes('月费') || q.includes('年费') || q.includes('免费') || q.includes('续费')) {
      return '不需要！一次性购买机器后，机身内置的小云官方直播与点播软件均为永久授权，无任何隐藏月租或续费套路。';
    }
    if (q.includes('保修') || q.includes('warranty') || q.includes('坏') || q.includes('故障') || q.includes('售后')) {
      return '我们是 Svi Studio Malaysia 官方授权店，每台机器均带有 SIRIM/MCMC 防伪标。享有 1 年内原厂 1 对 1 换新质保，如遇硬件故障，全马支持寄回官方售后中心直接换新机！';
    }
    if (q.includes('发货') || q.includes('多久') || q.includes('几天') || q.includes('物流') || q.includes('运费') || q.includes('东马')) {
      return '全马订单一律免运费！西马地区（雪兰莪、吉隆坡、槟城、柔佛等）1-2 个工作日由 J&T Express 或 Ninja Van 送达；东马（沙巴、砂拉越）4-5 个工作日空运送达。';
    }
    if (q.includes('推荐') || q.includes('哪款') || q.includes('区别') || q.includes('买哪') || q.includes('价格') || q.includes('多少钱')) {
      return '官方最新型号与价格：\n1. Svicloud 9P (经典旗舰 4G+64G) - RM699\n2. Svicloud 10S (简易智选 2G+32G) - RM549\n3. Svicloud 10P (新一代旗舰 8K AV1) - RM699\n4. Svicloud 15P (性能巅峰 8G+128G) - RM749\n5. Svicloud Soundbar 10 (杜比影院音响) - RM1399\n全马现货包邮，支持 Online Transfer / TNG eWallet / QuitNow QR / Visa Master / FPX 快捷支付！';
    }
    if (q.includes('频道') || q.includes('astro') || q.includes('直播') || q.includes('节目') || q.includes('球赛')) {
      return 'Svicloud 9P / 10S / 10P / 15P 均预装小云官方直播与点播平台，涵盖马来西亚 Astro 全套、新加坡、中港台、欧美及全球超 1000+ 高清频道，并有 4K 体育专线（英超、欧冠、羽球公开赛等），终身免费无月费！';
    }
    return '您好！欢迎咨询 Svi Studio Malaysia 官方旗舰店。我们现货供应 Svicloud 9P (RM699)、10S (RM549)、10P (RM699)、15P (RM749) 及 Soundbar 10 (RM1399)。全马免运费，请问您想了解哪一款呢？';
  } else if (lang === 'ms' || /hantar|pos|jaminan|siaran|bayar|berapa|kotak|harga|sangkut|lag/.test(q)) {
    if (q.includes('sangkut') || q.includes('lag') || q.includes('buffering')) {
      return 'Sila mulakan semula (restart) Wi-Fi router dan TV Box anda, kemudian cuba lagi! Jika masih mengalami masalah sangkut, sila hubungi khidmat pelanggan kami!';
    }
    return 'Terima kasih kerana menghubungi Svi Studio Malaysia! Senarai rasmi: Svicloud 9P (RM699), Svicloud 10S (RM549), Svicloud 10P (RM699), Svicloud 15P (RM749), dan Svicloud Soundbar 10 (RM1399). Lulus MCMC & SIRIM, 1000+ saluran langsung Astro tanpa langganan bulanan. Penghantaran percuma Semenanjung 1-2 hari, Sabah/Sarawak 4-5 hari bekerja!';
  } else {
    if (q.includes('lag') || q.includes('buffer') || q.includes('freeze')) {
      return 'Please restart your Wi-Fi router and TV Box, then try again! If buffering persists, please contact our customer support for assistance!';
    }
    return 'Welcome to Svi Studio Malaysia! Official pricing: Svicloud 9P (RM699), Svicloud 10S (RM549), Svicloud 10P (RM699), Svicloud 15P (RM749), and Svicloud Soundbar 10 (RM1399). All models are SIRIM/MCMC certified with free express delivery (West MY: 1-2 days, East MY: 4-5 days). How can I assist you today?';
  }
}

// AI Customer Support Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, lang = 'zh', history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      const reply = getSmartFallback(message, lang);
      res.json({ reply, source: 'knowledge_base' });
      return;
    }

    try {
      // Build conversation context
      const chatMessages = [
        ...history.slice(-6).map((h: { sender: string; text: string }) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: chatMessages,
        config: {
          systemInstruction: SYSTEM_PROMPT + `\nRespond in ${lang === 'zh' ? 'Simplified Chinese (简体中文)' : lang === 'ms' ? 'Bahasa Melayu' : 'English'}. Keep your answer friendly, concise and under 150 words.`,
          temperature: 0.7,
        },
      });

      const reply = response.text || getSmartFallback(message, lang);
      res.json({ reply, source: 'gemini' });
    } catch (aiErr) {
      console.warn('Gemini API call failed, falling back to local advisor:', aiErr);
      const reply = getSmartFallback(message, lang);
      res.json({ reply, source: 'fallback' });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    res.status(500).json({ error: message });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'Svi Studio Malaysia', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const http = await import('http');
  const httpServer = http.createServer(app);

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[Svi Studio Malaysia] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
