// Marketing → app checkout helper.
//
// Every "Start free" button on the marketing site routes through this
// function. It POSTs to the app's create-checkout-session Edge
// Function, which returns a Stripe Checkout URL. We then navigate
// the visitor's tab to that URL — Stripe takes it from there.
//
// The endpoint lives in the app's Supabase project. We hit it via the
// app's domain so the deployed Edge Function URL stays a Supabase
// detail (not exposed to the marketing site).
//
// If the request fails, we surface a clear error and fall back to
// dropping the visitor straight on the app's sign-in page so they
// can at least reach Beme (no dead-end click).

const CHECKOUT_ENDPOINT =
  'https://app.beme.com.au/functions/v1/create-checkout-session'

const APP_SIGN_IN_URL = 'https://app.beme.com.au'

export type Plan = 'individual' | 'organisation'

interface StartCheckoutOptions {
  plan: Plan
  /** Where on the marketing site the click came from (analytics). */
  source: string
  /** Optional email pre-fill — useful if you ever add an email input
   *  on the marketing site before "Start free". */
  email?: string
}

/**
 * Start Stripe Checkout for `plan`. Navigates the current tab to the
 * Stripe-hosted checkout page on success. Falls back to the app's
 * sign-in page on failure.
 */
export async function startCheckout(opts: StartCheckoutOptions): Promise<void> {
  try {
    const res = await fetch(CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    })
    if (!res.ok) throw new Error(`Checkout endpoint returned ${res.status}`)
    const { url } = (await res.json()) as { url?: string }
    if (!url) throw new Error('Checkout endpoint did not return a URL')
    window.location.href = url
  } catch (err) {
    console.error('[checkout] failed:', err)
    // Soft fallback — don't leave the visitor on a broken click. Land
    // them on the app where they can sign in or contact support.
    window.location.href = `${APP_SIGN_IN_URL}?error=checkout`
  }
}
