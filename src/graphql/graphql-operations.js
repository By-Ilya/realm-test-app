import gql from 'graphql-tag'

export const FIND_PROJECTS = gql`
query FindProject($query: PsprojectQueryInput!) {
  psprojects(query: $query) {
    _id
    account
    active
    details {
      pm_stage
      pm_project_status
      product_end_date
    }
    milestones {
      _id
      country
      currency
      name
    }
    name
    owner
    project_manager
    region
    stage
  }
}
`;