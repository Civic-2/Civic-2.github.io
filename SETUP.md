# CivicSnap branch preview and Google Sheets setup

## What this branch changes
- Restores the full CivicSnap interface from the original `AK` page as the root `index.html`, so the branch has a real GitHub Pages entry point.
- Removes the hard-coded administrator password and verification code from the public HTML.
- Uses the Apps Script `ADMIN_KEY` Script Property to authorize administrator report-management requests.
- Stores public report submissions in the Google Sheets `Reports` sheet when the backend URL is configured.
- Persists administrator status changes, assignments, internal notes, and deletions in the sheet.
- Keeps the student, teacher, maintenance, and administrator interface structure from the original site.

## Preview this branch without merging
Open the branch's `index.html` using GitHub HTML Preview:

https://raw.githack.com/Civic-2/Civic-2.github.io/civicsnap-complete-fix/index.html

This is a third-party development preview, not a GitHub Pages deployment. Use it for visual review only; do not enter real administrator credentials there. Use the GitHub branch page to inspect the source:
https://github.com/Civic-2/Civic-2.github.io/tree/civicsnap-complete-fix

## Connect Google Sheets
1. Create a Google Spreadsheet using the school-managed account.
2. Open Extensions → Apps Script.
3. Replace the Apps Script editor contents with the complete `Code_v2.gs` file from this branch.
4. Save, choose `setup`, and run it once. Approve the spreadsheet permissions. This creates the `Reports` sheet and its headers.
5. In Apps Script Project Settings → Script Properties, add `ADMIN_KEY` with a long, unique secret. Do not put this key in GitHub or in the HTML source.
6. Choose Deploy → New deployment → Web app.
7. Set Execute as: Me. Set Who has access: Anyone, so public report submissions can reach the endpoint. Deploy and copy the URL ending in `/exec`.
8. In this branch's `index.html`, replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE` with the deployed URL, then commit the change to this branch.
9. For administrator access, use `admin@civicsnap-ibis.edu.ph` on the login screen, then enter the `ADMIN_KEY` configured in Apps Script.

## Important limitations before official use
- The backend URL and Google Sheet must be configured by the project owner; they are not connected by this repository change alone.
- Demo student/teacher/maintenance accounts are browser-side preview accounts, not production identity verification or persistent user registration.
- Photo selection only creates temporary browser previews; photos are not uploaded to Google Drive or saved in Sheets.
- Public report submission is unauthenticated. Add abuse protection, privacy notice, and identity safeguards before using this for sensitive or official reports.
- Apps Script is the data gateway. Keep the spreadsheet restricted to authorized school personnel and never commit the administrator key.

## Review and merge
The fix branch is separate from `main`. Review the preview and test the configured Sheets backend before merging pull request #1. No changes in this branch are live on the existing GitHub Pages site until Pages is configured and the branch is merged or separately deployed.
