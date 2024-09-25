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
      responseTime
      status
    }
  }
`;


