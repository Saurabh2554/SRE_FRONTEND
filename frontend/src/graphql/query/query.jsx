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
    methodTypeChoices {
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
  query validateApi($apiUrl: String!, $methodType: String!, $headers: String, $requestBody: String){
    validateApi(apiUrl: $apiUrl, methodType: $methodType, headers: $headers, requestBody: $requestBody){
      status
      success
      message
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
      apiUrl
      availability_uptime
      methodType
      success_rates
      avg_latency
      isApiActive
      last_Error_Occurred
    }
  }
`;

export const GET_METRICES_BY_ID = gql`
  query GetAllMetrics($apiMonitoringId: UUID!) {
    getAllMetrices(apiMonitoringId: $apiMonitoringId) {
      apiName
      last_Error_Occurred
      apiUrl
      methodType
      avg_response_size
      avg_latency
      isApiActive
      success_count
      availability_uptime
      error_count
      expectedResponseTime
      success_rates
      error_rates
      response_time {
        responsetime
        timestamp
        success
      }
      percentile_50 {
      currPercentileResTime
      percentageDiff
    }
    percentile_90 {
      currPercentileResTime
      percentageDiff
    }
    percentile_99 {
      percentageDiff
      currPercentileResTime
    }
    }
  }
`;


