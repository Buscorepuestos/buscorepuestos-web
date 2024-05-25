import Image from "next/image";
import Button from "./Button";

export default function CardPrice() {
  return (
    <>
      {/* Next images */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-2 rounded-lg shadow-lg">
          <div className="pl-4">
            <Image
              src="/card-preview.webp"
              alt="card image"
              width={180}
              height={38}
              priority
              className="rounded-t-lg"
            />
            <h4 className="text-md">Parachoque delantero</h4>
            <p className="text-md">Ref e45678987654erfgy</p>
            <p className="text-lg">$10</p>
            <Button />
          </div>
        </div>
      </div>
    </>
  );
}
