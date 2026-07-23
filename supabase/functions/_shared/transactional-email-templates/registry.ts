/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
  /**
   * Transactional/security emails (payment links, receipts, login OTPs) are
   * NOT marketing mail. When true, send-transactional-email bypasses the
   * suppression list and does NOT attach a one-click List-Unsubscribe header,
   * so a customer who unsubscribed from notifications (or had a one-off
   * bounce/complaint) still receives the payment link / OTP they need.
   */
  transactional?: boolean
}

import { template as newXeniumRequest } from './new-xenium-request.tsx'
import { template as customerPaymentLink } from './customer-payment-link.tsx'
import { template as paymentConfirmed } from './payment-confirmed.tsx'
import { template as orderStatusUpdate } from './order-status-update.tsx'
import { template as trackingOtp } from './tracking-otp.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-xenium-request': newXeniumRequest,
  'customer-payment-link': { ...customerPaymentLink, transactional: true },
  'payment-confirmed': { ...paymentConfirmed, transactional: true },
  'order-status-update': orderStatusUpdate,
  'tracking-otp': { ...trackingOtp, transactional: true },
}
