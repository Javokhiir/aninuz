"use client"

import { type ComponentProps, type FC } from "react"
import { useParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/routing"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type LangSwitcherProps = ComponentProps<"button">

export const LangSwitcher: FC<LangSwitcherProps> = ({
  className,
  ...props
}) => {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  function onSelectChange(newLocale: string) {
    // @ts-expect-error -- TypeScript will validate that only known `params`
    // are used in combination with a given `pathname`. Since the two will
    // always match for the current route, we can skip runtime checks.
    router.replace({ pathname, params }, { locale: newLocale })

    window.location.href = `/${newLocale}${pathname.replace(/^\/(en|ru|uz)/, "")}`
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange}>
      <SelectTrigger
        svgHide
        className={cn(
          "text-semibold gap-1 border-none bg-transparent text-base shadow-[-5px_93px_98px_-35px_hsla(227,72%,39%,0.29)]",
          className
        )}
        {...props}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="text-medium bg-primary/30 min-w-0 border-none backdrop:blur-sm">
        <SelectItem value="ru">Ру</SelectItem>
        <SelectItem value="en">En</SelectItem>
        <SelectItem value="uz">Uz</SelectItem>
      </SelectContent>
    </Select>
  )
}
