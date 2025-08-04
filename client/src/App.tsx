// import MainMap from "./components/Map";
// import ThreeDApp from "./components/React3DMap.tsx";
import MapBoxMap from "./components/MapBox.tsx";

// function App() {
//   return (
//     <div className="flex flex-col p-10 justify-center items-center h-screen">
//       <div>
//         <MainMap />
//       </div>
//     </div>
//   );
// }

// export default App;

function App() {
  return (
    <div className="flex flex-row justify-center items-center h-[100vh] p-10 bg-black">
      {/* <ThreeDApp />
      <MainMap /> */}
      <MapBoxMap />
    </div>
  );
}

export default App;
