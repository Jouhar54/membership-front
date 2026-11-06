import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Search, CheckCircle2, XCircle, CreditCard,
  Eye, Users, RotateCcw, ExternalLink, Receipt, ArrowUpDown, Edit3, FileDown,
  Filter, X,
} from 'lucide-react'
import { applicationsApi, batchesApi, exportApi } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from '../hooks/useDebounce'
import Card from '../components/ui/Card'
import DataTable from '../components/tables/DataTable'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Pagination from '../components/ui/Pagination'
import { ConfirmModal } from '../components/ui/Modal'
import Modal from '../components/ui/Modal'
import RejectReasonModal from '../components/ui/RejectReasonModal'
import { PageLoader } from '../components/ui/LoadingStates'
import { DISTRICTS } from '../constants'
import { formatPhone, formatDate, cn, showApiErrorToast, downloadBlob, extractBlobErrorMessage } from '../utils'
import toast from 'react-hot-toast'

export default function MembersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isBatchAdmin = user?.role === 'batch_admin'
  const userBatchId = user?.batchId || null

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 350)
  const [batchFilter, setBatchFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')
  const [talukFilter, setTalukFilter] = useState('')
  const [mandalamFilter, setMandalamFilter] = useState('')
  const [panchayathFilter, setPanchayathFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortSelection, setSortSelection] = useState('created-desc')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState({
    batch: '',
    status: '',
    payment: '',
    district: '',
    taluk: '',
    mandalam: '',
    panchayath: '',
    dateFrom: '',
    dateTo: '',
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [confirmAction, setConfirmAction] = useState(null)
  const [viewApplication, setViewApplication] = useState(null)
  const [isExportingAll, setIsExportingAll] = useState(false)
  const [exportingMemberId, setExportingMemberId] = useState(null)
  const queryClient = useQueryClient()

  const { data: batches = [] } = useQuery({
    queryKey: ['batches'],
    queryFn: batchesApi.getAll,
  })

  const { data: locationsData = { districts: [], panchayaths: [], mandalams: [], taluks: [] } } = useQuery({
    queryKey: ['locations'],
    queryFn: () => applicationsApi.getLocations(),
    staleTime: 5 * 60 * 1000,
  })

  // Derive sortBy & sortOrder from sortSelection
  const { sortBy, sortOrder } = useMemo(() => {
    switch (sortSelection) {
      case 'created-asc':
        return { sortBy: 'createdAt', sortOrder: 'asc' }
      case 'name-asc':
        return { sortBy: 'fullName', sortOrder: 'asc' }
      case 'name-desc':
        return { sortBy: 'fullName', sortOrder: 'desc' }
      case 'created-desc':
      default:
        return { sortBy: 'createdAt', sortOrder: 'desc' }
    }
  }, [sortSelection])

  const effectiveBatch = isBatchAdmin && userBatchId ? userBatchId : batchFilter

  // Construct query params matching API requirements
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
    }
    const cleanSearch = debouncedSearch?.trim()
    if (cleanSearch) {
      params.search = cleanSearch
    }
    if (effectiveBatch && effectiveBatch !== 'all') {
      params.batch = effectiveBatch
      params.batchId = effectiveBatch
    }
    if (statusFilter && statusFilter !== 'all') {
      params.status = statusFilter
      params.membershipStatus = statusFilter
    }
    if (paymentFilter && paymentFilter !== 'all') {
      params.paymentStatus = paymentFilter
    }
    if (districtFilter && districtFilter !== 'all') {
      params.district = districtFilter
    }
    if (talukFilter && talukFilter !== 'all') {
      params.taluk = talukFilter
      params.thaluk = talukFilter
    }
    if (mandalamFilter && mandalamFilter !== 'all') {
      params.mandalam = mandalamFilter
    }
    if (panchayathFilter && panchayathFilter !== 'all') {
      params.panchayath = panchayathFilter
    }
    if (dateFrom) {
      params.startDate = dateFrom
    }
    if (dateTo) {
      params.endDate = dateTo
    }
    if (sortBy) {
      params.sortBy = sortBy
    }
    if (sortOrder) {
      params.sortOrder = sortOrder
    }
    return params
  }, [
    page,
    limit,
    debouncedSearch,
    effectiveBatch,
    statusFilter,
    paymentFilter,
    districtFilter,
    talukFilter,
    mandalamFilter,
    panchayathFilter,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  ])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['applications', queryParams],
    queryFn: () => applicationsApi.getAll(queryParams),
    placeholderData: (previousData) => previousData,
  })

  const applications = data?.applications || []

  // Merge dynamic locations from backend database + loaded applications + static standard DISTRICTS
  const districtList = useMemo(() => {
    const set = new Set(DISTRICTS)
    if (Array.isArray(locationsData?.districts)) {
      locationsData.districts.forEach((d) => {
        if (d && typeof d === 'string' && d.trim()) set.add(d.trim())
      })
    }
    if (Array.isArray(applications)) {
      applications.forEach((app) => {
        if (app?.district && typeof app.district === 'string' && app.district.trim()) {
          set.add(app.district.trim())
        }
      })
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [locationsData?.districts, applications])

  const talukList = useMemo(() => {
    const set = new Set()
    if (Array.isArray(locationsData?.taluks)) {
      locationsData.taluks.forEach((t) => {
        if (t && typeof t === 'string' && t.trim()) set.add(t.trim())
      })
    }
    if (Array.isArray(applications)) {
      applications.forEach((app) => {
        const val = app?.thaluk || app?.taluk
        if (val && typeof val === 'string' && val.trim()) {
          set.add(val.trim())
        }
      })
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [locationsData?.taluks, applications])

  const mandalamList = useMemo(() => {
    const set = new Set()
    if (Array.isArray(locationsData?.mandalams)) {
      locationsData.mandalams.forEach((m) => {
        if (m && typeof m === 'string' && m.trim()) set.add(m.trim())
      })
    }
    if (Array.isArray(applications)) {
      applications.forEach((app) => {
        if (app?.mandalam && typeof app.mandalam === 'string' && app.mandalam.trim()) {
          set.add(app.mandalam.trim())
        }
      })
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [locationsData?.mandalams, applications])

  const panchayathList = useMemo(() => {
    const set = new Set()
    if (Array.isArray(locationsData?.panchayaths)) {
      locationsData.panchayaths.forEach((p) => {
        if (p && typeof p === 'string' && p.trim()) set.add(p.trim())
      })
    }
    if (Array.isArray(applications)) {
      applications.forEach((app) => {
        if (app?.panchayath && typeof app.panchayath === 'string' && app.panchayath.trim()) {
          set.add(app.panchayath.trim())
        }
      })
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [locationsData?.panchayaths, applications])
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1
  const pagination = data?.pagination ?? {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }

  const approveMutation = useMutation({
    mutationFn: applicationsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Application approved and poster generated!')
      setConfirmAction(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Approval failed.')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: applicationsApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Application rejected.')
      setConfirmAction(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Rejection failed.')
    },
  })

  const markPaidMutation = useMutation({
    mutationFn: applicationsApi.markPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Payment marked as paid.')
      setConfirmAction(null)
    },
    onError: (err) => {
      showApiErrorToast(err, 'Marking paid failed.')
    },
  })

  const undoRejectMutation = useMutation({
    mutationFn: applicationsApi.undoReject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      toast.success('Application restored to pending.')
      setConfirmAction(null)
      setViewApplication((prev) => (prev ? {
        ...prev,
        membershipStatus: 'pending',
        rejectionReason: null,
        rejectedAt: null,
      } : null))
    },
    onError: (err) => {
      showApiErrorToast(err, 'Failed to undo rejection.')
    },
  })

  const handleExportMembersPdf = async () => {
    if (isExportingAll) return
    setIsExportingAll(true)
    const toastId = toast.loading('Generating members PDF report...')
    try {
      const exportParams = {}
      const cleanSearch = debouncedSearch?.trim()
      if (cleanSearch) exportParams.search = cleanSearch
      if (effectiveBatch && effectiveBatch !== 'all') {
        exportParams.batch = effectiveBatch
        exportParams.batchId = effectiveBatch
      }
      if (statusFilter && statusFilter !== 'all') {
        exportParams.status = statusFilter
        exportParams.membershipStatus = statusFilter
      }
      if (paymentFilter && paymentFilter !== 'all') {
        exportParams.paymentStatus = paymentFilter
      }
      if (districtFilter && districtFilter !== 'all') {
        exportParams.district = districtFilter
      }
      if (talukFilter && talukFilter !== 'all') {
        exportParams.taluk = talukFilter
        exportParams.thaluk = talukFilter
      }
      if (mandalamFilter && mandalamFilter !== 'all') {
        exportParams.mandalam = mandalamFilter
      }
      if (panchayathFilter && panchayathFilter !== 'all') {
        exportParams.panchayath = panchayathFilter
      }
      if (dateFrom) exportParams.startDate = dateFrom
      if (dateTo) exportParams.endDate = dateTo
      if (sortBy) exportParams.sortBy = sortBy
      if (sortOrder) exportParams.sortOrder = sortOrder

      const blob = await exportApi.downloadMembersPdf(exportParams)
      const today = new Date().toISOString().split('T')[0]
      const filename = `aalia-members-report-${today}.pdf`
      downloadBlob(blob, filename)
      toast.success('Members PDF report downloaded successfully!', { id: toastId })
    } catch (err) {
      const errorMsg = await extractBlobErrorMessage(err, 'Failed to download members PDF report.')
      toast.error(errorMsg, { id: toastId })
    } finally {
      setIsExportingAll(false)
    }
  }

  const handleExportSingleMember = async (member) => {
    if (exportingMemberId) return
    setExportingMemberId(member.id)
    const toastId = toast.loading(`Generating PDF for ${member.fullName}...`)
    try {
      const blob = await exportApi.downloadMemberPdf(member.id)
      const safeName = (member.membershipId || member.fullName || 'member')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
      const today = new Date().toISOString().split('T')[0]
      const filename = `aalia-member-${safeName}-${today}.pdf`
      downloadBlob(blob, filename)
      toast.success('Member PDF dossier downloaded successfully!', { id: toastId })
    } catch (err) {
      const errorMsg = await extractBlobErrorMessage(err, 'Failed to download member PDF.')
      toast.error(errorMsg, { id: toastId })
    } finally {
      setExportingMemberId(null)
    }
  }

  const hasActiveFilters = Boolean(
    search ||
    (!isBatchAdmin && batchFilter) ||
    statusFilter ||
    paymentFilter ||
    districtFilter ||
    talukFilter ||
    mandalamFilter ||
    panchayathFilter ||
    dateFrom ||
    dateTo ||
    sortSelection !== 'created-desc' ||
    limit !== 10
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (!isBatchAdmin && batchFilter) count++
    if (statusFilter) count++
    if (paymentFilter) count++
    if (districtFilter) count++
    if (talukFilter) count++
    if (mandalamFilter) count++
    if (panchayathFilter) count++
    if (dateFrom || dateTo) count++
    return count
  }, [isBatchAdmin, batchFilter, statusFilter, paymentFilter, districtFilter, talukFilter, mandalamFilter, panchayathFilter, dateFrom, dateTo])

  const draftFilterCount = useMemo(() => {
    let count = 0
    if (!isBatchAdmin && draftFilters.batch) count++
    if (draftFilters.status) count++
    if (draftFilters.payment) count++
    if (draftFilters.district) count++
    if (draftFilters.taluk) count++
    if (draftFilters.mandalam) count++
    if (draftFilters.panchayath) count++
    if (draftFilters.dateFrom || draftFilters.dateTo) count++
    return count
  }, [isBatchAdmin, draftFilters])

  const handleOpenFilterModal = () => {
    setDraftFilters({
      batch: batchFilter,
      status: statusFilter,
      payment: paymentFilter,
      district: districtFilter,
      taluk: talukFilter,
      mandalam: mandalamFilter,
      panchayath: panchayathFilter,
      dateFrom,
      dateTo,
    })
    setIsFilterModalOpen(true)
  }

  const handleApplyFilters = () => {
    setBatchFilter(draftFilters.batch)
    setStatusFilter(draftFilters.status)
    setPaymentFilter(draftFilters.payment)
    setDistrictFilter(draftFilters.district)
    setTalukFilter(draftFilters.taluk)
    setMandalamFilter(draftFilters.mandalam)
    setPanchayathFilter(draftFilters.panchayath)
    setDateFrom(draftFilters.dateFrom)
    setDateTo(draftFilters.dateTo)
    setPage(1)
    setIsFilterModalOpen(false)
  }

  const handleResetDraftFilters = () => {
    setDraftFilters({
      batch: '',
      status: '',
      payment: '',
      district: '',
      taluk: '',
      mandalam: '',
      panchayath: '',
      dateFrom: '',
      dateTo: '',
    })
  }

  const handleResetFilters = () => {
    setSearch('')
    if (!isBatchAdmin) setBatchFilter('')
    setStatusFilter('')
    setPaymentFilter('')
    setDistrictFilter('')
    setTalukFilter('')
    setMandalamFilter('')
    setPanchayathFilter('')
    setDateFrom('')
    setDateTo('')
    setDraftFilters({
      batch: '',
      status: '',
      payment: '',
      district: '',
      taluk: '',
      mandalam: '',
      panchayath: '',
      dateFrom: '',
      dateTo: '',
    })
    setSortSelection('created-desc')
    setLimit(10)
    setPage(1)
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Name',
      minWidth: '220px',
      render: (val, row) => (
        <div className="flex items-center gap-3 min-w-max">
          <Avatar name={row.fullName} src={row.profilePhoto} size="sm" className="shrink-0" />
          <span className="font-medium text-[var(--text-primary)] whitespace-nowrap">{row.fullName}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      minWidth: '140px',
      render: (val) => (
        <span className="text-[var(--text-secondary)] whitespace-nowrap font-medium">{formatPhone(val)}</span>
      ),
    },
    {
      key: 'bloodGroup',
      label: 'Blood Group',
      minWidth: '110px',
      render: (val, row) => (
        <span className="text-[var(--text-secondary)] font-medium whitespace-nowrap">{row.bloodGroup || '—'}</span>
      ),
    },
    {
      key: 'batchName',
      label: 'Batch',
      minWidth: '130px',
      render: (val) => (
        <span className="text-[var(--text-secondary)] text-xs font-medium whitespace-nowrap">{val}</span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      minWidth: '140px',
      render: (val) => <Badge variant={val} />,
    },
    {
      key: 'membershipStatus',
      label: 'Membership Status',
      minWidth: '170px',
      render: (val, row) => (
        <div className="flex items-center gap-1.5 flex-wrap min-w-max">
          <Badge variant={val} />
          {row.membershipStatus === 'rejected' && row.rejectionReason && (
            <span
              className="text-[10px] text-error font-medium px-1.5 py-0.5 rounded bg-error/10 border border-error/20 max-w-[140px] truncate"
              title={`Rejection Reason: ${row.rejectionReason}`}
            >
              {row.rejectionReason}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      minWidth: '160px',
      width: '160px',
      render: (_, row) => {
        const canEdit = !isBatchAdmin || !userBatchId || String(row.batchId) === String(userBatchId)
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="xs"
              icon={Eye}
              onClick={(e) => { e.stopPropagation(); setViewApplication(row) }}
              title="View Details"
            />
            <Button
              variant="ghost"
              size="xs"
              icon={FileDown}
              loading={exportingMemberId === row.id}
              disabled={!!exportingMemberId}
              onClick={(e) => {
                e.stopPropagation()
                handleExportSingleMember(row)
              }}
              title="Download Member PDF Dossier"
              className="text-slate-600 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-primary-950/30"
            />
            {canEdit && (
              <Button
                variant="ghost"
                size="xs"
                icon={Edit3}
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/edit-application/${row.id}`)
                }}
                title="Edit Application Details"
                className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-950/30"
              />
            )}
          {row.paymentStatus === 'pending' && row.membershipStatus !== 'rejected' && (
            <Button
              variant="ghost"
              size="xs"
              icon={CreditCard}
              onClick={(e) => {
                e.stopPropagation()
                setConfirmAction({ type: 'pay', member: row })
              }}
              title="Mark Paid"
            />
          )}
          {row.membershipStatus === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="xs"
                icon={CheckCircle2}
                disabled={row.paymentStatus !== 'paid'}
                className={cn(
                  'text-success hover:text-success',
                  row.paymentStatus !== 'paid' && 'opacity-30 cursor-not-allowed hover:bg-transparent text-[var(--text-tertiary)] hover:text-[var(--text-tertiary)]'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  if (row.paymentStatus !== 'paid') return
                  setConfirmAction({ type: 'approve', member: row })
                }}
                title={row.paymentStatus === 'paid' ? 'Approve' : 'Payment must be marked as paid before approval'}
              />
              <Button
                variant="ghost"
                size="xs"
                icon={XCircle}
                className="text-error hover:text-error"
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmAction({ type: 'reject', member: row })
                }}
                title="Reject"
              />
            </>
          )}
          {row.membershipStatus === 'rejected' && (
            <Button
              variant="ghost"
              size="xs"
              icon={RotateCcw}
              className="text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 dark:hover:text-amber-300"
              onClick={(e) => {
                e.stopPropagation()
                setConfirmAction({ type: 'undo-reject', member: row })
              }}
              title="Undo Rejection (Restore to Pending)"
            />
          )}
          </div>
        )
      },
    },
  ]

  if (isLoading && !data) return <PageLoader />

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-display">
            Membership Applications
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all incoming applications and approval states
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-card)] px-3 py-2 rounded-xl border border-[var(--border-color)] shadow-sm">
            <Users className="w-3.5 h-3.5 text-primary-500" />
            <span>
              Showing <strong className="text-[var(--text-primary)]">{applications.length}</strong> of{' '}
              <strong className="text-[var(--text-primary)]">{total}</strong> applications
            </span>
          </div>

          <Button
            variant="primary"
            icon={FileDown}
            loading={isExportingAll}
            disabled={isExportingAll}
            onClick={handleExportMembersPdf}
            className="shadow-sm font-semibold"
            title="Download PDF report matching active filters"
          >
            Download Members PDF
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Primary Search Input with full flexible space */}
            <div className="flex-1 min-w-0">
              <Input
                icon={Search}
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Sort Dropdown */}
              <div className="w-36 sm:w-44 flex-shrink-0">
                <Select
                  icon={ArrowUpDown}
                  placeholder="Sort by"
                  options={[
                    { value: 'created-desc', label: 'Newest First' },
                    { value: 'created-asc', label: 'Oldest First' },
                    { value: 'name-asc', label: 'Name (A to Z)' },
                    { value: 'name-desc', label: 'Name (Z to A)' },
                  ]}
                  value={sortSelection}
                  onChange={(e) => {
                    setSortSelection(e.target.value)
                    setPage(1)
                  }}
                />
              </div>

              {/* All Filters Modal Button */}
              <button
                type="button"
                onClick={handleOpenFilterModal}
                className={cn(
                  'h-10 px-3 sm:px-3.5 rounded-xl border font-medium text-sm inline-flex items-center gap-2 transition-all select-none cursor-pointer',
                  activeFilterCount > 0
                    ? 'border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold shadow-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                )}
                title="Open filters modal"
              >
                <Filter className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 text-[11px] font-bold rounded-full bg-primary-600 text-white flex items-center justify-center leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Quick Clear All Button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleResetFilters}
                  className="text-xs text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400 px-2"
                  title="Reset search and all filters"
                >
                  <span className="hidden md:inline">Reset</span>
                </Button>
              )}
            </div>
          </div>

          {/* Active Filter Pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-[var(--border-color)] text-xs">
              <span className="text-[var(--text-tertiary)] font-medium mr-1">Active:</span>

              {batchFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Batch: {batches.find((b) => b.id === batchFilter)?.name || batchFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setBatchFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {paymentFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Payment: {paymentFilter.charAt(0).toUpperCase() + paymentFilter.slice(1)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {districtFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>District: {districtFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDistrictFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {talukFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Taluk: {talukFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setTalukFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {mandalamFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Mandalam: {mandalamFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMandalamFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {panchayathFilter && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Panchayath: {panchayathFilter}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setPanchayathFilter('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(dateFrom || dateTo) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  <span>Date: {dateFrom || '...'} to {dateTo || '...'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDateFrom('')
                      setDateTo('')
                      setPage(1)
                    }}
                    className="hover:text-primary-900 dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  if (!isBatchAdmin) setBatchFilter('')
                  setStatusFilter('')
                  setPaymentFilter('')
                  setDistrictFilter('')
                  setTalukFilter('')
                  setMandalamFilter('')
                  setPanchayathFilter('')
                  setDateFrom('')
                  setDateTo('')
                  setPage(1)
                }}
                className="text-[var(--text-tertiary)] hover:text-primary-600 dark:hover:text-primary-400 font-medium ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div
          className={cn(
            'transition-opacity duration-150',
            isFetching && !isLoading && 'opacity-60 pointer-events-none'
          )}
        >
          <DataTable
            columns={columns}
            data={applications}
            minWidth="1000px"
            emptyMessage="No applications found matching your selected filters"
            emptyIcon={Users}
          />
        </div>

        {total > 0 && (
          <Pagination
            page={page}
            limit={limit}
            total={total}
            totalPages={totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
            limitOptions={[10, 20, 50, 100]}
            isLoading={isFetching && !isLoading}
          />
        )}
      </Card>

      {/* Reject Reason Modal */}
      <RejectReasonModal
        isOpen={confirmAction?.type === 'reject'}
        onClose={() => setConfirmAction(null)}
        member={confirmAction?.member}
        loading={rejectMutation.isPending}
        onConfirm={({ id, reason }) => {
          rejectMutation.mutate({ id, reason })
        }}
      />

      {/* Confirm Modal for Approve / Mark Paid / Undo Reject */}
      <ConfirmModal
        isOpen={!!confirmAction && confirmAction.type !== 'reject'}
        onClose={() => setConfirmAction(null)}
        size={confirmAction?.type === 'pay' ? 'md' : 'sm'}
        title={
          confirmAction?.type === 'approve'
            ? 'Approve Application'
            : confirmAction?.type === 'undo-reject'
            ? 'Undo Rejection'
            : 'Mark as Paid'
        }
        message={
          confirmAction?.type === 'approve'
            ? `Are you sure you want to approve ${confirmAction?.member?.fullName}? This will generate their member poster.`
            : confirmAction?.type === 'undo-reject'
            ? `Are you sure you want to undo the rejection for ${confirmAction?.member?.fullName}? This will restore their application back to pending status.`
            : `Mark payment as received for ${confirmAction?.member?.fullName}?`
        }
        confirmText={
          confirmAction?.type === 'approve'
            ? 'Approve'
            : confirmAction?.type === 'undo-reject'
            ? 'Undo Rejection'
            : 'Mark Paid'
        }
        variant={confirmAction?.type === 'approve' ? 'success' : 'primary'}
        loading={
          approveMutation.isPending ||
          markPaidMutation.isPending ||
          undoRejectMutation.isPending
        }
        onConfirm={() => {
          if (confirmAction?.type === 'approve') approveMutation.mutate(confirmAction.member.id)
          if (confirmAction?.type === 'pay') markPaidMutation.mutate(confirmAction.member.id)
          if (confirmAction?.type === 'undo-reject') undoRejectMutation.mutate(confirmAction.member.id)
        }}
      >
        {confirmAction?.type === 'pay' && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-[11px]">
                Uploaded Payment Proof
              </span>
              {(confirmAction?.member?.paymentScreenshot || confirmAction?.member?.paymentProof) && (
                <a
                  href={confirmAction?.member?.paymentScreenshot || confirmAction?.member?.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Full Image</span>
                </a>
              )}
            </div>

            {confirmAction?.member?.paymentScreenshot || confirmAction?.member?.paymentProof ? (
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)]/50 p-2.5 flex items-center justify-center overflow-hidden">
                <a
                  href={confirmAction?.member?.paymentScreenshot || confirmAction?.member?.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block max-h-64 overflow-hidden rounded-lg cursor-pointer"
                  title="Click to view full image in a new tab"
                >
                  <img
                    src={confirmAction?.member?.paymentScreenshot || confirmAction?.member?.paymentProof}
                    alt="Payment Screenshot"
                    className="max-h-64 w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.02] bg-white dark:bg-slate-900"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg text-white text-xs font-medium gap-1.5 backdrop-blur-[1px]">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Full Size</span>
                  </div>
                </a>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-[var(--border-color)] bg-[var(--bg-tertiary)]/30 text-center">
                <Receipt className="w-6 h-6 text-[var(--text-tertiary)]/60 mx-auto mb-1.5" />
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  No payment screenshot uploaded
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                  The applicant did not attach a transaction screenshot during registration.
                </p>
              </div>
            )}
          </div>
        )}
      </ConfirmModal>

      {/* View Details Modal */}
      <Modal
        isOpen={!!viewApplication}
        onClose={() => setViewApplication(null)}
        title="Application Details"
        size="lg"
      >
        {viewApplication && (
          <div className="space-y-5">
            {/* Header with Photo */}
            <div className="flex items-center gap-4 p-3 bg-[var(--bg-tertiary)]/60 rounded-xl border border-[var(--border-color)]">
              <Avatar name={viewApplication.fullName} src={viewApplication.profilePhoto} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--text-primary)] font-display text-lg truncate">
                  {viewApplication.fullName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">{viewApplication.batchName}</p>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  <Badge variant={viewApplication.membershipStatus} />
                  <Badge variant={viewApplication.paymentStatus} />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  icon={FileDown}
                  loading={exportingMemberId === viewApplication.id}
                  disabled={!!exportingMemberId}
                  onClick={() => handleExportSingleMember(viewApplication)}
                  title="Download Member PDF Dossier"
                >
                  Download PDF
                </Button>
                {(!isBatchAdmin || !userBatchId || String(viewApplication.batchId) === String(userBatchId)) && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit3}
                    onClick={() => {
                      setViewApplication(null)
                      navigate(`/edit-application/${viewApplication.id}`)
                    }}
                  >
                    Edit Application
                  </Button>
                )}
              </div>
            </div>

            {/* Rejection Details Banner if Rejected */}
            {viewApplication.membershipStatus === 'rejected' && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-error font-semibold text-xs uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5" />
                    Application Rejected
                  </span>
                  {viewApplication.rejectedAt && (
                    <span className="text-[var(--text-tertiary)] font-normal text-[11px] lowercase first-letter:uppercase">
                      {formatDate(viewApplication.rejectedAt)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-primary)]">
                  <span className="text-[var(--text-tertiary)] font-medium">Reason: </span>
                  <span className="font-medium text-error">{viewApplication.rejectionReason || 'No specific reason provided'}</span>
                </p>
                <div className="pt-1 flex items-center justify-end">
                  <Button
                    variant="outline"
                    size="xs"
                    icon={RotateCcw}
                    className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    onClick={() => {
                      setConfirmAction({ type: 'undo-reject', member: viewApplication })
                    }}
                  >
                    Undo Rejection
                  </Button>
                </div>
              </div>
            )}

            {/* Personal & Contact Grid */}
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Personal & Academic Info
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Father's Name</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.fatherName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Date of Birth</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.dob ? formatDate(viewApplication.dob) : '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Blood Group</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.bloodGroup || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Job Type / Profession</span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {viewApplication.jobType === 'Others' && viewApplication.jobTypeOther
                        ? `Other (${viewApplication.jobTypeOther})`
                        : viewApplication.jobType || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Batch</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.batchName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">ANWARI Certificate No.</span>
                    <span className="font-semibold text-primary-600 dark:text-primary-400 font-mono">
                      {viewApplication.anwariCertificateNo || '—'}
                    </span>
                  </div>
                  {viewApplication.membershipId && (
                    <div>
                      <span className="text-[var(--text-tertiary)] block">Membership ID</span>
                      <span className="font-bold text-success">{viewApplication.membershipId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Contact Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Mobile (Mob)</span>
                    <span className="font-medium text-[var(--text-primary)]">{formatPhone(viewApplication.phone)}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">WhatsApp</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.whatsapp ? formatPhone(viewApplication.whatsapp) : '—'}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[var(--text-tertiary)] block">Email</span>
                    <span className="font-medium text-[var(--text-primary)] break-all">{viewApplication.email || '—'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Address & Local Body
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div>
                    <span className="text-[var(--text-tertiary)] block">House Name</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.houseName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Place</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.place || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Post Office</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.post || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">PIN Code</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.pin || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Panchayath</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.panchayath || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Mandalam</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.mandalam || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">Thalukk (Taluk)</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.thaluk || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">District</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.district || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-tertiary)] block">State</span>
                    <span className="font-medium text-[var(--text-primary)]">{viewApplication.state || 'Kerala'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Proof / Screenshot */}
              {(viewApplication.paymentScreenshot || viewApplication.paymentProof) && (
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                    Payment Proof / Screenshot
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3 items-center bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                    <a
                      href={viewApplication.paymentScreenshot || viewApplication.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <img
                        src={viewApplication.paymentScreenshot || viewApplication.paymentProof}
                        alt="Payment Screenshot"
                        className="h-24 w-auto max-w-[160px] rounded-lg border border-[var(--border-color)] bg-white dark:bg-slate-900 object-contain p-1 shadow-sm hover:opacity-90 transition-opacity"
                      />
                    </a>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs text-[var(--text-primary)] font-medium">
                        Payment receipt / transaction screenshot submitted by applicant.
                      </p>
                      <a
                        href={viewApplication.paymentScreenshot || viewApplication.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                      >
                        Open Full Image &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Declaration & Signature */}
              <div>
                <h4 className="font-semibold text-[var(--text-primary)] mb-2 uppercase tracking-wider text-[11px] text-primary-600 dark:text-primary-400">
                  Declaration & Signature
                </h4>
                <div className="flex flex-col sm:flex-row gap-3 items-start bg-[var(--bg-tertiary)]/30 p-3 rounded-xl border border-[var(--border-color)]">
                  <div className="flex-1 space-y-1">
                    <p className="text-[var(--text-secondary)] italic">
                      "I accept and agree to be bound by the bylaw of AALIA and Anvariyya."
                    </p>
                    <p className="text-[var(--text-tertiary)]">
                      Declaration Date:{' '}
                      <span className="font-medium text-[var(--text-primary)]">
                        {viewApplication.declarationDate ? formatDate(viewApplication.declarationDate) : formatDate(viewApplication.registeredAt)}
                      </span>
                    </p>
                  </div>
                  {viewApplication.signature && (
                    <div className="flex-shrink-0">
                      <span className="text-[var(--text-tertiary)] block mb-1">Signature:</span>
                      <img
                        src={viewApplication.signature}
                        alt="Member Signature"
                        className="h-12 w-auto max-w-[140px] rounded border border-[var(--border-color)] bg-white dark:bg-slate-900 object-contain p-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filters Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Applications"
        size="xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {!isBatchAdmin && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                  Batch
                </label>
                <Select
                  placeholder="All Batches"
                  options={batches.map((b) => ({ value: b.id, label: b.name }))}
                  value={draftFilters.batch}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, batch: e.target.value }))}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Membership Status
              </label>
              <Select
                placeholder="All Status"
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' },
                ]}
                value={draftFilters.status}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, status: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Payment Status
              </label>
              <Select
                placeholder="All Payment"
                options={[
                  { value: 'paid', label: 'Paid' },
                  { value: 'pending', label: 'Pending' },
                ]}
                value={draftFilters.payment}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, payment: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                District
              </label>
              <Select
                placeholder="All Districts"
                options={districtList.map((d) => ({ value: d, label: d }))}
                value={draftFilters.district}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, district: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Taluk
              </label>
              <Select
                placeholder="All Taluks"
                options={talukList.map((t) => ({ value: t, label: t }))}
                value={draftFilters.taluk}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, taluk: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Mandalam
              </label>
              <Select
                placeholder="All Mandalams"
                options={mandalamList.map((m) => ({ value: m, label: m }))}
                value={draftFilters.mandalam}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, mandalam: e.target.value }))}
              />
            </div>

            <div className={!isBatchAdmin ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Panchayath
              </label>
              <Select
                placeholder="All Panchayaths"
                options={panchayathList.map((p) => ({ value: p, label: p }))}
                value={draftFilters.panchayath}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, panchayath: e.target.value }))}
              />
            </div>
          </div>

          {/* Registration Date Range */}
          <div className="pt-3 border-t border-[var(--border-color)]">
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
              Registration Date Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <span className="block text-[11px] text-[var(--text-tertiary)] mb-1">From Date</span>
                <input
                  type="date"
                  aria-label="Registration Start Date"
                  value={draftFilters.dateFrom}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div>
                <span className="block text-[11px] text-[var(--text-tertiary)] mb-1">To Date</span>
                <input
                  type="date"
                  aria-label="Registration End Date"
                  value={draftFilters.dateTo}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                  className="w-full h-10 px-3 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetDraftFilters}
              disabled={draftFilterCount === 0}
              className="text-xs text-[var(--text-secondary)] hover:text-error"
            >
              Reset All
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFilterModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApplyFilters}
              >
                Apply Filters {draftFilterCount > 0 && `(${draftFilterCount})`}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
