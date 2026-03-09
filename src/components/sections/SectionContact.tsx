import type { MigratedImage } from "@/sanity/lib/queries";

import CmsImage from "../ui/CmsImage";
import ContactButtonBar from "../composite/ContactButtonBar";

type SectionContactProps = {
  device?: "mb" | "pc";
  name?: string;
  photo?: MigratedImage;
  className?: string;
};

export default function SectionContact({
  device = "mb",
  name = "Betty",
  photo,
  className,
}: SectionContactProps) {
  const isPc = device === "pc";

  return (
    <section
      className={[
        "flex w-full flex-col items-center border-b border-secondary-50 bg-gradient-to-b from-secondary from-[20%] to-primary to-[60%]",
        isPc ? "gap-[16px] px-[48px] py-[24px]" : "gap-[8px] px-[24px] py-[8px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={isPc ? "Section_Contact_PC" : "Section_Contact_MB"}
      data-node-id={isPc ? "799:878" : "792:247"}
      data-device={device}
    >
      <div
        className="relative h-[120px] w-[152px] overflow-hidden rounded-[16px]"
        data-name="Photo"
        data-node-id={isPc ? "799:879" : "792:248"}
      >
        {photo?.image ? (
          <CmsImage
            fill
            image={photo.image}
            alt={photo.alt || name}
            sizes="152px"
            className="rounded-[16px] object-contain"
          />
        ) : null}
      </div>

      <div
        className="flex w-full flex-col items-center gap-[8px]"
        data-name="Contact"
        data-node-id={isPc ? "799:881" : "792:250"}
      >
        <div
          className="flex w-full flex-col items-center"
          data-name="Name"
          data-node-id={isPc ? "799:882" : "792:251"}
        >
          <p
            className={[isPc ? "text-pc-h1" : "text-mb-h1", "text-word2 text-center"].join(" ")}
            data-node-id={isPc ? "799:883" : "792:252"}
          >
            {name}
          </p>
        </div>

        <ContactButtonBar device={device} />
      </div>
    </section>
  );
}
