import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="m-2 flex">
      <Button disabled size="xs">
        Primary
      </Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="teritary">Teritary</Button>
      <Button variant="outline">Outline</Button>
      <Input />
    </div>
  );
}
