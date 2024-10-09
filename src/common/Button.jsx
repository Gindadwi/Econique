function Button (props) {

    const {name, className, classNameIcon, onClick, id, type, img} = props;

    return(
        <button
        className={`bg-warnaDasar h-14 text-white text-xl font-poppins font-medium rounded-md ${className}`}
        id={id}
        type={type}
        onClick={onClick}
        >
            <img src={img} className={`${classNameIcon}`}/>
            {name}
        </button>
    )

}

export default Button;