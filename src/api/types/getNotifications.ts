interface NotificationMetadata {
  customerId: string;
  applicationId: string;
  approvalProcessId: string;
}

interface NotificationDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  createdBy: string;
  type: string;
  title: string;
  content: string;
  metadata: NotificationMetadata;
  deleted: boolean;
}

export interface NotificationItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
  createdBy: string;
  notification: NotificationDetail;
  isRead: boolean;
  message: string;
  readAt: string | null;
  deleted: boolean;
}

export interface NotificationResponse {
  code: number;
  message: string;
  result: {
    content: NotificationItem[];
  };
}
