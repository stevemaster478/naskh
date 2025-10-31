import OutputDisplay from "../OutputDisplay";

export default function OutputDisplayExample() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <OutputDisplay
        value="ḥadīṯ, ṣalāh, ʿilm, rasūl"
        mode="latin-to-din"
      />
    </div>
  );
}
