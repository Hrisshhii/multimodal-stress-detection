type Props = {
  score: number;
};

export default function StressMeter({ score }: Props) {
  const percent = Math.round(score * 100);

  let color = "bg-green-500";

  if (score > 0.7) color = "bg-red-500";
  else if (score > 0.4) color = "bg-yellow-500";

  return (
    <div className="mb-4">
      <p className="text-sm mb-1">Stress Level: {percent}%</p>

      <div className="w-full h-3 bg-gray-700 rounded-full">
        <div
          className={`h-3 rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}