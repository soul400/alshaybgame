import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import PenaltySystem from "@/components/PenaltySystem";

const PenaltyPage = () => {
  const [_, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Penalty Header */}
      <div className="flex justify-between items-center mb-8">
        <Button onClick={() => setLocation("/")} variant="default">
          <i className="fas fa-arrow-right ml-2"></i> العودة للرئيسية
        </Button>
        
        <h2 className="text-3xl font-bold bg-warning text-[#333333] px-6 py-2 rounded-lg">
          نظام العقاب
        </h2>
      </div>

      {/* Penalty System */}
      <PenaltySystem />
    </div>
  );
};

export default PenaltyPage;
