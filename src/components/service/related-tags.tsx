import { Badge } from "@/components/ui/badge";

export default function RelatedTags({
  tags,
}: {
  tags: string[];
}): React.ReactElement {
  return (
    <div className="bg-background rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Related Tags</h2>
      <div className="flex flex-wrap gap-2 text-muted-foreground">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
