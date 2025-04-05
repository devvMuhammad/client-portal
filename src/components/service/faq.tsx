import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type FAQ = {
  question: string;
  answer: string;
};
export default function FAQSection({
  faqs,
}: {
  faqs: FAQ[];
}): React.ReactElement {
  return (
    <Accordion type="single" collapsible className="w-full">
      <h1 className="text-2xl font-bold ">FAQs</h1>
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
