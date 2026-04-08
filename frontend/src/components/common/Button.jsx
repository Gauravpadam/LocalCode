import PropTypes from 'prop-types';

/**
 * Button component using DaisyUI classes
 */
function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) {
  const baseStyles = 'btn transition-all duration-200';
  
  const variants = {
    primary: 'btn-primary', 
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-error', 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;