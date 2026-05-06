/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as newXeniumRequest } from './new-xenium-request.tsx'
import { template as customerPaymentLink } from './customer-payment-link.tsx'
import { template as paymentConfirmed } from './payment-confirmed.tsx'
import { template as orderStatusUpdate } from './order-status-update.tsx'
import { template as trackingOtp } from './tracking-otp.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'new-xenium-request': newXeniumRequest,
  'customer-payment-link': customerPaymentLink,
  'payment-confirmed': paymentConfirmed,
  'order-status-update': orderStatusUpdate,
  'tracking-otp': trackingOtp,
}
