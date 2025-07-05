"use client"

import { useEffect, useState } from "react"
import { composeRenderProps } from "react-aria-components"
import { type ClassNameValue, twMerge } from "tailwind-merge"

function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tailwind: ClassNameValue,
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tailwind, className))
}

export { composeTailwindRenderProps }

export const useMediaQuery = (query: string) => {
  const [value, setValue] = useState(false)

  useEffect(() => {
    const onChange = (event: MediaQueryListEvent) => {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}
