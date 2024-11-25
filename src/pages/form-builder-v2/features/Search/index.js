// import React, {useState} from "react";
// import {SearchIcon, MoreIcon, CrossIcon} from "../../icons";

// export default Search(arr) {

//   const [searchInput, setSearchInput] = useState('');

//   const handleSearch = (event) => {
//     setSearchInput(event.target.value);

//      searchList: [
//        ...Object.values(state.fs.files),
//        ...Object.values(state.fs.folders),
//      ].filter((file) =>
//        file.name.toLowerCase().includes(get().searchInput.toLocaleLowerCase())
//      ),
//   };

//   return (
//     <Box>
//       <SearchIcon />
//       <Input
//         type="search"
//         placeholder="Search"
//         value={searchInput}
//         onChange={handleSearch}
//       />
//       <MenuBtn onClick={() => setIsSidebarActive(!isSidebarActive)}>
//         <span>{isSidebarActive ? <CrossIcon /> : <MoreIcon />}</span>
//       </MenuBtn>
//     </Box>
//   );
// };

// searchList: [],
//setSearchList: (items) => set({ searchList: [...items] }),
// setSearchList: (items) =>
//   set((state) => ({
//     searchList: [
//       ...Object.values(state.fs.files),
//       ...Object.values(state.fs.folders),
//     ].filter((file) =>
//       file.name.toLowerCase().includes(get().searchInput.toLocaleLowerCase())
//     ),
//   })),
// searchInput: "",
// setSearchInput: (input) => set({ searchInput: input }),
