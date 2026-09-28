import { computed, ref, watch } from 'vue'
import type { ColorMode, LakeDefinition } from '@/types'
import { findLake } from '@/lakes'

/**
 * Whole app state lives in the URL so a view can be bookmarked/shared:
 *   ?lake=ossiacher-see&owner=fischereiverein-ossiach,revier-nord&mode=mine
 */
export function useUrlState() {
  const params = new URLSearchParams(window.location.search)

  const lakeId = ref(params.get('lake') ?? findLake(null).id)
  const mode = ref<ColorMode>(params.get('mode') === 'all' ? 'all' : 'mine')
  const lake = computed(() => findLake(lakeId.value))

  // Owner ids unknown to the lake (renamed, typo, other lake) are dropped right away so they
  // never linger in the state or get written back to the URL.
  const ownerIds = ref<string[]>(knownOwners(splitList(params.get('owner')), lake.value))

  watch(lake, (l) => {
    ownerIds.value = knownOwners(ownerIds.value, l)
  })

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

  return { lakeId, lake, ownerIds, mode, toggleOwner }
}

function knownOwners(ids: string[], lake: LakeDefinition): string[] {
  return ids.filter((id) => lake.owners.some((o) => o.id === id))
}

function splitList(value: string | null): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
