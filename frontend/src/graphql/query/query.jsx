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
  query GetAllMetrics($businessUnit: UUID!, $subBusinessUnit: UUID!, $fromDate: DateTime, $toDate: DateTime) {
    getAllMetrices(businessUnit: $businessUnit, subBusinessUnit: $subBusinessUnit, fromDate: $fromDate, toDate: $toDate) {
      id
      apiName
      apiType
      apiUrl
      expectedResponseTime
      availability_uptime
      success_rates
      error_rates
      throughput
      avg_latency
      downtime
    }
  }
`;


