import { gql } from '@apollo/client';

export const GET_ALL_BUSINESS_UNIT = gql`
  query GetBusinessUnit {
    businessUnit {
      id
      businessUnitName
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
  query GetApiType {
    methodTypeChoices {
      key
      value
    }
  }
`;

export const GET_AUTH_VALUE = gql`
  query GetAuthValue {
    authTypeChoices {
      key
      value
    }
  }
`;

export const VALIDATE_API = gql`
  query validateApi(
    $apiUrl: String!
    $methodType: String!
    $headers: String
    $requestBody: String
  ) {
    validateApi(
      apiUrl: $apiUrl
      methodType: $methodType
      headers: $headers
      requestBody: $requestBody
    ) {
      status
      success
      message
    }
  }
`;

// export const GET_ALL_METRICS = gql`
//   query GetAllMetrics(
//     $businessUnit: UUID!
//     $subBusinessUnit: UUID!
//     $fromDate: DateTime
//     $toDate: DateTime
//     $searchParam: String
//   ) {
//     getAllMetrices(
//       businessUnit: $businessUnit
//       subBusinessUnit: $subBusinessUnit
//       fromDate: $fromDate
//       toDate: $toDate
//       searchParam: $searchParam
//     ) {
//       id
//       apiName
//       apiUrl
//       availability_uptime
//       success_rates
//       avg_latency
//       isApiActive
//       methodType
//       last_Error_Occurred
//     }
//   }
// `;

export const GET_METRICES_BY_ID = gql`
  query GetAllMetrics(
    $apiMonitoringId: UUID!
    $fromDate: DateTime
    $toDate: DateTime
    $timeRange: Int
    $timeUnit: String
  ) {
    getAllMetrices(
      apiMonitoringId: $apiMonitoringId
      fromDate: $fromDate
      toDate: $toDate
      timeRange: $timeRange
      timeUnit: $timeUnit
    ) {
      apiName
      apiUrl
      avg_response_size
      avg_latency
      isApiActive
      success_count
      availability_uptime
      avg_first_byte_time
      error_count
      methodType
      success_rates
      error_rates
      assertionAndLimit {
        degradedResponseTime
        failedResponseTime
      }
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

export const GET_SERVICE_BY_ID = gql`
  query GetServiceById($serviceId: UUID!) {
    getServiceById(serviceId: $serviceId) {
      apiName
      apiUrl
      businessUnit {
        id
        businessUnitName
      }
      methodType
      requestBody
      subBusinessUnit {
        id
        subBusinessUnitName
      }
      id
      headers
    }
  }
`;

export const VALIDATE_TEAMS_CHANNEL = gql`
  query validateTeamsChannel($channelUrl: String!) {
    validateTeamsChannel(channelUrl: $channelUrl) {
      message
      success
      status
    }
  }
`;