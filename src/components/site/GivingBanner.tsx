import { Link } from "react-router-dom";

export const GivingBanner = () => {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-cream border-b border-gold/20 h-11 flex items-center">
      <div className="container text-center">
        <p className="text-[11px] md:text-xs text-gold leading-tight">
          🤍 A portion of every purchase supports causes as meaningful as the moments we preserve.{" "}
          <Link to="/giving" className="underline hover:text-gold-deep transition-colors">
            Learn more →
          </Link>
        </p>
      </div>
    </div>
  );
};
