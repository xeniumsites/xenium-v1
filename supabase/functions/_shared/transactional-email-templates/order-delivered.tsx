import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import { main, container, accentStrip, brand, h1, h2, lead, body, card, button, hr, footer, otpBox } from './_brand.ts'

interface Props { senderName?: string; recipientName?: string; occasion?: string; shortCode?: string; revealUrl?: string; previewUrl?: string; password?: string; revealAtLabel?: string; trackUrl?: string; editUntilLabel?: string }

const OrderDeliveredEmail = ({ senderName, recipientName, occasion, shortCode, revealUrl, previewUrl, password, revealAtLabel, trackUrl, editUntilLabel }: Props) => (
  <Html lang="en" dir="ltr"><Head /><Preview>Your Xenium for {recipientName ?? 'someone special'} is ready</Preview><Body style={main}><Container style={container}>
    <div style={accentStrip} /><Heading style={brand}>Xenium</Heading>
    <Heading style={h1}>Your Xenium is ready, {senderName ?? 'friend'}.</Heading>
    <Text style={lead}>Your {occasion ? occasion.toLowerCase() : 'personalised'} gift for {recipientName ?? 'someone special'} has been delivered.</Text>
    <Section style={card}><Heading as="h2" style={h2}>Two links, two purposes</Heading>
      <Text style={body}><strong>Preview privately:</strong> check your Xenium before the recipient sees it. This link bypasses the timer and password.</Text>
      <Section style={{ textAlign: 'center', margin: '16px 0' }}><Button href={previewUrl} style={button('primary')}>Preview your Xenium</Button></Section>
      <Text style={body}><strong>Share with the recipient:</strong> send them this reveal link{revealAtLabel ? ` — it unlocks at ${revealAtLabel}` : ''}.</Text>
      <Text style={{ ...body, margin: 0, wordBreak: 'break-all' }}><Link href={revealUrl} style={{ color: '#6234A4' }}>{revealUrl}</Link></Text>
    </Section>
    {password ? <><Text style={body}>Share this password with the recipient too:</Text><Section style={otpBox}>{password}</Section></> : null}
    <Text style={body}>Need a change? You can request edits until <strong>{editUntilLabel}</strong> from your <Link href={trackUrl} style={{ color: '#6234A4' }}>tracking page</Link> (order {shortCode}).</Text>
    <Hr style={hr} /><Text style={footer}>Xenium · Hand-crafted personalised digital gifts · Made in India</Text>
  </Container></Body></Html>
)

export const template = { component: OrderDeliveredEmail, subject: (d: Record<string, any>) => `Your Xenium for ${d.recipientName ?? 'someone special'} is ready`, displayName: 'Order delivered', previewData: { senderName: 'Rohan', recipientName: 'Aanya', occasion: 'Anniversary', shortCode: 'XEN-7K9P2A', revealUrl: 'https://xenium-sites.com/x/abc123', previewUrl: 'https://xenium-sites.com/preview/abc123', password: 'MONSOON', revealAtLabel: 'May 20 at 8:00 PM IST', trackUrl: 'https://xenium-sites.com/track/XEN-7K9P2A', editUntilLabel: 'May 21, 2026' } } satisfies TemplateEntry
