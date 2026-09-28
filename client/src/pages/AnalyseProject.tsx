import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AnalyseProject = () => {
  return (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs">#001</TableCell>
              <TableCell className="font-medium">AI Resume Screener</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  Evaluated
                </span>
              </TableCell>
              <TableCell className="text-right font-bold text-blue-600">92 / 100</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs">#002</TableCell>
              <TableCell className="font-medium">Placement Tracker</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                  In Review
                </span>
              </TableCell>
              <TableCell className="text-right font-bold text-slate-500">Pending</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
  )
}

export default AnalyseProject