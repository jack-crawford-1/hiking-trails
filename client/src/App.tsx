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
    <div className="flex flex-col p-4 justify-center items-center h-[100vh]">
      <MainMap />
      <ThreeDApp />
    </div>
  );
}

export default App;
