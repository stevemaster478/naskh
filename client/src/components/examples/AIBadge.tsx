import AIBadge from "../AIBadge";

export default function AIBadgeExample() {
  return (
    <div className="p-8 flex gap-4 justify-center">
      <AIBadge isAI={true} />
      <AIBadge isAI={false} />
    </div>
  );
}
