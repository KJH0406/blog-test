import { cx } from 'class-variance-authority'
import type { ClassValue } from 'class-variance-authority/dist/types'
import { twMerge } from 'tailwind-merge'

export * from 'class-variance-authority'

export type { ClassValue }

export const cn = (...args: ClassValue[]) => twMerge(cx(args))
