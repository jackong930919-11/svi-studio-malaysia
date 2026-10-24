import React, { useState, useMemo } from 'react';
import {
  Play,
  Search,
  ArrowLeft,
  Tv,
  Youtube,
  HelpCircle,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Sliders,
  Maximize2,
  X,
  Layers,
  Film,
  Dumbbell,
  BookOpen,
} from 'lucide-react';
import { Language } from '../types';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { UI_COPY } from '../data/uiTranslations';

interface TeachingPageProps {
  currentLang: Language;
  onNavigateToStore: () => void;
  onNavigateToAccessories?: () => void;
}

export interface VideoTutorialItem {
  id: string;
  title: string;
  category: 'youtube' | 'remote' | 'system' | 'apps' | 'gym' | 'troubleshoot';
  categoryLabel: string;
  type: 'youtube' | 'html5';
  embedUrl?: string;
  videoSrc?: string;
  poster?: string;
  summary: string;
  steps: string[];
  tips?: string;
  recommendedFor?: string;
}

export const TUTORIAL_ITEMS: VideoTutorialItem[] = [
  // 9 YouTube Video Embeds
  {
    id: 'yt-remote-learning',
    title: '手動學習電視遙控器',
    category: 'remote',
    categoryLabel: '遙控器與按鍵學習',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/oM2MbTOfgBI',
    summary: '將電視機原裝遙控器的「電源」與「音量」按鍵學習到小雲遙控器，從此客廳只需一隻遙控器即可同時開關電視與小雲機頂盒。',
    steps: [
      '將小雲遙控器與電視原裝遙控器的紅外發射頭頭對頭放置，相距約 2-3 公分。',
      '長按小雲遙控器電視鍵區的「設置 (SET)」鍵約 3-5 秒，直到紅色指示燈長亮，進入學習模式。',
      '在小雲遙控器上按一下要學習的目標按鍵（如電視電源鍵），此時指示燈開始慢閃。',
      '對準按住電視原裝遙控器對應的按鈕（如電視原裝電源鍵）1-2秒，小雲指示燈快閃3次後保持常亮，表示學習成功。',
      '按一下「設置 (SET)」鍵儲存並退出，即可直接用小雲遙控器開關電視！',
    ],
    tips: '若初次學習未成功，請更換原裝遙控器電池或縮短紅外發射頭對齊距離再次嘗試。',
    recommendedFor: '全系列 SVI 9P / 10P / 10S / 15P / 9MAX',
  },
  {
    id: 'yt-boot-setup',
    title: '開機如何設定',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/21KD5vNpZMg',
    summary: '新機第一次通電後的完整開機嚮導，引導您完成語言挑選、Wi-Fi 聯網、屏幕邊界校準等初始步驟。',
    steps: [
      '使用隨機附贈的 8K HDMI 線將電視盒與電視機連接，插上電源開機。',
      '電視訊號源切換至對應的 HDMI 端口，屏幕將顯示歡迎配置界面。',
      '使用方向鍵選擇顯示語言（推薦選擇「中文 (繁體/簡體)」或「English」）。',
      '搜尋並連接家裡的 2.4G / 5.0G Wi-Fi 無線網絡（或直接插上 RJ45 網線免密碼聯網）。',
      '調校屏幕縮放比例（Screen Zoom），確保綠色/白色邊框完全吻合電視邊緣，點擊完成即可秒進主界面！',
    ],
    tips: '建議優先連接 5.0G Wi-Fi 或直接插網線，觀看 4K/8K 體育直播更順暢！',
    recommendedFor: '新購機用戶首次通電必看',
  },
  {
    id: 'yt-quick-launch',
    title: '如何使用快捷啟動',
    category: 'remote',
    categoryLabel: '遙控器與按鍵學習',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/KaJ5yPq9lzo',
    summary: '自定義遙控器按鍵快捷映射，按下指定按鍵即時秒開喜愛的應用程式（如直接進入電視直播或 YouTube）。',
    steps: [
      '在小雲主頁上方點擊進入「設定 (Settings)」菜單。',
      '找到「自定義快捷鍵 / 快捷啟動」選項。',
      '選擇遙控器對應的彩色按鍵（紅/綠/黃/藍）或數字鍵。',
      '從安裝列表挑選您常用的應用（如「小雲直播」、「泥巴影院」或「YouTube」）。',
      '完成設定後，在任何畫面下只需按一下該按鍵，系統立即一秒切換進入目標應用！',
    ],
    tips: '長輩日常若只看電視台，可將紅色按鍵綁定為電視直播，一鍵開機即看！',
    recommendedFor: '有長輩或習慣一鍵觀影的家庭',
  },
  {
    id: 'yt-speedtest',
    title: '網路測速與連線診斷',
    category: 'troubleshoot',
    categoryLabel: '故障排除與測速',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/b6HWkUpRaH0',
    summary: '電視盒內建測速診斷工具，精準檢測實時下載速度、網絡延遲與丟包率，排查卡頓問題。',
    steps: [
      '在電視盒主界面進入「工具箱 (Tools)」或「我的應用」。',
      '點擊打開「網絡測速 (Speedtest)」應用程式。',
      '點擊「開始測速 (Start Test)」，系統將自動檢測本地延遲 (Ping)、下載帶寬與上傳速度。',
      '4K 高清播放建議下載速度達到 30Mbps 以上；8K 頂級影院建議 100Mbps 以上。',
      '若測速過低，可嘗試將電視盒移近路由器，或重啟 Wi-Fi 路由器與電視盒。',
    ],
    tips: '遇卡頓官方標準排查方案：先重啟路由器 + 重啟電視盒，通常 90% 的網絡緩衝即可解決。',
    recommendedFor: '網絡出現轉圈、卡頓或延遲時排查',
  },
  {
    id: 'yt-remote-reset',
    title: '遙控器如何恢復原廠設定',
    category: 'remote',
    categoryLabel: '遙控器與按鍵學習',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/3r93OcIMOsg',
    summary: '當藍牙遙控器出現按鍵無反應、指示燈常亮不滅或誤學習按鍵需清空時，一鍵恢復出廠初始狀態。',
    steps: [
      '確認遙控器電池電量充足，取下後蓋檢查電池接觸點。',
      '同時按住遙控器上的「確認鍵 (OK)」與「返回鍵 (Back)」長達 5 秒。',
      '觀察頂端指示燈，直到指示燈快速閃爍 3 次後熄滅，此時遙控器已清除所有自定義學習與配對記錄。',
      '靠近電視盒 30 公分以內，按任意鍵重新自動完成藍牙對頻。',
      '配對成功後屏幕右上方會提示「藍牙遙控器已連接」，即可恢復正常操控。',
    ],
    tips: '恢復原廠設定會清除紅外電視學習鍵的數據，如需控制電視需重新手動學習。',
    recommendedFor: '遙控器偶發性按鍵失靈或藍牙斷連',
  },
  {
    id: 'yt-disable-screen-reader',
    title: '如何關閉 YouTube 的導讀 (TalkBack)',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/_xjaD7Gh9JQ',
    summary: '解決打開 YouTube 或系統界面時出現黃色/綠色選中方框，並伴隨機械人聲語音朗讀內容的無障礙問題。',
    steps: [
      '返回電視盒主頁，點擊進入「系統設定 (Settings)」。',
      '向下滾動選單，點選「設備偏好設定」->「無障礙功能 (Accessibility)」。',
      '找到「TalkBack」或「隨選朗讀 (Screen Reader)」選項。',
      '點擊進入將開關狀態由「開啟 (On)」切換為「關閉 (Off)」。',
      '確認後黃色線框立即消失，人聲朗讀關閉，遙控器恢復流暢單擊操作！',
    ],
    tips: '長按遙控器上的返回鍵或音量鍵有時會誤觸無障礙快捷方式，依照此步驟關閉即可。',
    recommendedFor: '屏幕出現黃框、按一下沒反應需雙擊的用戶',
  },
  {
    id: 'yt-fix-language',
    title: '如何解決每次開機都變成其他語言',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/sG7OjnI-Rnk',
    summary: '鎖定電視盒預設語言，徹底解決部分電視重啟後自動變更為英文或其他語言的顯示問題。',
    steps: [
      '進入「系統設定」->「設備偏好設定」->「語言 (Language)」。',
      '在語言列表中，選中「中文 (繁體/簡體)」並將其拖動至最頂部第一位。',
      '移除或關閉列表中其他不常用的外語選項。',
      '進入「日期與時間」，將時區手動固定為「馬來西亞吉隆坡 (GMT+8)」，關閉由 HDMI CEC 自動同步語言。',
      '重新啟動電視盒測試，開機將永遠默認保持中文界面！',
    ],
    tips: '在電視機本身的 HDMI 設定中關閉「HDMI CEC 自動同步語言」，防止電視強行覆蓋盒子語言。',
    recommendedFor: '每次重新通電語言跳回英文的用戶',
  },
  {
    id: 'yt-exit-mouse-mode',
    title: '進入鼠標模式後，怎麼退出？',
    category: 'remote',
    categoryLabel: '遙控器與按鍵學習',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/-OxSYablwxM',
    summary: '如果不小心誤按了遙控器上的飛鼠/鼠標鍵，屏幕上出現箭頭光標且方向鍵無法正常跳格時的退出技巧。',
    steps: [
      '尋找小雲遙控器正面的「鼠標圖標」按鍵（通常位於方向鍵下方或音量鍵旁）。',
      '輕輕按一下該「鼠標鍵」。',
      '屏幕上的白色箭頭指針將會瞬間隱藏消失。',
      '電視焦點會自動回歸為標準的方塊高亮焦點，即可繼續使用上下左右方向鍵正常導航。',
    ],
    tips: '在部分網頁瀏覽器或特定手機版 APP 中，開啟鼠標模式反而能更方便點擊細小按鈕。',
    recommendedFor: '方向鍵按不動、屏幕出現滑鼠箭頭的用戶',
  },
  {
    id: 'yt-voice-troubleshoot',
    title: '遙控器 ～語音不能用怎麼辦？',
    category: 'remote',
    categoryLabel: '遙控器與按鍵學習',
    type: 'youtube',
    embedUrl: 'https://www.youtube.com/embed/bfTvi-8z8hg',
    summary: '按住語音麥克風鍵無反應、提示「請配對藍牙」或無法識別聲音時的 3 步排查與重新連線教學。',
    steps: [
      '檢查電池電量：電量過低時遙控器會優先關閉耗電的藍牙語音功能，請先更換一對全新 AAA 電池。',
      '檢查藍牙連線：進入「設定」->「遙控器與配件」，查看「SVI Remote」是否顯示「已連接」。',
      '重新配對藍牙：若顯示斷開，同時按住遙控器的「確認鍵 + 音量減」5 秒直到紅燈快閃，電視屏幕點擊配對完成重新連線。',
      '對準遙控器頂部麥克風孔，按住語音鍵說出「劉德華電影」或「打開小雲直播」，鬆開手指即可秒出搜尋結果！',
    ],
    tips: '語音功能必須通過藍牙傳輸；若遙控器僅在紅外線模式下工作，語音按鍵將無法生效。',
    recommendedFor: '語音搜尋無法辨識或按語音鍵沒反應',
  },

  // 14 SVI Official System & Feature Guides
  {
    id: 'svi-voice-apps',
    title: '語音指令打開應用程序',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/IzqBtpTDQRi1bd2kmHfA_1%E3%80%81%E8%AA%9E%E9%9F%B3%E6%8C%87%E4%BB%A4%E6%89%93%E9%96%8B%E6%87%89%E7%94%A8%E7%A8%8B%E5%BA%8F-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/IzqBtpTDQRi1bd2kmHfA_1%E3%80%81%E8%AA%9E%E9%9F%B3%E6%8C%87%E4%BB%A4%E6%89%93%E9%96%8B%E6%87%89%E7%94%A8%E7%A8%8B%E5%BA%8F-D.v2.0000000.jpg',
    summary: '利用小雲智能 AI 語音遙控器，動動嘴即可直接調出任意已安裝的影音、音樂或直播應用。',
    steps: [
      '按住遙控器上的語音鍵（麥克風圖標）。',
      '清晰說出指令，例如：「打開 YouTube」、「打開小雲直播」、「打開泥巴影視」。',
      '屏幕底部出現動態聲波辨識，辨識成功後鬆開手指。',
      '系統將自動跳轉並啟動目標 APP，無需在首頁逐個翻頁尋找。',
    ],
    tips: '支援普通話、粵語、英語等多語種智能識別。',
  },
  {
    id: 'svi-two-boot-methods',
    title: '兩種開機設置方式（遙控器與手機）',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/C8DeHDCZS1KcXoF2l4Fs_2%E3%80%81%E5%85%A9%E7%A8%AE%E9%96%8B%E6%A9%9F%E8%A8%AD%E7%BD%AE%E6%96%B9%E5%BC%8F+%E9%81%99%E6%8E%A7%E5%99%A8%E5%92%8C%E6%89%8B%E6%A9%9F-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/C8DeHDCZS1KcXoF2l4Fs_2%E3%80%81%E5%85%A9%E7%A8%AE%E9%96%8B%E6%A9%9F%E8%A8%AD%E7%BD%AE%E6%96%B9%E5%BC%8F+%E9%81%99%E6%8E%A7%E5%99%A8%E5%92%8C%E6%89%8B%E6%A9%9F-D.v2.0000000.jpg',
    summary: '支援傳統遙控器逐步點擊設置，或使用智慧型手機掃碼秒速同步 Wi-Fi 與 Google 賬戶。',
    steps: [
      '方式一（遙控器）：按照屏幕指示選擇語言、手動輸入 Wi-Fi 密碼完成初始化。',
      '方式二（手機快速設定）：屏幕顯示 Google 快捷設定二維碼，用安卓手機或 Google APP 掃描。',
      '手機將自動把家中 Wi-Fi 連接訊息與 Google 賬戶一鍵同步至電視盒，省去遙控器敲鍵盤輸入長密碼的繁瑣！',
    ],
    tips: '使用手機配對能大幅節省輸入長密碼的時間。',
  },
  {
    id: 'svi-factory-reset',
    title: '兩種恢復出廠方式：系統設置和用戶賬戶',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/BCo7mOPiQ92oTuuE1PUZ_3%E3%80%81%E5%85%A9%E7%A8%AE%E6%81%A2%E8%A4%87%E5%87%BA%E5%BB%A0%E6%96%B9%E5%BC%8F%EF%BC%9A%E7%B3%BB%E7%B5%B1%E8%A8%AD%E7%BD%AE%E5%92%8C%E7%94%A8%E6%88%B6%E8%B3%AC%E6%88%B6-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/BCo7mOPiQ92oTuuE1PUZ_3%E3%80%81%E5%85%A9%E7%A8%AE%E6%81%A2%E8%A4%87%E5%87%BA%E5%BB%A0%E6%96%B9%E5%BC%8F%EF%BC%9A%E7%B3%BB%E7%B5%B1%E8%A8%AD%E7%BD%AE%E5%92%8C%E7%94%A8%E6%88%B6%E8%B3%AC%E6%88%B6-D.v2.0000000.jpg',
    summary: '深入清理系統垃圾或重置盒子時的兩種官方安全途徑。',
    steps: [
      '途徑一：進入「系統設定」->「設備偏好設定」->「重設」->「清除全部數據 (恢復出廠)」。',
      '途徑二：在「用戶賬戶」中移除綁定賬戶並選擇清理用戶緩存空間。',
      '點擊確認後，電視盒將自動重啟並進入出廠乾淨狀態。',
    ],
    tips: '恢復出廠不會影響出廠終身授權，重新連網後應用市場與頻道均可正常重新下載使用！',
  },
  {
    id: 'svi-move-apps',
    title: '如何移動應用程序到指定位置',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/JOn2lc6QcueHoXAcw1Eh_4%E3%80%81%E5%A6%82%E4%BD%95%E7%A7%BB%E5%8B%95%E6%87%89%E7%94%A8%E7%A8%8B%E5%BA%8F%E5%88%B0%E6%8C%87%E5%AE%9A%E4%BD%8D%E7%BD%AE-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/JOn2lc6QcueHoXAcw1Eh_4%E3%80%81%E5%A6%82%E4%BD%95%E7%A7%BB%E5%8B%95%E6%87%89%E7%94%A8%E7%A8%8B%E5%BA%8F%E5%88%B0%E6%8C%87%E5%AE%9A%E4%BD%8D%E7%BD%AE-D.v2.0000000.jpg',
    summary: '自定義整理首頁桌面圖標順序，將最常看的小雲直播排在最前端。',
    steps: [
      '在首頁應用列表，將焦點移動到想要調整的應用圖標上。',
      '長按遙控器「確認鍵 (OK)」約 2-3 秒，直到圖標浮起並出現「移動」提示。',
      '使用方向鍵左右移動圖標到您喜愛的排序位置。',
      '按一下「OK 鍵」固定位置即可！',
    ],
    tips: '也可以點擊最前面的「+」號快速新增桌面常用快捷方式。',
  },
  {
    id: 'svi-streaming-login',
    title: '如何登錄 Prime Video, Netflix, HBO, Disney+',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/nXa2McdfQtGVSSTwOF2V_5%E3%80%81%E5%A6%82%E4%BD%95%E7%99%BB%E9%99%B8prime+video%2CNetflix%2CHBO%2CDisney%2B-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/nXa2McdfQtGVSSTwOF2V_5%E3%80%81%E5%A6%82%E4%BD%95%E7%99%BB%E9%99%B8prime+video%2CNetflix%2CHBO%2CDisney%2B-D.v2.0000000.jpg',
    summary: '登入國際流媒體正版賬號的最佳操作方式，支援 4K 杜比視界與全景聲輸出。',
    steps: [
      '打開對應的官方串流客戶端（如 Netflix 或 Disney+）。',
      '點擊「登錄 (Sign In)」，屏幕會出現 6 位或 8 位授權碼與驗證網址。',
      '使用手機或電腦打開提示的驗證網址，登錄您的流媒體賬戶並輸入屏幕驗證碼。',
      '電視端將自動瞬間授權成功並同步您的個人觀影列表！',
    ],
    tips: '使用手機掃碼或網頁碼授權，無需在電視上繁瑣輸入郵箱與長密碼。',
  },
  {
    id: 'svi-learn-tv-keys',
    title: '如何學習電視按鍵（紅外對接）',
    category: 'remote',
    categoryLabel: '遙控器與按鍵學習',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/YevnQxW5RtmfIL1LRUIl_6%E3%80%81%E5%A6%82%E4%BD%95%E5%AD%B8%E7%BF%92%E9%9B%BB%E8%A6%96%E6%8C%89%E9%8D%B5-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/YevnQxW5RtmfIL1LRUIl_6%E3%80%81%E5%A6%82%E4%BD%95%E5%AD%B8%E7%BF%92%E9%9B%BB%E8%A6%96%E6%8C%89%E9%8D%B5-D.v2.0000000.jpg',
    summary: '官方詳細動態演示電視鍵學習過程，支援電視開關、電視音量+/-及 AV/TV 切換。',
    steps: [
      '小雲遙控器進入 SET 學習狀態。',
      '對齊電視紅外線發射頭。',
      '逐一對應學習開關機、音量增減鍵。',
      '測試電視機響應，一隻遙控器掌控全客廳。',
    ],
    tips: '學習時請避免強光或日光直射發射頭，保證紅外信號錄入精準。',
  },
  {
    id: 'svi-uninstall-app',
    title: '卸載應用程序指南',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/sjeIlFxDQ7GXcadW9Bcs_7%E3%80%81%E5%8D%B8%E8%BC%89%E6%87%89%E7%94%A8-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/sjeIlFxDQ7GXcadW9Bcs_7%E3%80%81%E5%8D%B8%E8%BC%89%E6%87%89%E7%94%A8-D.v2.0000000.jpg',
    summary: '及時清理不再需要的軟體，釋放內存存儲空間，保持電視盒長期流暢不卡頓。',
    steps: [
      '在首頁進入「應用管理」或「設定」->「應用程序」。',
      '找到需要移除的軟體圖標。',
      '點擊「卸載 (Uninstall)」並確認。',
      '系統將自動清除該應用的所有殘留緩存文件。',
    ],
    tips: '常規出廠內建核心應用無法卸載，保護系統穩定運行。',
  },
  {
    id: 'svi-sleep-settings',
    title: '休眠時間與待機省電設置',
    category: 'system',
    categoryLabel: '基礎設定與系統',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/IZnC805TrSCPt3xHUpTw_8%E3%80%81%E4%BC%91%E7%9C%A0%E6%99%82%E9%96%93%E8%A8%AD%E7%BD%AE-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/IZnC805TrSCPt3xHUpTw_8%E3%80%81%E4%BC%91%E7%9C%A0%E6%99%82%E9%96%93%E8%A8%AD%E7%BD%AE-D.v2.0000000.jpg',
    summary: '自定義電視盒無操作時的自動休眠時長，保護電視屏幕，節省待機用電。',
    steps: [
      '進入「系統設定」->「設備偏好設定」->「螢幕保護程式 (Screen Saver)」。',
      '選擇「進入休眠狀態的時間」，可設置為 15分鐘 / 30分鐘 / 1小時 / 從不。',
      '喚醒時只需按一下遙控器電源鍵即可 0.5 秒瞬間秒啟！',
    ],
    tips: '長輩睡前看電視若忘記關機，可設為 1 小時後自動休眠。',
  },
  {
    id: 'svi-download-apps',
    title: '下載第三方應用指南',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/Q0TBpN8LR2eSuezUGaiX_9%E3%80%81%E4%B8%8B%E8%BC%89%E6%87%89%E7%94%A8-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/Q0TBpN8LR2eSuezUGaiX_9%E3%80%81%E4%B8%8B%E8%BC%89%E6%87%89%E7%94%A8-D.v2.0000000.jpg',
    summary: '從 Google Play Store、小雲應用市場或 U 盤安裝各種海量 APK 軟體。',
    steps: [
      '打開電視盒自帶的「應用市場」或「Google Play Store」。',
      '在搜索欄輸入軟體名稱或拼音首字母。',
      '點擊「安裝」，下載完成後系統自動完成安裝並建立桌面圖標。',
    ],
    tips: '亦可將電腦下載的 APK 裝入 U 盤，插入電視盒 USB 端口直接點擊安裝。',
  },
  {
    id: 'svi-download-hbo-max',
    title: '下載 HBO MAX 客戶端',
    category: 'apps',
    categoryLabel: '影視串流与 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/2Wgs2MqaRSulaZRlxwRY_10%E3%80%81%E4%B8%8B%E8%BC%89HBO+MAX-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/2Wgs2MqaRSulaZRlxwRY_10%E3%80%81%E4%B8%8B%E8%BC%89HBO+MAX-D.v2.0000000.jpg',
    summary: '在小雲電視盒上流暢安裝正版 HBO Max / Max 官方 TV 應用程式。',
    steps: [
      '進入應用市場或 Google Play 搜索「Max」或「HBO Max」。',
      '點擊下載 TV 版客戶端。',
      '使用手機登錄賬戶即可畅享華納兄弟大片與 HBO 原創劇集。',
    ],
    tips: '如在 Play 商店未找到，可從 ORZ 市場的「國際流媒體專區」直接一鍵下載。',
  },
  {
    id: 'svi-download-orz',
    title: 'ORZ 應用市場的下載及使用',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/b0mlmQtSYqIc0qtDCv2I_11%E3%80%81orz%E7%9A%84%E4%B8%8B%E8%BC%89%E5%8F%8A%E4%BD%BF%E7%94%A8-D-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/b0mlmQtSYqIc0qtDCv2I_11%E3%80%81orz%E7%9A%84%E4%B8%8B%E8%BC%89%E5%8F%8A%E4%BD%BF%E7%94%A8-D.v2.0000000.jpg',
    summary: 'SVI 小雲專屬海量應用集中站，一鍵獲取最新版小雲直播、影院、K歌及工具程式。',
    steps: [
      '在首頁瀏覽器或應用中心搜索下載「ORZ」市場安裝包。',
      '打開 ORZ 市場，進入「熱門應用」或「小雲專屬」。',
      '點擊任意應用程式即可後台極速自動下載並安裝。',
      'ORZ 市場還具備一鍵批量檢查應用更新功能，始終保持最新版本！',
    ],
    tips: 'ORZ 應用市場經過官方嚴格安全掃描，無毒無廣告插件。',
  },
  {
    id: 'svi-google-play-orz',
    title: '首頁搜索 Google Play，通過 Google Play 下載 ORZ',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/GqsIwLxqRfmt2qSCFR7R_%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2Google+Play%EF%BC%8C%E9%80%9A%E8%BF%87Google+Play%E4%B8%8B%E8%BD%BDorz-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/GqsIwLxqRfmt2qSCFR7R_%E9%A6%96%E9%A1%B5%E6%90%9C%E7%B4%A2Google+Play%EF%BC%8C%E9%80%9A%E8%BF%87Google+Play%E4%B.v2.0000000.jpg',
    summary: '透過 Google Play 官方商店安全安裝 ORZ 助手的操作流程。',
    steps: [
      '在首頁打開 Google Play 商店。',
      '搜尋欄輸入「ORZ」。',
      '點擊安裝並等待自動配置完成。',
    ],
    tips: '需要先登錄 Google 帳號即可正常下載。',
  },
  {
    id: 'svi-home-search-orz',
    title: '首頁應用程式直接搜索 ORZ',
    category: 'apps',
    categoryLabel: '影視串流與 ORZ 市場',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/Aeh0pdhfRr6rk08J8zPb_%E9%A6%96%E9%A1%B5%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BC%8F%E6%90%9C%E7%B4%A2ORZ-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/Aeh0pdhfRr6rk08J8zPb_%E9%A6%96%E9%A1%B5%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BC%8F%E6%90%9C%E7%B4%A2ORZ.v2.0000000.jpg',
    summary: '主界面最快捷的 ORZ 尋找與啟動方式。',
    steps: [
      '主頁點擊頂端全局搜索圖標。',
      '輸入「O-R-Z」。',
      '直接點擊啟動即可進入專屬市場。',
    ],
  },
  {
    id: 'svi-gym-install',
    title: 'SVI GYM 智能健身環安裝指引',
    category: 'gym',
    categoryLabel: 'SVI GYM 健身配件',
    type: 'html5',
    videoSrc:
      'https://vid.cdn-website.com/b1df9d15/videos/QzFwmzsdTeCY0K2Cn877_gyminstall-v.mp4',
    poster:
      'https://irp.cdn-website.com/b1df9d15/dms3rep/multi/QzFwmzsdTeCY0K2Cn877_gyminstall.v2.0000000.jpg',
    summary: '將電視盒升級為客廳健身房！SVI GYM 專屬體感傳感器與健身環配對組裝步驟。',
    steps: [
      '取出 SVI 健身環與大腿體感綁帶，裝入傳感器。',
      '在電視盒上下載並打開「SVI GYM」體感運動 APP。',
      '打開體感器電源開關，電視屏幕將自動完成藍牙秒速配對。',
      '按照屏幕教練動作進行體感校準，即可開始燃脂冒險、拳擊與瑜伽！',
    ],
    tips: '運動時請保持客廳前方 1.5 米無障礙物，享受暢快體感健身。',
    recommendedFor: '選配 SVI 體感健身環的用戶',
  },
];

export const TeachingPage: React.FC<TeachingPageProps> = ({
  currentLang,
  onNavigateToStore,
  onNavigateToAccessories,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeModalVideo, setActiveModalVideo] = useState<VideoTutorialItem | null>(null);
  const copy = UI_COPY[currentLang].teaching;

  // Filter tutorials based on category and search query
  const filteredTutorials = useMemo(() => {
    return TUTORIAL_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory === 'youtube' && item.type !== 'youtube') return false;
      if (activeCategory !== 'all' && activeCategory !== 'youtube' && item.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = item.title.toLowerCase().includes(q);
        const inSummary = item.summary.toLowerCase().includes(q);
        const inSteps = item.steps.some((s) => s.toLowerCase().includes(q));
        const inTips = item.tips ? item.tips.toLowerCase().includes(q) : false;
        return inTitle || inSummary || inSteps || inTips;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const youtubeVideosCount = TUTORIAL_ITEMS.filter((i) => i.type === 'youtube').length;
  const officialGuidesCount = TUTORIAL_ITEMS.filter((i) => i.type === 'html5').length;
  const getCategoryLabel = (item: VideoTutorialItem) => {
    if (currentLang === 'zh') return item.categoryLabel;
    switch (item.category) {
      case 'remote':
        return copy.categoryRemote;
      case 'system':
        return copy.categorySystem;
      case 'apps':
        return copy.categoryApps;
      case 'troubleshoot':
        return copy.categoryTroubleshoot;
      case 'gym':
        return copy.categoryGym;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background Starry Sky Canvas */}
      <StarfieldBackground />

      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-900/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500 transition-all text-xs font-semibold group"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>{copy.backStore}</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <img
                src="/images/Brand/svi-studio-logo.png"
                alt="Svi Studio 小云映画"
                className="w-24 sm:w-28 h-auto"
              />
              <div className="hidden sm:block">
                <span className="text-[10px] text-cyan-400 font-bold ml-1.5 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {copy.officialCenter}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToAccessories && (
              <button
                onClick={onNavigateToAccessories}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-300 hover:bg-amber-900/90 text-xs font-bold transition-all shadow-md shadow-amber-950/40"
              >
                <span>{copy.accessories}</span>
              </button>
            )}

            <a
              href="https://api.whatsapp.com/send?phone=60186663311&text=Hi%20Svi%20Studio%20Malaysia,%20I%20need%20technical%20assistance%20with%20teaching%20guides"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/90 text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">{copy.whatsappEngineer}</span>
              <span>+60186663311</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero Banner Section */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-xs font-bold shadow-inner">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copy.banner}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {copy.title}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
              {currentLang === 'zh' ? '官方教学中心' : 'Official Guides'}
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {copy.intro}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.search}
              className="w-full bg-slate-900/90 text-xs sm:text-sm text-slate-100 placeholder-slate-500 rounded-2xl pl-11 pr-10 py-3 sm:py-3.5 border border-slate-700/80 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-xl shadow-cyan-950/20 backdrop-blur-sm transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pt-1" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 pt-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>{copy.youtubeStats.replace('{count}', String(youtubeVideosCount))}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>{copy.officialStats.replace('{count}', String(officialGuidesCount))}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copy.supportStats}</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 max-w-4xl mx-auto backdrop-blur-sm">
          {[
            { id: 'all', label: copy.categoryAll.replace('{count}', String(TUTORIAL_ITEMS.length)) },
            { id: 'youtube', label: copy.categoryYoutube.replace('{count}', String(youtubeVideosCount)) },
            { id: 'remote', label: copy.categoryRemote },
            { id: 'system', label: copy.categorySystem },
            { id: 'apps', label: copy.categoryApps },
            { id: 'troubleshoot', label: copy.categoryTroubleshoot },
            { id: 'gym', label: copy.categoryGym },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Notice Card: Standard Troubleshooting Tip */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/60 to-blue-950/60 border border-cyan-800/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">
                {copy.noticeTitle}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                {copy.noticeText}
              </p>
            </div>
          </div>
          <a
            href="https://api.whatsapp.com/send?phone=60186663311&text=Hi%20Svi%20Studio%20Malaysia,%20I%20have%20questions%20about%20my%20TV%20Box"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{copy.supportCta}</span>
          </a>
        </div>

        {/* Videos Grid */}
        {filteredTutorials.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">{copy.noResults}</h3>
            <p className="text-xs text-slate-400">{copy.noResultsHelp}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              {copy.clearSearch}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredTutorials.map((item, idx) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 backdrop-blur-sm"
              >
                <div className="space-y-3.5">
                  {/* Top Badge & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700">
                      {item.type === 'youtube' ? (
                        <>
                          <Youtube className="w-3 h-3 text-red-500" />
                          <span>{copy.youtubeVideo}</span>
                        </>
                      ) : (
                        <>
                          <Film className="w-3 h-3 text-cyan-400" />
                          <span>{copy.officialGuide}</span>
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-cyan-400/90 font-medium">{getCategoryLabel(item)}</span>
                  </div>

                  {/* Video Player or Preview Area */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group/video">
                    {item.type === 'youtube' && item.embedUrl ? (
                      <iframe
                        src={item.embedUrl}
                        title={item.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : item.videoSrc ? (
                      <video
                        src={item.videoSrc}
                        poster={item.poster}
                        controls
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Play className="w-12 h-12" />
                      </div>
                    )}
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {idx + 1}. {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  {/* Key Steps List Preview */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 text-[11px] sm:text-xs">
                    <span className="font-bold text-cyan-300 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                      <Sliders className="w-3 h-3" />
                      <span>{copy.stepsHeader}</span>
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {item.steps.slice(0, 3).map((step, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="w-3.5 h-3.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[9px] shrink-0 mt-0.5 font-bold">
                            {sIdx + 1}
                          </span>
                          <span className="line-clamp-2 text-[10.5px] sm:text-xs">{step}</span>
                        </li>
                      ))}
                    </ul>
                    {item.steps.length > 3 && (
                      <p className="text-[9.5px] text-slate-500 pt-0.5">
                        {copy.moreSteps.replace('{count}', String(item.steps.length - 3))}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 truncate">
                    {item.recommendedFor || copy.guideSupport}
                  </span>
                  <button
                    onClick={() => setActiveModalVideo(item)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 shrink-0"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>{copy.fullSteps}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Contact / RMA Support Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950 border border-slate-800 p-6 sm:p-8 text-center space-y-4 max-w-4xl mx-auto backdrop-blur-sm">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-950/50">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-2xl font-black text-white">{copy.issueTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
              {copy.issueText}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href="https://api.whatsapp.com/send?phone=60186663311&text=Hi%20Svi%20Studio%20Malaysia,%20I%20need%20help%20with%20my%20TV%20Box"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{copy.contactExpert}</span>
            </a>
            <button
              onClick={onNavigateToStore}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all"
            >
              {copy.backOfficialStore}
            </button>
          </div>
        </div>
      </main>

      {/* Detailed Modal Viewer for Video & Steps */}
      {activeModalVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/50 shadow-2xl p-4 sm:p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-bold">
                  {getCategoryLabel(activeModalVideo)}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">{activeModalVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalVideo(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player in Modal */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
              {activeModalVideo.type === 'youtube' && activeModalVideo.embedUrl ? (
                <iframe
                  src={activeModalVideo.embedUrl}
                  title={activeModalVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : activeModalVideo.videoSrc ? (
                <video
                  src={activeModalVideo.videoSrc}
                  poster={activeModalVideo.poster}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>

            {/* Detailed Steps & Instructions */}
            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">{copy.overview}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeModalVideo.summary}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{copy.detailedSteps}</span>
                </h4>
                <ol className="space-y-2 text-xs text-slate-200">
                  {activeModalVideo.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{st}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {activeModalVideo.tips && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <strong>{copy.expertTip}</strong> {activeModalVideo.tips}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                {copy.modalSupport}
              </span>
              <button
                onClick={() => setActiveModalVideo(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                {copy.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Clean Footer */}
      <footer className="border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-sm py-6 text-center text-xs text-slate-500">
        <p>{copy.footer}</p>
      </footer>
    </div>
  );
};
