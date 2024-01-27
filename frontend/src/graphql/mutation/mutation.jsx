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
    ){
        businessUnit{
            id
            businessUnitName
        }
    }
  }
`;