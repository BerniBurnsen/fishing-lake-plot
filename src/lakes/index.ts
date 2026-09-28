import type { LakeDefinition } from '@/types'
import { ossiacherSee } from './ossiacher-see'
import { woerthersee } from './woerthersee'

/** Register new lakes here. The first entry is the default. */
export const lakes: readonly LakeDefinition[] = [ossiacherSee, woerthersee]

export const defaultLake: LakeDefinition = lakes[0]!

export function findLake(id: string | null | undefined): LakeDefinition {
  return lakes.find((l) => l.id === id) ?? defaultLake
}
