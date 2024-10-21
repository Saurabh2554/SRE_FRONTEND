import { gql } from "graphql-tag";

export const GET_ALL_BUSINESS_UNIT = gql`
  query {
    allBusinessUnit {
      id
      businessUnitName
    }
  }
`;

export const GET_ALL_SUB_BUSINESS_UNIT = gql`
  query {
    allSubBusinessUnit {
      id
      subBusinessUnitName
    }
  }
`;

export const GET_SUB_BUSINESS_UNITS_BY_BUSINESS_UNIT = gql`
  query GetSubBusinessUnitPerBusinessUnit($id: UUID!) {
    subBusinessUnitPerBusinessUnit(id: $id) {
      id
      subBusinessUnitName
    }
  }
`;

export const GET_API_TYPE = gql`
  query{
    apiTypeChoices {
    key
    value
  }
  }
`;

export const GET_AUTH_VALUE = gql`
  query{
    authTypeChoices {
    key
    value
  }
  }
`;


export const VALIDATE_API = gql`
  query validateApi($apiURL: String!, $apiType: String!, $query: String){
    validateApi(apiUrl: $apiURL, apiType: $apiType, query: $query){
      status
      success
    }
  }
`;

// export const GET_ALL_METRICS = gql`
//   query GetAllMetrics($businessUnit: UUID, $subBusinessUnit: UUID) {
//     getAllMetrices(businessUnit: $businessUnit, subBusinessUnit: $subBusinessUnit) {
//       id
//       apiName
//       apiType
//       apiUrl
//       expectedResponseTime
//       availability_uptime
//     }
//   }
// `;


export const GET_ALL_METRICS = gql`
  query GetAllMetrics($businessUnit: UUID!, $subBusinessUnit: UUID!, $fromDate: DateTime, $toDate: DateTime ,$searchParam: String) {
    getAllMetrices(businessUnit: $businessUnit, subBusinessUnit: $subBusinessUnit, fromDate: $fromDate, toDate: $toDate,searchParam: $searchParam) {
      id
      apiName
      apiType
      apiUrl
      availability_uptime
      success_rates
      avg_latency
      isApiActive
      
    }
  }
`;

export const GET_METRICES_BY_ID = gql`
  query GetAllMetrics($apiMonitoringId: UUID!) {
    getAllMetrices(apiMonitoringId: $apiMonitoringId) {
      apiName
      apiType
      apiUrl
      avg_response_size
      avg_latency
      isApiActive
      success_count
      error_count
      success_rates
      error_rates
      response_time {
        responsetime
        timestamp
      }
    }
  }
`;


