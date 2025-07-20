import { useState } from 'react'

function App() {
  const [link, setLink] = useState('')
  const [names, setNames] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExtract = () => {
    setLoading(true)
    const dummyNames = `沈宜嘉=Thẩm Nghi Gia\n萧漾=Tiêu Dạng\n沈星月=Thẩm Tinh Nguyệt\n飞雪院=Phi Tuyết Viện\n安康王=An Khang Vương\n苏长远=Tô Trường Viễn\n苏暮秋=Tô Mộ Thu\n丁香阁=Đinh Lan Các\n翠竹=Thúy Trúc\n王浅=Vương Thiển`
    setTimeout(() => {
      setNames(dummyNames)
      setLoading(false)
    }, 1500)
  }

  const handleDownload = () => {
    const blob = new Blob([names], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Names_xuyen-thanh-co-dai-an.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h1>🧙‍♀️ Trích xuất tên nhân vật</h1>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Dán link truyện..."
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <button onClick={handleExtract} disabled={loading} style={{ padding: '8px 16px' }}>
        {loading ? 'Đang trích xuất...' : 'Trích xuất tên'}
      </button>

      {names && (
        <div style={{ marginTop: 20 }}>
          <textarea
            value={names}
            onChange={(e) => setNames(e.target.value)}
            rows={10}
            style={{ width: '100%', padding: 10 }}
          />
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <button onClick={handleDownload} style={{ padding: '8px 16px' }}>
              📥 Tải xuống .txt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
