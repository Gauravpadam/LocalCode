import PropTypes from "prop-types";
import Card from "../common/Card";

function StatsCard({ title, value, icon, description, className }) {
  return (
    
        <div className={`stat `}>
          <div className="stat-figure text-success">
            <div className="text-neutral-content text-3xl">{icon}</div>
          </div>
          <div className="stat-title">{title}</div>
          <div className={`stat-value ${className}`}>{value || 0}</div>
          <div className="stat-desc">{description || ""}</div>
        </div>
    
  );
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default StatsCard;
