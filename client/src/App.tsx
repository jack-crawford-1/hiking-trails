import MapBoxMap from "./components/mapbox/MapBox.tsx";
// import UsersList from "./components/UserList.tsx";

function App() {
  return (
    <div className="flex flex-row justify-center items-center h-[100vh] p-10 bg-white">
      <MapBoxMap />
      {/* <UsersList /> */}
    </div>
  );
}

export default App;
