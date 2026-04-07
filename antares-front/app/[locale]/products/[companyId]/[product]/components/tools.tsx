import React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const ProductToolsView = () => {
  const t = useTranslations("products.productId")
  return (
    <div className="space-y-10 md:space-y-20">
      <h3 className="text-center text-3xl font-semibold">
        {t("detailedView")}
      </h3>
      <div className="flex flex-col items-center gap-14 md:flex-row">
        <div className="flex flex-col justify-end gap-10">
          <div className="flex items-center gap-4">
            <div className="order-last md:order-first">
              <h4 className="font-bold md:text-right">
                Why Use Tritorcs Square Drive Torque Wrench
              </h4>
              <p className="text-sm md:text-right">
                Below is the interactive Three Dimensional Model and the
                advantageous features that Tritorcs TSL series Square drive
                hydraulic torque wrenches provide.
              </p>
            </div>
            <Image
              src="/images/productDescription/left1.png"
              width={500}
              height={500}
              alt="left1"
              className="h-full max-w-[60px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="order-last md:order-first">
              <h4 className="font-bold md:text-right">
                Why Use Tritorcs Square Drive Torque Wrench
              </h4>
              <p className="text-sm md:text-right">
                Below is the interactive Three Dimensional Model and the
                advantageous features that Tritorcs TSL series Square drive
                hydraulic torque wrenches provide.
              </p>
            </div>
            <Image
              src="/images/productDescription/left2.png"
              width={500}
              height={500}
              alt="left1"
              className="h-full max-w-[60px]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="order-last md:order-first">
              <h4 className="font-bold md:text-right">
                Why Use Tritorcs Square Drive Torque Wrench
              </h4>
              <p className="text-sm md:text-right">
                Below is the interactive Three Dimensional Model and the
                advantageous features that Tritorcs TSL series Square drive
                hydraulic torque wrenches provide.
              </p>
            </div>
            <Image
              src="/images/productDescription/left3.png"
              width={500}
              height={500}
              alt="left1"
              className="h-full max-w-[60px]"
            />
          </div>
        </div>
        <Image
          src="/images/hero/fields/field1.png"
          width={500}
          height={500}
          alt="image"
          className="w-full max-w-[400px] rounded-2xl"
        />

        <div className="flex flex-col justify-end gap-10">
          <div className="flex items-center gap-4">
            <Image
              src="/images/productDescription/right1.png"
              width={500}
              height={500}
              alt="left1"
              className="h-full max-w-[60px]"
            />
            <div>
              <h4 className="font-bold">
                Why Use Tritorcs Square Drive Torque Wrench
              </h4>
              <p className="text-sm">
                Below is the interactive Three Dimensional Model and the
                advantageous features that Tritorcs TSL series Square drive
                hydraulic torque wrenches provide.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Image
              src="/images/productDescription/right2.png"
              width={500}
              height={500}
              alt="left1"
              className="h-full max-w-[60px]"
            />
            <div>
              <h4 className="font-bold">
                Why Use Tritorcs Square Drive Torque Wrench
              </h4>
              <p className="text-sm">
                Below is the interactive Three Dimensional Model and the
                advantageous features that Tritorcs TSL series Square drive
                hydraulic torque wrenches provide.
              </p>
            </div>
          </div>
          <div className="items-left flex gap-2">
            <Image
              src="/images/productDescription/right3.png"
              width={500}
              height={500}
              alt="left1"
              className="h-full max-w-[60px]"
            />
            <div>
              <h4 className="font-bold">
                Why Use Tritorcs Square Drive Torque Wrench
              </h4>
              <p className="text-sm">
                Below is the interactive Three Dimensional Model and the
                advantageous features that Tritorcs TSL series Square drive
                hydraulic torque wrenches provide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductToolsView
