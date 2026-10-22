import React, { useState, useEffect } from 'react'
import OriginalBlogPostPage from '@theme-original/BlogPostPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

async function sha256(message) {
  const buf = new TextEncoder().encode(message)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const SESSION_KEY = 'protected-unlocked'

function PasswordGate({ isProtected, children }) {
  const { siteConfig } = useDocusaurusContext()
  const [mounted, setMounted] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem(SESSION_KEY) === 'true') setUnlocked(true)
    } catch {}
  }, [])

  if (!isProtected || unlocked) return children

  if (!mounted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'var(--ifm-color-emphasis-500)' }}>Đang tải...</span>
      </div>
    )
  }

  const expectedHash = siteConfig.customFields?.protectedPasswordHash

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setError(false)
    try {
      const hash = await sha256(password)
      if (hash === expectedHash) {
        try { sessionStorage.setItem(SESSION_KEY, 'true') } catch {}
        setUnlocked(true)
      } else {
        setError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
    }}>
      <div style={{
        background: 'var(--ifm-card-background-color, var(--ifm-background-surface-color))',
        border: '1px solid var(--ifm-color-emphasis-200)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        maxWidth: '360px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>Nội dung riêng tư</h2>
        <p style={{ color: 'var(--ifm-color-emphasis-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Bài viết này cần mật khẩu để xem.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Nhập mật khẩu..."
            autoFocus
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: `1.5px solid ${error ? '#e53e3e' : 'var(--ifm-color-emphasis-300)'}`,
              fontSize: '1rem',
              background: 'var(--ifm-background-color)',
              color: 'var(--ifm-font-color-base)',
              outline: 'none',
            }}
          />
          {error && (
            <p style={{ color: '#e53e3e', fontSize: '0.85rem', margin: 0 }}>
              Mật khẩu không đúng, thử lại.
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #d4a017, #a07010)',
              color: '#1a1200',
              fontWeight: '700',
              fontSize: '1rem',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.65 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Đang kiểm tra...' : 'Mở khóa'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function BlogPostPageWrapper(props) {
  const isProtected = props.content?.frontMatter?.protected === true
  return (
    <PasswordGate isProtected={isProtected}>
      <OriginalBlogPostPage {...props} />
    </PasswordGate>
  )
}
