import MainMap from "./components/Map";

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

import ThreeDApp from "./components/React3DMap.tsx";

function App() {
  return (
    <div className="flex flex-row justify-center items-center h-[100vh] p-10 bg-black">
      <ThreeDApp />
      <MainMap />
    </div>
  );
}

export default App;
