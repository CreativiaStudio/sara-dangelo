# Tier 1 Test Fix Strategy (Iteration 3)

## Test 5 Fix (Calendly CTA)
Remove all `if (popup) else` logic. Assume that the Calendly integration will be an inline embed or redirect.
Assert unconditionally that clicking the CTA causes a navigation to a URL containing 'calendly' or opens a visible modal/iframe.
Pick ONE approach. For example:
```typescript
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  calendlyCTA.click()
]);
expect(popup.url()).toContain('calendly');
```
Or simply:
```typescript
await calendlyCTA.click();
await expect(page).toHaveURL(/calendly/);
```
Whichever you choose, do NOT use `if/else`. Make it unconditional.

## Test 10 Fix (Image Format)
Update the `page.on('response')` listener. Instead of verifying that *any* image is modern, filter it so it only checks images from `/_next/image` or the portfolio path.
```typescript
if (response.request().resourceType() === 'image' && response.url().includes('_next/image')) { ... }
```
Then assert unconditionally that the expected modern format was served.
