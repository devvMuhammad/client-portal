import { CheckListItem } from "./service-page-units";

export default function ServiceDescription({
  name,
  serviceIntroduction,
  offers,
  description,
}: {
  name: string;
  serviceIntroduction: string;
  offers: string[];
  description: string;
}): React.ReactElement {
  return (
    <div className="min-h-[30rem]">
      <h1 className="text-4xl font-bold tracking-tight">
        {/* Professional Graphic Design Services  */}
        {name}
      </h1>
      <p className="mt-4 text-muted-foreground">
        {/* I offer a wide range of graphic design services to help you create
        stunning visuals for your business. From logo design to social media
        graphics, I'll work closely with you to bring your vision to life. */}
        {serviceIntroduction}
      </p>
      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-lg font-semibold">What We Offer</h3>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            {/* <CheckListItem>Logo design</CheckListItem>
            <CheckListItem>
              Branding materials (business cards, letterhead, etc.)
            </CheckListItem>
            <CheckListItem>Social media graphics</CheckListItem>
            <CheckListItem>Illustrations and icons</CheckListItem>
            <CheckListItem>Website design and mockups</CheckListItem> */}
            {offers.map((offer) => (
              <CheckListItem key={offer}>{offer}</CheckListItem>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="mt-2 text-muted-foreground">
            {/* I believe in a collaborative process where we work closely together
            to ensure the final product exceeds your expectations. I'll provide
            regular updates, revisions, and feedback to make sure we're on the
            same page throughout the project. */}
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
