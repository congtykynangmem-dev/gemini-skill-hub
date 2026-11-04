import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi ứng dụng:", error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('gemini_skills_db');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '24px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>
              Đã xảy ra sự cố hiển thị giao diện
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
              Trình duyệt gặp lỗi khi nạp dữ liệu. Bạn có thể nhấn nút bên dưới để khôi phục lại cài đặt ban đầu của ứng dụng.
            </p>
            <div style={{
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#475569',
              textAlign: 'left',
              overflowX: 'auto',
              marginBottom: '24px'
            }}>
              {this.state.error?.message || 'Lỗi không xác định'}
            </div>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Khôi Phục & Tải Lại Trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function mountApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Không tìm thấy phần tử root!");
    return;
  }
  
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Lỗi khi render root:", err);
  }
}

// Đảm bảo DOM luôn sẵn sàng trước khi React khởi tạo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
