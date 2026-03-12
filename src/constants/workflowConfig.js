import {
    FileText,
    Mail,
    MessageCircle,
    CheckCircle,
    Truck,
    MapPin,
    Clock,
    AlertCircle,
    Send
} from 'lucide-react';

export const WORKFLOW_ITEMS = {
    tasks: [
        {
            id: 'task-gr-created',
            type: 'task',
            title: 'GR Created',
            description: 'Triggered when a Goods Receipt is created',
            icon: FileText,
            color: '#3b82f6', // blue
            defaultData: {
                requireApproval: false,
                priority: 'Medium'
            }
        },
        {
            id: 'task-vehicle-assigned',
            type: 'task',
            title: 'Vehicle Assigned',
            description: 'Triggered when a vehicle is assigned to a trip',
            icon: Truck,
            color: '#8b5cf6', // purple
            defaultData: {
                vehicleType: 'Any'
            }
        },
        {
            id: 'task-trip-started',
            type: 'task',
            title: 'Trip Started',
            description: 'Triggered when a trip officially starts',
            icon: MapPin,
            color: '#10b981', // green
            defaultData: {}
        },
        {
            id: 'task-delayed',
            type: 'task',
            title: 'Trip Delayed',
            description: 'Triggered when a trip exceeds expected time',
            icon: Clock,
            color: '#f59e0b', // amber
            defaultData: {
                delayThresholdMins: 30
            }
        },
        {
            id: 'task-completed',
            type: 'task',
            title: 'Trip Completed',
            description: 'Triggered when a trip successfully completes',
            icon: CheckCircle,
            color: '#22c55e', // green
            defaultData: {}
        }
    ],
    actions: [
        {
            id: 'action-send-email',
            type: 'action',
            title: 'Send Email',
            description: 'Send an email notification',
            icon: Mail,
            color: '#ef4444', // red
            defaultData: {
                to: '',
                subject: 'Workflow Notification',
                body: ''
            }
        },
        {
            id: 'action-send-whatsapp',
            type: 'action',
            title: 'Send WhatsApp',
            description: 'Send a WhatsApp message',
            icon: MessageCircle,
            color: '#22c55e', // green
            defaultData: {
                phoneNumber: '',
                message: ''
            }
        },
        {
            id: 'action-send-telegram',
            type: 'action',
            title: 'Send Telegram',
            description: 'Send a Telegram message',
            icon: Send,
            color: '#1d59f0ff', // blue
            defaultData: {
                phoneNumber: '',
                message: ''
            }
        },
        {
            id: 'action-alert',
            type: 'action',
            title: 'Raise Alert',
            description: 'Raise a system alert for operators',
            icon: AlertCircle,
            color: '#f97316', // orange
            defaultData: {
                alertLevel: 'Warning',
                message: ''
            }
        }
    ]
};
