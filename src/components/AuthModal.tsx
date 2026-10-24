import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  currentLang,
}) => {
  const [tab, setTab] = useState<'quick' | 'otp'>('quick');
  const [emailOrPhone, setEmailOrPhone] = useState('user.malaysia@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [isSentOtp, setIsSentOtp] = useState(false);

  if (!isOpen) return null;

  const handleQuickLogin = (method: 'google' | 'guest') => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: method === 'google' ? 'Google User (大马买家)' : '快速访客 (Guest Shopper)',
      email: method === 'google' ? 'google.buyer@gmail.com' : 'guest@svistudio.my',
      phone: '+60 12-883 9182',
      role: 'customer',
      addresses: [
        {
          fullName: 'Tan Wei Loon',
          phone: '+60 12-384 9182',
          email: 'tan.wl88@gmail.com',
          addressLine1: 'No. 28, Jalan USJ 11/3D',
          city: 'Subang Jaya',
          state: 'Selangor',
          postcode: '47620',
        },
      ],
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleSendOtp = () => {
    setIsSentOtp(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: emailOrPhone.split('@')[0] || 'Malaysian Member',
      email: emailOrPhone.includes('@') ? emailOrPhone : 'member@svistudio.my',
      phone: !emailOrPhone.includes('@') ? emailOrPhone : '+60 12-332 9988',
      role: 'customer',
      addresses: [],
    };
    onLoginSuccess(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Logged In View */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
              <p className="text-xs text-slate-400">{currentUser.email || currentUser.phone}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                SVI 官方会员已登录
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
              <span className="font-semibold text-slate-400 text-[10px]">默认收件信息:</span>
              <p className="text-white font-medium">Tan Wei Loon (+60 12-384 9182)</p>
              <p className="text-slate-400">Subang Jaya, Selangor 47620</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
              >
                继续购物
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold text-xs border border-slate-700"
              >
                退出登录
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="text-xl font-black text-white">极简快捷登录 / 注册</h3>
              <p className="text-xs text-slate-400">支持一键 Google 授权或手机验证码直达，免去繁琐密码</p>
            </div>

            {/* Google One-Click Button */}
            <button
              onClick={() => handleQuickLogin('google')}
              className="w-full py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-2 shadow transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>使用 Google 账号一键秒登</span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest absolute">
                或者使用手机/邮箱验证
              </span>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">大马手机号 / 邮箱</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="+60 12-xxxxxxx 或 email@..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold shrink-0"
                  >
                    {isSentOtp ? '已发送验证码' : '获取验证码'}
                  </button>
                </div>
              </div>

              {isSentOtp && (
                <div className="animate-in fade-in">
                  <label className="text-[11px] text-slate-400 block mb-1">
                    输入收到的 6 位数验证码 (测试请输入 888888)
                  </label>
                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="888888"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white tracking-widest text-center font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-900/30"
              >
                验证并进入店铺
              </button>
            </form>

            {/* Fast Guest Shopping option */}
            <button
              onClick={() => handleQuickLogin('guest')}
              className="w-full text-center text-xs text-slate-400 hover:text-cyan-400 py-1 transition-colors"
            >
              直接以访客身份结算 (无需注册) →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
