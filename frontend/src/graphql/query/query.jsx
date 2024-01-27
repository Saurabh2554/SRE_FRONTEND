import { gql } from "graphql-tag";

export const GET_ALL_BUSINESS_UNIT = gql`
  query {
    allBusinessUnit {
      id
      businessUnitDl
      businessUnitName
      businessUnitDescription
    }
  }
`;

