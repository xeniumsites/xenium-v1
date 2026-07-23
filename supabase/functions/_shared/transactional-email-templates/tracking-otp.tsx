import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'
import {
  main, container, accentStrip, brand, h1, lead, body as bodyStyle, hr, footer, otpBox,
} from './_brand.ts'

interface Props {
  senderName?: string
  shortCode?: string
  otp?: string
  expiresInMinutes?: number
}

const TrackingOtpEmail = ({ senderName, shortCode, otp, expiresInMinutes }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Xenium tracking code: {otp}</Preview>
    <Body style={main}>
      <Container style={container}>
        <div style={accentStrip} />
        <Heading style={brand}>Xenium</Heading>
        <Heading style={h1}>Your tracking code</Heading>
        <Text style={lead}>
          Hi {senderName ?? 'there'} — here's your one-time code to view the status of order{' '}
          <strong>{shortCode}</strong>.
        </Text>

        <Section style={otpBox}>{otp ?? '••••••'}</Section>

        <Text style={bodyStyle}>
          This code expires in {expiresInMinutes ?? 10} minutes. If you didn't request this, you can
          safely ignore this email.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          For your security, never share this code with anyone — including someone claiming to be
          from Xenium.
        </Text>
        <Text style={footer}>Xenium · Hand-crafted personalised digital gifts · Made in India</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: TrackingOtpEmail,
  subject: (d: Record<string, any>) => `Your Xenium tracking code: ${d.otp ?? '••••••'}`,
  displayName: 'Tracking page OTP',
  previewData: {
    senderName: 'Rohan',
    shortCode: 'XEN-7K9P2A',
    otp: '482915',
    expiresInMinutes: 10,
  },
} satisfies TemplateEntry
