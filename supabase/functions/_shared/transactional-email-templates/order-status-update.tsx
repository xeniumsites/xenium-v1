import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import {
  main, container, accentStrip, brand, h1, h2, lead, card, body as bodyStyle,
  button as buttonStyle, hr, footer, amberSmall,
} from './_brand.ts'

interface Props {
  senderName?: string
  occasion?: string
  shortCode?: string
  status?: string
  deliveryUrl?: string | null
  trackUrl?: string
}

const STATUS_COPY: Record<string, { headline: string; lead: string; cta: string }> = {
  queued: {
    headline: 'Your Xenium is queued',
    lead: 'Production starts shortly. We will reach out if we need any final assets.',
    cta: 'Track your order',
  },
  in_progress: {
    headline: 'Your Xenium is being crafted',
    lead: 'Our design team is now weaving your story into a cinematic digital experience.',
    cta: 'Track your order',
  },
  review: {
    headline: 'Your Xenium is ready for your review',
    lead: 'A first cut is ready. Please open your tracking page to preview and request any small tweaks.',
    cta: 'Review your Xenium',
  },
  revisions: {
    headline: 'We are making your revisions',
    lead: 'Thanks for the notes. Your refined Xenium will be back with you shortly.',
    cta: 'Track your order',
  },
  delivered: {
    headline: 'Your Xenium is ready',
    lead: 'Your private link is below. Open it on any device — share it whenever you like.',
    cta: 'Open your Xenium',
  },
  cancelled: {
    headline: 'Your order was cancelled',
    lead: 'Your Xenium order has been cancelled. If this is unexpected, please reply to this email.',
    cta: 'Contact us',
  },
}

const OrderStatusUpdateEmail = ({
  senderName, occasion, shortCode, status, deliveryUrl, trackUrl,
}: Props) => {
  const copy = STATUS_COPY[status ?? ''] ?? STATUS_COPY.in_progress
  const ctaHref = status === 'delivered' && deliveryUrl ? deliveryUrl : trackUrl
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{copy.headline} ({shortCode})</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={accentStrip} />
          <Heading style={brand}>Xenium</Heading>
          <Heading style={h1}>{copy.headline}, {senderName ?? 'friend'}.</Heading>
          <Text style={lead}>{copy.lead}</Text>

          <Section style={card}>
            <Text style={amberSmall}>Order</Text>
            <Text style={bodyStyle}><strong>{shortCode}</strong> · {occasion}</Text>
            <Text style={amberSmall}>Status</Text>
            <Text style={bodyStyle}>{(status ?? '').replace('_', ' ')}</Text>
          </Section>

          <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
            <Button href={ctaHref} style={buttonStyle('primary')}>{copy.cta}</Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Replies come straight to our team. Email us at{' '}
            <Link href="mailto:xeniumgifts@gmail.com" style={{ color: '#6234A4' }}>xeniumgifts@gmail.com</Link>
            {' '}if you need anything.
          </Text>
          <Text style={footer}>Xenium · Hand-crafted personalised digital gifts · Made in India</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderStatusUpdateEmail,
  subject: (d: Record<string, any>) => {
    const c = STATUS_COPY[d.status ?? ''] ?? STATUS_COPY.in_progress
    return `${c.headline} — ${d.shortCode ?? ''}`
  },
  displayName: 'Order status update',
  previewData: {
    senderName: 'Rohan',
    occasion: 'Anniversary',
    shortCode: 'XEN-7K9P2A',
    status: 'delivered',
    deliveryUrl: 'https://xenium-sites.com/x/abc123',
    trackUrl: 'https://xenium-sites.com/track/XEN-7K9P2A',
  },
} satisfies TemplateEntry
