import { useCompanyColorStore } from "@/states/store"

import { Faqs } from "@/types/models/product"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/product-accordion"

const ProductAccordion = ({ faqs }: { faqs: Faqs[] }) => {
  const { color } = useCompanyColorStore()
  return (
    <Accordion type="single" collapsible className="space-y-2 bg-white">
      {faqs.map((faq) => (
        <AccordionItem value={`item-${faq.id}`} key={faq.id}>
          <AccordionTrigger
            className="text-lg"
            svgStyle={{ backgroundColor: color }}
          >
            {faq.title}
          </AccordionTrigger>
          <AccordionContent>
            <div dangerouslySetInnerHTML={{ __html: faq.content }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export default ProductAccordion
