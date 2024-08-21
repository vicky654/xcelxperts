// import React, { useContext } from 'react';
// import AppContext from '../../utils/Context/DashboardContext';

// interface FilterBadgesProps {
//   filters?: {
//     client_id?: string;
//     company_id?: string;
//     site_id?: string;
//   };
// }

// const FilterBadges: React.FC<FilterBadgesProps> = ({ filters }) => {
 

//   if (!filters?.client_id && !filters?.company_id && !filters?.site_id) {
//     return null;
//   }

//   return (
//     <div className="badges-container flex flex-wrap items-center gap-2 px-4 text-white" style={{ background: "#ddd" }}>
//       {filters?.client_id && DashboardSelectedClient && (
//         <div className="badge bg-blue-600 flex items-center gap-2 px-2 py-1">
//           <span className="font-semibold">Client :</span> {DashboardSelectedClient.client_name}
//         </div>
//       )}

//       {filters?.company_id && DashboardSelectedEntity && (
//         <div className="badge bg-green-600 flex items-center gap-2 px-2 py-1">
//           <span className="font-semibold">Entity :</span> {DashboardSelectedEntity.entity_name}
//         </div>
//       )}

//       {filters?.site_id && DashboardSelectedStation && (
//         <div className="badge bg-red-600 flex items-center gap-2 px-2 py-1">
//           <span className="font-semibold">Station :</span> {DashboardSelectedStation.name}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FilterBadges;
