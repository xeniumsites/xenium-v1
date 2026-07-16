/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

// Email-safe brand styles. Email clients don't reliably support webfonts or
// CSS variables, so we hardcode the values from src/index.css here. Dark
// theme is also unreliable across clients (Outlook in particular), so we use
// a warm cream background with a violet accent strip — looks premium and
// renders identically everywhere.

export const BRAND = {
  void: '#0C0C14',
  ink: '#1a1a26',
  paper: '#FAF7F1',
  paperLine: '#EFE7D6',
  bodyText: '#3a3a44',
  mutedText: '#7a7a86',
  amber: '#E5A422',
  amberDeep: '#7c5a00',
  rose: '#B85781',
  violet: '#6234A4',
  violetMid: '#7C5BB8',
}

export const main: React.CSSProperties = {
  backgroundColor: BRAND.void,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: 0,
  padding: 0,
}

export const container: React.CSSProperties = {
  padding: '40px 28px',
  maxWidth: '560px',
  margin: '0 auto',
}

export const accentStrip: React.CSSProperties = {
  height: '4px',
  background: `linear-gradient(90deg, ${BRAND.violet}, ${BRAND.rose}, ${BRAND.amber})`,
  borderRadius: '4px',
  margin: '0 0 32px',
}

export const brand: React.CSSProperties = {
  fontSize: '13px',
  letterSpacing: '0.4em',
  color: BRAND.amber,
  textTransform: 'uppercase',
  margin: '0 0 16px',
  fontWeight: 600,
}

export const h1: React.CSSProperties = {
  fontSize: '28px',
  color: '#ffffff',
  margin: '0 0 16px',
  lineHeight: 1.3,
  fontWeight: 500,
  letterSpacing: '-0.02em',
}

export const h2: React.CSSProperties = {
  fontSize: '13px',
  color: BRAND.amber,
  margin: '0 0 12px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 600,
}

export const lead: React.CSSProperties = {
  fontSize: '16px',
  color: '#e2e8f0',
  margin: '0 0 24px',
  lineHeight: 1.6,
  fontWeight: 400,
}

export const body: React.CSSProperties = {
  fontSize: '14px',
  color: '#cbd5e1',
  margin: '0 0 16px',
  lineHeight: 1.65,
}

export const card: React.CSSProperties = {
  background: BRAND.ink,
  border: `1px solid rgba(255,255,255,0.1)`,
  borderRadius: '12px',
  padding: '24px',
  margin: '0 0 24px',
}

export const button = (variant: 'primary' | 'secondary' = 'primary'): React.CSSProperties => ({
  display: 'inline-block',
  background:
    variant === 'primary'
      ? `linear-gradient(135deg, ${BRAND.violet}, ${BRAND.rose}, ${BRAND.amber})`
      : 'rgba(255,255,255,0.05)',
  color: '#ffffff',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  padding: '14px 32px',
  borderRadius: '999px',
  border: variant === 'primary' ? 'none' : `1px solid rgba(255,255,255,0.1)`,
  margin: '4px 0',
  textAlign: 'center',
})

export const row: React.CSSProperties = {
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: 1.5,
}

export const labelStyle: React.CSSProperties = { color: '#94a3b8' }
export const valueStyle: React.CSSProperties = { color: '#f8fafc', fontWeight: 500 }

export const hr: React.CSSProperties = {
  borderColor: 'rgba(255,255,255,0.1)',
  margin: '32px 0 24px',
}

export const footer: React.CSSProperties = {
  fontSize: '12px',
  color: '#64748b',
  margin: '0 0 8px',
  lineHeight: 1.6,
}

export const amberSmall: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.2em',
  color: BRAND.amber,
  textTransform: 'uppercase',
  margin: '0 0 8px',
  fontWeight: 600,
}

export const otpBox: React.CSSProperties = {
  background: '#ffffff',
  border: `2px solid ${BRAND.violet}`,
  borderRadius: '12px',
  fontSize: '32px',
  letterSpacing: '0.4em',
  textAlign: 'center',
  padding: '16px',
  color: BRAND.void,
  fontFamily: 'Menlo, Monaco, Consolas, monospace',
  margin: '8px 0 16px',
}
