import { Link } from "react-router-dom";

export const GivingBanner = () => {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-gold border-b border-navy/20 h-11 flex items-center shadow-sm">
      <div className="container text-center">
        <p className="text-[11px] md:text-xs text-navy leading-tight">
          🤍 A portion of every purchase supports causes as meaningful as the moments we preserve.{" "}
          <Link to="/giving" className="underline font-medium hover:text-navy/70 transition-colors">
            Learn more →
          </Link>
        </p>
      </div>
    </div>
  );
};
