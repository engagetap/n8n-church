# n8n-nodes-planning-center

This is an n8n community node for [Planning Center Online](https://www.planningcenter.com) - church management software for services, people, giving, groups, and more.

Planning Center is a suite of software tools designed for churches, including people management, service planning, volunteer scheduling, check-ins, giving, and more.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) | [Operations](#operations) | [Trigger](#planning-center-trigger) | [Credentials](#credentials) | [Compatibility](#compatibility)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### npm

```bash
npm install n8n-nodes-planning-center
```

### Community Nodes (Recommended)

1. Go to **Settings** > **Community Nodes**
2. Select **Install**
3. Enter `n8n-nodes-planning-center`
4. Agree to the risks and select **Install**

### Docker (Self-Hosted)

See [Docker Installation](#docker-installation) below.

## Operations

### Person (People Product)

| Operation | Description |
|-----------|-------------|
| **Create** | Create a new person |
| **Delete** | Delete a person |
| **Get** | Get a person by ID |
| **Get Many** | Get many people with filters |
| **Update** | Update a person |

**Filters:** first_name, last_name, email, status, created_at, updated_at

**Includes:** phone_numbers, emails, addresses, households, field_data, primary_campus

### List (People Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a list by ID |
| **Get Many** | Get all lists |
| **Get People** | Get people from a list with filters |
| **Refresh** | Trigger a list refresh/rerun (for Rules-based lists) |

**Get People Filters:** added after date, added before date, first_name, last_name

**Get People Includes:** phone_numbers, emails, addresses, households

### Form (People Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a form by ID |
| **Get Many** | Get all forms |
| **Get Submissions** | Get form submissions with filters |

**Filters:** submitted after date, submitted before date

**Includes:** person details, form_fields

### Service Type (Services Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a service type by ID |
| **Get Many** | Get all service types |

**Filters:** name

### Plan (Services Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a plan by ID |
| **Get Many** | Get plans for a service type |

**Filters:** after date, before date, future only, past only, **next X days**

**Next X Days:** Set a number (e.g., `7`) to get plans within the next X days from today. Perfect for volunteer reminder workflows.

**Includes:** contributors, my_schedules, plan_times, series

### Team Member (Services Product)

| Operation | Description |
|-----------|-------------|
| **Get Many** | Get team members scheduled for a plan |

**Filters:** status (Confirmed/Unconfirmed/Declined), team_id

**Includes:** person, team, responds_to, times, decline_reason

### Workflow (People Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a workflow by ID |
| **Get Many** | Get all workflows |

**Includes:** category, shared_people, shares, steps

### Workflow Step (People Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a workflow step by ID |
| **Get Many** | Get all steps for a workflow |

**Includes:** default_assignee

### Workflow Card (People Product)

| Operation | Description |
|-----------|-------------|
| **Create** | Add a person to a workflow |
| **Get** | Get a workflow card by ID |
| **Get Many** | Get workflow cards with filters |
| **Promote** | Move card to the next step |
| **Go Back** | Move card to the previous step |
| **Skip Step** | Skip current step and move forward |
| **Snooze** | Snooze card until a specified date |
| **Unsnooze** | Remove snooze from a card |
| **Remove** | Remove card from workflow |
| **Restore** | Restore a removed card |

**Filters:** stage (ready/snoozed/completed/removed), step_id, assignee_id, created_after, created_before

**Includes:** person, assignee, current_step, workflow, activities, notes

### Check-In Event (Check-Ins Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get an event by ID |
| **Get Many** | Get many events |

**Filters:** name, archive status (archived/not_archived)

**Includes:** attendance_types, event_periods, event_times, locations

### Check-In (Check-Ins Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a check-in by ID |
| **Get Many** | Get many check-ins |

**Filters:** event_id, location_id, person_id, status (checked_out/first_time/guest/not_checked_out/regular/volunteer), security_code, created_after, created_before, checked_out_after

**Includes:** checked_in_at (station), checked_in_by, checked_out_by, event, event_period, event_times, locations, options, person

### Check-In Location (Check-Ins Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a location by ID |
| **Get Many** | Get locations for an event |

**Filters:** location type (locations/root)

**Includes:** check_ins, event, locations (children), options, parent

### Group (Groups Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a group by ID |
| **Get Many** | Get many groups |

**Filters:** group_type_id, name, enrollment_open, enrollment_strategy, archive status

**Includes:** group_type, location

### Group Type (Groups Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a group type by ID |
| **Get Many** | Get all group types |

### Group Membership (Groups Product)

| Operation | Description |
|-----------|-------------|
| **Get Many** | Get memberships for a group |

**Filters:** role (leader/member)

**Includes:** person

### Group Event (Groups Product)

| Operation | Description |
|-----------|-------------|
| **Get** | Get a group event by ID |
| **Get Many** | Get events for a group |

**Filters:** starts_after, starts_before, upcoming only

**Includes:** group, location

## Planning Center Trigger

Receive real-time webhooks from Planning Center when events occur.

### Setup

1. Get your n8n webhook URL from the Planning Center Trigger node
2. Go to [Planning Center Webhooks](https://api.planningcenteronline.com/webhooks)
3. Create a new webhook subscription pointing to your n8n URL
4. Copy the **Authenticity Secret** from Planning Center
5. Paste the secret into the n8n trigger node

### Available Events

| Product | Events |
|---------|--------|
| **People** | Person created/updated/destroyed, Email changes, Phone changes, Address changes, Form submissions, Workflow card changes |
| **Services** | Plan created/updated/destroyed, Team member scheduled/updated/removed |
| **Check-Ins** | Check-in created/updated |
| **Giving** | Donation created/updated/destroyed |

### Features

- **Signature Verification**: Validates webhook authenticity using HMAC-SHA256
- **Event Filtering**: Only trigger on events you care about
- **Parsed Payload**: Clean output with webhook metadata, attributes, and relationships

### Example: Real-Time New Person Notification

```
Planning Center Trigger
  - Events: Person - Created
  - Authenticity Secret: your-secret
    ↓
Slack → Send Message
  - Channel: #new-people
  - Message: New person added: {{ $json.attributes.first_name }}
```

### Example: Real-Time Form Submission Processing

```
Planning Center Trigger
  - Events: Form Submission - Created
    ↓
Planning Center → Person → Get
  - Include: emails, phone_numbers
    ↓
Clearstream → Send Welcome Message
```

## Example Workflows

### First-Time Visitor Texting

```
Schedule Trigger (every 15 min on Sunday)
    ↓
Planning Center → List → Refresh (optional)
    ↓
Planning Center → List → Get People
  - List ID: your-visitor-list-id
  - Filter: Added to List After = 15 minutes ago
  - Include: Phone Numbers
    ↓
Filter (has phone number)
    ↓
Clearstream → Send Message
```

### Volunteer Scheduling Reminders

```
Schedule Trigger (Monday morning)
    ↓
Planning Center → Service Type → Get Many
    ↓
Planning Center → Plan → Get Many
  - Service Type ID: from previous step
  - Filter: Next X Days = 7
    ↓
Planning Center → Team Member → Get Many
  - Plan ID: from previous step
  - Filter: Status = Unconfirmed
  - Include: Person
    ↓
Filter (has phone number)
    ↓
Clearstream → Send Reminder Message
```

### Workflow Card Notifications

```
Schedule Trigger (every hour)
    ↓
Planning Center → Workflow → Get Many
    ↓
Planning Center → Workflow Card → Get Many
  - Workflow ID: from previous step
  - Filter: Stage = Ready
  - Filter: Step ID = specific-step-id
  - Include: Person
    ↓
Filter (card created in last hour)
    ↓
Clearstream → Send Notification
```

### Automated Workflow Card Management

```
Planning Center → Workflow Card → Get Many
  - Filter: Stage = Ready
  - Filter: Created Before = 30 days ago
    ↓
Loop Over Items
    ↓
Planning Center → Workflow Card → Promote
  - Workflow ID: workflow-id
  - Card ID: from current item
```

## Credentials

This node supports two authentication methods:

### Personal Access Token (Recommended for single-church use)

1. Go to [Planning Center Developer Portal](https://api.planningcenteronline.com/oauth/applications)
2. Create a new **Personal Access Token**
3. Copy the **Application ID** and **Secret**
4. Enter these in the n8n credentials

### OAuth2 (Recommended for multi-church applications)

1. Go to [Planning Center Developer Portal](https://api.planningcenteronline.com/oauth/applications)
2. Create a new **OAuth Application**
3. Set the callback URL to your n8n OAuth callback URL
4. Copy the **Client ID** and **Client Secret**
5. Enter these in the n8n credentials

## Compatibility

- n8n version 1.0.0 or later
- Node.js 18.10 or later

## Docker Installation

For self-hosted n8n running in Docker:

1. Build and pack the node:
```bash
npm run build
npm pack
```

2. Copy to your Docker host and extract to the n8n volume:
```bash
# On Docker host
mkdir -p /path/to/n8n-volume/nodes
cd /path/to/n8n-volume/nodes
tar -xzf n8n-nodes-planning-center-*.tgz
mv package n8n-nodes-planning-center
npm install --omit=dev
chown -R 1000:1000 .
```

3. Add environment variable to your container:
```
N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/nodes
```

4. Restart n8n

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Deploy to Docker host (requires .env file)
./deploy.sh
```

## Git Workflow

### When to Commit

Commit after completing a logical unit of work:
- New feature or resource added
- Bug fix completed and tested
- Refactoring finished
- Documentation updated

### When to Push

Push to remote after:
- Feature is complete and tested locally
- Before ending a work session (backup)
- When ready for others to review/use changes

### Common Commands

```bash
# Check what's changed
git status
git diff

# Stage and commit changes
git add .
git commit -m "Add workflow card filters to trigger"

# Push to remote
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

### Commit Message Format

Use clear, descriptive messages:

```
<type>: <short description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- refactor: Code refactoring
- chore: Maintenance tasks
```

Examples:
```bash
git commit -m "feat: Add Check-Ins resource"
git commit -m "fix: Correct webhook signature verification"
git commit -m "docs: Update README with git instructions"
```

### Branching (Optional)

For larger features:

```bash
# Create and switch to feature branch
git checkout -b feat/check-ins

# Work on feature, commit as needed
git add .
git commit -m "feat: Add Check-Ins events resource"

# Push branch
git push -u origin feat/check-ins

# When done, merge to main
git checkout main
git merge feat/check-ins
git push
```

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Planning Center API Documentation](https://developer.planning.center)
- [Planning Center API Status](https://status.planningcenter.com)

## Roadmap

- [x] Services product (Service Types, Plans, Team Members)
- [x] Workflows (Workflow, Workflow Step, Workflow Card with actions)
- [x] Webhook triggers (real-time events from People, Services, Check-Ins, Giving)
- [x] Check-Ins product (Events, Check-ins, Locations)
- [x] Groups product (Groups, Group Types, Memberships, Events)
- [ ] Giving product (Donations, Funds)
- [ ] Calendar product (Events, Event Instances)

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

---

Part of the [n8n-church](https://github.com/n8n-church) project - Serving churches through automation.
