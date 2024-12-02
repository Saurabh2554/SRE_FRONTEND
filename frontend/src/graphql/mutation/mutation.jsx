import { gql } from "@apollo/client";

export const CREATE_BUSINESS_UNIT = gql`
mutation CreateBusinessUnit(
  $businessUnitName: String!
  $businessUnitDescription: String!
  $businessUnitDl: String!
  $createdBy: String!
) {
  createBusinessUnit(
    businessUnitName: $businessUnitName
    businessUnitDescription: $businessUnitDescription
    businessUnitDl: $businessUnitDl
    createdBy: $createdBy
  ) {
    businessUnit {
      id
      businessUnitName
      businessUnitDescription
      businessUnitDl
      createdBy
    }
    success
    message
  }
}
`;

export const CREATE_SUB_BUSINESS_UNIT = gql`
  mutation CreateSubbusinessUnit(
    $businessUnit: UUID!  # Ensure the type is UUID to match the backend
    $subBusinessUnitName: String!
    $subBusinessUnitDescription: String!
    $subBusinessUnitDl: String!
    $createdBy: String!
  ) {
    createSubbusinessUnit(
      businessUnit: $businessUnit
      subBusinessUnitName: $subBusinessUnitName
      subBusinessUnitDescription: $subBusinessUnitDescription
      subBusinessUnitDl: $subBusinessUnitDl
      createdBy: $createdBy
    ) {
      subBusinessUnit {  # This should match the return type from your mutation
        id
        subBusinessUnitName
        subBusinessUnitDescription
        subBusinessUnitDl
        createdBy
      }
      success
      message
    }
  }
`;



export const CREATE_API_MONITOR = gql`
  mutation CreateApiMonitor($input: MonitoredApiInput!) {
    createApiMonitor(input: $input) {
      monitoredApi {
        id
        apiName
        apiUrl
      }
      success
      message
    }
  }
`;

export const UPDATE_API_MONITOR = gql`
  mutation UpdateApiMonitor($input: MonitoredApiInput
   $apiMonitorId: UUID!
   $isApiActive: Boolean!) 
   {
    updateApiMonitor(
    id:$apiMonitorId 
    input: $input
    isApiActive: $isApiActive
    ) {
      monitoredApi {
        id
        apiName
        apiUrl
        isApiActive
      }
      success
      message
    }
  }
`;
