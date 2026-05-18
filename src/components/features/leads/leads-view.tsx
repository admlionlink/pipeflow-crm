'use client'

import { useState, useMemo, useTransition, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Plus, Search, Filter, MoreHorizontal, Eye, Pencil, Trash2,
  ArrowUpDown, ChevronUp, ChevronDown, Users, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { LeadStatusBadge } from './lead-status-badge'
import { LeadFormDialog } from './lead-form-dialog'
import { LeadDeleteDialog } from './lead-delete-dialog'
import { createLead, updateLead, deleteLead } from '@/server/leads'
import { type Lead, type LeadStatus, LEAD_STATUS_OPTIONS } from '@/types/lead'
import { type LeadInput } from '@/lib/validations/lead'

const ITEMS_PER_PAGE = 8

type SortField = 'name' | 'company' | 'status' | 'createdAt'
type SortOrder = 'asc' | 'desc'

interface LeadsViewProps {
  workspaceSlug: string
  workspaceId: string
  initialLeads: Lead[]
  total: number
  page: number
  search: string
  statusFilter: LeadStatus[]
}

export function LeadsView({
  workspaceSlug, workspaceId, initialLeads, total, page, search, statusFilter,
}: LeadsViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // Dados locais — sincronizados com props do servidor
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  useEffect(() => setLeads(initialLeads), [initialLeads])

  // Estado de UI
  const [localSearch, setLocalSearch] = useState(search)
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)

  // Ordenação client-side sobre a página atual (servidor já filtrou e paginou)
  const sorted = useMemo(() => {
    const copy = [...leads]
    copy.sort((a, b) => {
      const va = (a[sortField] ?? '') as string
      const vb = (b[sortField] ?? '') as string
      return sortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
    return copy
  }, [leads, sortField, sortOrder])

  function buildParams(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    const s = overrides.search ?? search
    const st = overrides.status ?? (statusFilter.length ? statusFilter.join(',') : undefined)
    const pg = overrides.page ?? '1'
    if (s) p.set('search', s)
    if (st) p.set('status', st)
    if (pg !== '1') p.set('page', pg)
    return p.toString()
  }

  function handleSearch(value: string) {
    setLocalSearch(value)
    const qs = buildParams({ search: value, page: '1' })
    startTransition(() => router.push(`${pathname}${qs ? '?' + qs : ''}`))
  }

  function toggleStatusFilter(status: LeadStatus) {
    const next = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status]
    const qs = buildParams({ status: next.join(',') || undefined, page: '1' })
    startTransition(() => router.push(`${pathname}${qs ? '?' + qs : ''}`))
  }

  function clearFilters() {
    setLocalSearch('')
    startTransition(() => router.push(pathname))
  }

  function goToPage(p: number) {
    const qs = buildParams({ page: String(p) })
    startTransition(() => router.push(`${pathname}${qs ? '?' + qs : ''}`))
  }

  function handleSort(field: SortField) {
    if (sortField === field) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortOrder('asc') }
  }

  // ── Mutations ─────────────────────────────────────────────────

  async function handleCreate(data: LeadInput) {
    const result = await createLead(workspaceId, data)
    if (result.error) { toast.error(result.error); return }
    toast.success('Lead criado com sucesso!')
    setFormOpen(false)
    startTransition(() => router.refresh())
  }

  async function handleEdit(data: LeadInput) {
    if (!editingLead) return
    // Optimistic update
    setLeads((prev) => prev.map((l) => l.id === editingLead.id ? { ...l, ...data, role: data.role } : l))
    setFormOpen(false)
    setEditingLead(null)
    const result = await updateLead(workspaceId, editingLead.id, data)
    if (result.error) {
      toast.error(result.error)
      startTransition(() => router.refresh()) // rollback
    } else {
      toast.success('Lead atualizado com sucesso!')
    }
  }

  async function handleDelete() {
    if (!deletingLead) return
    // Optimistic update
    setLeads((prev) => prev.filter((l) => l.id !== deletingLead.id))
    setDeleteOpen(false)
    const leadName = deletingLead.name
    setDeletingLead(null)
    const result = await deleteLead(workspaceId, deletingLead.id)
    if (result.error) {
      toast.error(result.error)
      startTransition(() => router.refresh()) // rollback
    } else {
      toast.success(`Lead "${leadName}" excluído.`)
    }
  }

  function openEdit(lead: Lead) { setEditingLead(lead); setFormOpen(true) }
  function openDelete(lead: Lead) { setDeletingLead(lead); setDeleteOpen(true) }

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE))
  const hasActiveFilters = search.trim() !== '' || statusFilter.length > 0

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ArrowUpDown className="ml-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
    return sortOrder === 'asc'
      ? <ChevronUp className="ml-1 h-3.5 w-3.5 shrink-0 text-primary" />
      : <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 text-primary" />
  }

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {total} lead{total !== 1 ? 's' : ''} cadastrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => { setEditingLead(null); setFormOpen(true) }}>
          <Plus className="h-4 w-4" />
          Novo lead
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1" style={{ minWidth: '200px', maxWidth: '360px' }}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, empresa ou e-mail…"
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
            disabled={isPending}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={statusFilter.length > 0 ? 'border-primary text-primary' : ''}
            >
              <Filter className="h-4 w-4" />
              Status
              {statusFilter.length > 0 && (
                <Badge className="ml-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]">
                  {statusFilter.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LEAD_STATUS_OPTIONS.map((opt) => (
              <DropdownMenuCheckboxItem
                key={opt.value}
                checked={statusFilter.includes(opt.value)}
                onCheckedChange={() => toggleStatusFilter(opt.value)}
              >
                {opt.label}
              </DropdownMenuCheckboxItem>
            ))}
            {statusFilter.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters}>
                  <X className="h-3.5 w-3.5 mr-2" />
                  Limpar filtros
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <p className="text-xs text-muted-foreground">
            {total} resultado{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Tabela ou empty state */}
      {sorted.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters} />
      ) : (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="border-b border-border">
                {(['name', 'company'] as SortField[]).map((field, i) => (
                  <th
                    key={field}
                    className={`px-4 py-3 text-left font-medium text-muted-foreground${i === 1 ? ' hidden md:table-cell' : ''}`}
                  >
                    <button onClick={() => handleSort(field)} className="flex items-center hover:text-foreground transition-colors">
                      {field === 'name' ? 'Nome' : 'Empresa'}
                      <SortIcon field={field} />
                    </button>
                  </th>
                ))}
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">E-mail</th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground xl:table-cell">Telefone</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  <button onClick={() => handleSort('status')} className="flex items-center hover:text-foreground transition-colors">
                    Status <SortIcon field="status" />
                  </button>
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground xl:table-cell">Responsável</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link href={`/${workspaceSlug}/leads/${lead.id}`} className="group flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                          {lead.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium transition-colors group-hover:text-primary">{lead.name}</p>
                        <p className="truncate text-xs text-muted-foreground md:hidden">{lead.company}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{lead.company}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{lead.email}</td>
                  <td className="hidden px-4 py-3 text-muted-foreground xl:table-cell">{lead.phone}</td>
                  <td className="px-4 py-3"><LeadStatusBadge status={lead.status} /></td>
                  <td className="hidden px-4 py-3 xl:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px]">
                          {lead.ownerName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">{lead.ownerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ações do lead</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/${workspaceSlug}/leads/${lead.id}`}>
                            <Eye className="mr-2 h-4 w-4" />Ver detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(lead)}>
                          <Pencil className="mr-2 h-4 w-4" />Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openDelete(lead)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação server-side */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, total)} de {total} leads
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => goToPage(page - 1)} disabled={page === 1 || isPending}>
              Anterior
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(p)}
                disabled={isPending}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => goToPage(page + 1)} disabled={page === totalPages || isPending}>
              Próximo
            </Button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <LeadFormDialog
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingLead(null) }}
        lead={editingLead ?? undefined}
        onSubmit={editingLead ? handleEdit : handleCreate}
      />
      <LeadDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        lead={deletingLead}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">
        {hasFilters ? 'Nenhum lead encontrado' : 'Nenhum lead ainda'}
      </h3>
      <p className="max-w-xs text-sm text-muted-foreground">
        {hasFilters
          ? 'Tente ajustar a busca ou os filtros para encontrar o que procura.'
          : 'Comece adicionando seu primeiro lead e acompanhe suas negociações.'}
      </p>
    </div>
  )
}
