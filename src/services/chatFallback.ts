export type ChatLanguage = 'zh' | 'en' | 'ms';

const PRODUCT_SPEC_REPLIES: Record<ChatLanguage, Record<'9p' | '10s' | '10p' | '15p', string>> = {
  zh: {
    '9p': 'Svicloud 9P：Android 12.0；Amlogic S905Y4 四核 Cortex-A35；4GB RAM + 64GB ROM；2.4G / 5.0G 双频 Wi-Fi（2T2R）；Bluetooth 5.0；支持 8K / 4K、AV1、Dolby Vision、Dolby Audio 和 HDR10+。附蓝牙语音遥控器，并支持 Google Play、Netflix、YouTube、Disney+、Yogurt Kids、Cherry TV、Happy Family Karaoke，以及免月费直播与点播服务。',
    '10s': 'Svicloud 10S：Android 12.0；Amlogic S905Y4 四核 Cortex-A35 / ARM G31 MP2 GPU；2GB DDR3 + 32GB eMMC；2.4GHz / 5GHz 双频 Wi-Fi（2T2R、802.11 a/b/g/n/ac）；Bluetooth 5.0；最高 4K@60fps。支持 AV1、VP9 Profile 2、H.265 Main10、H.264、AVS2、HDR10 / 4K HDR；配备 HDMI 2.1、2 个 USB 2.0、USB-C 5V/2A、光纤音频与 RJ45 10M/100M 网口；遥控器支持 HDMI-CEC。',
    '10p': 'Svicloud 10P：Android 12.0；Amlogic S905Y4 四核 Cortex-A35 / ARM Mali-G31 MP2 GPU；4GB DDR3 + 64GB eMMC；2.4GHz / 5.0GHz 双频 Wi-Fi（2T2R）；Bluetooth 5.0；RJ45 网口最高支持 1000M。HDMI 2.1 可支持最高 4K / 8K（取决于显示设备与解码能力）；另有 2 个 USB 2.0、光纤音频、Dolby Audio 和 Type-C 电源输入。',
    '15p': 'Svicloud 15P：Android 14；Amlogic S905Y5 Cortex-A55 四核；4GB RAM + 64GB ROM；Wi-Fi 6 双频 2.4GHz + 5GHz（2T2R）；Bluetooth 5.4；最高 4K@60fps，支持 HDR10、HDR10+、HLG、AV1 硬件解码及 Dolby Audio。接口为 HDMI 2.1、RJ45 LAN、Type-C 电源，并配 AI 语音飞鼠遥控器。',
  },
  en: {
    '9p': 'Svicloud 9P: Android 12.0; Amlogic S905Y4 quad-core Cortex-A35; 4GB RAM + 64GB ROM; 2.4G / 5.0G dual-band Wi-Fi (2T2R); Bluetooth 5.0; 8K / 4K video, AV1, Dolby Vision, Dolby Audio and HDR10+. Includes a Bluetooth voice remote and supports Google Play, Netflix, YouTube, Disney+, Yogurt Kids, Cherry TV, Happy Family Karaoke, live channels and VOD with no monthly fee.',
    '10s': 'Svicloud 10S: Android 12.0; Amlogic S905Y4 quad-core Cortex-A35 / ARM G31 MP2 GPU; 2GB DDR3 + 32GB eMMC; 2.4GHz / 5GHz dual-band Wi-Fi (2T2R, 802.11 a/b/g/n/ac); Bluetooth 5.0; up to 4K@60fps. Supports AV1, VP9 Profile 2, H.265 Main10, H.264, AVS2 and HDR10 / 4K HDR. Ports: HDMI 2.1, 2x USB 2.0, USB-C 5V/2A, optical audio and RJ45 10M/100M. Remote supports HDMI-CEC.',
    '10p': 'Svicloud 10P: Android 12.0; Amlogic S905Y4 quad-core Cortex-A35 / ARM Mali-G31 MP2 GPU; 4GB DDR3 + 64GB eMMC; 2.4GHz / 5.0GHz dual-band Wi-Fi (2T2R); Bluetooth 5.0; RJ45 LAN up to 1000M. HDMI 2.1 supports up to 4K / 8K depending on the display and decoding. Also includes 2x USB 2.0, optical audio, Dolby Audio and Type-C power input.',
    '15p': 'Svicloud 15P: Android 14; Amlogic S905Y5 Cortex-A55 quad-core; 4GB RAM + 64GB ROM; Wi-Fi 6 dual-band 2.4GHz + 5GHz (2T2R); Bluetooth 5.4; up to 4K@60fps with HDR10, HDR10+, HLG, AV1 hardware decoding and Dolby Audio. Ports: HDMI 2.1, RJ45 LAN and Type-C power. Includes an AI Voice Air Mouse Remote.',
  },
  ms: {
    '9p': 'Svicloud 9P: Android 12.0; empat teras Amlogic S905Y4 Cortex-A35; RAM 4GB + ROM 64GB; Wi-Fi dwi-jalur 2.4G / 5.0G (2T2R); Bluetooth 5.0; video 8K / 4K, AV1, Dolby Vision, Dolby Audio dan HDR10+. Termasuk alat kawalan suara Bluetooth dan menyokong Google Play, Netflix, YouTube, Disney+, Yogurt Kids, Cherry TV, Happy Family Karaoke serta saluran langsung dan VOD tanpa yuran bulanan.',
    '10s': 'Svicloud 10S: Android 12.0; CPU empat teras Amlogic S905Y4 Cortex-A35 / GPU ARM G31 MP2; 2GB DDR3 + 32GB eMMC; Wi-Fi dwi-jalur 2.4GHz / 5GHz (2T2R, 802.11 a/b/g/n/ac); Bluetooth 5.0; sehingga 4K@60fps. Menyokong AV1, VP9 Profile 2, H.265 Main10, H.264, AVS2 dan HDR10 / 4K HDR. Port: HDMI 2.1, 2x USB 2.0, USB-C 5V/2A, audio optik dan RJ45 10M/100M. Alat kawalan jauh menyokong HDMI-CEC.',
    '10p': 'Svicloud 10P: Android 12.0; CPU empat teras Amlogic S905Y4 Cortex-A35 / GPU ARM Mali-G31 MP2; 4GB DDR3 + 64GB eMMC; Wi-Fi dwi-jalur 2.4GHz / 5.0GHz (2T2R); Bluetooth 5.0; LAN RJ45 sehingga 1000M. HDMI 2.1 menyokong sehingga 4K / 8K bergantung pada paparan dan penyahkodan. Turut tersedia 2x USB 2.0, audio optik, Dolby Audio dan input kuasa Type-C.',
    '15p': 'Svicloud 15P: Android 14; CPU empat teras Amlogic S905Y5 Cortex-A55; RAM 4GB + ROM 64GB; Wi-Fi 6 dwi-jalur 2.4GHz + 5GHz (2T2R); Bluetooth 5.4; sehingga 4K@60fps dengan HDR10, HDR10+, HLG, penyahkodan perkakasan AV1 dan Dolby Audio. Port: HDMI 2.1, LAN RJ45 dan kuasa Type-C. Termasuk Alat Kawalan Jauh Tetikus Udara Suara AI.',
  },
};

export function getSmartFallback(message: string, lang: ChatLanguage = 'zh'): string {
  const q = message.toLowerCase();
  const requestedModel = (['9p', '10s', '10p', '15p'] as const).find((model) =>
    new RegExp(`\\b${model}\\b`).test(q),
  );
  const asksForSpecs =
    /spec|parameter|processor|cpu|ram|rom|storage|wi-?fi|bluetooth|resolution|android|port|specification|参数|规格|配置|处理器|内存|存储|无线|蓝牙|分辨率|接口|系统/.test(q);
  if (requestedModel && asksForSpecs) {
    return PRODUCT_SPEC_REPLIES[lang][requestedModel];
  }

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
      return '官方最新型号与价格：\n1. Svicloud 9P (4GB+64GB，Android 12，支持 2.4G / 5.0G 双频 Wi-Fi) - RM699\n2. Svicloud 10S (2GB+32GB，Android 12，最高 4K@60fps) - RM549\n3. Svicloud 10P (4GB DDR3 + 64GB eMMC，Android 12，双频 Wi-Fi) - RM699\n4. Svicloud 15P (4GB RAM + 64GB ROM，Android 14，Wi-Fi 6，最高 4K@60fps) - RM749\n5. Svicloud Soundbar 10 (杜比影院音响) - RM1399\n全马现货包邮，支持 Online Transfer / TNG eWallet / QuitNow QR / Visa Master / FPX 快捷支付！';
    }
    if (q.includes('频道') || q.includes('astro') || q.includes('直播') || q.includes('节目') || q.includes('球赛')) {
      return 'Svicloud 9P / 10S / 10P / 15P 均预装小云官方直播与点播平台，涵盖马来西亚 Astro 全套、新加坡、中港台、欧美及全球超 1000+ 高清频道，并有 4K 体育专线（英超、欧冠、羽球公开赛等），终身免费无月费！';
    }
    return '您好！欢迎咨询 Svi Studio Malaysia 官方旗舰店。我们现货供应 Svicloud 9P (RM699)、10S (RM549)、10P (RM699)、15P (RM749) 及 Soundbar 10 (RM1399)。全马免运费，请问您想了解哪一款呢？';
  }
  if (lang === 'ms' || /hantar|pos|jaminan|siaran|bayar|berapa|kotak|harga|sangkut|lag/.test(q)) {
    if (q.includes('sangkut') || q.includes('lag') || q.includes('buffering')) {
      return 'Sila mulakan semula (restart) Wi-Fi router dan TV Box anda, kemudian cuba lagi! Jika masih mengalami masalah sangkut, sila hubungi khidmat pelanggan kami!';
    }
    return 'Terima kasih kerana menghubungi Svi Studio Malaysia! Senarai rasmi: Svicloud 9P (RM699), Svicloud 10S (RM549), Svicloud 10P (RM699), Svicloud 15P (RM749), dan Svicloud Soundbar 10 (RM1399). Lulus MCMC & SIRIM, 1000+ saluran langsung Astro tanpa langganan bulanan. Penghantaran percuma Semenanjung 1-2 hari, Sabah/Sarawak 4-5 hari bekerja!';
  }
  if (q.includes('lag') || q.includes('buffer') || q.includes('freeze')) {
    return 'Please restart your Wi-Fi router and TV Box, then try again! If buffering persists, please contact our customer support for assistance!';
  }
  return 'Welcome to Svi Studio Malaysia! Official pricing: Svicloud 9P (RM699), Svicloud 10S (RM549), Svicloud 10P (RM699), Svicloud 15P (RM749), and Svicloud Soundbar 10 (RM1399). All models are SIRIM/MCMC certified with free express delivery (West MY: 1-2 days, East MY: 4-5 days). How can I assist you today?';
}
