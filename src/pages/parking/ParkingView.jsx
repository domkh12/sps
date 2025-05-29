import React from 'react'
import ParkingDetail from './ParkingDetail'
import { useParams } from 'react-router-dom'
import {
  useFilterParkingSpacesQuery,
  useGetParkingSpacesQuery,
} from "../../redux/feature/parking/parkingApiSlice";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
function ParkingView() {
  
  const{id}=useParams()
  const {Parking}=useGetParkingSpacesQuery("ParkingList",{
    selectFromResult: ({data})=>({
      user:data?.entities [id],
    })
  })
  let content ;
  if (!Parking ){
    content =<LoadingFetchingDataComponent/>
  }
  content =<ParkingDetail Parking ={Parking}/>
  return content;
}

export default ParkingView

