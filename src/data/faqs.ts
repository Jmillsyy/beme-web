// Single source of truth for FAQ content so the rendered <details>
// blocks and the FAQPage structured data never drift apart. Home shows
// a short subset; the pricing page carries the full list.

export interface Faq {
  q: string
  a: string
}

export const homeFaqs: Faq[] = [
  {
    q: 'Do I need a credit card to start?',
    a: "Yes. Stripe collects card details upfront for the 14-day free trial. You're not charged until the trial ends, and you can cancel anytime from your account settings without being billed.",
  },
  {
    q: 'What brick and block sizes does Beme support?',
    a: 'Whatever you order from. Wall types are library-agnostic: set your own brick or block dimensions per project and Beme builds the schedule around them. AU SEQ, US CMU, UK metric, custom supplier ranges, all work the same way.',
  },
  {
    q: 'Can I hand the customer a real document?',
    a: 'Yes. Exports are a polished multi-page PDF: assumptions, wall layout diagram, per-wall-type breakdowns, supply schedule, 3D view. Branded with your details on Pro.',
  },
]

export const pricingFaqs: Faq[] = [
  {
    q: 'What counts as an export?',
    a: 'Each PDF you generate from the export modal, the supply schedule plus 3D view plus wall layout, counts as one export. Browsing projects, editing walls, viewing the 3D model, none of that counts. Only the moment you hit Export and a PDF gets created.',
  },
  {
    q: 'What happens if I hit the Basic export cap?',
    a: "Beme prompts you to upgrade to Pro for unlimited exports before generating the 11th. Your existing projects keep working: you can still edit, view, and prepare estimates. You just can't export new PDFs that month until you upgrade or the cap resets next billing cycle.",
  },
  {
    q: 'Do re-exports count toward the cap?',
    a: 'Yes. Every PDF export uses one credit, including re-exports after a typo fix or price update. 10 exports per month is generous enough to absorb a few re-exports per quote. Heavy re-exporters should look at Pro.',
  },
  {
    q: 'Do I need a credit card to start?',
    a: 'No. Build a full project, see the 3D view, run the exports, all without entering payment details.',
  },
  {
    q: 'What brick and block sizes does Beme support?',
    a: 'Whatever you order from. Wall types are library-agnostic: set your own dimensions per project and Beme builds the schedule around them.',
  },
  {
    q: 'Does Beme price the job or just count it?',
    a: 'Count, not price. Your supplier sets the rate; Beme gives you the quantity.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly, no contract. Cancel from your account settings; your projects stay exported and downloadable.',
  },
]

// Build FAQPage structured data from a list of Q/As.
export function faqJsonLd(items: Faq[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
