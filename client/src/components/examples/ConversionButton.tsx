import { useState } from "react";
import ConversionButton from "../ConversionButton";

export default function ConversionButtonExample() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8">
      <ConversionButton onClick={handleClick} loading={loading} />
    </div>
  );
}
