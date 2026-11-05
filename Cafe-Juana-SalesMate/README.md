# Cafe Juana — SalesMate Admin Portal (HTML/CSS/JS)

## Start here

Open **`index.html`** in a modern desktop browser. There is no installation, bundler, or server requirement. All pages use `styles.css`, `app.js`, `modules.js`, and the bundled local PNGs in `assets/`.

The project is organized into **23 separate HTML pages**: the original six screens plus the remaining 17 Admin Portal views. Navigation between the modules is linked and the expanded/collapsed sidebar selection is kept in your browser. The design follows the **1440 × 900 desktop** Figma references and Cafe Juana green/cream brand style, with smaller-screen adaptations.

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
- Four Reports & Analytics tabs, chart and donut visuals, History dialog, date-range selection.
- My Profile form (browser-only save), password checklist validation, sample staff invite form, notification preferences, light/dark theme toggle, and Account Activity filters.
- Topbar search routing to relevant modules, and shared notification and profile menus.

All customer metrics, dates, transaction amounts and loyalty balances are Figma **sample content**. Forms and modals demonstrate UI interactions only: **no real authentication, password reset email, backend writes, transactions, Loyverse synchronization, customer record editing or staff invitations are performed**. Browser-only saved preferences and profile inputs use localStorage where permitted.

## Image assets

The `assets/` folder contains local PNG artwork including the Cafe Juana logo, tropical and sage botanical patterns, coffee activity chart, announcements imagery and promotional still lifes. These image files were recovered from matching items in the user's ChatGPT file library. Direct inspection of the linked Google Drive folder was not available; if it contains newer versions, replace the matching filenames under `assets/`.

## Accuracy note

The structure, sample content, tabs, and appearance are based on their specific Figma frames; the HTML/CSS is a manually adapted implementation, **not a certified pixel-by-pixel export**. Some illustrative icons and graphic shapes are reconstructed using CSS and text. Initial file/path checks and CSS/JS syntax checks passed, but automated live browser screenshot comparisons were blocked in the current environment.

## Dashboard fixes — November 5, 2026

The following updates apply to `dashboard.html`, `sidebar-closed.html`, and `sidebar-opened.html`:

- **Customer Overview**: Uses `assets/Minimalist Botanical Leaf Frame-2.png`.
- **Stamps Awarded**: Uses `assets/Warm Coffee Bean Watercolor Waves.png`.
- **Rewards Redeemed**: Uses `assets/Elegant Botanical Gift Rewards Banner.png`.
- **Average Rating**: Uses a five-point star SVG icon instead of a bar-chart icon.
- **Rewards and Redemption Overview**: Replaces the baked-in donut image plus overlapping HTML label with one HTML/CSS donut chart and centered `412 claims` total.
- **Customer and Purchase Activity**: Replaces its static image with a live SVG chart generated by `dashboard-charts.js`.
  - Change the period using **Last 7 months**, **Last 30 days**, or **Last 12 months**.
  - Click the **Purchases** or **Customers** legend buttons to show/hide a series.
  - Hover, focus, or click a plotted period to see its figures.
  - To replace demonstration data, edit the `activityData` object in `dashboard-charts.js` or feed it with aggregated POS/database records.

All chart data is currently **illustrative**. The charts respond to controls, but no real Loyverse/database connection has been established.

The original Drive folder could not be enumerated in this session. The three metric backgrounds were selected from matching, locally available Cafe Juana original artwork in the file library.

## Dashboard View All navigation

The **View All** controls are now real links across all three dashboard layouts (`dashboard.html`, `sidebar-closed.html`, and `sidebar-opened.html`):

- Recent Loyalty Activity → `purchase-transactions.html` (Purchases & Stamps module; Stamp History remains available as its tab).
- Promotions and Events → `promotional-offers.html` (Promotions & Events module; Events and Hall Packages remain available as tabs).

This is ordinary same-tab navigation, not a popup or a placeholder notification.
