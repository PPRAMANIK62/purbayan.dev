import { useEffect } from "react"

const SITE_NAME = "Purbayan Pramanik"
interface PageMeta {
  title?: string
  description?: string
}

export function usePageMeta({ title, description }: PageMeta = {}): void {
  useEffect(() => {
    const prevTitle = document.title
    const descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDescription = descriptionTag?.getAttribute("content") ?? ""

    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME

    if (descriptionTag && description) {
      descriptionTag.setAttribute("content", description)
    }

    return () => {
      document.title = prevTitle
      if (descriptionTag) {
        descriptionTag.setAttribute("content", prevDescription)
      }
    }
  }, [title, description])
}
