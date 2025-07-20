import React, { useState, useEffect } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [names, setNames] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const fetchAndExtractNames = async () => {
    setLoading(true)
    setError(null)
    setNames([])

    try {
      const proxy = 'https://api.allorigins.win/raw?url='
      const response = await fetch(proxy + encodeURIComponent(url))
      const html = await response.text()

      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const text = doc.body.textContent || ''

      const allMatches = [
        ...text.matchAll(/([\p{Script=Han}]{1,5})\s*=\s*([\p{L}\s]{2,30})/gu),
        ...text.matchAll(/["“]([\p{Script=Han}]{1,5})["”]\s*=\s*["“]([\p{L}\s]{2,30})["”]/gu),
        ...text.matchAll(/([\p{Script=Han}]{1,5})\s*([\p{L}\s]{2,30})/gu)
      ]

      const extracted = allMatches.map(m => ({
        han: m[1].trim(),
        name: m[2].trim()
      }))

      setNames(extracted)
    } catch (err) {
      setError('Không thể lấy nội dung từ URL này.')
    } finally {
      setLoading(false)
    }
  }

  const downloadFile = (type) => {
    let content = ''
    let mime = ''
    const filename = 'ten-nhan-vat'

    if (type === 'txt') {
      content = names.map(n => `${n.han} = ${n.name}`).join('\n')
      mime = 'text/plain'
    } else if (type === 'csv') {
      content = 'Hán,Tên dịch\n' + names.map(n => `${n.han},${n.name}`).join('\n')
      mime = 'text/csv'
    } else if (type === 'json') {
      content = JSON.stringify(names, null, 2)
      mime = 'application/json'
    }

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.${type}`
    link.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = () => {
    const text = names.map(n => `${n.han} = ${n.name}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  const updateName = (index, value) => {
    const updated = [...names]
    updated[index].name = value
    setNames(updated)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-gray-800 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📖 Trích xuất tên nhân vật</h1>
        <button
          onClick={() => setIsDark(prev => !prev)}
          className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
        >
          {isDark ? '🌞 Sáng' : '🌙 Tối'}
        </button>
      </div>

      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded mb-4 text-black"
        placeholder="Nhập URL (vd: https://truyenfull.vn/...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={fetchAndExtractNames}
        disabled={loading || !url}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Đang tải...' : 'Bắt đầu trích xuất'}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {names.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            📋 Kết quả ({names.length} tên):
          </h2>

          <ul className="bg-white dark:bg-gray-800 p-4 rounded shadow max-h-96 overflow-y-auto">
            {names.map((n, idx) => (
              <li key={idx} className="flex items-center gap-2 border-b py-1">
                <span className="min-w-[4rem] font-semibold">{n.han}</span>
                <input
                  className="flex-1 p-1 rounded border border-gray-300 text-black"
                  value={n.name}
                  onChange={(e) => updateName(idx, e.target.value)}
                />
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3 mt-4">
            <button onClick={() => downloadFile('txt')} className="bg-gray-700 text-white px-3 py-1 rounded">
              Tải TXT
            </button>
            <button onClick={() => downloadFile('csv')} className="bg-gray-700 text-white px-3 py-1 rounded">
              Tải CSV
            </button>
            <button onClick={() => downloadFile('json')} className="bg-gray-700 text-white px-3 py-1 rounded">
              Tải JSON
            </button>
            <button onClick={copyToClipboard} className="bg-green-600 text-white px-3 py-1 rounded">
              📋 Sao chép tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
