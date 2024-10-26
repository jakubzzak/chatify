import {TypeWriter} from "@/components/ui/type-writer";
import {NameInput} from "@/app/_components/name-input";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8.5rem)] px-4 pb-4 w-full items-center justify-center">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold text-center mb-6">
        <TypeWriter value="home.title"/>
      </h1>
      <NameInput />
    </div>
  );
}
