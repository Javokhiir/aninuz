import { Button } from "./button"

const SpecialButton = ({
  className,
  children,
  style,
  onClick,
  disabled,
}: {
  className?: string
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  disabled?: boolean
}) => {
  return (
    <Button
      onClick={onClick}
      style={style}
      disabled={disabled}
      className={`bg-primary text-primary-foreground h-12 cursor-pointer p-4 px-5 text-lg font-medium shadow-[inset_0px_1px_4px_5px_rgba(255,255,255,0.1),0px_15px_10px_-6px_hsla(227,72%,39%,0.3)] md:max-w-sm md:px-4 ${className}`}
    >
      {children}
    </Button>
  )
}

export default SpecialButton
