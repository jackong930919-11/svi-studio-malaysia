import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  Sparkles,
  User,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  Film,
  ExternalLink,
  ThumbsUp,
  Layers,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AiCustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

// Option item for the A / B / C / D decision flow
export interface DecisionOption {
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
  sublabel?: string;
  solution?: {
    title: string;
    steps: string[];
    warningOrTip?: string;
    hasVideoTutorial?: boolean;
    videoTip?: string;
  };
  nextQuestionId?: string;
}

export interface QuestionNode {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  categoryTitle: string;
  title: string;
  desc: string;
  options: DecisionOption[];
}

export const DECISION_TREE: Record<string, QuestionNode> = {
  root: {
    id: 'root',
    questionNumber: 1,
    totalQuestions: 2,
    categoryTitle: '故障诊断分类',
    title: '请问您遇到了哪方面的问题？',
    desc: '请在下方轻点 A / B / C / D 选项，系统将为您提供针对性排查：',
    options: [
      {
        key: 'A',
        label: '播放卡顿 · 画面转圈 · Wi-Fi 连网故障',
        sublabel: '网络缓冲、延迟高、Wi-Fi 断连或网速诊断',
        nextQuestionId: 'network',
      },
      {
        key: 'B',
        label: '遥控器失灵 · 语音键没反应 · 出现鼠标光标',
        sublabel: '蓝牙对频、学习电视按键、退出鼠标模式',
        nextQuestionId: 'remote',
      },
      {
        key: 'C',
        label: '找不到想看的频道 · 直播黑屏 · 回看问题',
        sublabel: 'Astro 频道、体育直播、换源、第三方串流软件',
        nextQuestionId: 'channels',
      },
      {
        key: 'D',
        label: '新机开机设置 · 1对1换新质保 · 订单物流',
        sublabel: '首次通电、质保申请流程、付款与派送时效',
        nextQuestionId: 'mall_policy',
      },
    ],
  },

  // Branch A: 网络与播放卡顿
  network: {
    id: 'network',
    questionNumber: 2,
    totalQuestions: 2,
    categoryTitle: '网络与播放诊断',
    title: '请选择您当前的网络连接方式与卡顿现象：',
    desc: '根据具体情况选择最贴合的一项，即可获取官方工程师排查方案：',
    options: [
      {
        key: 'A',
        label: '连接家中 Wi-Fi，画面时常转圈缓冲或提示网络超时',
        sublabel: 'Wi-Fi 信号不稳定，偶尔可以播放但经常卡住',
        solution: {
          title: 'Wi-Fi 卡顿黄金排查方案：',
          steps: [
            '【官方黄金口诀】：先拔掉 Wi-Fi 路由器电源和电视盒电源，静置 30 秒后重新插上通电！通常 90% 的缓存拥堵立即可恢复。',
            '将电视盒连接至 5GHz 频段 Wi-Fi（若 Wi-Fi 名字有 5G 后缀，请优先连它，避开拥挤的 2.4G 频段）。',
            '检查路由器与电视盒之间的距离，若隔有承重墙或铁门，建议将电视盒移近或使用网线直连。',
            '在小云直播设置中，将解码模式调整为「硬解 (Hardware)」以降低 CPU 负载。',
          ],
          warningOrTip: '💡 推荐家庭网络带宽在 100Mbps 以上（如 Unifi, Time, Maxis Fibre），观影更顺畅。',
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 4 课查看《網路測速與診斷》视频指南。',
        },
      },
      {
        key: 'B',
        label: '插入了 LAN 网线，但系统仍提示『未连接互联网』',
        sublabel: '有线网线插上后无反应或无法获取 IP 地址',
        solution: {
          title: '有线网线连接排查步骤：',
          steps: [
            '检查电视盒背面的网口指示灯是否正常亮起（黄绿灯闪烁）。',
            '进入电视盒「设置」->「网络与互联网」，关闭顶部的 Wi-Fi 开关，点击「以太网 (Ethernet)」并设置为自动获取 IP (DHCP)。',
            '尝试更换一根纯铜 Cat6 高速网线，或将网线插入路由器其他 LAN 端口测试。',
            '若路由器设置了 MAC 地址过滤或访客隔离，请进入路由器后台允许电视盒接入。',
          ],
          warningOrTip: '⚠️ 有线网络比 Wi-Fi 具备更低的丢包率，是看超高清球赛的最优选择。',
        },
      },
      {
        key: 'C',
        label: '只有特定一两个电视频道卡顿，其他频道播放流畅',
        sublabel: '局部个别频道出现黑屏、卡顿或音频不同步',
        solution: {
          title: '特定频道快速换源方案：',
          steps: [
            '在播放卡顿的频道画面上，按遥控器「菜单键 (Menu)」或「设置键」。',
            '在弹出的设置菜单中，找到「播放线路 / 来源 (Source)」，切换到「线路 2」或「备用高清源」。',
            '在「解码方式」中切换：如果原本是硬解码，可尝试切换为「软解码」，反之亦然。',
            '部分海外小众频道可能偶遇卫星转播临时维护，通常 1-2 小时内服务器会自动修复。',
          ],
          warningOrTip: '💡 小云全系机型均内置多套备用服务器，高峰期切换备用源即可秒切顺畅。',
        },
      },
      {
        key: 'D',
        label: '想测试实际网速，不知道怎么在电视盒上跑 Speedtest',
        sublabel: '需要检测延迟 (Ping) 与实时下行带宽',
        solution: {
          title: '电视盒测速操作指南：',
          steps: [
            '在电视盒主页进入「工具箱 (Tools)」或「我的应用」。',
            '打开「网络测速 (Speedtest)」应用程式。',
            '点击「开始测速」，系统将自动检测下载带宽与本地网络延迟。',
            '4K 超清播放要求下载速度达到 30Mbps 以上；8K 旗舰机型建议 100Mbps 以上。',
          ],
          hasVideoTutorial: true,
          videoTip: '「官方教學視頻」第 4 课有详细手把手测速视频。',
        },
      },
    ],
  },

  // Branch B: 遥控器与按键
  remote: {
    id: 'remote',
    questionNumber: 2,
    totalQuestions: 2,
    categoryTitle: '遥控器故障诊断',
    title: '请问您的遥控器具体遇到了哪种状况：',
    desc: '轻点最符合您遥控器现状的选项：',
    options: [
      {
        key: 'A',
        label: '按住语音键没有反应 / 提示『请连接蓝牙』',
        sublabel: '无法进行语音搜片或提示未配对',
        solution: {
          title: '语音功能恢复与蓝牙重配步骤：',
          steps: [
            '【检查电量】：遥控器电量低于 20% 时，蓝牙语音麦克风会自动断电保护，请先更换一对全新 AAA 电池。',
            '【检查蓝牙状态】：进入「设置」->「遥控器与配件」，查看「SVI Remote」是否显示已连接。',
            '【重新配对】：若未连接，请同时长按遥控器的「确认键 (OK) + 音量减 (-)」5 秒，直到指示灯快闪，在电视端点击配对重新连接。',
            '配对成功后，按住语音麦克风键对准遥控器顶部说出影片名字，松手即可搜索！',
          ],
          warningOrTip: '⚠️ 语音搜片必须在蓝牙连接状态下使用，红外模式下语音键不生效。',
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 9 课查看《遥控器语音不能用怎么办》实操演示。',
        },
      },
      {
        key: 'B',
        label: '屏幕上突然出现一个鼠标白色光标箭头，方向键按不动',
        sublabel: '误触飞鼠模式，无法用方向键正常切换焦点',
        solution: {
          title: '一秒退出鼠标光标模式：',
          steps: [
            '在小云遥控器正面寻找「鼠标图标」按键（通常位于方向键下方或侧边）。',
            '轻按一下该「鼠标键」。',
            '屏幕上的白色光标箭头将瞬间消失。',
            '电视焦点自动恢复为方块高亮模式，方向键即可重新自由跳动导航！',
          ],
          warningOrTip: '💡 在浏览器或手机版应用中，重新轻按该键可再次开启鼠标辅助点击。',
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 8 课查看《进入鼠标模式后怎么退出》视频。',
        },
      },
      {
        key: 'C',
        label: '想让小云遥控器同时开关电视机（红外学习按键）',
        sublabel: '希望一只遥控器同时控制电视电源和机顶盒',
        solution: {
          title: '遥控器红外按键学习步骤：',
          steps: [
            '将小云遥控器与电视原装遥控器的红外发射头对准，距离保持 2-3 公分。',
            '长按小云遥控器电视键区的「设置 (SET)」键 3-5 秒，直到红灯长亮，进入学习模式。',
            '在小云遥控器上按一下要学习的按键（如电视电源键），红灯开始慢闪。',
            '对准按住电视原装遥控器电源键 1-2 秒，小云指示灯快闪 3 次后保持长亮，表示学习成功。',
            '按一下「设置 (SET)」键退出，即可直接用小云遥控器开闭电视机电源！',
          ],
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 1 课查看《手動學習電視遙控器》详细视频演示。',
        },
      },
      {
        key: 'D',
        label: '遥控器完全失灵 / 按键全无反应 / 红灯常亮不灭',
        sublabel: '遥控器死机、指示灯异常或按键完全无响应',
        solution: {
          title: '遥控器强制恢复出厂重设：',
          steps: [
            '取下电池后盖，重新安装全新正品电池，确保正负极接触良好。',
            '【强制重置】：同时长按遥控器的「确认键 (OK)」与「返回键」长达 5 秒。',
            '观察顶端红灯，直到红灯连续闪烁 3 次后熄灭，说明已成功清空所有配对数据。',
            '靠近电视盒 30 公分以内，按任意键自动重新完成对频连接。',
          ],
          warningOrTip: '⚠️ 若依然完全不亮灯，可能由于跌落导致硬件损坏，可向官方申请 1 对 1 换新质保。',
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 5 课查看《遙控器如何恢復原廠設定》。',
        },
      },
    ],
  },

  // Branch C: 频道与第三方应用
  channels: {
    id: 'channels',
    questionNumber: 2,
    totalQuestions: 2,
    categoryTitle: '频道与应用服务',
    title: '请问您需要观看或排查哪一类内容：',
    desc: '点击您关心的内容类型：',
    options: [
      {
        key: 'A',
        label: '想看大马 Astro、本地 Malay/Indian 频道或海外电视频道',
        sublabel: '华丽台、AEC、欢喜台、TVB、中港台直播',
        solution: {
          title: '电视频道快速切换指引：',
          steps: [
            '在首页点击打开「小云官方直播」应用。',
            '按遥控器「OK 键」调出频道列表，按「左键」切换频道分组。',
            '分组包含：🇲🇾 Astro 专区、🇲🇾 马来本地专区、🇭🇰 香港 TVB 翡翠台、🇹🇼 台湾热门新闻综艺、🇨🇳 内地央视卫视。',
            '长按 OK 键可将常看频道添加至「我的收藏 (Favorite)」，下次开机一键直达！',
          ],
          warningOrTip: '💡 一次购买，工厂终身免费授权，无任何隐藏月费或年费。',
        },
      },
      {
        key: 'B',
        label: '想看英超 EPL、欧冠、西甲、羽球等体育赛事直播专线',
        sublabel: '实时足球、BWF 羽毛球、NBA 蓝球高清线路',
        solution: {
          title: '体育直播与赛事线路指引：',
          steps: [
            '进入小云直播，左侧分类选择【体育专区】或【Sports HD】。',
            '包含 Astro SuperSport 1-4 台、Now Sports、BeIN Sports 1-3 台、SPOTV 等国际体育频道。',
            '大型赛事（如英超强强对决、奥运羽毛球决赛）时，优先选择带有「VIP 专线」或「低延迟专线」标识的线路。',
            '建议插网线或连 5G Wi-Fi，享受 60 帧无拖影流畅体验。',
          ],
          warningOrTip: '💡 15P 机型具备独立体育赛事硬件加速引擎，极速低延时不卡顿。',
        },
      },
      {
        key: 'C',
        label: '想安装与登入 Netflix、Disney+、YouTube 或 HBO Max',
        sublabel: '国际正版流媒体在电视盒上的下载与快捷登录',
        solution: {
          title: '国际流媒体安装与免打字登录：',
          steps: [
            '进入主页「ORZ 市场」或「Google Play 商店」，搜索对应应用并下载。',
            '打开应用点击「登录 (Sign In)」，屏幕将显示 6-8 位验证码及官方授权网址。',
            '用手机浏览器打开对应网址并输入验证码，即可一键授权登录，无需在电视上用遥控器艰难输入长密码！',
            '最高支持 4K HDR10 与杜比全景声输出。',
          ],
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 5 课查看《如何登錄 Prime Video, Netflix, Disney+》。',
        },
      },
      {
        key: 'D',
        label: '频道误删了 / 想找回 7 天无广告精彩节目回看',
        sublabel: '找回被隐藏的频道或重播错过的精彩节目',
        solution: {
          title: '7天节目回看与频道重置：',
          steps: [
            '在小云直播中，选中目标频道后按「向右键」调出 7 天 EPG 节目回看单。',
            '挑选过去 7 天内任意播出的电视剧、综艺或球赛，随时点播回看，支持快进与倒退。',
            '若误删了频道，进入直播设置 ->「频道管理」-> 选择「恢复默认频道列表」即可瞬间全部找回。',
          ],
          warningOrTip: '💡 包含回看去广告功能，无需忍受漫长广告等待。',
        },
      },
    ],
  },

  // Branch D: 商城与售后
  mall_policy: {
    id: 'mall_policy',
    questionNumber: 2,
    totalQuestions: 2,
    categoryTitle: '商城政策与售后质保',
    title: '请问您需要了解哪一项官方售后与商城信息：',
    desc: '点击对应的政策指引：',
    options: [
      {
        key: 'A',
        label: '新买的电视盒到了，首次通电该怎么开机初始化设置？',
        sublabel: '新机开机向导、连接电视、语言与画面调整',
        solution: {
          title: '新机开箱快速配置 4 步走：',
          steps: [
            '使用随赠的原装 8K HDMI 线接驳电视与电视盒，插上电源。',
            '电视遥控器切换至对应 HDMI 信号源。',
            '屏幕提示欢迎配置，语言选择「中文（简体/繁体）」或「English」。',
            '连上家中 Wi-Fi 或插上网线，根据屏幕指引调校边缘画面缩放 (Screen Zoom)，即可畅快观影！',
          ],
          hasVideoTutorial: true,
          videoTip: '可前往「官方教學視頻」第 2 课查看《開機如何設定》完整高清视频。',
        },
      },
      {
        key: 'B',
        label: '怎么申请『1 年内原厂 1 对 1 换新』质保服务？',
        sublabel: '官方正品承诺，非人为损坏 1 年直接换全新机',
        solution: {
          title: '1 年原厂 1 对 1 换新快速通道：',
          steps: [
            '【官方承诺】：Svi Studio Malaysia 坚持只换不修！购机 1 年内若出现任何硬件或主板故障，直接为您更换全新原装整机！',
            '【申报流程】：向客服发送机身背面防伪 S/N 码或下单手机号 -> 确认硬件问题 -> J&T 顺丰上门取件并为您寄出全新机。',
            '【专属专员】：点击下方绿色按钮直接联系 WhatsApp 客服专员，无需繁琐填表，极速登记！',
          ],
          warningOrTip: '⚠️ 请勿私自刷机或拆卸机身，避免失去官方保修资格。',
        },
      },
      {
        key: 'C',
        label: '下单后几天送到？支持哪些官方付款方式？',
        sublabel: '免运费派送时效与 5 大官方安全支付方式',
        solution: {
          title: '派送时效与官方支付方式：',
          steps: [
            '【派送时效】：全马现货包邮！西马 1-2 个工作日极速送达（J&T Express / Ninja Van 派送）；东马（沙巴/砂拉越）4-5 个工作日空运送达。',
            '【官方 5 大支付】：仅支持 Online Transfer（银行转账）、TNG eWallet（一触即通）、QuitNow QR（即时扫码）、Visa / MasterCard（信用卡/借记卡）、FPX 在线网银。',
            '【无隐藏费用】：100% 官方正品包邮包税，没有任何隐藏月费或分期杂费。',
          ],
        },
      },
      {
        key: 'D',
        label: '查询我刚买的电视盒当前快递派送进度 (Tracking)',
        sublabel: '实时物流轨迹、快递单号与派件员信息',
        solution: {
          title: '实时订单物流追踪方法：',
          steps: [
            '轻触商城顶部导航栏或页脚中的「物流追踪」按钮。',
            '输入您下单时填写的「订单编号 (如 SVI-...)」或「手机号码」。',
            '系统将从 J&T Express / Ninja Van 专线实时调取取件、分拨与派送轨迹！',
          ],
        },
      },
    ],
  },
};

export const AiCustomerServiceModal: React.FC<AiCustomerServiceModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  // Mode toggle: 'guided' (A/B/C/D flow, default) vs 'chat' (free typing with Gemini)
  const [activeMode, setActiveMode] = useState<'guided' | 'chat'>('guided');

  // Guided flow state
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('root');
  const [historyTrail, setHistoryTrail] = useState<
    { questionId: string; selectedOption: DecisionOption }[]
  >([]);
  const [activeSolution, setActiveSolution] = useState<DecisionOption['solution'] | null>(null);
  const [lastSelectedOption, setLastSelectedOption] = useState<DecisionOption | null>(null);

  // Resolution status: null = asking, true = solved, false = unresolved (triggers WhatsApp)
  const [isResolved, setIsResolved] = useState<boolean | null>(null);

  // Chat mode state (free Gemini typing)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'bot',
      text:
        currentLang === 'zh'
          ? '您好！我是 Svi Studio Malaysia 官方智能顾问 SviBot。请问您有什么需要咨询？推荐优先使用顶部的「A/B/C/D 智能排查」一步步排查解决问题！'
          : currentLang === 'ms'
          ? 'Hai! Saya SviBot, penasihat pintar 24/7 Svi Studio Malaysia. Anda disyorkan menggunakan panduan pilihan A/B/C/D di atas untuk penyelesaian pantas!'
          : 'Hello! I am SviBot from Svi Studio Malaysia. You are recommended to use the A/B/C/D diagnostic guide above for quick troubleshooting!',
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    if (activeMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, activeMode]);

  if (!isOpen) return null;

  // Reset diagnostic flow
  const handleResetDiagnostic = () => {
    setCurrentQuestionId('root');
    setHistoryTrail([]);
    setActiveSolution(null);
    setLastSelectedOption(null);
    setIsResolved(null);
  };

  // Step back in diagnostic flow
  const handleStepBack = () => {
    if (isResolved !== null) {
      setIsResolved(null);
      return;
    }
    if (activeSolution) {
      setActiveSolution(null);
      return;
    }
    if (historyTrail.length > 0) {
      const newTrail = [...historyTrail];
      const previous = newTrail.pop();
      setHistoryTrail(newTrail);
      if (previous) {
        setCurrentQuestionId(previous.questionId);
      } else {
        setCurrentQuestionId('root');
      }
      setActiveSolution(null);
      setLastSelectedOption(null);
      setIsResolved(null);
    }
  };

  // Handle option selection in A / B / C / D
  const handleSelectOption = (option: DecisionOption) => {
    setLastSelectedOption(option);

    if (option.solution) {
      // Reached a concrete solution
      setActiveSolution(option.solution);
      setIsResolved(null);
    } else if (option.nextQuestionId && DECISION_TREE[option.nextQuestionId]) {
      // Advance to next single question
      setHistoryTrail((prev) => [...prev, { questionId: currentQuestionId, selectedOption: option }]);
      setCurrentQuestionId(option.nextQuestionId);
      setActiveSolution(null);
      setIsResolved(null);
    }
  };

  // Generate customized WhatsApp URL
  const getWhatsAppUrl = () => {
    const issueSummary = lastSelectedOption
      ? `${lastSelectedOption.label}`
      : '电视盒疑难故障排查';
    const text = encodeURIComponent(
      `Hi Svi Studio Malaysia, 我通过AI客服排查【${issueSummary}】，遇到困难依然未能解决，需要官方工程师协助排查。`
    );
    return `https://api.whatsapp.com/send?phone=601111766671&text=${text}`;
  };

  // Chat message send handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          lang: currentLang,
          history: messages.slice(-5).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text:
          data.reply ||
          '如果依然遇到卡顿或故障，请先重启 Wi-Fi 和电视盒再试！如需人工协助，可随时点击底部 WhatsApp 客服。',
        time: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.warn('AI chat error:', e);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text:
          '重启 Wi-Fi 和电视盒，再进行尝试！如果还是卡顿或未能解决，请点击下方绿色按钮联络我们 WhatsApp 客服专员 (+601111766671)。',
        time: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const currentNode = DECISION_TREE[currentQuestionId] || DECISION_TREE.root;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl h-[92vh] sm:h-[640px] rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-xs sm:text-sm">SviBot 智能售后助手</h3>
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                  官方专席
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>全天候 24/7 在线排查</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] sm:text-xs">
              <button
                onClick={() => setActiveMode('guided')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeMode === 'guided'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A/B/C/D 排查
              </button>
              <button
                onClick={() => setActiveMode('chat')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  activeMode === 'chat'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                自由提问
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODE 1: Guided A / B / C / D Decision Flow (Default & Primary) */}
        {activeMode === 'guided' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/60">
            {/* Breadcrumb / Step Indicator */}
            <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 pb-1 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5">
                {(historyTrail.length > 0 || activeSolution) && (
                  <button
                    onClick={handleStepBack}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors pr-2 border-r border-slate-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>返回上一步</span>
                  </button>
                )}
                <span className="font-medium text-slate-300">
                  {activeSolution
                    ? '第 2 步 · 官方推荐排查方案'
                    : `第 ${currentNode.questionNumber} 题 / 共 ${currentNode.totalQuestions} 题 · ${currentNode.categoryTitle}`}
                </span>
              </div>

              {(historyTrail.length > 0 || activeSolution || isResolved !== null) && (
                <button
                  onClick={handleResetDiagnostic}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>重新开始</span>
                </button>
              )}
            </div>

            {/* CASE 1: UNRESOLVED -> WhatsApp Escalation Card */}
            {isResolved === false ? (
              <div className="rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/60 p-5 space-y-4 shadow-xl animate-in zoom-in-95">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      1对1 官方工程师专属通道
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      问题尚未解决？请交给我们大马官方团队！
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      别担心！您刚才排查的问题为：
                      <strong className="text-emerald-300 ml-1">
                        {lastSelectedOption?.label || '电视盒故障'}
                      </strong>
                      。我们的大马官方高级技术工程师已就绪，欢迎直接通过 WhatsApp 发送问题截图或视频，我们将提供即时远程诊断或安排 1 对 1 换新！
                    </p>
                  </div>
                </div>

                {/* Big WhatsApp CTA Button */}
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>立即连接 WhatsApp 官方客服 (+601111766671)</span>
                </a>

                {/* Sub features for reassurance */}
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300 pt-1">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>大马工作时间内 10分钟极速响应</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>支持 1年原厂1对1换新保障</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                  <button
                    onClick={handleResetDiagnostic}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>排查其他问题</span>
                  </button>
                  <button
                    onClick={() => setActiveMode('chat')}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>切换到自由打字问答</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : isResolved === true ? (
              /* CASE 2: SOLVED SUCCESS CARD */
              <div className="rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 p-6 text-center space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
                  <ThumbsUp className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg sm:text-xl font-black text-white">太棒了！很高兴为您解决问题！</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Svi Studio Malaysia 感谢您的支持！祝您与家人享受 4K/8K 杜比视界的极致观影体验。
                    如日后有任何疑问，随时点击客服图标，我们都在这里！
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all active:scale-95"
                  >
                    完成并关闭
                  </button>
                  <button
                    onClick={handleResetDiagnostic}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                  >
                    排查其他问题
                  </button>
                </div>
              </div>
            ) : activeSolution ? (
              /* CASE 3: DISPLAY CONCRETE SOLUTION & ASK "RESOLVED?" */
              <div className="space-y-4 animate-in fade-in">
                {/* Solution Box */}
                <div className="rounded-2xl bg-slate-900/90 border border-cyan-500/50 p-4 sm:p-5 space-y-3.5 shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      {lastSelectedOption?.key}
                    </span>
                    <h4 className="font-bold text-white text-sm sm:text-base">
                      {activeSolution.title}
                    </h4>
                  </div>

                  <div className="space-y-2 p-3 sm:p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                    {activeSolution.steps.map((st, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                          {sIdx + 1}
                        </span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>

                  {activeSolution.warningOrTip && (
                    <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-[11px] text-cyan-200">
                      {activeSolution.warningOrTip}
                    </div>
                  )}

                  {activeSolution.hasVideoTutorial && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Film className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>{activeSolution.videoTip || '本教程已同步至官方教學視頻庫'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resolution Prompt: Did this resolve the issue? */}
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-3">
                  <div className="text-center space-y-1">
                    <h5 className="font-black text-white text-xs sm:text-sm">
                      按照以上步骤操作后，您的问题解决了吗？
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      若依然存在故障，系统将直接为您接入 WhatsApp 官方专属客服：
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* Option A: Solved */}
                    <button
                      onClick={() => setIsResolved(true)}
                      className="p-3 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-600/60 hover:border-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 group"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>[A] ✅ 已经解决，恢复正常！</span>
                    </button>

                    {/* Option B: Unsolved -> triggers WhatsApp */}
                    <button
                      onClick={() => setIsResolved(false)}
                      className="p-3 rounded-xl bg-amber-950/70 hover:bg-amber-900/90 border border-amber-600/60 hover:border-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 group"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span>[B] ⚠️ 依然解决不到，转接 WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* CASE 4: SHOW CURRENT SINGLE QUESTION WITH A / B / C / D OPTIONS */
              <div className="space-y-4 animate-in fade-in">
                {/* Question Prompt Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-indigo-950/60 border border-cyan-800/50 space-y-1.5 shadow-md">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-[10px] text-cyan-300 font-bold">
                    <HelpCircle className="w-3 h-3 text-cyan-400" />
                    <span>单题单选排查</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white">{currentNode.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-300">{currentNode.desc}</p>
                </div>

                {/* 4 Clickable Options: A / B / C / D */}
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                  {currentNode.options.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt)}
                      className="group relative w-full text-left p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/80 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/40 flex items-start gap-3 active:scale-[0.99]"
                    >
                      {/* Badge Key: A / B / C / D */}
                      <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-700 group-hover:border-cyan-400 group-hover:bg-cyan-500 text-slate-300 group-hover:text-slate-950 font-black text-sm flex items-center justify-center shrink-0 transition-colors shadow-inner">
                        {opt.key}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-white text-xs sm:text-sm group-hover:text-cyan-300 transition-colors">
                            {opt.label}
                          </h4>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        {opt.sublabel && (
                          <p className="text-[10px] sm:text-[11px] text-slate-400 group-hover:text-slate-300 leading-relaxed">
                            {opt.sublabel}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Direct WhatsApp help link if user wants immediate human support */}
                <div className="pt-2 text-center">
                  <a
                    href="https://api.whatsapp.com/send?phone=601111766671&text=Hi%20Svi%20Studio%20Malaysia,%20I%20would%20like%20to%20speak%20with%20an%20engineer%20directly"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>不想排查？点击直接联络 WhatsApp 官方技术专员 (+601111766671)</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MODE 2: Free Chat with Gemini 3.8 AI */
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-950/60">
            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
              <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-[11px] text-cyan-200">
                💡 您正在使用自由对话模式。若遇到复杂故障，推荐点击顶部
                <strong className="text-cyan-300 mx-1">「A/B/C/D 排查」</strong>
                体验单题智能诊断向导！
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed space-y-1 ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span className="block text-[9px] opacity-60 text-right">{m.time}</span>
                  </div>

                  {m.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-center text-xs text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] text-slate-400 ml-1">SviBot 正在分析最佳解答...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Pills */}
            <div className="px-3 py-2 border-t border-slate-800/80 bg-slate-900/90 overflow-x-auto whitespace-nowrap space-x-2 shrink-0">
              {t.aiSupport.quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="inline-block px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-950 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入您的问题 (如: 为什么看球赛卡顿? 15P多少钱?)..."
                  className="flex-1 bg-slate-900 text-xs text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-40 transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
