# Cafe Juana — SalesMate Admin Portal (HTML/CSS/JS)

## Start here

Open **`index.html`** in a modern desktop browser; it redirects straight to **`login.html`**. No installation, bundler, or server is required. Admin views share `styles.css`, `app.js`, `modules.js`, `charts.js` (only where charts appear), and bundled PNGs in `assets/`.

The project is organized into **23 separate HTML pages**: the original six screens plus the remaining 17 Admin Portal views. Navigation between modules is linked. The sidebar starts collapsed on every page and opens **only while hovered** (keyboard focus and touch have accessibility fallbacks). There is no persistent pinned-open state. The design follows the **1440 × 900 desktop** Figma references and Cafe Juana green/cream brand style, with smaller-screen adaptations.

## Original 6 screens

| Screen | File | Figma node |
|---|---|---|
| Admin Login | `login.html` | `307:11768` |
| Account Recovery — Inline | `account-recovery-inline.html` | `475:11` |
| Account Recovery — Confirmation | `account-recovery-confirmation.html` | `475:72` |
| Dashboard | `dashboard.html` | `55:12` and `54:16` |
| Sidebar — Closed | `sidebar-closed.html` | `55:12` |
| Sidebar — Opened | `sidebar-opened.html` | `54:16` |

## Additional 17 module pages

| Parent module | View | File | Figma node |
|---|---|---|---|
| Customer Management | Customer cards | `customer-management.html` | `61:21` |
| Purchases & Stamps | Loyverse Transactions | `purchase-transactions.html` | `84:25` |
| Purchases & Stamps | Stamp History | `stamp-history.html` | `84:158` |
| Rewards & Redemptions | Reward Catalog | `reward-catalog.html` | `91:33` |
| Rewards & Redemptions | Redemptions | `redemptions.html` | `91:170` |
| Promotions & Events | Promotional Offers | `promotional-offers.html` | `99:41` |
| Promotions & Events | Event Announcements | `event-announcements.html` | `99:177` |
| Promotions & Events | Hall Packages | `hall-packages.html` | `99:313` |
| Reports & Analytics | Customer Reports | `customer-reports.html` | `115:53` |
| Reports & Analytics | Stamp Activity Reports | `stamp-reports.html` | `115:241` |
| Reports & Analytics | Redemption Reports | `redemption-reports.html` | `115:429` |
| Reports & Analytics | Ratings Summary | `ratings-report.html` | `115:617` |
| Account Settings | My Profile | `account-settings.html` | `123:69` |
| Account Settings | Password & Security | `password-security.html` | `362:11` |
| Account Settings | Staff Accounts | `staff-accounts.html` | `362:153` |
| Account Settings | Preferences | `preferences.html` | `362:299` |
| Account Settings | Account Activity | `account-activity.html` | `362:440` |

## UI controls included

- Customer lookup, status filter, sorting, pagination sample state, and button-anchored customer details.
- Transactions and Stamp History tabs, receipt/stamp detail states, mock sync status.
- Reward catalog filtering, edit/new reward dialogs, and a sample eligibility check. It does **not** deduct stamps.
- Promotions / Events / Hall Packages tabs, filters, create/edit sample forms.
- Four Reports & Analytics tabs, code-driven interchangeable charts, History dialog, and working date-range selection.
- My Profile form (browser-only save), password checklist validation, sample staff invite form, notification preferences, light/dark theme toggle, and Account Activity filters.
- Topbar search routing to relevant modules, and shared notification and profile menus.

All customer metrics, dates, transaction amounts and loyalty balances are Figma **sample content**. Forms and modals demonstrate UI interactions only: **no real authentication, password reset email, backend writes, transactions, Loyverse synchronization, customer record editing or staff invitations are performed**. Browser-only saved preferences and profile inputs use localStorage where permitted.

## Image assets

The `assets/` folder contains local PNG artwork including the Cafe Juana logo, tropical and sage botanical patterns, coffee activity chart, announcements imagery and promotional still lifes. These image files were recovered from matching items in the user's ChatGPT file library. Direct inspection of the linked Google Drive folder was not available; if it contains newer versions, replace the matching filenames under `assets/`.

## Accuracy note

The structure, sample content, tabs, and appearance are based on their specific Figma frames; the HTML/CSS is a manually adapted implementation, **not a certified pixel-by-pixel export**. Some illustrative icons and graphic shapes are reconstructed using CSS and text. JS interactions and drawing were tested in a browser using inline local resources, including sidebar hover/collapse, every chart type, date ranges and series toggles. True online browser/page navigation and pixel-perfect Figma matching were not verified.

## Dashboard design fixes — retained

- **Customer Overview**: `assets/Minimalist Botanical Leaf Frame-2.webp`.
- **Stamps Awarded**: `assets/Warm Coffee Bean Watercolor Waves.webp`.
- **Rewards Redeemed**: `assets/Elegant Botanical Gift Rewards Banner.webp`.
- **Average Rating**: five-point star icon.
- **Circle charts**: numbers are generated once by the renderer, preventing duplicate overlapping labels.
- **Customer and Purchase Activity**: actual SVG marks drawn from editable JavaScript arrays, not an image.

## November 6, 2026 — Hover-only sidebar, Login startup, interchangeable graphs

### Sidebar

Every Admin page starts with the **80 px collapsed sidebar**. Move the cursor over it to expand to **240 px**; leave to close automatically. Keyboard focus expands the menu for accessibility and a touch interaction can reveal it on touch devices. There is no click-to-pin toggle and old `cj-sidebar` localStorage preferences are intentionally ignored. `sidebar-opened.html` and `sidebar-closed.html` remain as Dashboard preview routes, but now **both** follow the same hover behavior.

### Initial page

`index.html` now redirects to `login.html` (JavaScript redirect with HTML refresh fallback), so the former module-list landing page is gone. The login and account-recovery screens remain separate files; no real sign-in or recovery email is sent.

### Interchangeable graphs

**All dashboard/report graphs are rendered from one file: `charts.js`.** The previous `dashboard-charts.js` is retired. The active visualizations do **not** use PNG chart imagery.

| Location | Chart IDs in `charts.js` | Changeable types |
|---|---|---|
| Dashboard — Customer & Purchase Activity | `dashboard-activity` | Combined, Bar, Line, Area |
| Dashboard — Rewards & Redemption Overview | `dashboard-rewards` | Donut, Pie, Bars |
| Reports — Customer Growth & Retention | `customer-growth` | Bar, Line, Area |
| Reports — Membership Mix | `customer-mix` | Donut, Pie, Bars |
| Reports — Stamp Activity Trend | `stamp-trend` | Bar, Line, Area |
| Reports — Stamp Award Status | `stamp-mix` | Donut, Pie, Bars |
| Reports — Reward Claim Activity | `redemption-trend` | Bar, Line, Area |
| Reports — Redemption Status | `redemption-mix` | Donut, Pie, Bars |
| Reports — Customer Rating Distribution | `ratings-distribution` | Bar (horizontal), Line, Area |
| Reports — Feedback Categories | `ratings-mix` | Donut, Pie, Bars |

Use the **Chart display type** dropdown in each graph panel to swap chart styles. Use the **date-range** dropdown to switch between the stored example datasets. The Dashboard's Purchases/Customers legend buttons still toggle data series. All graphs use editable SVG, with accessible data descriptions and keyboard focus on data points.

### Edit the datasets in code

Open **`charts.js`**, then find the object called `sampleData`. Each graph ID contains period objects (`7m`, `30d`, `year`, or `12m` for the Dashboard activity chart). For trends, edit `labels` and the `values` arrays for each series; for breakdowns, edit `labels` and `values`. The chart redraws automatically on reload. Example (after the page loads):

```js
CafeJuanaCharts.setData('customer-growth', '7m', {
  labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  series: [{ label: 'New members', values: [32, 41, 46, 55, 63, 71, 82] }]
});
CafeJuanaCharts.setType('customer-growth', 'area');
```

These are **demonstration values** only. Charts are ready to accept your processed database/Loyverse aggregates, but API fetching, authentication and live synchronization still require backend implementation. **Report summary cards remain illustrative static metrics**; changing graph type/date does not recalculate the cards.

## Dashboard View All navigation

The **View All** controls are now real links across all three dashboard layouts (`dashboard.html`, `sidebar-closed.html`, and `sidebar-opened.html`):

- Recent Loyalty Activity → `purchase-transactions.html` (Purchases & Stamps module; Stamp History remains available as its tab).
- Promotions and Events → `promotional-offers.html` (Promotions & Events module; Events and Hall Packages remain available as tabs).

This is ordinary same-tab navigation, not a popup or a placeholder notification.


## Lite edition
This edition uses locally bundled WebP versions of the same source PNG artwork to reduce the download size. All project image paths have been updated; no extra assets are needed. The source code and functions match the full original PNG edition.
