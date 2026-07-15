# People Routing Table Rules (`team/people.md`)

`team/people.md` is the single people mapping table: **staff-id ↔ GitHub ↔ owned domains**.

Purpose:

1. The only basis for an agent to answer "who should I ask about this".
2. The existence source for `owner` field validation in `check.ts`.
3. The translation table between staff-ids and GitHub reviewers (page content uses staff-ids; PRs and CODEOWNERS use GitHub identities).

## Columns

| Column | Required | Rule |
| --- | --- | --- |
| `staff_id` | yes | `staff:########`, 8 digits, the company-wide unique employee id, primary key |
| `github` | recommended | GitHub username, used for PR reviewer assignment |
| `owns` | recommended | Owned systems/domains, comma-separated, matching the owner split across wiki pages |
| `notes` | no | Remarks (e.g. gardener rotation order, handover in progress) |

## Rules

1. `staff:00000000` is the system placeholder, kept in the table (used by templates/examples/unclaimed pages); it is not a person.
2. Update the table when members join or leave; pages owned by leavers get re-claimed at the gardening session.
3. This table itself is owned by the knowledge admins (via CODEOWNERS).
4. Do not record names, emails, or other direct PII here — the staff-id is the identity; look people up through company systems when contact is needed.
