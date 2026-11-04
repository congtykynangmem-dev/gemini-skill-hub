import React, { useState, useEffect, useRef } from 'react';
import { 
  Library, 
  PlaySquare, 
  PlusCircle, 
  Download, 
  Settings, 
  Send, 
  Check, 
  CheckCircle, 
  Trash2, 
  Bot, 
  User, 
  Sparkles, 
  AlertCircle, 
  Search, 
  ArrowRight,
  ShieldCheck,
  FileCode
} from 'lucide-react';

const INITIAL_SKILLS = [
  {
    id: 1,
    name: 'Trợ lý Soạn thảo Văn bản',
    desc: 'Soạn thảo văn bản hành chính theo quy chuẩn nhà nước, nghị định 30/2020/NĐ-CP.',
    tag: 'Hành chính',
    installed: true,
    systemInstruction: 'Bạn là chuyên viên hành chính cao cấp am hiểu Nghị định 30/2020/NĐ-CP. Hãy hỗ trợ soạn thảo văn bản quy phạm, công văn, tờ trình hoặc thông báo với văn phong chuẩn mực, trang trọng và chính xác.',
    tools: [
      {
        name: 'format_document',
        description: 'Định dạng và kiểm tra tiêu đề, số ký hiệu, nơi nhận theo thể thức chuẩn.'
      }
    ]
  },
  {
    id: 2,
    name: 'Trợ lý Truyền thông & Báo chí',
    desc: 'Chuyển đổi công văn, sự kiện thành bài đăng mạng xã hội, Zalo OA thu hút.',
    tag: 'Truyền thông',
    installed: true,
    systemInstruction: 'Bạn là chuyên gia truyền thông sáng tạo. Nhiệm vụ của bạn là cô đọng thông tin quan trọng thành các bài đăng hấp dẫn trên Facebook, Zalo OA hoặc bản tin nội bộ với các icon sinh động và kêu gọi hành động (CTA) rõ ràng.',
    tools: []
  },
  {
    id: 3,
    name: 'Smart Mailbox & Task Dispatcher',
    desc: 'Quét và phân loại nội dung email, tự động tóm tắt và trích xuất Task công việc.',
    tag: 'Năng suất',
    installed: false,
    systemInstruction: 'Bạn là trợ lý điều phối công việc thông minh. Hãy phân tích các email hoặc yêu cầu công việc được cung cấp: xác định mức độ ưu tiên (Khẩn cấp/Bình thường), tóm tắt yêu cầu cốt lõi và lập danh sách To-do kèm deadline dự kiến.',
    tools: [
      {
        name: 'create_calendar_task',
        description: 'Tạo lịch nhắc hẹn và công việc vào Google Calendar.'
      }
    ]
  },
  {
    id: 4,
    name: 'Trợ lý Pháp chế Doanh nghiệp',
    desc: 'Rà soát điều khoản hợp đồng kinh tế, cảnh báo rủi ro pháp lý theo luật VN.',
    tag: 'Pháp chế',
    installed: false,
    systemInstruction: 'Bạn là luật sư tư vấn doanh nghiệp am hiểu Bộ luật Dân sự và Luật Thương mại Việt Nam. Hãy đọc kỹ các điều khoản hợp đồng được cung cấp, nêu bật các rủi ro tiềm ẩn (phạt vi phạm, điều khoản bất khả kháng, thẩm quyền giải quyết tranh chấp) và đề xuất phương án chỉnh lý tối ưu.',
    tools: []
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('hub');
  
  // Safe localStorage loader
  const [skills, setSkills] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem('gemini_skills_db');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Lỗi đọc localStorage:', e);
    }
    return INITIAL_SKILLS;
  });

  // Playground state
  const [selectedSkillId, setSelectedSkillId] = useState(1);
  const [apiKey, setApiKey] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Xin chào! Tôi là Trợ lý AI trong Gemini Skill Hub. Hãy chọn kỹ năng bạn muốn thử nghiệm và đặt câu hỏi cho tôi nhé!'
    }
  ]);
  const messagesEndRef = useRef(null);

  // Search & Filter state in Hub
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  // Create Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillTag, setNewSkillTag] = useState('Hành chính');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillInstruction, setNewSkillInstruction] = useState('');
  const [newSkillTools, setNewSkillTools] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('gemini_skills_db', JSON.stringify(skills));
      }
    } catch (e) {
      console.warn('Lỗi ghi localStorage:', e);
    }
  }, [skills]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const safeSkills = Array.isArray(skills) && skills.length > 0 ? skills : INITIAL_SKILLS;
  const currentSkill = safeSkills.find(s => s && s.id === Number(selectedSkillId)) || safeSkills[0] || INITIAL_SKILLS[0];

  const handleToggleInstall = (skillId) => {
    setSkills(prev => (Array.isArray(prev) ? prev : INITIAL_SKILLS).map(s => {
      if (s && s.id === skillId) {
        const nextState = !s.installed;
        showToast(`${nextState ? 'Đã cài đặt' : 'Đã gỡ'} kỹ năng "${s.name}"!`);
        return { ...s, installed: nextState };
      }
      return s;
    }));
  };

  const handleTestSkill = (skillId) => {
    setSelectedSkillId(skillId);
    setActiveTab('playground');
    const skill = safeSkills.find(s => s && s.id === skillId);
    if (skill) {
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: `Kỹ năng "${skill.name}" đã được kích hoạt!\n\n📋 **Mục tiêu:** ${skill.desc || 'Hỗ trợ nghiệp vụ chuyên sâu'}\n\nHãy nhập yêu cầu của bạn bên dưới.`
        }
      ]);
    }
  };

  const downloadConfig = (skill) => {
    if (!skill) return;
    const data = JSON.stringify({
      schema_version: "1.0",
      type: "gemini_agent_skill",
      name: skill.name || "Custom Skill",
      tag: skill.tag || "Chung",
      description: skill.desc || "",
      systemInstruction: skill.systemInstruction || "Bạn là trợ lý AI chuyên nghiệp...",
      tools: skill.tools || []
    }, null, 2);

    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-${skill.id || 'custom'}-${(skill.name || 'skill').toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Đã xuất cấu hình JSON cho "${skill.name}"`);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const newMsg = { id: Date.now(), role: 'user', content: userText };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    if (apiKey.trim()) {
      try {
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: `${currentSkill?.systemInstruction ? `[Chỉ thị hệ thống: ${currentSkill.systemInstruction}]\n\n` : ''}${userText}` }]
            }
          ]
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const replyText = data.candidates[0].content.parts[0].text;
          setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: replyText }]);
        } else if (data.error) {
          setMessages(prev => [...prev, { 
            id: Date.now() + 1, 
            role: 'assistant', 
            content: `⚠️ Lỗi từ Gemini API: ${data.error.message || 'Không thể tạo phản hồi. Vui lòng kiểm tra API key.'}` 
          }]);
        }
      } catch (err) {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'assistant', 
          content: `⚠️ Lỗi kết nối mạng: ${err.message}` 
        }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        let simulatedReply = '';
        const tag = currentSkill?.tag || '';

        if (tag === 'Hành chính') {
          simulatedReply = `[Soạn thảo theo Nghị định 30/2020/NĐ-CP]\n\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n---------------------\n\nKính gửi: Các cơ quan, đơn vị liên quan.\n\nVề việc: ${userText}\n\n1. Căn cứ chức năng, nhiệm vụ và quyền hạn được giao...\n2. Đề nghị thủ trưởng các đơn vị phối hợp triển khai nghiêm túc nội dung trên.\n\n(Chế độ thử nghiệm không dùng API Key - Nhập Gemini API Key ở thanh phía trên để kết nối AI thực tế).`;
        } else if (tag === 'Truyền thông') {
          simulatedReply = `📢 [BẢN TIN NÓNG HỔI / ZALO OA]\n\n✨ ${userText.toUpperCase()} ✨\n\n👉 Bạn đã cập nhật thông tin mới nhất hôm nay chưa?\n🔹 Điểm nhấn 1: Nhanh chóng - Tiện lợi - Chuẩn xác.\n🔹 Điểm nhấn 2: Tối ưu hiệu suất công việc cùng Gemini AI.\n\n👇 Để lại bình luận hoặc nhắn tin trực tiếp để được tư vấn ngay nhé!\n#GeminiSkillHub #TruyenThong #AI`;
        } else if (tag === 'Năng suất') {
          simulatedReply = `📋 [PHÂN TÍCH EMAIL & ĐIỀU PHỐI CÔNG VIỆC]\n\n🎯 Yêu cầu: "${userText}"\n⚡ Mức độ ưu tiên: Cao\n📌 Công việc trích xuất:\n  1. [ ] Phản hồi thông tin xác nhận cho đối tác (Hạn: 17h00 hôm nay)\n  2. [ ] Phối hợp phòng ban chuẩn bị tài liệu liên quan\n  3. [ ] Lên lịch hẹn kiểm tra tiến độ dự án`;
        } else {
          simulatedReply = `Chào bạn! Tôi đang hoạt động dưới vai trò **${currentSkill?.name || 'Trợ lý'}**.\n\nTôi đã ghi nhận yêu cầu: "${userText}".\n\n📌 Gợi ý xử lý: Căn cứ theo quy định hiện hành, bạn cần rà soát kỹ các điều khoản và thông số kỹ thuật liên quan.\n\n*(Mẹo: Hãy dán Gemini API Key ở ô phía trên để nhận câu trả lời phân tích chuyên sâu đầy đủ từ Gemini 1.5 Flash)*`;
        }

        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: simulatedReply }]);
        setIsLoading(false);
      }, 600);
    }
  };

  const handleCreateSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) {
      showToast('Vui lòng nhập tên kỹ năng!', 'error');
      return;
    }

    let parsedTools = [];
    if (newSkillTools.trim()) {
      try {
        parsedTools = JSON.parse(newSkillTools);
        if (!Array.isArray(parsedTools)) {
          parsedTools = [parsedTools];
        }
      } catch (err) {
        showToast('Định dạng JSON Schema Tools không hợp lệ!', 'error');
        return;
      }
    }

    const newSkill = {
      id: Date.now(),
      name: newSkillName.trim(),
      tag: newSkillTag || 'Khác',
      desc: newSkillDesc.trim() || 'Kỹ năng tuỳ chỉnh được tạo trong Gemini Skill Hub.',
      systemInstruction: newSkillInstruction.trim() || 'Bạn là trợ lý AI chuyên nghiệp.',
      tools: parsedTools,
      installed: true
    };

    setSkills(prev => [newSkill, ...(Array.isArray(prev) ? prev : INITIAL_SKILLS)]);
    downloadConfig(newSkill);
    showToast(`Đã tạo và tải file JSON cấu hình cho "${newSkill.name}" thành công!`);

    setNewSkillName('');
    setNewSkillDesc('');
    setNewSkillInstruction('');
    setNewSkillTools('');
    setActiveTab('hub');
  };

  const tags = ['Tất cả', ...Array.from(new Set(safeSkills.map(s => s?.tag || 'Khác')))];
  const filteredSkills = safeSkills.filter(s => {
    if (!s) return false;
    const matchTag = selectedTag === 'Tất cả' || s.tag === selectedTag;
    const matchSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (s.desc || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white font-medium transition-all transform duration-300 ${notification.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shadow-xl flex-shrink-0 z-20">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="text-white" size={18} />
              </div>
              <div>
                <span className="font-bold text-base tracking-wide text-white block">Gemini Skill Hub</span>
                <span className="text-[11px] text-blue-400 font-medium tracking-wider uppercase">Mắt Bão Host Ready</span>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1.5">
            <button
              onClick={() => setActiveTab('hub')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'hub' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Library size={18} />
                <span>Chợ Kỹ Năng</span>
              </div>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">{safeSkills.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'playground' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <PlaySquare size={18} />
                <span>Thực Chiến (Chat)</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'create' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PlusCircle size={18} />
              <span>Đóng Gói Kỹ Năng Mới</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2 mb-1 text-slate-300 font-medium">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Hosting Mắt Bão Tĩnh (SPA)</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hỗ trợ cấu hình .htaccess tự động chuyển hướng đường dẫn và nén Gzip.
          </p>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-800">
              {activeTab === 'hub' && 'Kho Kỹ Năng Gemini (Skill Hub)'}
              {activeTab === 'playground' && 'Playground Thử Nghiệm Kỹ Năng Thực Tế'}
              {activeTab === 'create' && 'Tạo & Đóng Gói Kỹ Năng AI'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sẵn sàng hoạt động
            </span>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {/* TAB 1: SKILL HUB */}
          {activeTab === 'hub' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Search & Tag Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm kỹ năng hoặc tính năng..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                        selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map(skill => (
                  <div
                    key={skill.id}
                    className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between p-6 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-100">
                          {skill.tag}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => downloadConfig(skill)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Tải cấu hình JSON"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mb-2">
                        {skill.name}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {skill.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleInstall(skill.id)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                          skill.installed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {skill.installed ? (
                          <>
                            <Check size={14} /> Đã cài đặt
                          </>
                        ) : (
                          'Cài đặt'
                        )}
                      </button>

                      <button
                        onClick={() => handleTestSkill(skill.id)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-1"
                      >
                        <span>Test thử</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredSkills.length === 0 && (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                  <Library className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-slate-500 font-medium">Không tìm thấy kỹ năng nào phù hợp.</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedTag('Tất cả'); }}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Xem tất cả kỹ năng
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PLAYGROUND (CHAT & TEST) */}
          {activeTab === 'playground' && (
            <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Kỹ năng đang chọn:</label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => handleTestSkill(Number(e.target.value))}
                    className="bg-white border border-slate-200 text-slate-800 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium shadow-sm"
                  >
                    {safeSkills.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.tag})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Nhập Gemini API Key (tùy chọn)..."
                    className="w-full sm:w-64 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setMessages([{ id: Date.now(), role: 'assistant', content: 'Lịch sử trò chuyện đã được làm mới.' }])}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Xóa đoạn chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Chat Message Window */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                        msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 max-w-xl">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white flex-shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-500 text-sm rounded-tl-none flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                      <span>Đang suy nghĩ câu trả lời...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Gửi yêu cầu thử nghiệm cho "${currentSkill?.name || 'Trợ lý'}"... (Nhấn Enter để gửi)`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-blue-600/20"
                >
                  <span>Gửi</span>
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: CREATE SKILL */}
          {activeTab === 'create' && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Đóng Gói & Xuất Bản Kỹ Năng Mới</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Định nghĩa hướng dẫn hệ thống, danh mục và công cụ API để xuất ra cấu hình chuẩn cho Google Gemini.
                </p>
              </div>

              <form onSubmit={handleCreateSkill} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Tên Kỹ năng (Skill Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="VD: Chuyên gia Phân tích Dữ liệu..."
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                      Thẻ Phân loại (Tag)
                    </label>
                    <select
                      value={newSkillTag}
                      onChange={(e) => setNewSkillTag(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition bg-white"
                    >
                      <option value="Hành chính">Hành chính</option>
                      <option value="Truyền thông">Truyền thông</option>
                      <option value="Năng suất">Năng suất</option>
                      <option value="Pháp chế">Pháp chế</option>
                      <option value="Kỹ thuật">Kỹ thuật</option>
                      <option value="Kinh doanh">Kinh doanh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Mô tả ngắn gọn
                  </label>
                  <input
                    type="text"
                    value={newSkillDesc}
                    onChange={(e) => setNewSkillDesc(e.target.value)}
                    placeholder="Mô tả tóm tắt mục đích và giá trị của kỹ năng..."
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    System Instruction (Chỉ thị hệ thống cốt lõi)
                  </label>
                  <textarea
                    rows="5"
                    value={newSkillInstruction}
                    onChange={(e) => setNewSkillInstruction(e.target.value)}
                    placeholder="Định hình vai trò, tính cách, giới hạn chuyên môn và các quy tắc ứng xử của AI..."
                    className="w-full border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  ></textarea>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Tools & Function Calling (JSON Schema - Tùy chọn)
                    </label>
                    <span className="text-[11px] text-slate-400">Định dạng mảng hoặc object JSON</span>
                  </div>
                  <textarea
                    rows="4"
                    value={newSkillTools}
                    onChange={(e) => setNewSkillTools(e.target.value)}
                    placeholder={`[
  {
    "name": "lookup_customer",
    "description": "Tra cứu mã khách hàng trong hệ thống CRM"
  }
]`}
                    className="w-full border border-slate-200 rounded-lg p-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none transition bg-slate-50"
                  ></textarea>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('hub')}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition"
                  >
                    <Download size={16} />
                    <span>Lưu & Tải File JSON Cấu Hình</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
