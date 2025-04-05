import { Input } from "../ui/input";

export default function ChatHeader() {
  return (
    <div className="flex flex-col gap-2 justify-between p-4">
      <h1 className="font-bold text-xl">Messages</h1>
      <form className="flex w-full md:gap-4">
        <Input
          // prompt="Search"
          placeholder="Search"
          className="w-full"
        />
      </form>
    </div>
  );
}
