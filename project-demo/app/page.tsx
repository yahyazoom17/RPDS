import PotholeMap from "@/components/pothole-map/PotholeMap";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold">Road Pothole Detection</h1>
      <p className="mb-6 text-gray-600">
        Visualizing detected potholes on the road.
      </p>
      <PotholeMap />
    </main>
  );
}
