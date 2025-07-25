// Dashboard StatsWidget example
export default function StatsWidget({ title, value }: { title: string; value: number }) {
  return (
    <div className="widget">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
} 