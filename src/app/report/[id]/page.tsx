import ReportDetailClient from "./report-detail-client";

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return <ReportDetailClient reportId={params.id} />;
}
