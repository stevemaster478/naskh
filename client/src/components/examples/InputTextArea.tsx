import { useState } from "react";
import InputTextArea from "../InputTextArea";

export default function InputTextAreaExample() {
  const [value, setValue] = useState("");

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <InputTextArea
        value={value}
        onChange={setValue}
        placeholder="Inserisci testo arabo o latino..."
        mode="latin-to-din"
      />
    </div>
  );
}
