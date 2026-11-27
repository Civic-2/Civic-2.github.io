# CivicSnap deployment guide

## Google Sheets database
1. Create a Google Spreadsheet.
2. Open Extensions → Apps Script.
3. Replace the starter editor code with the complete contents of `Code_v2.gs` in this repository.
4. Save, select `setup`, and run it once. Approve the requested spreadsheet permissions. This creates the Reports sheet and column headers.
5. In Apps Script Project Settings → Script Properties, add `ADMIN_KEY` with a long, unique secret. Keep it private; do not commit it to GitHub.

## Deploy the backend
1. Choose Deploy → New deployment → Web app.
2. Execute as: Me.
3. Who has access: Anyone. Public report submission needs to reach the endpoint.
4. Deploy and copy the Web app URL ending in /exec.
5. If you change the Apps Script code later, deploy a new version.

## Configure the website
1. Open `index.html` in this repository.
2. Replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` with your deployed Web app URL.
3. Save and commit.
4. In GitHub repository Settings → Pages, select deployment from the `main` branch root after merging the fix branch.

## Test
- Submit a test report on the public page. Verify that a row appears in the Reports sheet.
- Open Administrator, enter the Script Property key, and connect.
- Confirm that reports load, then change a status and assign a staff ID.
- Refresh and verify the changes remain.

## Current scope and cautions
The new site provides a public report form and an administrator dashboard with persistent report listing, status changes, and assignment. The Apps Script backend persists report IDs, details, reporter information, status, assignment, history, and notes.

This is a starter school project, not a fully hardened production case-management system. Public report creation currently does not authenticate the submitter. Photo uploads, account registration/login, role-based staff access, email notifications, announcements, and a public status lookup are not yet connected to persistent storage. Protect the spreadsheet and Apps Script project with school account permissions, and add identity verification, abuse controls, and a privacy notice before using it for official sensitive reports.
