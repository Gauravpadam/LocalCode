import PropTypes from "prop-types";

function Card({ children, className = "", hover = true, ...props }) {
  const baseStyles = "card shadow-xl border border-base-300 bg-base-300/50 ";
  const hoverStyles = hover
    ? "hover:border-base-content shadow-xl transition-all duration-300 cursor-pointer"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
      <div className="card-body">{children}</div>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;
