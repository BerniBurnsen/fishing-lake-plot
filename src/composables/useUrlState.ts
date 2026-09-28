import { computed, ref, watch } from 'vue'
import type { ColorMode } from '@/types'
import { findLake } from '@/lakes'

/**
 * Whole app state lives in the URL so a view can be bookmarked/shared:
 *   ?lake=ossiacher-see&owner=verein-ossiach,revier-nord&mode=mine
 */
export function useUrlState() {
  const params = new URLSearchParams(window.location.search)

  const lakeId = ref(params.get('lake') ?? findLake(null).id)
  const ownerIds = ref<string[]>(splitList(params.get('owner')))
  const mode = ref<ColorMode>(params.get('mode') === 'all' ? 'all' : 'mine')

  const lake = computed(() => findLake(lakeId.value))

  /** Owner ids that actually exist for the current lake. Unknown ids are ignored. */
  const validOwnerIds = computed(() =>
    ownerIds.value.filter((id) => lake.value.owners.some((o) => o.id === id)),
  )

  function toggleOwner(id: string) {
    ownerIds.value = ownerIds.value.includes(id)
      ? ownerIds.value.filter((o) => o !== id)
      : [...ownerIds.value, id]
  }

  watch([lakeId, ownerIds, mode], () => {
    const next = new URLSearchParams()
    next.set('lake', lakeId.value)
    if (ownerIds.value.length) next.set('owner', ownerIds.value.join(','))
    next.set('mode', mode.value)
    window.history.replaceState(null, '', `${window.location.pathname}?${next}`)
  })

  return { lakeId, lake, ownerIds, validOwnerIds, mode, toggleOwner }
}

function splitList(value: string | null): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
