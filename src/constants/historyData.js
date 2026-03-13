export const WORKFLOW_HISTORY = [
    {
        id: 'hist-001',
        workflowName: 'GR Created → Send Email',
        status: 'success',
        triggeredAt: '2026-03-12T10:30:00+05:30',
        completedAt: '2026-03-12T10:30:05+05:30',
        duration: '5s',
        triggeredBy: 'System',
        nodes: [
            { title: 'GR Created', status: 'success', startedAt: '10:30:00', endedAt: '10:30:02', message: 'GR #4521 created successfully' },
            { title: 'Send Email', status: 'success', startedAt: '10:30:02', endedAt: '10:30:05', message: 'Email sent to dispatch@transport.com' }
        ]
    },
    {
        id: 'hist-002',
        workflowName: 'Vehicle Assigned → WhatsApp',
        status: 'success',
        triggeredAt: '2026-03-12T09:15:00+05:30',
        completedAt: '2026-03-12T09:15:08+05:30',
        duration: '8s',
        triggeredBy: 'Admin',
        nodes: [
            { title: 'Vehicle Assigned', status: 'success', startedAt: '09:15:00', endedAt: '09:15:03', message: 'Vehicle MH-12-AB-1234 assigned to Trip #87' },
            { title: 'Send WhatsApp', status: 'success', startedAt: '09:15:03', endedAt: '09:15:08', message: 'WhatsApp sent to driver +91-98765XXXXX' }
        ]
    },
    {
        id: 'hist-003',
        workflowName: 'Trip Delayed → Raise Alert → Email',
        status: 'failed',
        triggeredAt: '2026-03-11T16:45:00+05:30',
        completedAt: '2026-03-11T16:45:12+05:30',
        duration: '12s',
        triggeredBy: 'System',
        error: 'SMTP server unreachable',
        nodes: [
            { title: 'Trip Delayed', status: 'success', startedAt: '16:45:00', endedAt: '16:45:03', message: 'Trip #65 exceeded threshold by 45min' },
            { title: 'Raise Alert', status: 'success', startedAt: '16:45:03', endedAt: '16:45:06', message: 'Alert raised for operations team' },
            { title: 'Send Email', status: 'failed', startedAt: '16:45:06', endedAt: '16:45:12', message: 'Failed: SMTP server unreachable' }
        ]
    },
    {
        id: 'hist-004',
        workflowName: 'GR Created → Telegram',
        status: 'failed',
        triggeredAt: '2026-03-11T14:20:00+05:30',
        completedAt: '2026-03-11T14:20:10+05:30',
        duration: '10s',
        triggeredBy: 'System',
        error: 'Telegram API rate limit exceeded',
        nodes: [
            { title: 'GR Created', status: 'success', startedAt: '14:20:00', endedAt: '14:20:04', message: 'GR #4518 created successfully' },
            { title: 'Send Telegram', status: 'failed', startedAt: '14:20:04', endedAt: '14:20:10', message: 'Failed: Telegram API rate limit exceeded' }
        ]
    },
    {
        id: 'hist-005',
        workflowName: 'Trip Started → WhatsApp → Email',
        status: 'success',
        triggeredAt: '2026-03-11T08:00:00+05:30',
        completedAt: '2026-03-11T08:00:15+05:30',
        duration: '15s',
        triggeredBy: 'Driver App',
        nodes: [
            { title: 'Trip Started', status: 'success', startedAt: '08:00:00', endedAt: '08:00:03', message: 'Trip #90 started from Mumbai depot' },
            { title: 'Send WhatsApp', status: 'success', startedAt: '08:00:03', endedAt: '08:00:09', message: 'WhatsApp sent to manager +91-99887XXXXX' },
            { title: 'Send Email', status: 'success', startedAt: '08:00:09', endedAt: '08:00:15', message: 'Email sent to ops@transport.com' }
        ]
    },
    {
        id: 'hist-006',
        workflowName: 'Trip Completed → Email',
        status: 'success',
        triggeredAt: '2026-03-10T18:30:00+05:30',
        completedAt: '2026-03-10T18:30:07+05:30',
        duration: '7s',
        triggeredBy: 'Driver App',
        nodes: [
            { title: 'Trip Completed', status: 'success', startedAt: '18:30:00', endedAt: '18:30:03', message: 'Trip #88 completed at Pune depot' },
            { title: 'Send Email', status: 'success', startedAt: '18:30:03', endedAt: '18:30:07', message: 'Completion report emailed to client@abc.com' }
        ]
    },
    {
        id: 'hist-007',
        workflowName: 'Vehicle Assigned → Email → WhatsApp',
        status: 'failed',
        triggeredAt: '2026-03-10T11:10:00+05:30',
        completedAt: '2026-03-10T11:10:18+05:30',
        duration: '18s',
        triggeredBy: 'Admin',
        error: 'WhatsApp API timeout',
        nodes: [
            { title: 'Vehicle Assigned', status: 'success', startedAt: '11:10:00', endedAt: '11:10:04', message: 'Vehicle GJ-05-CD-5678 assigned to Trip #91' },
            { title: 'Send Email', status: 'success', startedAt: '11:10:04', endedAt: '11:10:10', message: 'Email sent to fleet@transport.com' },
            { title: 'Send WhatsApp', status: 'failed', startedAt: '11:10:10', endedAt: '11:10:18', message: 'Failed: WhatsApp API timeout after 8s' }
        ]
    }
];
