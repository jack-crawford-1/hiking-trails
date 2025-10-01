import AllDocTracks from "./components/AllDocTracks.tsx";
import MapBoxMap from "./components/mapbox/MapBox.tsx";
import UsersList from "./components/UserList.tsx";
// import UsersList from "./components/UserList.tsx";

function App() {
  return (
    <div className="flex flex-col justify-center min-h-[100vh] p-10 bg-white gap-10">
      <div className="justify-center items-center flex">
        <h2 className="font-bold text-2xl mb-3">
          MapBox - allDocTracks.JSON markers
        </h2>
        <MapBoxMap />
      </div>
      <div>
        <h2 className="font-bold text-2xl">
          All DOC Tracks API - cached with Redis
        </h2>
        <AllDocTracks />
      </div>
      <div>
        <h2 className="font-bold text-2xl">User List MongoDB</h2>
        <UsersList />
      </div>
    </div>
  );
}

export default App;
