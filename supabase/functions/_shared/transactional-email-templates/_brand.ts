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
  backgroundColor: BRAND.paper,
  fontFamily: 'Georgia, "Times New Roman", serif',
  margin: 0,
  padding: 0,
}

export const container: React.CSSProperties = {
  padding: '32px 28px',
  maxWidth: '560px',
  margin: '0 auto',
}

export const accentStrip: React.CSSProperties = {
  height: '4px',
  background: `linear-gradient(90deg, ${BRAND.violet}, ${BRAND.rose}, ${BRAND.amber})`,
  borderRadius: '4px',
  margin: '0 0 24px',
}

export const brand: React.CSSProperties = {
  fontSize: '13px',
  letterSpacing: '0.4em',
  color: BRAND.amberDeep,
  textTransform: 'uppercase',
  margin: '0 0 16px',
  fontWeight: 'normal',
}

export const h1: React.CSSProperties = {
  fontSize: '28px',
  color: BRAND.void,
  margin: '0 0 12px',
  lineHeight: 1.2,
  fontWeight: 'normal',
}

export const h2: React.CSSProperties = {
  fontSize: '13px',
  color: BRAND.amberDeep,
  margin: '0 0 10px',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontWeight: 600,
}

export const lead: React.CSSProperties = {
  fontSize: '16px',
  color: BRAND.bodyText,
  margin: '0 0 22px',
  lineHeight: 1.6,
}

export const body: React.CSSProperties = {
  fontSize: '14px',
  color: BRAND.bodyText,
  margin: '0 0 16px',
  lineHeight: 1.65,
}

export const card: React.CSSProperties = {
  background: '#ffffff',
  border: `1px solid ${BRAND.paperLine}`,
  borderRadius: '10px',
  padding: '18px 20px',
  margin: '0 0 16px',
}

export const button = (variant: 'primary' | 'secondary' = 'primary'): React.CSSProperties => ({
  display: 'inline-block',
  background:
    variant === 'primary'
      ? `linear-gradient(135deg, ${BRAND.violet}, ${BRAND.rose}, ${BRAND.amber})`
      : '#ffffff',
  color: variant === 'primary' ? '#ffffff' : BRAND.void,
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: '15px',
  fontWeight: 600,
  textDecoration: 'none',
  padding: '12px 26px',
  borderRadius: '999px',
  border: variant === 'primary' ? 'none' : `1px solid ${BRAND.paperLine}`,
  margin: '4px 0',
})

export const row: React.CSSProperties = {
  fontSize: '14px',
  margin: '4px 0',
  lineHeight: 1.5,
}

export const labelStyle: React.CSSProperties = { color: BRAND.mutedText }
export const valueStyle: React.CSSProperties = { color: BRAND.void }

export const hr: React.CSSProperties = {
  borderColor: BRAND.paperLine,
  margin: '28px 0 16px',
}

export const footer: React.CSSProperties = {
  fontSize: '12px',
  color: BRAND.mutedText,
  margin: 0,
  lineHeight: 1.6,
}

export const amberSmall: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '0.2em',
  color: BRAND.amberDeep,
  textTransform: 'uppercase',
  margin: '0 0 6px',
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
