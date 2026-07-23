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
  paymentLinkUrl?: string
  amount?: string
  currency?: string
  trackUrl?: string
}

const CustomerPaymentLinkEmail = ({
  senderName, occasion, shortCode, paymentLinkUrl, amount, currency, trackUrl,
}: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Xenium request — payment link inside ({amount})</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={accentStrip} />
        <Heading style={brand}>Xenium</Heading>
        <Heading style={h1}>Hi {senderName ?? 'there'} — your Xenium is queued.</Heading>
        <Text style={lead}>
          Thank you for your request for a {occasion ? occasion.toLowerCase() : 'Xenium'} experience.
          To begin production, please complete {amount ? <>payment of <strong>{amount}</strong></> : 'your payment'}{' '}
          using the secure link below.
        </Text>

        <Section style={{ textAlign: 'center', margin: '24px 0 28px' }}>
          <Button href={paymentLinkUrl} style={buttonStyle('primary')}>
            {amount ? `Pay ${amount} securely` : 'Pay securely'}
          </Button>
        </Section>

        <Section style={card}>
          <Heading as="h2" style={h2}>Order summary</Heading>
          <Text style={row}>
            <span style={labelStyle}>Order ID: </span>
            <span style={valueStyle}>{shortCode}</span>
          </Text>
          <Text style={row}>
            <span style={labelStyle}>Occasion: </span>
            <span style={valueStyle}>{occasion}</span>
          </Text>
          <Text style={row}>
            <span style={labelStyle}>Total: </span>
            <span style={valueStyle}>{amount} {currency ?? 'INR'}</span>
          </Text>
        </Section>

        <Text style={amberSmall}>What happens next?</Text>
        <Text style={bodyStyle}>
          Once payment confirms, our design team begins crafting your Xenium. Orders before 12 PM IST are
          delivered the same day; otherwise within 24 hours. We'll email you the moment it's ready.
        </Text>

        <Text style={bodyStyle}>
          You can track your order any time at{' '}
          <Link href={trackUrl} style={{ color: '#6234A4', textDecoration: 'underline' }}>{trackUrl}</Link>
          {' '}— quote order ID <strong>{shortCode}</strong>.
        </Text>

        <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
          <Button href={trackUrl} style={buttonStyle('secondary')}>Track this order</Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Trouble paying? Reply to this email or write to{' '}
          <Link href="mailto:xeniumgifts@gmail.com" style={{ color: '#6234A4' }}>xeniumgifts@gmail.com</Link>
          . Your payment link expires in 7 days.
        </Text>
        <Text style={footer}>
          Xenium · Hand-crafted personalised digital gifts · Made in India
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: CustomerPaymentLinkEmail,
  subject: (d: Record<string, any>) =>
    `Your Xenium order ${d.shortCode ?? ''} — secure payment link inside`,
  displayName: 'Customer payment link',
  previewData: {
    senderName: 'Rohan',
    occasion: 'Anniversary',
    shortCode: 'XEN-7K9P2A',
    paymentLinkUrl: 'https://rzp.io/l/sample',
    amount: '₹750',
    currency: 'INR',
    trackUrl: 'https://xenium-sites.com/track/XEN-7K9P2A',
  },
} satisfies TemplateEntry
