import React, { useEffect } from 'react'
import { getCurrentLanguage } from '@/lib/i18n-simple'

type SeoProps = {
  title: string
  description: string
  imageUrl?: string
  canonicalPath?: string
  productSlug?: string
  productPrice?: string
  productBrand?: string
  productCategory?: string
  productAvailability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  isProduct?: boolean
}

function upsertMeta(property: string, content: string, attr: 'name' | 'property' = 'name') {
  if (!content) return
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}='${property}']`)
  if (!tag) {
    tag = document.createElement('meta') as HTMLMetaElement
    tag.setAttribute(attr, property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  if (!href) return
  let selector = `link[rel='${rel}']`
  if (hreflang) selector += `[hreflang='${hreflang}']`
  let link = document.head.querySelector<HTMLLinkElement>(selector)
  if (!link) {
    link = document.createElement('link') as HTMLLinkElement
    link.setAttribute('rel', rel)
    if (hreflang) link.setAttribute('hreflang', hreflang)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function ensureAbsolute(url: string | undefined, baseUrl: string): string | undefined {
  if (!url) return undefined
  try {
    if (url.startsWith('http')) return url
    return new URL(url, baseUrl).toString()
  } catch {
    return undefined
  }
}

function getAlternateSlug(slug: string, lang: 'en' | 'es'): string {
  if (!slug) return slug
  if (lang === 'es') {
    return slug.endsWith('-esp') ? slug : `${slug}-esp`
  } else {
    return slug.endsWith('-esp') ? slug.slice(0, -4) : slug
  }
}

export const Seo: React.FC<SeoProps> = ({ 
  title, 
  description, 
  imageUrl, 
  canonicalPath = '', 
  productSlug,
  productPrice,
  productBrand = 'American Chassis Depot',
  productCategory = 'Container Chassis',
  productAvailability = 'InStock',
  isProduct = false
}) => {
  useEffect(() => {
    const lang = getCurrentLanguage()
    const baseUrl = (import.meta as any)?.env?.VITE_SITE_URL || window.location.origin
    const path = canonicalPath || window.location.pathname
    const canonical = new URL(path, baseUrl).toString()
    const absImage = ensureAbsolute(imageUrl || '/assets/og-image.jpg', baseUrl)

    // Basic meta tags
    document.title = title
    upsertMeta('description', description)
    upsertMeta('robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
    upsertMeta('theme-color', '#0A3161')
    upsertMeta('author', 'American Chassis Depot')
    upsertMeta('keywords', lang === 'es' 
      ? 'chasis de contenedores, chasis 20ft, chasis 40ft, chasis extensibles, chasis triaxial, chasis gooseneck, equipos de transporte, chasis intermodal, chasis de envío, distribuidor de chasis'
      : 'container chassis, 20ft chassis, 40ft chassis, extendable chassis, triaxle chassis, gooseneck chassis, transportation equipment, intermodal chassis, shipping chassis, chassis dealer'
    )

    // Canonical and alternate links
    upsertLink('canonical', canonical)
    const altEnPath = productSlug ? `/en/products/${getAlternateSlug(productSlug, 'en')}` : '/en'
    const altEsPath = productSlug ? `/es/products/${getAlternateSlug(productSlug, 'es')}` : '/es'
    upsertLink('alternate', new URL(altEnPath, baseUrl).toString(), 'en')
    upsertLink('alternate', new URL(altEsPath, baseUrl).toString(), 'es')
    upsertLink('alternate', new URL(altEnPath, baseUrl).toString(), 'x-default')

    // Enhanced Open Graph tags
    upsertMeta('og:type', isProduct ? 'product' : 'website', 'property')
    upsertMeta('og:site_name', 'American Chassis Depot', 'property')
    upsertMeta('og:locale', lang === 'es' ? 'es_US' : 'en_US', 'property')
    upsertMeta('og:title', title, 'property')
    upsertMeta('og:description', description, 'property')
    upsertMeta('og:url', canonical, 'property')
    if (absImage) {
      upsertMeta('og:image', absImage, 'property')
      upsertMeta('og:image:width', '1200', 'property')
      upsertMeta('og:image:height', '630', 'property')
      upsertMeta('og:image:type', 'image/jpeg', 'property')
      upsertMeta('og:image:alt', title, 'property')
    }

    // Product-specific Open Graph tags
    if (isProduct) {
      upsertMeta('og:product:availability', productAvailability, 'property')
      if (productPrice) {
        upsertMeta('og:product:price:amount', productPrice, 'property')
        upsertMeta('og:product:price:currency', 'USD', 'property')
      }
      if (productBrand) {
        upsertMeta('og:product:brand', productBrand, 'property')
      }
      if (productCategory) {
        upsertMeta('og:product:category', productCategory, 'property')
      }
    }

    // Enhanced Twitter Card tags
    upsertMeta('twitter:card', 'summary_large_image', 'name')
    upsertMeta('twitter:site', '@americanchassisdepot', 'name')
    upsertMeta('twitter:creator', '@americanchassisdepot', 'name')
    upsertMeta('twitter:url', canonical, 'name')
    upsertMeta('twitter:title', title, 'name')
    upsertMeta('twitter:description', description, 'name')
    if (absImage) {
      upsertMeta('twitter:image', absImage, 'name')
      upsertMeta('twitter:image:alt', title, 'name')
    }

    // Additional SEO tags
    upsertMeta('geo.region', 'US-TX')
    upsertMeta('geo.placename', 'Houston')
    upsertMeta('geo.position', '29.8171;-95.4026')
    upsertMeta('ICBM', '29.8171, -95.4026')

    // Language-specific meta tags
    if (lang === 'es') {
      upsertMeta('language', 'Spanish')
      upsertMeta('content-language', 'es')
    } else {
      upsertMeta('language', 'English')
      upsertMeta('content-language', 'en')
    }

  }, [title, description, imageUrl, canonicalPath, productSlug, productPrice, productBrand, productCategory, productAvailability, isProduct])

  return null
}

export default Seo


