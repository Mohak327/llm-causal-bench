interface CardProps {
    bgColor?: string;
    accentColor?: string;
    children: React.ReactNode;
    className?: string;
}

const Card = ({ bgColor, accentColor, children, className }: CardProps) => {
    const cardStyle = { backgroundColor: bgColor };
    return (
        <div style={cardStyle} className={`border-4 border-black p-6 relative transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${className}`}>
            {children}
        </div>
    );
};

export default Card;
