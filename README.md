# LocalBiz Connect
**Empowering Local Businesses Through Digital Marketing**

A responsive, SaaS-style digital marketing campaign platform built with HTML5, CSS3 and vanilla JavaScript. No backend, no build step.

## Problem Statement
Many small and local businesses struggle to maintain a consistent digital presence because professional marketing tools can be complex or expensive. LocalBiz Connect provides a simple platform to create promotional campaigns, generate social media content, manage offers and understand campaign performance.

## Solution
LocalBiz Connect provides an easy-to-use digital marketing workspace where local businesses can create campaigns, prepare social media content, manage promotional activities and monitor marketing performance through a centralized dashboard.

## Features
- Landing page with sticky blurred navbar, hero dashboard preview, features, how-it-works, clickable business categories and sample campaigns
- Dashboard: animated stats, SVG performance chart (metric + 7/30/90-day filters), recent campaigns table (cards on mobile)
- Campaigns: create, read, update, delete, search, filter, sort, status management, delete confirmation modal
- 6-step campaign builder with custom validation, platform cards, budget slider and live estimates
- Content Studio: caption + hashtag generator, loader, copy/regenerate/save, live Instagram-style preview, weekly content calendar
- Analytics driven by saved campaigns: platform filter, date filter, SVG charts, donut chart, best campaign
- Business profile with logo upload preview, settings with toggles, light/dark theme that persists
- Toasts, reusable modals, empty states, keyboard-accessible, mobile sidebar with overlay

## Technologies
HTML5, CSS3 (variables, grid, flexbox), Vanilla JavaScript, LocalStorage, Font Awesome, Google Fonts (Inter).

## Project Structure
```
LocalBiz-Connect/
├── index.html  dashboard.html  campaigns.html  create-campaign.html
├── content-studio.html  analytics.html  profile.html  settings.html
├── css/  style, landing, dashboard, campaigns, content, analytics, responsive
├── js/   main, dashboard, campaigns, create-campaign, content, analytics, profile, settings
└── assets/ images, icons
```

## How to Run
Open `index.html` in any modern browser. No server required (internet needed once for fonts/icons CDN).

## How LocalStorage Works
| Key | Data |
|---|---|
| `lbc_campaigns` | Campaign array (sample data seeded on first launch) |
| `lbc_content` | Saved captions |
| `lbc_plans` | Content calendar plans |
| `lbc_profile` | Business profile (logo as data URL) |
| `lbc_settings` | Notification toggles |
| `theme` | `light` or `dark` |

Settings → Reset all data restores the sample campaigns.

## Future Enhancements
AI-powered content generation, Meta Ads API, Instagram/Facebook/WhatsApp Business APIs, cloud database, user authentication, payments, advanced AI analytics, customer CRM, email marketing, push notifications.

## Screenshots
_Add screenshots of the landing page, dashboard, campaign builder and content studio here._

## Author
Aravinthan

**LocalBiz Connect – Digital Marketing Campaign Platform:** Designed and developed a responsive digital marketing platform that helps local businesses create promotional campaigns, generate social media content, manage offers and monitor campaign performance. Implemented campaign management, content generation, social media preview, analytics dashboard, filtering, validation, dark mode and LocalStorage-based data persistence using HTML, CSS and JavaScript.
