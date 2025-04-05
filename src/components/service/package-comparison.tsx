import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Packages } from "@/types";

interface PackageComparisonProps {
  packages: Packages;
}

export default function PackageComparison({
  packages,
}: PackageComparisonProps): React.ReactElement {
  return (
    <div className="grid gap-4">
      <div className="bg-background rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Package Comparison</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Basic</TableHead>
              <TableHead>Standard</TableHead>
              <TableHead>Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Logo Design Concepts</TableCell>
              <TableCell>1</TableCell>
              <TableCell>3</TableCell>
              <TableCell>5</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Revisions</TableCell>
              <TableCell>2</TableCell>
              <TableCell>Unlimited</TableCell>
              <TableCell>Unlimited</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Source Files</TableCell>
              <TableCell>✓</TableCell>
              <TableCell>✓</TableCell>
              <TableCell>✓</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Turnaround Time</TableCell>
              <TableCell>3-5 days</TableCell>
              <TableCell>5-7 days</TableCell>
              <TableCell>7-10 days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brand Style Guide</TableCell>
              <TableCell>-</TableCell>
              <TableCell>✓</TableCell>
              <TableCell>✓</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Social Media Graphics</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>✓</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Price</TableCell>
              <TableCell>$99</TableCell>
              <TableCell>$199</TableCell>
              <TableCell>$299</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
