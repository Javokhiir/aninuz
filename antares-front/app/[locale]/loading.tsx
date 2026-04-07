import Image from "next/image"

const RootLoading = () => {
  return (
    <div className="fixed inset-0 z-50 mt-[90px] flex h-[calc(100vh-90px)] w-screen items-center justify-center bg-white">
      <div className="animate-ping">
        <Image
          className="inline-block max-w-[80px] xl:max-w-[120px]"
          src="/logos/logo-with-text.png"
          alt="logo"
          width={120}
          height={120}
        />
      </div>
    </div>
  )
}

export default RootLoading
