import AllDocTracks from "./components/AllDocTracks";
import MainMap from "./components/Map";
import UsersList from "./components/UserList";

function App() {
  return (
    <div className="flex flex-col gap-4 p-10">
      <h2 className="text-md text-purple-600">Client</h2>
      <p>Vite + React + Typescript + TailwindCSS</p>
      <h2 className="text-md text-purple-600">Server</h2>
      <p>MongoDB + Nodemon + Redis + Cors + Dotenv + Express</p>
      <div>
        <h2 className="text-md text-pink-600">Users from MongoDB</h2>
        <UsersList />
      </div>
      <div>
        <h2 className="text-md text-pink-600">DOC tracks from DOC API</h2>
        <AllDocTracks />
      </div>
      <div>
        <h2 className="text-md text-pink-600">main Map</h2>
        <MainMap />
      </div>
    </div>
  );
}

export default App;
