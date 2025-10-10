import AllDocTracks from "./components/AllDocTracks.tsx";
import MapBoxMap from "./components/mapbox/MapBox.tsx";
import UsersList from "./components/UserList.tsx";
// import UsersList from "./components/UserList.tsx";

function App() {
  return (
    <div className="flex flex-col justify-center p-40 bg-gray-950  gap-10">
      <h1 className="font-bold text-5xl mb-3 uppercase text-white py-6 px-0 w-full flex justify-center">
        Hiking Trails - Development
      </h1>

      <div className="justify-center items-start flex flex-col border-2 border-white p-2">
        <h2 className="font-bold text-2xl mb-3 text-white bg-blue-500 p-2 ">
          MapBox - allDocTracks.JSON markers
        </h2>
        <p className="text-blue-400 mb-2 mt-2">
          MapBox max using stored JSON file to render markers and heatmap
        </p>

        <MapBoxMap />
      </div>
      <div className="border-2 text-white p-2">
        <h2 className="font-bold text-2xl bg-pink-500 w-fit p-2 mb-2">
          All DOC Tracks API - cached with Redis
        </h2>
        <p className="text-pink-400 mb-2 mt-2">
          Fetching from the DOC API and caching for speed. Used AssetID to
          filter through all tracks to show polyline details for that track.
        </p>
        <AllDocTracks />
      </div>
      <div className="border-2 text-white p-2">
        <h2 className="font-bold text-2xl bg-green-500 w-fit p-2">
          User List MongoDB
        </h2>
        <p className="text-green-400 mb-2 mt-2">
          Shows entries from a connected MongoDB database
        </p>
        <UsersList />
      </div>
    </div>
  );
}

export default App;
