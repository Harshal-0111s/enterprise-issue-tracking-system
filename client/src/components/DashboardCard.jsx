import "../styles/Card.css";

function DashboardCard({ title, value, color }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <h1 style={{ color }}>{value}</h1>
    </div>
  );
}

export default DashboardCard;