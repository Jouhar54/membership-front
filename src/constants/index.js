export const ROLES = {
  ADMIN: 'admin',
  BATCH_ADMIN: 'batch_admin',
  MEMBER: 'member',
}

export const MEMBERSHIP_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  VERIFIED: 'verified',
}

export const POSTER_STATUS = {
  NOT_GENERATED: 'not_generated',
  GENERATING: 'generating',
  READY: 'ready',
}

export const DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad',
  'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod',
]

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
]

export const JOB_TYPES = [
  'Mudaris',
  'Qatheeb',
  'Sadar',
  'Muallim',
  'School teacher',
  'Others',
]

export const STATES = [
  'Kerala',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Delhi',
  'Andhra Pradesh',
  'Telangana',
  'Goa',
  'Gujarat',
  'Others',
]

export const NAV_ITEMS = {
  member: [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Profile', path: '/profile', icon: 'User' },
    { label: 'Poster', path: '/poster', icon: 'Image' },
  ],
  batch_admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Members', path: '/admin/members', icon: 'Users' },
    { label: 'Approvals', path: '/admin/approvals', icon: 'ClipboardCheck' },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Batch Admins', path: '/admin/batch-admins', icon: 'ShieldCheck' },
    { label: 'Members', path: '/admin/members', icon: 'Users' },
    { label: 'Batches', path: '/admin/batches', icon: 'GraduationCap' },
    { label: 'Approvals', path: '/admin/approvals', icon: 'ClipboardCheck' },
  ],
}
