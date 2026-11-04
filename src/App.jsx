import React, { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
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
  FileCode,
  Edit3,
  Upload,
  X,
  RefreshCw,
  Paperclip,
  FileText,
  Eye
} from 'lucide-react';

const INITIAL_SKILLS = [
  {
    id: 1,
    name: 'Trợ lý Soạn thảo Văn bản',
    desc: 'Soạn thảo văn bản hành chính theo thể thức chuẩn Nghị định 30/2020/NĐ-CP (Công văn, Tờ trình, Quyết định, Báo cáo, Kế hoạch...).',
    tag: 'Hành chính',
    installed: true,
    systemInstruction: `[Vai trò]: Bạn là một Chuyên viên Hành chính Tổng hợp kiêm Trợ lý Soạn thảo Văn bản xuất sắc. Bạn nắm thuộc lòng và áp dụng chuẩn xác Nghị định 30/2020/NĐ-CP của Chính phủ Việt Nam về thể thức và kỹ thuật trình bày văn bản hành chính.

[Bối cảnh]: Thường xuyên soạn thảo các loại văn bản nhà nước (Công văn, Tờ trình, Báo cáo, Quyết định, Thông báo, Kế hoạch...) từ những ý tưởng thô hoặc gạch đầu dòng ngắn gọn để có thể copy/paste ngay ra Word, in ấn và trình ký.

[Nhiệm vụ]: Khi nhận loại văn bản cần soạn và thông tin cốt lõi, hãy viết một văn bản hành chính hoàn chỉnh, đảm bảo đầy đủ các thành phần thể thức theo quy định.

[Quy tắc/Ràng buộc]:
- Tuân thủ tuyệt đối cấu trúc của Nghị định 30/2020/NĐ-CP (bao gồm: Quốc hiệu, Tiêu ngữ, Tên cơ quan ban hành, Số/Ký hiệu, Địa danh, Ngày tháng năm, Trích yếu nội dung, Kính gửi, Nội dung văn bản, Chức danh người ký và Chữ ký, Nơi nhận).
- Sử dụng văn phong hành chính nhà nước: Trang trọng, khách quan, chính xác, súc tích, mạch lạc. Tuyệt đối không dùng từ ngữ đa nghĩa, từ lóng, biểu cảm hay ngôn ngữ giao tiếp hàng ngày.
- Bố cục nội dung logic: Đặt vấn đề (Căn cứ pháp lý) -> Nội dung chính (Quy định/Chỉ đạo/Đề xuất cụ thể) -> Kết luận/Tổ chức thực hiện.
- Nếu thông tin người dùng cung cấp bị thiếu các căn cứ pháp lý cần thiết, hãy tự động chèn placeholder (ví dụ: [Căn cứ Luật...], [Căn cứ Nghị định...], [Căn cứ Quyết định số...]) để người dùng dễ dàng bổ sung sau.

[Định dạng]: Trình bày dưới dạng Markdown mô phỏng trực quan bố cục trang giấy hành chính chuẩn (in đậm, in nghiêng đúng vị trí theo Nghị định 30/2020/NĐ-CP):
- Quốc hiệu: IN HOA, ĐỨNG, ĐẬM (ví dụ: **CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM**)
- Tiêu ngữ: Chữ in thường, đứng, đậm (ví dụ: **Độc lập - Tự do - Hạnh phúc**)
- Tên cơ quan ban hành: IN HOA, ĐỨNG
- Địa danh, ngày tháng năm: Chữ in thường, nghiêng (*..., ngày ... tháng ... năm ...*)
- Trích yếu / Tên loại văn bản: IN HOA, ĐỨNG, ĐẬM
- Kính gửi: Chữ in thường, đậm
- Nơi nhận: In đậm, nghiêng phần tiêu đề, gạch đầu dòng danh sách đơn vị nhận.

[Dữ liệu đầu vào]:
- Loại văn bản: {Ví dụ: Công văn / Tờ trình}
- Đơn vị ban hành: {Tên cơ quan của bạn}
- Đơn vị nhận (Kính gửi): {Tên cơ quan/cá nhân nhận}
- Nội dung chính cần truyền đạt: {Gạch đầu dòng các ý chính}.`,
    tools: [
      {
        name: 'format_document',
        description: 'Định dạng và kiểm tra tiêu đề, số ký hiệu, nơi nhận theo thể thức chuẩn Nghị định 30/2020/NĐ-CP.'
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
            // Cập nhật cấu hình mặc định mới nhất, giữ nguyên trạng thái cài đặt của người dùng
            const merged = parsed.map(skill => {
              const defaultSkill = INITIAL_SKILLS.find(d => d.id === skill.id);
              if (defaultSkill) {
                return { ...defaultSkill, installed: skill.installed };
              }
              return skill;
            });
            INITIAL_SKILLS.forEach(defaultSkill => {
              if (!merged.some(s => s.id === defaultSkill.id)) {
                merged.push(defaultSkill);
              }
            });
            return merged;
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

  // Edit Skill Modal State
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingToolsText, setEditingToolsText] = useState('');
  const fileInputRef = useRef(null);

  // Chat file attachment state
  const [attachedFile, setAttachedFile] = useState(null);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const chatFileInputRef = useRef(null);

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

  const handleOpenEditModal = (skill) => {
    if (!skill) return;
    setEditingSkill({ ...skill });
    setEditingToolsText(skill.tools && skill.tools.length > 0 ? JSON.stringify(skill.tools, null, 2) : '');
  };

  const handleSaveEditSkill = (e) => {
    e.preventDefault();
    if (!editingSkill || !editingSkill.name.trim()) {
      showToast('Tên kỹ năng không được để trống!', 'error');
      return;
    }

    let parsedTools = [];
    if (editingToolsText.trim()) {
      try {
        parsedTools = JSON.parse(editingToolsText.trim());
        if (!Array.isArray(parsedTools)) parsedTools = [parsedTools];
      } catch (err) {
        showToast('Lỗi định dạng Tools JSON: Vui lòng nhập đúng cú pháp!', 'error');
        return;
      }
    }

    const updatedSkill = {
      ...editingSkill,
      name: editingSkill.name.trim(),
      tag: editingSkill.tag || 'Khác',
      desc: (editingSkill.desc || '').trim(),
      systemInstruction: (editingSkill.systemInstruction || '').trim(),
      tools: parsedTools
    };

    setSkills(prev => (Array.isArray(prev) ? prev : INITIAL_SKILLS).map(s => {
      if (s && s.id === updatedSkill.id) {
        return updatedSkill;
      }
      return s;
    }));

    // Thông báo cho cuộc trò chuyện nếu đang mở kỹ năng này trong playground
    if (selectedSkillId === updatedSkill.id) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: 'assistant',
          content: `⚙️ [Hệ thống]: Kỹ năng "${updatedSkill.name}" đã được cập nhật chỉ thị prompt mới! Bạn có thể gửi yêu cầu để kiểm tra ngay.`
        }
      ]);
    }

    showToast(`Đã lưu thay đổi cho kỹ năng "${updatedSkill.name}"!`);
    setEditingSkill(null);
  };

  const handleResetToDefault = () => {
    if (!editingSkill) return;
    const original = INITIAL_SKILLS.find(d => d.id === editingSkill.id);
    if (original) {
      setEditingSkill({ ...original });
      setEditingToolsText(original.tools && original.tools.length > 0 ? JSON.stringify(original.tools, null, 2) : '');
      showToast('Đã khôi phục thông số kỹ năng về bản gốc mặc định.');
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result;
        const parsed = JSON.parse(raw);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        const newItems = items.map((item, idx) => ({
          id: item.id && typeof item.id === 'number' ? item.id : Date.now() + idx,
          name: item.name || item.title || 'Kỹ năng mới',
          tag: item.tag || item.category || 'Tùy chỉnh',
          desc: item.desc || item.description || 'Kỹ năng được nhập từ file JSON.',
          systemInstruction: item.systemInstruction || item.prompt || item.instruction || 'Bạn là trợ lý AI chuyên nghiệp.',
          tools: Array.isArray(item.tools) ? item.tools : [],
          installed: true
        }));

        setSkills(prev => {
          const prevList = Array.isArray(prev) ? prev : INITIAL_SKILLS;
          const existingIds = new Set(newItems.map(n => n.id));
          const filteredPrev = prevList.filter(p => !existingIds.has(p.id));
          return [...newItems, ...filteredPrev];
        });

        showToast(`Đã nhập thành công ${newItems.length} kỹ năng vào Hub!`);
      } catch (err) {
        showToast('Lỗi đọc file JSON: Cú pháp không hợp lệ!', 'error');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleExportAll = () => {
    const exportData = safeSkills.map(s => ({
      schema_version: "1.0",
      type: "gemini_agent_skill",
      id: s.id,
      name: s.name,
      tag: s.tag,
      description: s.desc,
      systemInstruction: s.systemInstruction,
      tools: s.tools || []
    }));
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-skills-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Đã xuất toàn bộ ${exportData.length} kỹ năng thành file JSON!`);
  };

  const handleDeleteSkill = (skillId, skillName) => {
    if (INITIAL_SKILLS.some(d => d.id === skillId)) {
      showToast('Không thể xóa kỹ năng mặc định của hệ thống!', 'error');
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa kỹ năng "${skillName}" không?`)) {
      setSkills(prev => (Array.isArray(prev) ? prev : INITIAL_SKILLS).filter(s => s.id !== skillId));
      showToast(`Đã xóa kỹ năng "${skillName}"!`);
    }
  };

  const handleChatFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingFile(true);
    const fileName = file.name;
    const fileSize = file.size;
    const ext = fileName.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value.trim();
        setAttachedFile({
          name: fileName,
          size: fileSize,
          type: 'docx',
          textContent: text || '[Tài liệu Word rỗng hoặc không có văn bản thuần]',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });
        showToast(`Đã trích xuất ${text.length} ký tự từ file Word "${fileName}"!`);
      } else if (ext === 'pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = (reader.result || '').toString().split(',')[1];
          setAttachedFile({
            name: fileName,
            size: fileSize,
            type: 'pdf',
            base64Data,
            mimeType: 'application/pdf',
            textContent: `[File PDF: ${fileName} - Đã mã hóa base64 để Gemini 1.5 Flash đọc và trích xuất trực tiếp]`
          });
          showToast(`Đã đính kèm file PDF "${fileName}" thành công!`);
          setIsExtractingFile(false);
        };
        reader.readAsDataURL(file);
        return;
      } else {
        // txt, md, json, csv, log...
        const reader = new FileReader();
        reader.onload = () => {
          const text = (reader.result || '').toString().trim();
          setAttachedFile({
            name: fileName,
            size: fileSize,
            type: ext || 'text',
            textContent: text,
            mimeType: file.type || 'text/plain'
          });
          showToast(`Đã trích xuất ${text.length} ký tự từ file "${fileName}"!`);
          setIsExtractingFile(false);
        };
        reader.readAsText(file);
        return;
      }
    } catch (err) {
      console.error('Lỗi đọc file:', err);
      showToast(`Lỗi trích xuất file: ${err.message}`, 'error');
    } finally {
      setIsExtractingFile(false);
      if (chatFileInputRef.current) chatFileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if ((!inputMessage.trim() && !attachedFile) || isLoading || isExtractingFile) return;

    const userText = inputMessage.trim() || 'Trích lọc thông tin cốt lõi và tổng hợp nội dung trọng tâm từ văn bản đính kèm.';
    const currentAttachment = attachedFile ? { ...attachedFile } : null;

    const newMsg = {
      id: Date.now(),
      role: 'user',
      content: userText,
      attachment: currentAttachment
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setAttachedFile(null);
    setIsLoading(true);

    if (apiKey.trim()) {
      try {
        const parts = [];
        if (currentSkill?.systemInstruction) {
          parts.push({ text: `[Chỉ thị hệ thống: ${currentSkill.systemInstruction}]` });
        }

        if (currentAttachment?.base64Data && currentAttachment.mimeType === 'application/pdf') {
          parts.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: currentAttachment.base64Data
            }
          });
          parts.push({
            text: `[Văn bản PDF đính kèm: "${currentAttachment.name}"]\n\n[Yêu cầu xử lý từ người dùng]:\n${userText}`
          });
        } else if (currentAttachment?.textContent) {
          parts.push({
            text: `[Nội dung văn bản đầu vào được trích xuất từ file "${currentAttachment.name}"]:\n---\n${currentAttachment.textContent}\n---\n\n[Yêu cầu xử lý / trích lọc của người dùng]:\n${userText}`
          });
        } else {
          parts.push({ text: userText });
        }

        const payload = {
          contents: [
            {
              role: 'user',
              parts: parts
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
        const fileSnippet = currentAttachment?.textContent 
          ? currentAttachment.textContent.slice(0, 260).replace(/[\r\n]+/g, ' ') 
          : 'Toàn bộ nội dung văn bản đầu vào';

        if (tag === 'Hành chính') {
          const tríchYếu = currentAttachment 
            ? `Tổng hợp và xử lý nội dung từ tài liệu đính kèm "${currentAttachment.name}"`
            : userText.replace(/[\n\r]+/g, ' ').slice(0, 100);

          simulatedReply = `**[TÊN CƠ QUAN CHỦ QUẢN]**               **CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM**
**[TÊN CƠ QUAN BAN HÀNH]**                    **Độc lập - Tự do - Hạnh phúc**
Số: .../...-[Ký hiệu]                     *[Địa danh], ngày ... tháng ... năm ...*

<div align="center">

### **CÔNG VĂN**
**Về việc: ${tríchYếu}**

</div>

**Kính gửi:** [Tên cơ quan / đơn vị nhận văn bản]

- [Căn cứ Luật Tổ chức chính quyền địa phương / Luật chuyên ngành liên quan...];
- [Căn cứ Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư];
- [Căn cứ Quyết định số .../... quy định chức năng, nhiệm vụ, quyền hạn...];${currentAttachment ? `\n- [Căn cứ kết quả trích lọc từ hồ sơ/văn bản: ${currentAttachment.name}];` : ''}

Thực hiện nhiệm vụ được giao, sau khi nghiên cứu và trích lọc thông tin từ tài liệu đính kèm, [Tên cơ quan ban hành] kính đề nghị Quý đơn vị phối hợp triển khai:

**1. Về nội dung trọng tâm:**
- Yêu cầu thực hiện: ${userText}
- Nội dung cốt lõi trích lọc từ tài liệu: "${fileSnippet}..."

**2. Về thời hạn và trách nhiệm thực hiện:**
- Báo cáo kết quả gửi về [Tên cơ quan ban hành] trước ngày [Thời hạn].
- Trong quá trình triển khai, nếu phát sinh khó khăn, vướng mắc, kịp thời phản hồi để phối hợp giải quyết.

Kính mong nhận được sự phối hợp chặt chẽ của Quý cơ quan./.

**Nơi nhận:**                                        **[CHỨC DANH NGƯỜI KÝ]**
- Như trên;                                         *(Ký, ghi rõ họ tên và đóng dấu)*
- Lãnh đạo cơ quan (để b/c);
- Lưu: VT, [Đơn vị soạn thảo].

                                                    **[HỌ VÀ TÊN]**

---
*(Lưu ý: Đã nhận diện và trích lọc thành công file "${currentAttachment ? currentAttachment.name : 'văn bản'}". Nhập Gemini API Key ở ô phía trên để AI phân tích đầy đủ 100% nội dung thực tế).*`;
        } else if (tag === 'Truyền thông') {
          simulatedReply = `📢 [BẢN TIN NÓNG HỔI / ZALO OA]\n\n✨ TỔNG HỢP NỘI DUNG TỪ ${currentAttachment ? currentAttachment.name.toUpperCase() : userText.toUpperCase()} ✨\n\n👉 Điểm tin nổi bật được trích xuất tự động:\n🔹 ${fileSnippet}...\n\n👇 Xem thêm chi tiết và bình luận bên dưới nhé!\n#GeminiSkillHub #TrichXuatVanBan #AI`;
        } else if (tag === 'Năng suất') {
          simulatedReply = `📋 [PHÂN TÍCH VĂN BẢN & ĐIỀU PHỐI CÔNG VIỆC]\n\n🎯 Tài liệu xử lý: "${currentAttachment ? currentAttachment.name : userText}"\n⚡ Mức độ ưu tiên: Cao\n📌 Công việc trích xuất từ tài liệu:\n  1. [ ] Rà soát các mốc thời gian và yêu cầu báo cáo trong văn bản\n  2. [ ] Phân công các đầu mối chuyên trách phụ trách từng hạng mục\n  3. [ ] Hoàn tất dự thảo phản hồi trước thời hạn quy định\n\n🔍 Dữ liệu văn bản ghi nhận: ${fileSnippet}...`;
        } else {
          simulatedReply = `Chào bạn! Tôi đã tiếp nhận yêu cầu "${userText}"${currentAttachment ? ` cùng với file đính kèm **${currentAttachment.name}**` : ''}.\n\n📌 Kết quả trích lọc sơ bộ: Đã đọc thành công nội dung văn bản (${fileSnippet.slice(0, 100)}...). Dữ liệu sẵn sàng xử lý theo kỹ năng **${currentSkill?.name || 'Trợ lý'}**.\n\n*(Mẹo: Dán Gemini API Key ở ô phía trên để Gemini 1.5 Flash tự động phân tích sâu toàn bộ văn bản)*`;
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
              {/* Search & Tag Bar & Actions */}
              <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
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

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImportFile}
                      accept=".json"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                      title="Nạp kỹ năng từ file JSON tải về hoặc có sẵn"
                    >
                      <Upload size={14} />
                      <span>Nhập JSON (Import)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportAll}
                      className="px-3 py-2 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition shadow-sm"
                      title="Tải toàn bộ danh sách kỹ năng thành 1 file JSON"
                    >
                      <Download size={14} />
                      <span>Sao lưu tất cả</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
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
                            onClick={() => handleOpenEditModal(skill)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Điều chỉnh trực tiếp prompt và cấu hình"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => downloadConfig(skill)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Tải cấu hình JSON"
                          >
                            <Download size={16} />
                          </button>
                          {!INITIAL_SKILLS.some(d => d.id === skill.id) && (
                            <button
                              onClick={() => handleDeleteSkill(skill.id, skill.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa kỹ năng tùy chỉnh này"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
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
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(currentSkill)}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg flex items-center gap-1.5 transition shadow-sm whitespace-nowrap"
                    title="Chỉnh sửa trực tiếp prompt & tham số của kỹ năng này để dùng ngay"
                  >
                    <Edit3 size={14} />
                    <span>Sửa Prompt trực tiếp</span>
                  </button>
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
                      {msg.attachment && (
                        <div className="mb-2.5 p-2 bg-blue-700/80 rounded-lg flex items-center justify-between gap-2 text-xs border border-blue-400/40">
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={15} className="text-blue-200 flex-shrink-0" />
                            <span className="font-semibold truncate">{msg.attachment.name}</span>
                            <span className="text-blue-200 text-[11px] whitespace-nowrap">({Math.round(msg.attachment.size / 1024)} KB)</span>
                          </div>
                          {msg.attachment.textContent && (
                            <button
                              type="button"
                              onClick={() => {
                                setAttachedFile(msg.attachment);
                                setShowExtractedPreview(true);
                              }}
                              className="text-[11px] text-blue-200 hover:text-white underline whitespace-nowrap"
                            >
                              Xem nội dung
                            </button>
                          )}
                        </div>
                      )}
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

              {/* Quick Template Chips */}
              {currentSkill?.tag === 'Hành chính' && (
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
                  <span className="text-slate-400 font-medium whitespace-nowrap">Mẫu nhanh NĐ 30:</span>
                  <button
                    type="button"
                    onClick={() => setInputMessage("- Loại văn bản: Công văn\n- Đơn vị ban hành: Sở Thông tin và Truyền thông\n- Đơn vị nhận (Kính gửi): Các Sở, Ban, Ngành và UBND các huyện, thị xã\n- Nội dung chính cần truyền đạt: Triển khai rà soát hệ thống kỹ thuật và bảo đảm an toàn thông tin mạng trong quý 4/2026.")}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 transition whitespace-nowrap shadow-sm"
                  >
                    📄 Công văn đôn đốc
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMessage("- Loại văn bản: Tờ trình\n- Đơn vị ban hành: Phòng Kế hoạch - Tài chính\n- Đơn vị nhận (Kính gửi): Ban Giám đốc Sở\n- Nội dung chính cần truyền đạt: Xin phê duyệt dự toán kinh phí nâng cấp hạ tầng công nghệ thông tin phục vụ chuyển đổi số năm 2026.")}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 transition whitespace-nowrap shadow-sm"
                  >
                    📝 Tờ trình phê duyệt
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMessage("- Loại văn bản: Thông báo\n- Đơn vị ban hành: Văn phòng cơ quan\n- Đơn vị nhận (Kính gửi): Toàn thể cán bộ, công chức, viên chức cơ quan\n- Nội dung chính cần truyền đạt: Lịch làm việc và phân công trực cơ quan, bảo đảm an ninh trật tự.")}
                    className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 transition whitespace-nowrap shadow-sm"
                  >
                    📢 Thông báo nội bộ
                  </button>
                </div>
              )}

              {/* Attachment chip if file is attached */}
              {attachedFile && (
                <div className="px-4 py-2.5 bg-blue-50/90 border-t border-blue-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                      <FileText size={13} />
                    </div>
                    <span className="font-bold text-slate-800 truncate">{attachedFile.name}</span>
                    <span className="text-slate-500 text-[11px]">({Math.round(attachedFile.size / 1024)} KB)</span>
                    <span className="hidden sm:inline bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {attachedFile.type}
                    </span>
                    {attachedFile.textContent && (
                      <span className="text-emerald-700 font-medium text-[11px] hidden md:inline">
                        ✓ Đã trích xuất {attachedFile.textContent.length} ký tự
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {attachedFile.textContent && (
                      <button
                        type="button"
                        onClick={() => setShowExtractedPreview(true)}
                        className="px-2.5 py-1 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold flex items-center gap-1 transition shadow-xs"
                      >
                        <Eye size={12} />
                        <span>Xem trích xuất</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Gỡ file đính kèm"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )}

              {isExtractingFile && (
                <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-center gap-2 text-xs text-amber-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                  <span>Đang đọc và trích xuất dữ liệu từ văn bản đính kèm...</span>
                </div>
              )}

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-end gap-2">
                <input
                  type="file"
                  ref={chatFileInputRef}
                  onChange={handleChatFileSelect}
                  accept=".docx,.doc,.txt,.pdf,.md,.json,.csv"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => chatFileInputRef.current?.click()}
                  disabled={isLoading || isExtractingFile}
                  className={`p-3 rounded-xl border transition flex items-center justify-center flex-shrink-0 shadow-xs ${
                    attachedFile 
                      ? 'bg-blue-50 text-blue-600 border-blue-300 hover:bg-blue-100' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-blue-600'
                  }`}
                  title="Đính kèm văn bản đầu vào (.docx, .pdf, .txt, .md, .csv...)"
                >
                  <Paperclip size={18} />
                </button>

                <textarea
                  rows="2"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={
                    attachedFile
                      ? `Yêu cầu trích lọc / xử lý file "${attachedFile.name}"... (hoặc Enter để trích lọc tự động)`
                      : `Gửi yêu cầu thử nghiệm cho "${currentSkill?.name || 'Trợ lý'}"... (Shift+Enter để xuống dòng, Enter để gửi)`
                  }
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition resize-none"
                />
                <button
                  type="submit"
                  disabled={(!inputMessage.trim() && !attachedFile) || isLoading || isExtractingFile}
                  className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-1.5 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-blue-600/20 self-stretch justify-center"
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

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Edit3 size={17} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Điều Chỉnh Kỹ Năng Trực Tiếp</h3>
                  <p className="text-xs text-slate-500">Chỉnh sửa sẽ lưu vào máy và áp dụng ngay trong Playground</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditSkill} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Tên Kỹ năng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSkill.name || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Phân loại (Tag)
                  </label>
                  <input
                    type="text"
                    value={editingSkill.tag || 'Hành chính'}
                    onChange={(e) => setEditingSkill({ ...editingSkill, tag: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="VD: Hành chính, Truyền thông..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mô tả ngắn gọn
                </label>
                <input
                  type="text"
                  value={editingSkill.desc || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, desc: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    System Instruction (Chỉ thị cốt lõi / Prompt Persona) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-blue-600 font-medium">Áp dụng trực tiếp cho Gemini</span>
                </div>
                <textarea
                  rows="9"
                  required
                  value={editingSkill.systemInstruction || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, systemInstruction: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono bg-slate-50/50"
                  placeholder="[Vai trò]: ...&#10;[Bối cảnh]: ...&#10;[Nhiệm vụ]: ...&#10;[Quy tắc/Ràng buộc]: ..."
                ></textarea>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Tools & Schema (JSON - Tùy chọn)
                  </label>
                  <span className="text-[11px] text-slate-400">Định dạng mảng object JSON</span>
                </div>
                <textarea
                  rows="3"
                  value={editingToolsText}
                  onChange={(e) => setEditingToolsText(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50"
                  placeholder="[]"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                {INITIAL_SKILLS.some(d => d.id === editingSkill.id) ? (
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-xs text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 font-medium"
                  >
                    <RefreshCw size={12} />
                    <span>Khôi phục bản gốc ban đầu</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSkill(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Check size={14} />
                    <span>Lưu & Áp Dụng Ngay</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extracted Text Preview Modal */}
      {showExtractedPreview && attachedFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Nội Dung Văn Bản Đã Trích Xuất</h3>
                  <p className="text-[11px] text-slate-500">{attachedFile.name} ({Math.round(attachedFile.size / 1024)} KB)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExtractedPreview(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto bg-slate-50/50">
              <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed bg-white p-4 rounded-xl border border-slate-200 shadow-inner max-h-[50vh] overflow-y-auto select-text">
                {attachedFile.textContent || 'Không có nội dung văn bản thuần trích xuất.'}
              </pre>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Độ dài: <strong className="text-slate-800">{attachedFile.textContent ? attachedFile.textContent.length : 0}</strong> ký tự
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setInputMessage(prev => `${prev ? `${prev}\n\n` : ''}${attachedFile.textContent}`);
                    setShowExtractedPreview(false);
                    showToast('Đã chèn nội dung trích xuất vào khung chat!');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-lg transition"
                >
                  Chèn vào khung chat
                </button>
                <button
                  type="button"
                  onClick={() => setShowExtractedPreview(false)}
                  className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
