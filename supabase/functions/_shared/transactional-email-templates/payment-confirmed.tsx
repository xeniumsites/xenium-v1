import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import {
  main, container, accentStrip, brand, h1, h2, lead, card, body as bodyStyle,
  button as buttonStyle, row, labelStyle, valueStyle, hr, footer, amberSmall,
} from './_brand.ts'

interface Props {
  senderName?: string
  occasion?: string
  shortCode?: string
  trackUrl?: string
}

const PaymentConfirmedEmail = ({ senderName, occasion, shortCode, trackUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Payment received — your Xenium is now in production</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={accentStrip} />
        <Heading style={brand}>Xenium</Heading>
        <Heading style={h1}>Payment received, {senderName ?? 'friend'}.</Heading>
        <Text style={lead}>
          Thank you. We've successfully received payment for your{' '}
          {occasion ? occasion.toLowerCase() : ''} Xenium ({shortCode}). Our design team is now
          beginning production.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>What happens next</Heading>
          <Text style={row}>
            <span style={labelStyle}>1. </span>
            <span style={valueStyle}>We may reach out within 24 hours if we need any extra photos, music or details.</span>
          </Text>
          <Text style={row}>
            <span style={labelStyle}>2. </span>
            <span style={valueStyle}>You'll receive your private Xenium link within 48–72 hours.</span>
          </Text>
          <Text style={row}>
            <span style={labelStyle}>3. </span>
            <span style={valueStyle}>One round of revisions is included if anything needs tweaking.</span>
          </Text>
        </Section>

        <Text style={amberSmall}>Order ID</Text>
        <Text style={bodyStyle}><strong>{shortCode}</strong></Text>

        <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
          <Button href={trackUrl} style={buttonStyle('primary')}>Track your order</Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Questions? Just reply to this email — we read every one.
        </Text>
        <Text style={footer}>
          Xenium · Hand-crafted personalised digital gifts · Made in India
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: PaymentConfirmedEmail,
  subject: (d: Record<string, any>) =>
    `Payment received — your Xenium ${d.shortCode ?? ''} is in production`,
  displayName: 'Payment confirmed',
  previewData: {
    senderName: 'Rohan',
    occasion: 'Anniversary',
    shortCode: 'XEN-7K9P2A',
    trackUrl: 'https://xenium-sites.com/track/XEN-7K9P2A',
  },
} satisfies TemplateEntry
