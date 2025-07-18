export interface Report {
  id: number
  folder?: string
  title: string
  description?: string
  notif_rules?: string
}

export type NewReport = Omit<Report, 'id'>
