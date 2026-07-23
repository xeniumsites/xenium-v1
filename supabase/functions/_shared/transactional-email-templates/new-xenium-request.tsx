import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  occasion?: string
  recipientName?: string
  recipientRelation?: string
  senderName?: string
  senderEmail?: string
  senderPhone?: string
  mood?: string
  features?: string[]
  story?: string
  deadline?: string
  submittedAt?: string
  shortCode?: string
  paymentLinkUrl?: string
  attachmentCount?: number
}

const Row = ({ label, value }: { label: string; value?: string }) => (
  value ? (
    <Text style={row}>
      <span style={labelStyle}>{label}: </span>
      <span style={valueStyle}>{value}</span>
    </Text>
  ) : null
)

const NewXeniumRequestEmail = ({
  occasion, recipientName, recipientRelation, senderName, senderEmail,
  senderPhone, mood, features, story, deadline, submittedAt, shortCode, paymentLinkUrl, attachmentCount,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New Xenium request from {senderName ?? 'someone special'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={brand}>Xenium</Heading>
        <Heading style={h1}>New experience request</Heading>
        <Text style={lead}>
          A new request just arrived. Details below.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Order</Heading>
          <Row label="Order ID" value={shortCode} />
          <Row label="Payment link" value={paymentLinkUrl} />
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Occasion</Heading>
          <Row label="Occasion" value={occasion} />
          <Row label="Mood" value={mood} />
          <Row label="Deadline" value={deadline} />
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Recipient</Heading>
          <Row label="Name" value={recipientName} />
          <Row label="Relation" value={recipientRelation} />
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>From</Heading>
          <Row label="Name" value={senderName} />
          <Row label="Email" value={senderEmail} />
          <Row label="Phone" value={senderPhone} />
        </Section>

        {features && features.length > 0 && (
          <Section style={card}>
            <Heading as="h2" style={h2}>Selected features</Heading>
            <Text style={valueStyle}>{features.join(' · ')}</Text>
          </Section>
        )}

        {story && (
          <Section style={card}>
            <Heading as="h2" style={h2}>Their story</Heading>
            <Text style={story_}>{story}</Text>
          </Section>
        )}

        {attachmentCount ? (
          <Section style={card}>
            <Heading as="h2" style={h2}>Photos</Heading>
            <Text style={valueStyle}>
              📎 {attachmentCount} photo{attachmentCount === 1 ? '' : 's'} attached to this email.
            </Text>
          </Section>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Submitted {submittedAt ?? 'just now'} · xenium-sites.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewXeniumRequestEmail,
  subject: (d: Record<string, any>) =>
    `New Xenium request — ${d.occasion ?? 'experience'} for ${d.recipientName ?? 'someone special'}`,
  to: 'xeniumgifts@gmail.com',
  displayName: 'New Xenium request',
  previewData: {
    occasion: 'Anniversary',
    recipientName: 'Aanya',
    recipientRelation: 'Wife',
    senderName: 'Rohan',
    senderEmail: 'rohan@example.com',
    senderPhone: '+91 90000 00000',
    mood: 'Romantic & cinematic',
    features: ['Custom video', 'Voice message', 'Photo timeline'],
    story: 'We met in college during the monsoons...',
    deadline: '2026-05-20',
    submittedAt: 'May 3, 2026 · 4:32 PM',
    attachmentCount: 3,
  },
} satisfies TemplateEntry

const main: React.CSSProperties = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container: React.CSSProperties = { padding: '32px 28px', maxWidth: '560px', margin: '0 auto' }
const brand: React.CSSProperties = { fontSize: '14px', letterSpacing: '0.4em', color: '#b8860b', textTransform: 'uppercase', margin: '0 0 24px', fontWeight: 'normal' }
const h1: React.CSSProperties = { fontSize: '26px', color: '#0c0c14', margin: '0 0 8px', fontWeight: 'normal' }
const h2: React.CSSProperties = { fontSize: '13px', color: '#7c5a00', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }
const lead: React.CSSProperties = { fontSize: '15px', color: '#55575d', margin: '0 0 24px', lineHeight: 1.5 }
const card: React.CSSProperties = { background: '#faf7f1', border: '1px solid #efe7d6', borderRadius: '8px', padding: '16px 18px', margin: '0 0 14px' }
const row: React.CSSProperties = { fontSize: '14px', margin: '4px 0', lineHeight: 1.5 }
const labelStyle: React.CSSProperties = { color: '#7a7a7a' }
const valueStyle: React.CSSProperties = { color: '#0c0c14' }
const story_: React.CSSProperties = { fontSize: '14px', color: '#0c0c14', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }
const hr: React.CSSProperties = { borderColor: '#eee', margin: '28px 0 16px' }
const footer: React.CSSProperties = { fontSize: '12px', color: '#999', margin: 0 }
