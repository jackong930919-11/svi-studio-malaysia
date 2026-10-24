export type ChatLanguage = 'zh' | 'en' | 'ms';

export function getSmartFallback(message: string, lang: ChatLanguage = 'zh'): string {
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
